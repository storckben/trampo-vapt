import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePaymentGateway } from '@/hooks/usePaymentGateway';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const TestOrders = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Adicionar noindex para evitar indexação pelo Google
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow';
    document.head.appendChild(metaRobots);

    return () => {
      // Limpar meta tag ao desmontar componente
      const existingMeta = document.querySelector('meta[name="robots"]');
      if (existingMeta) {
        document.head.removeChild(existingMeta);
      }
    };
  }, []);
  const [ordersGenerated, setOrdersGenerated] = useState(0);
  const { createTransaction } = usePaymentGateway();

  const generateFakeOrders = async () => {
    setLoading(true);
    setOrdersGenerated(0);
    
    try {
      const names = [
        'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Ferreira',
        'Lucia Pereira', 'Roberto Lima', 'Fernanda Alves', 'Ricardo Sousa', 'Juliana Rodrigues',
        'Marcos Andrade', 'Patricia Martins', 'Eduardo Ribeiro', 'Carla Mendes', 'Felipe Araújo',
        'Vanessa Cardoso', 'Daniel Barbosa', 'Tatiana Gomes', 'Bruno Dias', 'Camila Rocha',
        'André Nascimento', 'Renata Moreira', 'Gustavo Correia', 'Isabella Teixeira', 'Rafael Campos',
        'Larissa Castro', 'Thiago Freitas', 'Bianca Vieira', 'Leonardo Pinto', 'Mariana Cunha',
        'Gabriel Monteiro', 'Priscila Nunes', 'Vinicius Lopes', 'Cristina Reis', 'Lucas Carvalho',
        'Amanda Azevedo', 'Rodrigo Silveira', 'Natalia Melo', 'Fabio Ramos', 'Leticia Moura'
      ];

      const cities = [
        'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador', 'Brasília',
        'Fortaleza', 'Curitiba', 'Recife', 'Porto Alegre', 'Goiânia',
        'Campinas', 'Santos', 'Vitória', 'Florianópolis', 'Natal'
      ];

      const states = ['SP', 'RJ', 'MG', 'BA', 'DF', 'CE', 'PR', 'PE', 'RS', 'GO', 'ES', 'SC', 'RN'];
      
      const services = [
        'DOC-RG-02', 'VEI-CNH-RN', 'FED-CPF-02', 'VEI-LIC-01', 'TRB-CRT-01',
        'DOC-CIN-01', 'DOC-CIN-02', 'DOC-RG-01', 'VEI-CNH-01', 'JUD-ANT-01'
      ];

      for (let i = 0; i < 40; i++) {
        try {
          const name = names[i % names.length];
          const city = cities[Math.floor(Math.random() * cities.length)];
          const state = states[Math.floor(Math.random() * states.length)];
          const service = services[Math.floor(Math.random() * services.length)];
          
          // Gerar CPF fictício
          const cpf = Math.floor(Math.random() * 99999999999).toString().padStart(11, '0');
          
          // Gerar telefone fictício
          const phone = `11${Math.floor(Math.random() * 900000000) + 100000000}`;
          
      // Gerar email fictício com domínio neutro
      const safeDomains = ['exemplo.com', 'demo.br', 'simulacao.net'];
      const domain = safeDomains[Math.floor(Math.random() * safeDomains.length)];
      const email = `${name.toLowerCase().replace(/\s+/g, '.')}${Math.floor(Math.random() * 100)}@${domain}`;
          
          // Valor entre R$ 50 e R$ 500 (em reais, não centavos)
          const amount = (Math.floor(Math.random() * 45) + 5) * 10;

          // Criar payload para o sistema unificado
          const unifiedPayload = {
            amount: amount,
            customer: {
              name: name,
              email: email,
              phone: phone,
              cpf: cpf,
              address: {
                street: `Rua ${Math.floor(Math.random() * 999) + 1}`,
                streetNumber: (Math.floor(Math.random() * 999) + 1).toString(),
                complement: '',
                zipCode: `${Math.floor(Math.random() * 99999).toString().padStart(5, '0')}${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`,
                neighborhood: `Bairro ${Math.floor(Math.random() * 20) + 1}`,
                city: city,
                state: state,
                country: 'Brasil'
              }
            },
            items: [
              {
                title: service,
                quantity: 1,
                unitPrice: amount,
                tangible: true
              }
            ],
            description: `Agendamento para ${service}`
          };

          // Chamar o gateway unificado para criar a transação
          const response = await createTransaction(unifiedPayload);
          
          if (response.status === 'success' || response.id) {
            // Salvar no banco de dados
            await supabase.from('pix_orders').insert({
              customer_name: name,
              customer_email: email,
              customer_phone: phone,
              customer_cpf: cpf,
              address_street: unifiedPayload.customer.address.street,
              address_street_number: unifiedPayload.customer.address.streetNumber,
              address_neighborhood: unifiedPayload.customer.address.neighborhood,
              address_city: unifiedPayload.customer.address.city,
              address_state: unifiedPayload.customer.address.state,
              address_zip_code: unifiedPayload.customer.address.zipCode,
              address_country: unifiedPayload.customer.address.country,
              product_name: 'Agenda',
              quantity: 1,
              amount: amount,
              status: 'pending',
              transaction_id: response.id,
              pix_code: response.pix_code || response.pixCode
            });

            setOrdersGenerated(i + 1);
            
            // Pausa entre pedidos para evitar rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
          } else {
            console.error(`Erro ao criar pedido ${i + 1}:`, response);
          }
        } catch (error) {
          console.error(`Erro ao processar pedido ${i + 1}:`, error);
        }
      }

      toast.success(`${ordersGenerated} pedidos gerados com sucesso no gateway!`);
      
    } catch (error) {
      console.error('Erro ao gerar pedidos:', error);
      toast.error('Erro ao gerar pedidos no gateway');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto pt-20">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-gray-800">
              Gerador de Pedidos de Teste
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Esta página gera 40 pedidos reais usando o gateway padrão do sistema. Cada pedido será processado com 2 segundos de intervalo.
              </p>
              
              {loading && (
                <div className="mb-4">
                  <p className="text-blue-600 font-medium">
                    Gerando pedidos... {ordersGenerated}/40
                  </p>
                </div>
              )}
              
              <Button 
                onClick={generateFakeOrders}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Gerando Pedidos...
                  </>
                ) : (
                  'Gerar 40 Pedidos Reais no Gateway'
                )}
              </Button>
              
              {loading && (
                <p className="text-sm text-orange-600 mt-4">
                  ⚠️ Processo lento: cada pedido leva ~2 segundos para processar no gateway
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestOrders;
