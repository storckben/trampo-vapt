import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Interfaces para SyncPay API
interface SyncPayCustomer {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  externaRef?: string;
  address: {
    street: string;
    streetNumber: string;
    complement?: string;
    zipCode: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
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

interface SyncPayAPIRequest {
  ip: string;
  pix: {
    expiresInDays: string;
  };
  items: {
    title: string;
    quantity: number;
    tangible: boolean;
    unitPrice: number;
  }[];
  amount: number;
  customer: {
    cpf: string;
    name: string;
    email: string;
    phone: string;
    externaRef: string;
    address: {
      city: string;
      state: string;
      street: string;
      country: string;
      zipCode: string;
      complement: string;
      neighborhood: string;
      streetNumber: string;
    };
  };
  metadata: {
    provider: string;
    sell_url: string;
    order_url: string;
    user_email: string;
    user_identitication_number: string;
  };
  traceable: boolean;
  postbackUrl: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 SYNCPAY - Iniciando processamento...');

    // Parse request body
    const body = await req.text();
    if (!body || body.trim() === '') {
      console.error('❌ SYNCPAY - Body da requisição está vazio');
      return new Response(
        JSON.stringify({ error: 'Request body is empty' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    let requestData: SyncPayRequest;
    try {
      requestData = JSON.parse(body);
    } catch (parseError) {
      console.error('❌ SYNCPAY - Erro ao parsear JSON:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('📝 SYNCPAY - Request recebido:', requestData);

    // Get credentials from environment
    const clientId = Deno.env.get('SYNCPAY_CLIENT_ID');
    const clientSecret = Deno.env.get('SYNCPAY_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      console.error('❌ SYNCPAY - Credenciais não configuradas');
      return new Response(
        JSON.stringify({ error: 'SyncPay credentials not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Step 1: Get access token with timeout
    console.log('🔑 SYNCPAY - Obtendo token de acesso...');
    const authController = new AbortController();
    const authTimeout = setTimeout(() => authController.abort(), 30000); // 30s timeout
    
    const authResponse = await fetch('https://api.syncpayments.com.br/api/partner/v1/auth-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret
      }),
      signal: authController.signal
    });
    
    clearTimeout(authTimeout);

    if (!authResponse.ok) {
      const authError = await authResponse.text();
      console.error('❌ SYNCPAY - Erro na autenticação:', authError);
      return new Response(
        JSON.stringify({ error: 'Authentication failed', details: authError }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;
    console.log('✅ SYNCPAY - Token obtido com sucesso');

    // Enhanced validations
    const cpfPattern = /^\d{11}$/;
    if (!cpfPattern.test(requestData.customer.cpf)) {
      console.error('❌ SYNCPAY - CPF inválido:', requestData.customer.cpf);
      return new Response(
        JSON.stringify({ error: 'Invalid CPF format. Must be 11 digits.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!requestData.amount || requestData.amount <= 0) {
      console.error('❌ SYNCPAY - Valor inválido:', requestData.amount);
      return new Response(
        JSON.stringify({ error: 'Amount must be greater than 0.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(requestData.customer.email)) {
      console.error('❌ SYNCPAY - Email inválido:', requestData.customer.email);
      return new Response(
        JSON.stringify({ error: 'Invalid email format.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate unique reference
    const uniqueRef = `REF_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

// Calculate expiration date (2 days from now)
const expirationDate = new Date();
expirationDate.setDate(expirationDate.getDate() + 2);
const expiresInDays = expirationDate.toISOString().split('T')[0]; // YYYY-MM-DD format

    // Step 2: Create payment
    console.log('💳 SYNCPAY - Criando pagamento...');
    
    // Payload do Partner Cash-In API
    const partnerPayload = {
      amount: requestData.amount,
      description: requestData.description || (requestData.items && requestData.items[0]?.title) || 'Pagamento',
      client: {
        name: requestData.customer.name,
        cpf: requestData.customer.cpf,
        email: requestData.customer.email,
        phone: (requestData.customer.phone || '').replace(/\D/g, '').slice(0,11)
      }
    };

    console.log('📤 SYNCPAY - Payload (partner cash-in):', JSON.stringify(partnerPayload, null, 2));
    

    const paymentController = new AbortController();
    const paymentTimeout = setTimeout(() => paymentController.abort(), 45000); // 45s timeout

    const paymentResponse = await fetch('https://api.syncpayments.com.br/api/partner/v1/cash-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(partnerPayload),
      signal: paymentController.signal
    });

    clearTimeout(paymentTimeout);

    if (!paymentResponse.ok) {
      const errorText = await paymentResponse.text();
      console.error('❌ SYNCPAY - Erro na criação do pagamento:', errorText);
      return new Response(
        JSON.stringify({ 
          error: 'Payment creation failed', 
          details: errorText,
          status: paymentResponse.status 
        }),
        { 
          status: paymentResponse.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const paymentData = await paymentResponse.json();
    console.log('✅ SYNCPAY - Resposta da API (partner):', paymentData);

    // Normalizar campos possíveis do provedor
    const transactionId = paymentData.identifier || paymentData.id || paymentData.transactionId || paymentData.reference || paymentData.payment_id;
    const pixCode = paymentData.pix_code || paymentData.pixCode || paymentData.paymentCode || paymentData.qrcode || paymentData.qrCode;
    const qrBase64 = paymentData.paymentCodeBase64 || paymentData.qr_code_base64 || paymentData.qrCodeBase64 || paymentData.qrcode_base64;

    if (!pixCode) {
      console.error('❌ SYNCPAY - Resposta inesperada da API (sem PIX code):', paymentData);
      return new Response(
        JSON.stringify({ 
          error: 'Unexpected API response - missing PIX code', 
          details: paymentData 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Format successful response (inclui sempre todos os campos)
    const response = {
      success: true,
      gateway: 'syncpay',
      transactionId: transactionId || 'unknown',
      status: 'pending',
      paymentCode: pixCode,
      paymentCodeBase64: qrBase64 || null,
      message: paymentData.message || 'PIX gerado com sucesso'
    };

    console.log('🎉 SYNCPAY - Resposta final:', response);

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('💥 SYNCPAY - Erro inesperado:', error);
    
    // Handle specific error types
    if (error.name === 'AbortError') {
      return new Response(
        JSON.stringify({ 
          error: 'Request timeout', 
          message: 'The request took too long to complete' 
        }),
        { 
          status: 408, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        message: error.message || 'Unknown error occurred'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});