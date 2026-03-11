import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      orderId,
      customerEmail, 
      customerName, 
      pixCode, 
      pixQrCode, 
      amount 
    } = await req.json();

    console.log(`🎯 Agendando lembretes para pedido ${orderId}`);

    // Criar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Salvar na tabela de lembretes
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
    const { error: insertError } = await supabase
      .from('payment_reminders')
      .insert({
        order_id: orderId,
        customer_email: customerEmail,
        customer_name: customerName,
        pix_code: pixCode,
        pix_qrcode: pixQrCode,
        amount: parseFloat(amount),
        expires_at: expiresAt.toISOString()
      });

    if (insertError) {
      throw new Error(`Erro ao salvar lembrete: ${insertError.message}`);
    }

    // Agendar 3 lembretes: 10min, 20min, 30min
    const reminders = [
      { delay: 10 * 60 * 1000, number: 1 }, // 10 minutos
      { delay: 20 * 60 * 1000, number: 2 }, // 20 minutos
      { delay: 30 * 60 * 1000, number: 3 }, // 30 minutos
    ];

    console.log('📅 Lembretes agendados para:', {
      reminder1: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      reminder2: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
      reminder3: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    });

    // Agendar os envios usando setTimeout
    for (const reminder of reminders) {
      setTimeout(async () => {
        try {
          // Verificar se o pagamento já foi confirmado
          const { data: reminderData } = await supabase
            .from('payment_reminders')
            .select('payment_confirmed')
            .eq('order_id', orderId)
            .single();

          if (reminderData?.payment_confirmed) {
            console.log(`✅ Pagamento já confirmado para ${orderId}. Cancelando lembrete ${reminder.number}`);
            return;
          }

          // Enviar lembrete
          const response = await fetch(`${supabaseUrl}/functions/v1/send-payment-reminder`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseKey}`,
            },
            body: JSON.stringify({
              customerEmail,
              customerName,
              pixCode,
              pixQrCode,
              amount,
              reminderNumber: reminder.number
            })
          });

          if (!response.ok) {
            console.error(`❌ Erro ao enviar lembrete ${reminder.number}:`, await response.text());
          } else {
            // Atualizar contador de lembretes
            await supabase
              .from('payment_reminders')
              .update({ 
                reminder_count: reminder.number,
                last_reminder_at: new Date().toISOString()
              })
              .eq('order_id', orderId);
            
            console.log(`✅ Lembrete ${reminder.number} enviado para ${orderId}`);
          }
        } catch (error) {
          console.error(`❌ Erro no lembrete ${reminder.number}:`, error);
        }
      }, reminder.delay);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: '3 lembretes agendados com sucesso',
        orderId,
        scheduledTimes: reminders.map(r => new Date(Date.now() + r.delay).toISOString())
      }), 
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );

  } catch (error: any) {
    console.error("❌ Erro ao agendar lembretes:", error);
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
