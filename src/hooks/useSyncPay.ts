import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Interfaces para SyncPay API
interface SyncPayCustomer {
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
}

interface SyncPayItem {
  title: string;
  quantity: number;
  unitPrice: number;
  tangible: boolean;
}

interface SyncPayRequest {
  amount: number;
  customer: SyncPayCustomer;
  items: SyncPayItem[];
  description?: string;
}

interface SyncPayResponse {
  id: string;
  status: string;
  pix_code?: string;
  pix_qr_code?: string;
  qr_code_base64?: string;
  pixCode?: string;
  qrCode?: string;
  paymentCode?: string;
  paymentCodeBase64?: string;
}

export const useSyncPay = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTransaction = async (payload: SyncPayRequest): Promise<SyncPayResponse> => {
    setLoading(true);
    setError(null);

    try {
      // Validar valor mínimo
      if (payload.amount < 0.50) {
        throw new Error('Valor mínimo de transação é R$ 0,50');
      }

      console.log('🔥 SYNCPAY - Criando transação:', payload);

      const { data, error } = await supabase.functions.invoke('syncpay-payment', {
        body: payload
      });

      if (error) {
        console.error('❌ SYNCPAY - Erro na edge function:', error);
        throw error;
      }

      console.log('✅ SYNCPAY - Resposta da edge function:', data);

      // Normalizar resposta para o formato padrão
      const normalizedResponse: SyncPayResponse = {
        id: data.transactionId || data.id || 'unknown',
        status: data.status || 'pending',
        pix_code: data.paymentCode || data.pix_code,
        pix_qr_code: data.paymentCodeBase64 || data.pix_qr_code,
        qr_code_base64: data.paymentCodeBase64 || data.qr_code_base64,
        pixCode: data.paymentCode || data.pixCode,
        qrCode: data.paymentCodeBase64 || data.qrCode,
        paymentCode: data.paymentCode,
        paymentCodeBase64: data.paymentCodeBase64
      };

      return normalizedResponse;

    } catch (err: any) {
      console.error('❌ SYNCPAY - Erro na criação da transação:', err);
      const errorMessage = err.message || 'Erro desconhecido na criação da transação';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentDetails = async (transactionId: string) => {
    // Placeholder para buscar detalhes do pagamento
    return {
      id: transactionId,
      status: 'pending',
      amount: 0,
      createdAt: new Date().toISOString()
    };
  };

  return {
    createTransaction,
    getPaymentDetails,
    loading,
    error
  };
};

// Exportar tipos para uso externo
export type { SyncPayRequest, SyncPayResponse, SyncPayCustomer, SyncPayItem };