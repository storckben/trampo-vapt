import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PoliticaPrivacidade = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <img 
            src="/lovable-uploads/77c50366-3c6d-4d7b-b8a7-4fa2fc4e1fa3.png" 
            alt="imagem" 
            className="h-8"
          />
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Política de Privacidade e Cookies
          </h1>

          <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                1. Coleta de Informações
              </h2>
              <p>
                Coletamos apenas as informações necessárias para a prestação dos serviços, 
                incluindo dados pessoais fornecidos durante o agendamento e cookies técnicos para 
                o funcionamento adequado da plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                2. Uso de Cookies
              </h2>
              <p>
                Utilizamos cookies para:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Garantir o funcionamento técnico do site</li>
                <li>Melhorar a experiência do usuário</li>
                <li>Analisar o desempenho da plataforma</li>
                <li>Manter suas preferências de navegação</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                3. Tipos de Cookies
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">Cookies Essenciais</h3>
                  <p className="text-sm">
                    Necessários para o funcionamento básico do site, como autenticação e navegação.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Cookies Analíticos</h3>
                  <p className="text-sm">
                    Ajudam a entender como os usuários interagem com o site para melhorias futuras.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Cookies de Preferências</h3>
                  <p className="text-sm">
                    Armazenam suas escolhas para personalizar sua experiência.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                4. Proteção de Dados
              </h2>
              <p>
                Seus dados são protegidos por medidas de segurança técnicas e organizacionais adequadas. 
                Não compartilhamos informações pessoais com terceiros, exceto quando necessário para 
                a prestação do serviço ou por determinação legal.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                5. Seus Direitos
              </h2>
              <p>
                Você tem o direito de:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Aceitar ou recusar cookies não essenciais</li>
                <li>Solicitar acesso aos seus dados pessoais</li>
                <li>Solicitar correção de dados incorretos</li>
                <li>Solicitar exclusão de dados quando aplicável</li>
                <li>Retirar o consentimento a qualquer momento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                6. Alterações na Política
              </h2>
              <p>
                Esta política pode ser atualizada periodicamente. Recomendamos revisar 
                regularmente para estar ciente de quaisquer mudanças.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                7. Contato
              </h2>
              <p>
                Para dúvidas sobre esta política ou exercer seus direitos, entre em contato 
                através dos canais oficiais.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliticaPrivacidade;
