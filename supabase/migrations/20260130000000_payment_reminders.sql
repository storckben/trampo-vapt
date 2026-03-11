-- Tabela para controlar lembretes de pagamento
CREATE TABLE IF NOT EXISTS payment_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  pix_code TEXT NOT NULL,
  pix_qrcode TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  reminder_count INTEGER DEFAULT 0,
  last_reminder_at TIMESTAMP WITH TIME ZONE,
  payment_confirmed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_payment_reminders_order_id ON payment_reminders(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_reminders_expires_at ON payment_reminders(expires_at);
CREATE INDEX IF NOT EXISTS idx_payment_reminders_payment_confirmed ON payment_reminders(payment_confirmed);

-- Função para limpar lembretes expirados (mais de 24h)
CREATE OR REPLACE FUNCTION cleanup_expired_reminders()
RETURNS void AS $$
BEGIN
  DELETE FROM payment_reminders
  WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;
