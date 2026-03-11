import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { usePaymentGateway } from '@/hooks/usePaymentGateway';


const TesteSyncPay = () => {
  const navigate = useNavigate();

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
  const { toast } = useToast();
  const { createTransaction, loading, error } = usePaymentGateway();
  
  // Dados do cliente para teste
  const [clienteData, setClienteData] = useState({
    nome: 'Cliente Demo Processo',
    email: 'cliente.demo@exemplo.com',
    telefone: '(11) 99999-9999',
    cpf: '12345678901',
    endereco: {
      rua: 'Rua de Simulacao',
      numero: '123',
      cep: '01234567',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP'
    }
  });
  
  // Dados do serviço para teste
  const [servicoData, setServicoData] = useState({
    nome: 'DOC-RG-02 - Processo Gateway',
    valor: 63.00
  });
  
  // Dados da resposta do pagamento
  const [paymentData, setPaymentData] = useState(null);
  const [pixCopied, setPixCopied] = useState(false);

  const handleGerarPix = async () => {
    try {
      const payload = {
        amount: servicoData.valor,
        customer: {
          name: clienteData.nome,
          email: clienteData.email,
          phone: clienteData.telefone,
          cpf: clienteData.cpf,
          address: {
            street: clienteData.endereco.rua,
            streetNumber: clienteData.endereco.numero,
            zipCode: clienteData.endereco.cep,
            neighborhood: clienteData.endereco.bairro,
            city: clienteData.endereco.cidade,
            state: clienteData.endereco.estado,
            country: 'Brasil'
          }
        },
        items: [{
          title: servicoData.nome,
          quantity: 1,
          unitPrice: servicoData.valor,
          tangible: true
        }],
        description: servicoData.nome
      };

      console.log('🔥 PROCESSO GATEWAY - Enviando payload:', payload);
      const response = await createTransaction(payload);
      console.log('✅ PROCESSO GATEWAY - Resposta recebida:', response);
      
      setPaymentData(response);
      
      toast({
        title: "PIX Gerado com Sucesso!",
        description: "Código PIX criado para teste.",
      });
      
    } catch (err) {
      console.error('❌ PROCESSO GATEWAY - Erro:', err);
      toast({
        title: "Erro ao Gerar PIX",
        description: err.message || "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const handleCopyPix = async () => {
    if (!paymentData?.pix_code && !paymentData?.pixCode) return;
    
    const pixCode = paymentData.pix_code || paymentData.pixCode;
    try {
      await navigator.clipboard.writeText(pixCode);
      setPixCopied(true);
      toast({
        title: "Código PIX Copiado!",
        description: "Cole no seu aplicativo bancário.",
      });
      
      setTimeout(() => setPixCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Erro ao Copiar",
        description: "Não foi possível copiar o código PIX.",
        variant: "destructive",
      });
    }
  };

  const handleVoltar = () => {
    navigate('/admin');
  };

  const getPixCode = () => {
    if (!paymentData) return '';
    return paymentData.pix_code || paymentData.pixCode || paymentData.paymentCode || '';
  };

  const getQRCodeBase64 = () => {
    if (!paymentData) return '';
    return paymentData.qr_code_base64 || paymentData.qrCode || paymentData.paymentCodeBase64 || '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleVoltar}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Processo SyncPay API</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Card de Informações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Processo de Integração SyncPay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Esta página permite verificar a nova integração com a API do SyncPay sem afetar o sistema em produção.
            </p>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-700 text-sm">
                  <strong>Erro:</strong> {error}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Dados do Teste */}
          <Card>
            <CardHeader>
              <CardTitle>Dados para Processo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Cliente</Label>
                <Input value={clienteData.nome} readOnly className="bg-gray-50" />
              </div>
              
              <div>
                <Label>Email</Label>
                <Input value={clienteData.email} readOnly className="bg-gray-50" />
              </div>
              
              <div>
                <Label>CPF</Label>
                <Input value={clienteData.cpf} readOnly className="bg-gray-50" />
              </div>
              
              <div>
                <Label>Serviço</Label>
                <Input value={servicoData.nome} readOnly className="bg-gray-50" />
              </div>
              
              <div>
                <Label>Valor</Label>
                <Input 
                  value={`R$ ${servicoData.valor.toFixed(2)}`} 
                  readOnly 
                  className="bg-gray-50" 
                />
              </div>

              <Button 
                onClick={handleGerarPix}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Gerando PIX...' : 'Gerar PIX Processo'}
              </Button>
            </CardContent>
          </Card>

          {/* Resultado do PIX */}
          <Card>
            <CardHeader>
              <CardTitle>Retorno</CardTitle>
            </CardHeader>
            <CardContent>
              {!paymentData ? (
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Clique em "Gerar PIX Processo" para ver o retorno</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* QR Code */}
                  {getQRCodeBase64() && (
                    <div className="text-center">
                      <img 
                        src={`data:image/png;base64,${getQRCodeBase64()}`}
                        alt="QR Code PIX"
                        className="mx-auto max-w-[200px] border rounded"
                      />
                    </div>
                  )}

                  {/* Transaction ID */}
                  {paymentData.id && (
                    <div>
                      <Label className="text-xs text-gray-500">ID da Transação</Label>
                      <div className="bg-gray-50 p-2 rounded text-xs font-mono break-all">
                        {paymentData.id}
                      </div>
                    </div>
                  )}

                  {/* Status */}
                  {paymentData.status && (
                    <div>
                      <Label className="text-xs text-gray-500">Status</Label>
                      <div className="bg-gray-50 p-2 rounded text-sm">
                        {paymentData.status}
                      </div>
                    </div>
                  )}

                  {/* Código PIX */}
                  {getPixCode() && (
                    <div>
                      <Label className="text-xs text-gray-500">Código PIX</Label>
                      <div className="flex gap-2">
                        <Input 
                          value={getPixCode()}
                          readOnly
                          className="bg-gray-50 text-xs font-mono"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCopyPix}
                          className="px-3"
                        >
                          {pixCopied ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Debug Info */}
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                      Ver resposta completa (Debug Info)
                    </summary>
                    <pre className="mt-2 bg-gray-100 p-3 rounded text-xs overflow-auto">
                      {JSON.stringify(paymentData, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TesteSyncPay;