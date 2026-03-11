import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

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
      customerEmail, 
      customerName, 
      pixCode, 
      pixQrCode, 
      amount,
      reminderNumber 
    } = await req.json();

    console.log(`📧 Enviando lembrete #${reminderNumber} para ${customerEmail}`);

    // Configurações SMTP
    const smtpHost = Deno.env.get("SMTP_HOST") || "smtp-mail.outlook.com";
    const smtpPort = parseInt(Deno.env.get("SMTP_PORT") || "587");
    const smtpUser = Deno.env.get("SMTP_USER") || "poupando.tempo@hotmail.com";
    const smtpPass = Deno.env.get("SMTP_PASSWORD");

    if (!smtpPass) {
      throw new Error('SMTP_PASSWORD não configurado');
    }

    console.log(`📧 Conectando ao SMTP: ${smtpHost}:${smtpPort}`);

    const client = new SMTPClient({
      connection: {
        hostname: smtpHost,
        port: smtpPort,
        tls: true,
        auth: {
          username: smtpUser,
          password: smtpPass,
        },
      },
    });

    await client.send({
      from: smtpUser,
      to: customerEmail,
      subject: `⏰ Lembrete ${reminderNumber}/3: Você já pagou o seu agendamento?`,
      content: "Email em HTML",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .qrcode { text-align: center; margin: 30px 0; padding: 20px; background: white; border-radius: 10px; }
            .qrcode img { max-width: 250px; height: auto; }
            .pix-code { background: white; padding: 15px; border-radius: 8px; border: 2px dashed #667eea; word-break: break-all; font-family: monospace; font-size: 12px; margin: 20px 0; }
            .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>⏰ Lembrete de Pagamento</h1>
            <p style="margin: 0; font-size: 18px;">Lembrete ${reminderNumber} de 3</p>
          </div>
          
          <div class="content">
            <h2>Olá, ${customerName}! 👋</h2>
            
            <p><strong>Você já realizou o pagamento do seu agendamento?</strong></p>
            
            <div class="warning">
              <p style="margin: 0;"><strong>⚠️ Se já pagou, ignore esta mensagem.</strong><br>
              Este é um lembrete automático enviado para garantir que você não perca seu agendamento.</p>
            </div>

            <p>Caso ainda não tenha pago, você pode realizar o pagamento agora mesmo via PIX:</p>

            <div class="qrcode">
              <h3>📱 QR Code do PIX</h3>
              <img src="${pixQrCode}" alt="QR Code PIX" />
              <p><strong>Valor:</strong> R$ ${parseFloat(amount).toFixed(2)}</p>
            </div>

            <h3>💳 Ou copie o código PIX:</h3>
            <div class="pix-code">${pixCode}</div>
            
            <p style="text-align: center;">
              <em>Seu agendamento será confirmado automaticamente após a identificação do pagamento.</em>
            </p>
          </div>

          <div class="footer">
            <p>Esta é uma mensagem automática. Por favor, não responda este e-mail diretamente.</p>
            <p>Em caso de dúvidas, entre em contato através de poupando.tempo@hotmail.com</p>
            <p style="font-size: 10px; color: #999;">© ${new Date().getFullYear()} Poup Agenda. Todos os direitos reservados.</p>
          </div>
        </body>
        </html>
      `,
    });

    await client.close();

    console.log(`✅ Lembrete #${reminderNumber} enviado!`);

    return new Response(
      JSON.stringify({ 
        success: true,
        reminderNumber 
      }), 
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );

  } catch (error: any) {
    console.error("❌ Erro ao enviar lembrete:", error);
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
