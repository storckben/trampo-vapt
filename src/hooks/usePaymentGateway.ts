import { useState, useEffect } from 'react';
import { useGestaoPay, type GestaoPayRequest, type GestaoPayResponse } from './useGestaoPay';
import { useSyncPay, type SyncPayRequest, type SyncPayResponse } from './useSyncPay';

type PaymentGateway = 'syncpay' | 'gestaopay';

interface UnifiedPaymentRequest {
  amount: number;
  customer: {
    name: string;
    email: string;
    phone?: string;
    cpf: string;
    address?: {
      street?: string;
      streetNumber?: string;
      complement?: string;
      zipCode?: string;
      neighborhood?: string;
      city?: string;
      state?: string;
      country?: string;
    };
  };
  items: {
    title: string;
    quantity: number;
    unitPrice: number;
    tangible: boolean;
  }[];
  description?: string;
}

interface UnifiedPaymentResponse {
  id: string;
  status: string;
  pix_code?: string;
  pix_qr_code?: string;
  qr_code_base64?: string;
  pixCode?: string;
  qrCode?: string;
  gateway: PaymentGateway;
}

export const usePaymentGateway = () => {
  const [currentGateway, setCurrentGateway] = useState<PaymentGateway>('syncpay');
  const [isAutoFallbackEnabled, setIsAutoFallbackEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gestaoPay = useGestaoPay();
  const syncPay = useSyncPay();

  // Carregar configurações salvas do localStorage
  useEffect(() => {
    const savedGateway = localStorage.getItem('payment_gateway') as PaymentGateway;
    if (savedGateway && (savedGateway === 'syncpay' || savedGateway === 'gestaopay')) {
      setCurrentGateway(savedGateway);
    }
    
    const savedAutoFallback = localStorage.getItem('auto_fallback_enabled');
    if (savedAutoFallback !== null) {
      setIsAutoFallbackEnabled(savedAutoFallback === 'true');
    }
  }, []);

  // Salvar gateway no localStorage quando mudar
  const switchGateway = (gateway: PaymentGateway) => {
    setCurrentGateway(gateway);
    localStorage.setItem('payment_gateway', gateway);
    console.log(`🔄 Gateway alterado para: ${gateway.toUpperCase()}`);
  };

  // Alternar modo de fallback automático
  const toggleAutoFallback = (enabled: boolean) => {
    setIsAutoFallbackEnabled(enabled);
    localStorage.setItem('auto_fallback_enabled', enabled.toString());
    console.log(`🔄 Fallback automático ${enabled ? 'ativado' : 'desativado'}`);
  };

  const createTransaction = async (payload: UnifiedPaymentRequest): Promise<UnifiedPaymentResponse> => {
    setLoading(true);
    setError(null);

    // Helper function para converter payload para GestaoPay
    const convertToGestaoPayload = (payload: UnifiedPaymentRequest): GestaoPayRequest => ({
      customer: {
        name: payload.customer.name,
        email: payload.customer.email,
        phone: payload.customer.phone || '',
        document: {
          number: payload.customer.cpf,
          type: 'cpf'
        }
      },
      items: payload.items.map(item => ({
        title: item.title,
        description: item.title,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        tangible: item.tangible
      })),
      postbackUrl: 'https://webhook.site/callback',
      paymentMethod: 'pix',
      shipping: {
        fee: 0,
        address: {
          street: payload.customer.address?.street || '',
          streetNumber: payload.customer.address?.streetNumber || '',
          complement: payload.customer.address?.complement || '',
          zipCode: payload.customer.address?.zipCode || '',
          neighborhood: payload.customer.address?.neighborhood || '',
          city: payload.customer.address?.city || '',
          state: payload.customer.address?.state || '',
          country: payload.customer.address?.country || 'Brasil'
        }
      },
      isInfoProducts: false
    });

    try {
      let response: GestaoPayResponse | SyncPayResponse;
      let usedGateway = currentGateway;

      console.log(`🚀 Tentando gateway principal: ${currentGateway.toUpperCase()}`);

      // Tentar gateway principal primeiro
      try {
        if (currentGateway === 'syncpay') {
          response = await syncPay.createTransaction(payload as SyncPayRequest);
        } else {
          const gestaoPayload = convertToGestaoPayload(payload);
          response = await gestaoPay.createTransaction(gestaoPayload);
        }

        console.log(`✅ Pagamento criado com sucesso usando ${currentGateway.toUpperCase()}`);

        // Validação: garantir que veio PIX/QR Code; se não, forçar fallback
        const hasPixCode = !!(
          (response as any).pix_code ||
          (response as any).pixCode ||
          (response as any).paymentCode ||
          (response as any).pix
        );
        const hasQr = !!(
          (response as any).qr_code_base64 ||
          (response as any).pix_qr_code ||
          (response as any).qrCode ||
          (response as any).paymentCodeBase64
        );
        if (!hasPixCode && !hasQr) {
          console.warn('⚠️ Gateway principal não retornou PIX/QR Code. Forçando fallback...');
          throw new Error('Gateway principal não retornou PIX/QR Code');
        }
      } catch (primaryError: any) {
        console.warn(`⚠️ Falha no gateway principal ${currentGateway.toUpperCase()}:`, primaryError.message);
        
        // Verificar se fallback automático está habilitado
        if (!isAutoFallbackEnabled) {
          console.log(`🚫 Fallback automático desabilitado - não tentando gateway de backup`);
          throw primaryError;
        }
        
        // Tentar gateway de backup
        const backupGateway = currentGateway === 'syncpay' ? 'gestaopay' : 'syncpay';
        console.log(`🔄 Tentando gateway de backup: ${backupGateway.toUpperCase()}`);
        
        try {
          if (backupGateway === 'syncpay') {
            response = await syncPay.createTransaction(payload as SyncPayRequest);
          } else {
            const gestaoPayload = convertToGestaoPayload(payload);
            response = await gestaoPay.createTransaction(gestaoPayload);
          }
          
          usedGateway = backupGateway;
          console.log(`✅ Pagamento criado com sucesso usando gateway de backup ${backupGateway.toUpperCase()}`);
        } catch (backupError: any) {
          console.error(`❌ Falha em ambos os gateways:`, {
            primary: primaryError.message,
            backup: backupError.message
          });
          
          throw new Error(`Falha em ambos os gateways. Principal: ${primaryError.message}. Backup: ${backupError.message}`);
        }
      }

      // Normalizar resposta (consolidando todas as variações de campos)
      const pixCodeRaw =
        (response as any).pix_code ||
        (response as any).pixCode ||
        (response as any).paymentCode ||
        (response as any).pix;

      const qrBase64Raw =
        (response as any).qr_code_base64 ||
        (response as any).pix_qr_code ||
        (response as any).qrCode ||
        (response as any).paymentCodeBase64;

      const normalizedResponse: UnifiedPaymentResponse = {
        id: (response as any).id || (response as any).transactionId || 'unknown',
        status: (response as any).status || 'pending',
        pix_code: pixCodeRaw,
        pix_qr_code: qrBase64Raw,
        qr_code_base64: qrBase64Raw,
        pixCode: pixCodeRaw,
        qrCode: qrBase64Raw,
        gateway: usedGateway
      };

      console.log('🔎 Unified payment response:', normalizedResponse);
      return normalizedResponse;

    } catch (err: any) {
      console.error(`❌ Erro crítico no sistema de pagamento:`, err);
      const errorMessage = err.message || 'Erro crítico no sistema de pagamento';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    currentGateway,
    switchGateway,
    createTransaction,
    loading: loading || gestaoPay.loading || syncPay.loading,
    error: error || gestaoPay.error || syncPay.error,
    availableGateways: ['syncpay', 'gestaopay'] as PaymentGateway[],
    isAutoFallbackEnabled,
    toggleAutoFallback
  };
};

export type { PaymentGateway, UnifiedPaymentRequest, UnifiedPaymentResponse };