import React from 'react';
import { CheckCircle, Bell, X, Smartphone } from 'lucide-react';
import { getNotificationSupport, getInstallPromptMessage, isIOS } from '@/utils/deviceDetection';

interface NotificationToastProps {
  show: boolean;
  type: 'success' | 'denied';
  serviceName: string;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ 
  show, 
  type, 
  serviceName, 
  onClose 
}) => {
  if (!show) return null;
  
  // Desativar notificação toast para iOS
  if (isIOS()) return null;

  const support = getNotificationSupport();
  const installPrompt = getInstallPromptMessage();

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className={`
        bg-white rounded-lg shadow-lg border-l-4 p-4 max-w-sm
        ${type === 'success' ? 'border-green-500' : 'border-orange-500'}
      `}>
        <div className="flex items-start">
          <div className={`flex-shrink-0 mr-3 ${
            type === 'success' ? 'text-green-500' : 'text-orange-500'
          }`}>
            {type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <Bell className="h-5 w-5" />
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900">
              {type === 'success' ? '✅ Notificações Ativadas!' : 
               support.platform.includes('ios') ? '🍎 iOS Detectado' : '📱 Continuando sem notificações'}
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {type === 'success' 
                ? `Perfeito! Você receberá atualizações sobre ${serviceName} e seu agendamento.`
                : support.platform.includes('ios') 
                  ? `${support.message} Você pode continuar com ${serviceName} normalmente.`
                  : `Tudo bem! Você pode continuar com o agendamento de ${serviceName} normalmente.`
              }
            </p>
            {type === 'success' && (
              <p className="mt-1 text-xs text-gray-500">
                🔔 Você receberá notificações sobre status do pagamento e confirmação do agendamento.
              </p>
            )}
            {support.platform.includes('ios') && installPrompt.canInstall && (
              <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-800">
                <div className="flex items-center gap-1">
                  <Smartphone className="h-3 w-3" />
                  <span className="font-medium">Dica para melhor experiência:</span>
                </div>
                <p className="mt-1">{installPrompt.message}</p>
              </div>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}; 