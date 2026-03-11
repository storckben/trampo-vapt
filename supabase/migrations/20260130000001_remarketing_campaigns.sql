-- Tabela para campanhas de remarketing via push notification
CREATE TABLE IF NOT EXISTS public.remarketing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  icon TEXT DEFAULT '/favicon.ico',
  badge TEXT DEFAULT '/favicon.ico',
  target_audience JSONB DEFAULT '{}'::jsonb,
  schedule_type TEXT DEFAULT 'immediate' CHECK (schedule_type IN ('immediate', 'scheduled', 'recurring')),
  scheduled_for TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'failed')),
  sent_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id)
);

-- Tabela de push leads (caso não exista)
CREATE TABLE IF NOT EXISTS public.push_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT UNIQUE NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  customer_name TEXT,
  customer_phone TEXT,
  customer_cpf TEXT,
  customer_address_street TEXT,
  customer_address_number TEXT,
  customer_address_complement TEXT,
  customer_address_neighborhood TEXT,
  customer_address_city TEXT,
  customer_address_state TEXT,
  customer_address_zip_code TEXT,
  customer_address_country TEXT,
  interested_product TEXT,
  lead_source TEXT,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_notification_at TIMESTAMP WITH TIME ZONE,
  notification_count INTEGER DEFAULT 0
);

-- Índice para push_leads
CREATE INDEX IF NOT EXISTS idx_push_leads_endpoint ON public.push_leads(endpoint);

-- Tabela para rastrear envios de campanhas
CREATE TABLE IF NOT EXISTS public.campaign_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.remarketing_campaigns(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.push_leads(id) ON DELETE CASCADE,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  clicked_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  UNIQUE(campaign_id, lead_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_remarketing_campaigns_status ON public.remarketing_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_remarketing_campaigns_scheduled_for ON public.remarketing_campaigns(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_campaign_sends_campaign_id ON public.campaign_sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_sends_lead_id ON public.campaign_sends(lead_id);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.remarketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_sends ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso (permitir tudo para service_role)
CREATE POLICY "Enable all for service role" ON public.remarketing_campaigns
  FOR ALL USING (true);

CREATE POLICY "Enable all for service role" ON public.campaign_sends
  FOR ALL USING (true);
