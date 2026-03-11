import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Settings, Check, ArrowLeft, Zap, Shield, RefreshCw, AlertTriangle } from 'lucide-react';
import { usePaymentGateway, type PaymentGateway } from '@/hooks/usePaymentGateway';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const ConfiguracaoAPI = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    currentGateway, 
    switchGateway, 
    availableGateways, 
    isAutoFallbackEnabled, 
    toggleAutoFallback 
  } = usePaymentGateway();

  const handleSwitchGateway = (gateway: PaymentGateway) => {
    switchGateway(gateway);
    toast({
      title: "Gateway Alterado",
      description: `Gateway principal alterado para ${gateway === 'syncpay' ? 'SyncPay' : 'GestaoPay'}`,
    });
  };

  const handleToggleAutoFallback = (enabled: boolean) => {
    toggleAutoFallback(enabled);
    toast({
      title: enabled ? "Fallback Automático Ativado" : "Fallback Automático Desativado",
      description: enabled 
        ? "Agora se o gateway principal falhar, tentará automaticamente o de backup"
        : "Agora apenas o gateway principal será usado, sem fallback automático",
    });
  };

  const gatewayInfo = {
    syncpay: {
      name: 'SyncPay',
      description: 'Gateway principal recomendado - Rápido e confiável',
      icon: <Zap className="w-5 h-5" />,
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-800'
    },
    gestaopay: {
      name: 'GestaoPay',
      description: 'Gateway secundário - Manual quando necessário',
      icon: <Shield className="w-5 h-5" />,
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-800'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-gray-600" />
            <h1 className="text-2xl font-bold text-gray-800">Configuração de APIs</h1>
          </div>
        </div>

        {/* Status Atual */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              Gateway Ativo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                {gatewayInfo[currentGateway].icon}
                <div>
                  <h3 className="font-semibold text-green-800">
                    {gatewayInfo[currentGateway].name}
                  </h3>
                  <p className="text-sm text-green-600">
                    {gatewayInfo[currentGateway].description}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Ativo
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Configuração de Fallback */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Configuração de Fallback
            </CardTitle>
            <p className="text-sm text-gray-600">
              Controle como o sistema deve reagir quando o gateway principal falha.
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isAutoFallbackEnabled ? 'bg-green-100' : 'bg-orange-100'}`}>
                  {isAutoFallbackEnabled ? (
                    <RefreshCw className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">
                    {isAutoFallbackEnabled ? 'Fallback Automático' : 'Modo Manual'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {isAutoFallbackEnabled 
                      ? 'Se o gateway principal falhar, tentará automaticamente o de backup'
                      : 'Apenas o gateway principal será usado, sem tentativa automática de backup'
                    }
                  </p>
                  <div className="mt-2">
                    <Badge 
                      variant={isAutoFallbackEnabled ? "default" : "secondary"}
                      className={isAutoFallbackEnabled ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}
                    >
                      {isAutoFallbackEnabled ? 'Ativo' : 'Desativado'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <Switch
                checked={isAutoFallbackEnabled}
                onCheckedChange={handleToggleAutoFallback}
              />
            </div>
          </CardContent>
        </Card>

        {/* Seleção de Gateway */}
        <Card>
          <CardHeader>
            <CardTitle>Selecionar Gateway Principal</CardTitle>
            <p className="text-sm text-gray-600">
              Escolha qual gateway será usado como principal.
              {isAutoFallbackEnabled && ' O outro funcionará como backup automático.'}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableGateways.map((gateway) => (
              <div
                key={gateway}
                className={`p-4 border rounded-lg transition-all cursor-pointer hover:shadow-md ${
                  currentGateway === gateway
                    ? gatewayInfo[gateway].color + ' border-2'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleSwitchGateway(gateway)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={currentGateway === gateway ? gatewayInfo[gateway].textColor : 'text-gray-600'}>
                      {gatewayInfo[gateway].icon}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${
                        currentGateway === gateway ? gatewayInfo[gateway].textColor : 'text-gray-800'
                      }`}>
                        {gatewayInfo[gateway].name}
                      </h3>
                      <p className={`text-sm ${
                        currentGateway === gateway ? gatewayInfo[gateway].textColor : 'text-gray-600'
                      }`}>
                        {gatewayInfo[gateway].description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {currentGateway === gateway && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Principal
                      </Badge>
                    )}
                    {currentGateway !== gateway && isAutoFallbackEnabled && (
                      <Badge variant="outline">
                        Backup
                      </Badge>
                    )}
                    <Button
                      variant={currentGateway === gateway ? "default" : "outline"}
                      size="sm"
                      disabled={currentGateway === gateway}
                    >
                      {currentGateway === gateway ? 'Ativo' : 'Selecionar'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Informações Adicionais */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Como Funciona</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600 mt-0.5">
                1
              </div>
              <div>
                <h4 className="font-medium">Gateway Principal</h4>
                <p className="text-sm text-gray-600">
                  Todas as transações tentarão usar o gateway selecionado como principal primeiro.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600 mt-0.5">
                2
              </div>
              <div>
                <h4 className="font-medium">Fallback Automático</h4>
                <p className="text-sm text-gray-600">
                  Se habilitado, tentará automaticamente o gateway de backup quando o principal falhar.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600 mt-0.5">
                3
              </div>
              <div>
                <h4 className="font-medium">Controle Total</h4>
                <p className="text-sm text-gray-600">
                  Você pode alternar entre modo automático (com fallback) ou manual (apenas gateway principal).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConfiguracaoAPI;