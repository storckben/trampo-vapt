import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GestaoPayRequest {
  amount: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    cpf: string;
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
    unitPrice: number;
    quantity: number;
    tangible: boolean;
  }[];
  postbackUrl: string;
}

serve(async (req) => {
  console.log('🚀 GestaoPay Edge Function - Iniciando processamento...');
  console.log('🔍 Método da requisição:', req.method);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const rawBody = await req.text();
    console.log('📦 Body bruto recebido:', rawBody);

    if (!rawBody || rawBody.trim() === '') {
      throw new Error('Body da requisição está vazio');
    }

    const payload: GestaoPayRequest = JSON.parse(rawBody);
    console.log('📦 Payload parseado:', JSON.stringify(payload, null, 2));

    // Get GestaoPay keys
    const publicKey = Deno.env.get('GESTAOPAY_PUBLIC_KEY');
    const secretKey = Deno.env.get('GESTAOPAY_PRIVATE_KEY');
    
    if (!publicKey || !secretKey) {
      throw new Error('Chaves GestaoPay não configuradas');
    }

    console.log('🔑 Usando chaves GestaoPay (public:secret)');

    // Calculate total amount in cents
    const totalAmount = payload.items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
    const amountInCents = Math.round(totalAmount * 100); // Convert to cents
    
    console.log(`💰 Valor em reais: R$ ${totalAmount}`);
    console.log(`💰 Valor em centavos: ${amountInCents}`);

    // Build GestaoPay payload - Formato simples conforme documentação
    const gestaoPayPayload = {
      amount: amountInCents, // Em centavos (ex: 7200 = R$ 72,00)
      paymentMethod: "pix",
      items: payload.items.map(item => ({
        title: "Produto 1",
        unitPrice: Math.round(item.unitPrice * 100), // Em centavos
        quantity: item.quantity,
        tangible: false
      })),
      customer: {
        name: payload.customer.name,
        email: payload.customer.email,
        document: {
          type: "cpf",
          number: payload.customer.cpf
        }
      }
    };

    console.log('📤 GESTAOPAY REQUEST - Enviando para API GestaoPay');
    console.log('📄 GESTAOPAY PAYLOAD:', JSON.stringify(gestaoPayPayload, null, 2));

    // Create authorization header (Basic auth with public:secret)
    const authString = `${publicKey}:${secretKey}`;
    const authHeader = `Basic ${btoa(authString)}`;

    // Make request to GestaoPay API
    const response = await fetch('https://api.gestaopay.com.br/v1/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(gestaoPayPayload),
    });

    const responseData = await response.text();
    
    // Log detalhado da resposta com status HTTP
    console.log('📥 GESTAOPAY RESPONSE:', JSON.stringify({
      httpStatus: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseData
    }, null, 2));

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseData);
    } catch (e) {
      console.error('❌ Erro ao fazer parse da resposta:', responseData);
      throw new Error(`Resposta inválida da GestaoPay: ${responseData}`);
    }

    if (!response.ok) {
      console.error('❌ GestaoPay retornou erro:', parsedResponse);
      throw new Error(`Erro GestaoPay: ${parsedResponse.message || JSON.stringify(parsedResponse)}`);
    }

    console.log('✅ Resposta GestaoPay processada:', parsedResponse);

    // Check if response has PIX data - GestaoPay retorna em parsedResponse.pix
    const pixData = parsedResponse.pix || parsedResponse.qrcode || parsedResponse.qrCode;
    const qrCodeString = pixData?.qrcode || pixData?.qrCode || pixData?.code || pixData?.emvqrcps;
    const qrCodeBase64 = pixData?.qrCodeBase64 || pixData?.base64 || pixData?.encodedImage;

    if (!qrCodeString && !qrCodeBase64) {
      console.error('❌ Resposta não contém dados PIX válidos:', parsedResponse);
      throw new Error('Dados PIX não encontrados na resposta');
    }

    // Return standardized response
    const normalizedResponse = {
      status: 'success',
      idTransaction: parsedResponse.id || parsedResponse.transactionId,
      paymentCode: qrCodeString,
      paymentCodeBase64: qrCodeBase64 || qrCodeString,
      status_transaction: parsedResponse.status,
      transaction: parsedResponse
    };

    console.log('✅ Resposta normalizada:', normalizedResponse);

    // 🔔 Agendar lembretes de pagamento (3 emails em 30 minutos)
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      
      if (supabaseUrl && supabaseKey) {
        console.log('📅 Agendando lembretes de pagamento...');
        
        const reminderResponse = await fetch(`${supabaseUrl}/functions/v1/schedule-reminders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            orderId: normalizedResponse.idTransaction,
            customerEmail: payload.customer.email,
            customerName: payload.customer.name,
            pixCode: qrCodeString,
            pixQrCode: qrCodeBase64 || qrCodeString,
            amount: totalAmount.toFixed(2)
          })
        });

        if (reminderResponse.ok) {
          console.log('✅ Lembretes agendados com sucesso');
        } else {
          console.error('⚠️ Erro ao agendar lembretes:', await reminderResponse.text());
        }
      }
    } catch (reminderError) {
      console.error('⚠️ Erro ao agendar lembretes (não crítico):', reminderError);
      // Não falhar a requisição principal por causa dos lembretes
    }

    return new Response(JSON.stringify(normalizedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('❌ Erro no processamento:', error);
    
    return new Response(JSON.stringify({
      error: error.message,
      details: error.stack
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});