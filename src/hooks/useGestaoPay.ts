import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Interfaces para GestaoPay API
interface GestaoPayCustomer {
  name: string;
  email: string;
  phone?: string;
  cpf: string;
  externaRef?: string;
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
}

interface GestaoPayItem {
  title: string;
  quantity: number;
  unitPrice: number;
  tangible: boolean;
}

interface GestaoPayAPIRequest {
  amount: number;
  customer: GestaoPayCustomer;
  items: GestaoPayItem[];
  postbackUrl: string;
  pix?: {
    expiresInDays?: number;
  };
  metadata?: string;
  traceable?: boolean;
  ip?: string;
}

interface GestaoPayResponse {
  id: string;
  status: string;
  pix_code?: string;
  pix_qr_code?: string;
  qr_code_base64?: string;
  pixCode?: string;
  qrCode?: string;
  transaction?: any;
}

interface GestaoPayRequest {
  postbackUrl: string;
  paymentMethod: 'pix';
  customer: {
    name: string;
    email: string;
    phone: string;
    document: {
      number: string;
      type: 'cpf';
    };
  };
  shipping: {
    fee: number;
    address: {
      street: string;
      streetNumber: string;
      zipCode: string;
      neighborhood: string;
      city: string;
      state: string;
      country: string;
      complement?: string;
    };
  };
  items: {
    title: string;
    description: string;
    unitPrice: number;
    quantity: number;
    tangible: boolean;
  }[];
  isInfoProducts: boolean;
}

interface PaymentDetails {
  id: string;
  status: string;
  pix_code?: string;
  pix_qr_code?: string;
  qr_code_base64?: string;
}

export const useGestaoPay = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTransaction = async (payload: GestaoPayRequest): Promise<GestaoPayResponse> => {
    console.log('🚀 GESTAOPAY - Criando transação com payload:', payload);
    
    // Validação do valor mínimo (R$ 0,50 = 50 centavos)
    const totalAmount = payload.items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
    if (totalAmount < 0.50) {
      throw new Error('Valor mínimo para pagamento via PIX é de R$ 0,50');
    }
    
    console.log(`💰 Valor total calculado: R$ ${totalAmount} (será enviado em reais)`);
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('🚀 GESTAOPAY - Criando transação via API...');
      
      // Mapear payload para formato GestaoPay API
      const gestaoPayPayload: GestaoPayAPIRequest = {
        amount: Math.max(totalAmount, 0.50), // Enviar em reais (não centavos)
        customer: {
          name: payload.customer.name,
          email: payload.customer.email,
          cpf: payload.customer.document.number,
          phone: payload.customer.phone,
          address: {
            street: payload.shipping.address.street,
            streetNumber: payload.shipping.address.streetNumber,
            complement: payload.shipping.address.complement,
            zipCode: payload.shipping.address.zipCode,
            neighborhood: payload.shipping.address.neighborhood,
            city: payload.shipping.address.city,
            state: payload.shipping.address.state,
            country: payload.shipping.address.country
          }
        },
        items: payload.items.map(item => ({
          title: item.title,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          tangible: item.tangible
        })),
        postbackUrl: payload.postbackUrl
      };

      console.log('📤 Enviando para GestaoPay via Edge Function:', gestaoPayPayload);

      const { data, error } = await supabase.functions.invoke('gestaopay-payment', {
        body: gestaoPayPayload,
      });

      console.log('📥 Resposta completa da edge function:', { data, error });

      if (error) {
        console.error('❌ Erro na edge function:', error);
        throw new Error(`Erro na edge function: ${error.message}`);
      }

      if (!data) {
        console.error('❌ Data é null/undefined:', data);
        throw new Error('Edge function retornou dados vazios');
      }

      console.log('📋 Data recebida:', data);

      // GestaoPay retorna status 'success' diretamente, não em um wrapper
      if (data.status !== 'success') {
        console.error('❌ API GestaoPay retornou erro:', data);
        throw new Error(`Erro GestaoPay: ${data.message || 'Erro desconhecido'}`);
      }

      // Normalizar resposta no formato esperado pelo app
      const normalized: GestaoPayResponse = {
        id: data.idTransaction || data.client_id || data.id || '',
        status: data.status_transaction || data.status || 'pending',
        pix_code: data.paymentCode || data.pix_code || data.pixCode,
        pix_qr_code: data.paymentCodeBase64 || data.qr_code_base64 || data.qrCode || data.qr_code,
        qr_code_base64: data.paymentCodeBase64 || data.qr_code_base64,
        transaction: data,
      };

      console.log('✅ Resposta GestaoPay normalizada:', normalized);
      
      return normalized;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido na API GestaoPay';
      console.error('❌ GESTAOPAY - Erro:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPaymentDetails = async (transactionId: string): Promise<PaymentDetails> => {
    console.log('🔍 GESTAOPAY - Buscando detalhes da transação:', transactionId);
    
    try {
      // GestaoPay possui endpoint para buscar detalhes via GET /transactions/{id}
      // Implementaremos via edge function se necessário
      console.log('⚠️ GESTAOPAY - Endpoint de consulta disponível via API');
      
      return {
        id: transactionId,
        status: 'pending',
        pix_code: '',
        pix_qr_code: '',
        qr_code_base64: '',
      };
    } catch (err) {
      console.error('❌ GESTAOPAY - Erro ao buscar detalhes:', err);
      throw err;
    }
  };

  return {
    createTransaction,
    getPaymentDetails,
    loading,
    error,
  };
};

export type { GestaoPayRequest, GestaoPayResponse, GestaoPayCustomer, GestaoPayItem };