import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Cookie, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CookieConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept, onDecline }) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se o usuário já deu consentimento
    const hasConsent = localStorage.getItem('cookie-consent');
    if (!hasConsent) {
      // Mostrar imediatamente
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setIsVisible(false);
    onAccept();
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setIsVisible(false);
    onDecline();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay - Fundo completamente opaco */}
      <div className="fixed inset-0 bg-white z-[9999] transition-opacity duration-300" />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto border border-gray-200 animate-in zoom-in-95 duration-300">
          {/* Header com ícone */}
          <div className="flex items-center gap-3 p-6 pb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Política de Cookies
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Transparência e controle de dados
              </p>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="px-6 pb-2">
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              Utilizamos cookies essenciais para o funcionamento do site e cookies analíticos para melhorar sua experiência. 
              Seus dados são tratados com total segurança e transparência.
            </p>

            {/* Benefícios */}
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Cookie className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  O que fazemos com os cookies:
                </span>
              </div>
              <ul className="text-xs text-blue-800 space-y-1 ml-6">
                <li>• Melhorar a performance do site</li>
                <li>• Personalizar sua experiência</li>
                <li>• Analisar o uso para aprimoramentos</li>
                <li>• Garantir a segurança dos dados</li>
              </ul>
            </div>

            {/* Link para política detalhada */}
            <div className="flex items-center gap-1 mb-6">
              <ExternalLink className="w-3 h-3 text-blue-600" />
              <button 
                className="text-xs text-blue-600 hover:text-blue-800 underline font-medium transition-colors"
                onClick={() => navigate('/politica-privacidade')}
              >
                Leia nossa Política de Privacidade completa
              </button>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="px-6 pb-6">
            <div className="flex gap-3">
              <Button
                onClick={handleAccept}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 font-medium"
              >
                Aceitar Cookies
              </Button>
              <Button
                onClick={handleDecline}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Recusar
              </Button>
            </div>
            
            {/* Texto informativo */}
            <p className="text-xs text-gray-500 text-center mt-3">
              Você pode alterar suas preferências a qualquer momento
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookieConsent;