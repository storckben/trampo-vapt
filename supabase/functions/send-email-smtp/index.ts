import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Enviando email via SMTP...');
    
    const data = await req.json();
    console.log('📋 Dados recebidos:', data);

    const { nome, email, unidade, data: dataAgendamento, horario, servico, endereco } = data;

    // Configurações SMTP - Brevo (Sendinblue)
    const smtpHost = Deno.env.get("SMTP_HOST") || "smtp-relay.brevo.com";
    const smtpPort = parseInt(Deno.env.get("SMTP_PORT") || "587");
    const smtpUser = Deno.env.get("SMTP_USER"); // Login do Brevo (a136ab001@smtp-brevo.com)
    const smtpPass = Deno.env.get("SMTP_PASSWORD"); // Master Password ou chave SMTP
    const smtpFrom = Deno.env.get("SMTP_FROM") || "poupando.tempo@hotmail.com"; // Email remetente verificado

    if (!smtpUser || !smtpPass) {
      throw new Error('SMTP_USER e SMTP_PASSWORD não configurados');
    }

    console.log(`📧 Configurando SMTP: ${smtpHost}:${smtpPort} com ${smtpUser}`);

    // Usando nodemailer via npm
    const nodemailer = await import("npm:nodemailer@6.9.8");
    
    const transporter = nodemailer.default.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const info = await transporter.sendMail({
      from: `"Poup Agenda" <${smtpFrom}>`, // Usando email verificado
      to: email,
      subject: `💳 Aguardando Pagamento - ${unidade || 'Poup Agenda'}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 0;
              background-color: #f5f5f5;
            }
            .container {
              background-color: white;
              margin: 20px;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white; 
              padding: 40px 30px; 
              text-align: center; 
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 600;
            }
            .header p {
              margin: 10px 0 0 0;
              font-size: 16px;
              opacity: 0.95;
            }
            .content { 
              padding: 40px 30px; 
            }
            .info-card {
              background: #f8f9fa;
              border-left: 4px solid #667eea;
              padding: 20px;
              margin: 25px 0;
              border-radius: 8px;
            }
            .info-row {
              padding: 15px 0;
              border-bottom: 1px solid #e9ecef;
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .info-label {
              font-weight: 600;
              color: #667eea;
              display: block;
              margin-bottom: 5px;
              font-size: 14px;
            }
            .info-value {
              color: #333;
              display: block;
              font-size: 16px;
            }
            .alert-box {
              background: #d1ecf1;
              border: 1px solid #bee5eb;
              border-radius: 8px;
              padding: 20px;
              margin: 25px 0;
              color: #0c5460;
            }
            .alert-box strong {
              display: block;
              margin-bottom: 5px;
              font-size: 16px;
            }
            .footer { 
              background: #f8f9fa;
              text-align: center; 
              padding: 30px; 
              font-size: 13px; 
              color: #6c757d; 
            }
            .footer a {
              color: #667eea;
              text-decoration: none;
            }
            .divider {
              height: 1px;
              background: #e9ecef;
              margin: 30px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💳 Aguardando Pagamento</h1>
              <p>Complete o pagamento para garantir seu atendimento</p>
            </div>
            
            <div class="content">
              <p style="font-size: 18px; margin-top: 0;">Olá, <strong>${nome}</strong>! 👋</p>
              
              <p>Sua solicitação foi recebida. Para garantir seu atendimento, realize o pagamento o quanto antes:</p>

              <div class="info-card">
                <h3 style="margin-top: 0; color: #667eea;">📋 Detalhes do Serviço</h3>
                
                ${servico ? `
                <div class="info-row">
                  <span class="info-label">🎯 Serviço:</span>
                  <span class="info-value">${servico}</span>
                </div>
                ` : ''}
                
                ${dataAgendamento ? `
                <div class="info-row">
                  <span class="info-label">📅 Data:</span>
                  <span class="info-value">${dataAgendamento}</span>
                </div>
                ` : ''}
                
                ${horario ? `
                <div class="info-row">
                  <span class="info-label">⏰ Horário:</span>
                  <span class="info-value">${horario}</span>
                </div>
                ` : ''}
                
                ${unidade ? `
                <div class="info-row">
                  <span class="info-label">📍 Unidade:</span>
                  <span class="info-value">${unidade}</span>
                </div>
                ` : ''}
                
                ${endereco ? `
                <div class="info-row">
                  <span class="info-label">🗺️ Endereço:</span>
                  <span class="info-value">${endereco}</span>
                </div>
                ` : ''}
              </div>

              <div class="alert-box">
                <strong>⚠️ Importante:</strong>
                <p style="margin: 5px 0 0 0;">
                  • Complete o pagamento para confirmar seu atendimento<br>
                  • Após o pagamento, você receberá a confirmação<br>
                  • Guarde este e-mail para referência
                </p>
              </div>

              <div class="divider"></div>

              <p style="font-size: 14px; color: #6c757d;">
                <strong>Precisa remarcar ou cancelar?</strong><br>
                Entre em contato conosco o quanto antes através do e-mail 
                <a href="mailto:poupando.tempo@hotmail.com" style="color: #667eea;">poupando.tempo@hotmail.com</a>
              </p>
            </div>

            <div class="footer">
              <p style="margin: 0 0 10px 0;"><strong>Poup Agenda</strong></p>
              <p style="margin: 5px 0;">
                Em caso de dúvidas, responda este e-mail ou entre em contato:<br>
                <a href="mailto:poupando.tempo@hotmail.com">poupando.tempo@hotmail.com</a>
              </p>
              <p style="font-size: 11px; color: #999; margin-top: 20px;">
                © ${new Date().getFullYear()} Poup Agenda. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log('✅ Email enviado com sucesso via SMTP! MessageId:', info.messageId);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Email enviado com sucesso via SMTP",
      messageId: info.messageId
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("💥 Erro ao enviar email:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack,
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
