import { supabase } from '@/integrations/supabase/client';

export interface EmailData {
  to: string;
  subject: string;
  template: 'agendamento' | 'lembrete' | 'cancelamento' | 'promocional' | 'boas-vindas';
  data: Record<string, any>;
}

export interface EmailTemplate {
  subject: string;
  htmlTemplate: string;
}

const EMAIL_TEMPLATES: Record<string, EmailTemplate> = {
  agendamento: {
    subject: '💳 Aguardando Pagamento - {servico}',
    htmlTemplate: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #f59e0b;">💳 Aguardando Pagamento</h1>
        <p>Olá <strong>{nome}</strong>,</p>
        <p>Sua solicitação foi recebida. Para garantir seu atendimento, complete o pagamento:</p>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3>📋 Detalhes do Serviço:</h3>
          <p><strong>Serviço:</strong> {servico}</p>
          <p><strong>Data:</strong> {data}</p>
          <p><strong>Horário:</strong> {horario}</p>
          <p><strong>Local:</strong> {unidade}</p>
          <p><strong>Endereço:</strong> {endereco}</p>
        </div>
        
        <div style="background: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
          <p style="margin: 0;"><strong>⚠️ Importante:</strong> Complete o pagamento para confirmar seu atendimento.</p>
        </div>
        
        <p>Após a confirmação do pagamento, você receberá todos os detalhes.</p>
        
        <hr style="margin: 30px 0;">
        <small style="color: #6b7280;">
          Este é um email automático, não é necessário responder.
        </small>
      </div>
    `
  },

  lembrete: {
    subject: '⏰ Lembrete: Agendamento Amanhã - {servico}',
    htmlTemplate: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #f59e0b;">⏰ Lembrete de Agendamento</h1>
        <p>Olá <strong>{nome}</strong>,</p>
        <p>Este é um lembrete do seu agendamento <strong>amanhã</strong>:</p>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>📋 Amanhã:</h3>
          <p><strong>Serviço:</strong> {servico}</p>
          <p><strong>Horário:</strong> {horario}</p>
          <p><strong>Local:</strong> {unidade}</p>
        </div>
        
        <p>✅ Chegue com 15 minutos de antecedência</p>
        <p>📱 Tenha seus documentos em mãos</p>
        
        <p>Nos vemos amanhã!</p>
      </div>
    `
  },

  cancelamento: {
    subject: '❌ Agendamento Cancelado - {servico}',
    htmlTemplate: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626;">❌ Agendamento Cancelado</h1>
        <p>Olá <strong>{nome}</strong>,</p>
        <p>Seu agendamento foi cancelado:</p>
        
        <div style="background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Serviço:</strong> {servico}</p>
          <p><strong>Data:</strong> {data}</p>
          <p><strong>Horário:</strong> {horario}</p>
        </div>
        
        <p>Você pode reagendar a qualquer momento através do nosso site.</p>
        
        <a href="{siteUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Reagendar Agora
        </a>
      </div>
    `
  },

  promocional: {
    subject: '🎉 Oferta Especial - {desconto}% de desconto!',
    htmlTemplate: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #059669;">🎉 Oferta Especial!</h1>
        <p>Olá <strong>{nome}</strong>,</p>
        
        <div style="background: linear-gradient(135deg, #059669, #34d399); padding: 30px; border-radius: 12px; margin: 20px 0; text-align: center; color: white;">
          <h2 style="margin: 0; font-size: 2.5em;">{desconto}%</h2>
          <h3 style="margin: 10px 0;">DE DESCONTO</h3>
          <p style="margin: 0;">Em todos os serviços</p>
        </div>
        
        <p><strong>Válido até:</strong> {validadeAte}</p>
        <p><strong>Código:</strong> <span style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-family: monospace;">{codigo}</span></p>
        
        <a href="{siteUrl}" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Agendar com Desconto
        </a>
      </div>
    `
  },

  'boas-vindas': {
    subject: '👋 Bem-vindo(a) ao Poupa Tempo!',
    htmlTemplate: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">👋 Bem-vindo(a)!</h1>
        <p>Olá <strong>{nome}</strong>,</p>
        <p>Que bom ter você conosco! 🎉</p>
        
        <p>Agora você pode:</p>
        <ul>
          <li>✅ Agendar serviços online</li>
          <li>🔔 Receber lembretes automáticos</li>
          <li>📱 Acompanhar seus agendamentos</li>
          <li>🎯 Aproveitar ofertas exclusivas</li>
        </ul>
        
        <a href="{siteUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Fazer Primeiro Agendamento
        </a>
        
        <p>Qualquer dúvida, estamos aqui para ajudar!</p>
      </div>
    `
  }
};

export const useEmailSystem = () => {
  const sendEmail = async (emailData: EmailData): Promise<boolean> => {
    try {
      const template = EMAIL_TEMPLATES[emailData.template];
      if (!template) {
        throw new Error(`Template ${emailData.template} não encontrado`);
      }

      // Substituir variáveis no template
      let htmlContent = template.htmlTemplate;
      let subject = template.subject;

      Object.entries(emailData.data).forEach(([key, value]) => {
        const placeholder = `{${key}}`;
        htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), String(value));
        subject = subject.replace(new RegExp(placeholder, 'g'), String(value));
      });

      const { data, error } = await supabase.functions.invoke('send-agendamento-email', {
        body: {
          to: emailData.to,
          subject,
          html: htmlContent,
          template: emailData.template,
          ...emailData.data
        }
      });

      if (error) {
        console.error('Erro ao enviar email:', error);
        return false;
      }

      console.log('✅ Email enviado:', data);
      return true;

    } catch (error) {
      console.error('Erro no sistema de email:', error);
      return false;
    }
  };

  const sendWelcomeEmail = async (nome: string, email: string) => {
    return sendEmail({
      to: email,
      subject: 'Bem-vindo!',
      template: 'boas-vindas',
      data: {
        nome,
        siteUrl: window.location.origin
      }
    });
  };

  const sendReminderEmail = async (agendamento: any) => {
    return sendEmail({
      to: agendamento.email,
      subject: 'Lembrete de Agendamento',
      template: 'lembrete',
      data: {
        nome: agendamento.nome,
        servico: agendamento.servico,
        data: agendamento.data,
        horario: agendamento.horario,
        unidade: agendamento.unidade
      }
    });
  };

  const sendCancellationEmail = async (agendamento: any) => {
    return sendEmail({
      to: agendamento.email,
      subject: 'Agendamento Cancelado',
      template: 'cancelamento',
      data: {
        nome: agendamento.nome,
        servico: agendamento.servico,
        data: agendamento.data,
        horario: agendamento.horario,
        siteUrl: window.location.origin
      }
    });
  };

  const sendPromotionalEmail = async (cliente: any, promocao: any) => {
    return sendEmail({
      to: cliente.email,
      subject: 'Oferta Especial!',
      template: 'promocional',
      data: {
        nome: cliente.nome,
        desconto: promocao.desconto,
        validadeAte: promocao.validadeAte,
        codigo: promocao.codigo,
        siteUrl: window.location.origin
      }
    });
  };

  const sendBulkEmails = async (emails: EmailData[]): Promise<number> => {
    let successCount = 0;

    for (const email of emails) {
      const success = await sendEmail(email);
      if (success) successCount++;
      
      // Delay para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return successCount;
  };

  return {
    sendEmail,
    sendWelcomeEmail,
    sendReminderEmail,
    sendCancellationEmail,
    sendPromotionalEmail,
    sendBulkEmails,
    templates: EMAIL_TEMPLATES
  };
}; 