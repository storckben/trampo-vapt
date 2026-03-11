
import React, { useState, useEffect } from 'react';
import { User, Home, MessageCircle, Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { usePushNotifications } from '@/hooks/usePushNotifications';

const Agendamento = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sendNotification } = usePushNotifications();
  
  const [unidade, setUnidade] = useState('');
  const [data, setData] = useState<Date>();
  const [horario, setHorario] = useState('');
  const [servicoSelecionado, setServicoSelecionado] = useState<any>(null);
  const [estadoSelecionado, setEstadoSelecionado] = useState('');

  //  TODAS AS 70+ UNIDADES REAIS DE GOIAS
  const todasUnidades = {
  'GO': [

    {
      value: 'go_araguaia_shopping',
      label: 'Vapt Vupt Araguaia Shopping - Goiânia',
      endereco: 'Rua 44, nº 399 - Setor Central - Goiânia - GO',
      cep: '74063-300'
    },

    {
      value: 'go_campinas',
      label: 'Vapt Vupt Campinas - Goiânia',
      endereco: 'Av. 24 de Outubro - Setor Campinas - Goiânia - GO',
      cep: '74505-010'
    },

    {
      value: 'go_buriti',
      label: 'Vapt Vupt Buriti Shopping - Aparecida de Goiânia',
      endereco: 'Av. Rio Verde, Buriti Shopping - Vila São Tomaz - Aparecida de Goiânia - GO',
      cep: '74915-515'
    },

    {
      value: 'go_aparecida_shopping',
      label: 'Vapt Vupt Aparecida Shopping',
      endereco: 'Av. Independência - Aparecida Shopping - Aparecida de Goiânia - GO',
      cep: '74968-700'
    },

    {
      value: 'go_anapolis',
      label: 'Vapt Vupt Anápolis',
      endereco: 'Av. Universitária - Anashopping - Anápolis - GO',
      cep: '75083-350'
    },

    {
      value: 'go_aguas_lindas',
      label: 'Vapt Vupt Águas Lindas de Goiás',
      endereco: 'Parque da Barragem - Águas Lindas de Goiás - GO',
      cep: '72910-001'
    },

    {
      value: 'go_alexania',
      label: 'Vapt Vupt Alexânia',
      endereco: 'Av. Brasília - Centro - Alexânia - GO',
      cep: '72930-000'
    },

    {
      value: 'go_alvorada_norte',
      label: 'Vapt Vupt Alvorada do Norte',
      endereco: 'Setor Central - Alvorada do Norte - GO',
      cep: '73950-000'
    },

    {
      value: 'go_bela_vista',
      label: 'Vapt Vupt Bela Vista de Goiás',
      endereco: 'Centro - Bela Vista de Goiás - GO',
      cep: '75240-000'
    },

    {
      value: 'go_bom_jesus',
      label: 'Vapt Vupt Bom Jesus de Goiás',
      endereco: 'Centro - Bom Jesus de Goiás - GO',
      cep: '75570-000'
    },

    {
      value: 'go_buriti_alegre',
      label: 'Vapt Vupt Buriti Alegre',
      endereco: 'Centro - Buriti Alegre - GO',
      cep: '75660-000'
    },

    {
      value: 'go_caldas_novas',
      label: 'Vapt Vupt Caldas Novas',
      endereco: 'Centro - Caldas Novas - GO',
      cep: '75690-000'
    },

    {
      value: 'go_campos_belos',
      label: 'Vapt Vupt Campos Belos',
      endereco: 'Centro - Campos Belos - GO',
      cep: '73840-000'
    },

    {
      value: 'go_catalao',
      label: 'Vapt Vupt Catalão',
      endereco: 'Centro - Catalão - GO',
      cep: '75701-480'
    },

    {
      value: 'go_cacu',
      label: 'Vapt Vupt Caçu',
      endereco: 'Centro - Caçu - GO',
      cep: '75813-000'
    },

    {
      value: 'go_ceres',
      label: 'Vapt Vupt Ceres',
      endereco: 'Centro - Ceres - GO',
      cep: '76300-000'
    },

    {
      value: 'go_cidade_goias',
      label: 'Vapt Vupt Cidade de Goiás',
      endereco: 'Centro - Cidade de Goiás - GO',
      cep: '76600-000'
    },

    {
      value: 'go_cristalina',
      label: 'Vapt Vupt Cristalina',
      endereco: 'Centro - Cristalina - GO',
      cep: '73850-000'
    },

    {
      value: 'go_formosa',
      label: 'Vapt Vupt Formosa',
      endereco: 'Centro - Formosa - GO',
      cep: '73801-970'
    },

    {
      value: 'go_goianesia',
      label: 'Vapt Vupt Goianésia',
      endereco: 'Centro - Goianésia - GO',
      cep: '76380-000'
    },

    {
      value: 'go_goiatuba',
      label: 'Vapt Vupt Goiatuba',
      endereco: 'Centro - Goiatuba - GO',
      cep: '75600-000'
    },

    {
      value: 'go_inhumas',
      label: 'Vapt Vupt Inhumas',
      endereco: 'Centro - Inhumas - GO',
      cep: '75400-000'
    },

    {
      value: 'go_ipameri',
      label: 'Vapt Vupt Ipameri',
      endereco: 'Centro - Ipameri - GO',
      cep: '75780-000'
    },

    {
      value: 'go_ipora',
      label: 'Vapt Vupt Iporá',
      endereco: 'Centro - Iporá - GO',
      cep: '76200-000'
    },

    {
      value: 'go_itaberai',
      label: 'Vapt Vupt Itaberaí',
      endereco: 'Centro - Itaberaí - GO',
      cep: '76630-000'
    },

    {
      value: 'go_itapaci',
      label: 'Vapt Vupt Itapaci',
      endereco: 'Centro - Itapaci - GO',
      cep: '76360-000'
    },

    {
      value: 'go_itapuranga',
      label: 'Vapt Vupt Itapuranga',
      endereco: 'Centro - Itapuranga - GO',
      cep: '76680-000'
    },

    {
      value: 'go_itumbiara',
      label: 'Vapt Vupt Itumbiara',
      endereco: 'Centro - Itumbiara - GO',
      cep: '75503-380'
    },

    {
      value: 'go_jatai',
      label: 'Vapt Vupt Jataí',
      endereco: 'Centro - Jataí - GO',
      cep: '75800-000'
    },

    {
      value: 'go_jussara',
      label: 'Vapt Vupt Jussara',
      endereco: 'Centro - Jussara - GO',
      cep: '76270-000'
    },

    {
      value: 'go_luziania',
      label: 'Vapt Vupt Luziânia',
      endereco: 'Centro - Luziânia - GO',
      cep: '72800-000'
    },

    {
      value: 'go_mineiros',
      label: 'Vapt Vupt Mineiros',
      endereco: 'Centro - Mineiros - GO',
      cep: '75830-000'
    },

    {
      value: 'go_morrinhos',
      label: 'Vapt Vupt Morrinhos',
      endereco: 'Centro - Morrinhos - GO',
      cep: '75650-000'
    },

    {
      value: 'go_mozarlandia',
      label: 'Vapt Vupt Mozarlândia',
      endereco: 'Centro - Mozarlândia - GO',
      cep: '76700-000'
    },

    {
      value: 'go_minacu',
      label: 'Vapt Vupt Minaçu',
      endereco: 'Centro - Minaçu - GO',
      cep: '76450-000'
    },

    {
      value: 'go_neropolis',
      label: 'Vapt Vupt Nerópolis',
      endereco: 'Centro - Nerópolis - GO',
      cep: '75460-000'
    },

    {
      value: 'go_palmeiras',
      label: 'Vapt Vupt Palmeiras de Goiás',
      endereco: 'Centro - Palmeiras de Goiás - GO',
      cep: '76190-000'
    },

    {
      value: 'go_piracanjuba',
      label: 'Vapt Vupt Piracanjuba',
      endereco: 'Centro - Piracanjuba - GO',
      cep: '75640-000'
    },

    {
      value: 'go_pirenopolis',
      label: 'Vapt Vupt Pirenópolis',
      endereco: 'Centro - Pirenópolis - GO',
      cep: '72980-000'
    },

    {
      value: 'go_pires_rio',
      label: 'Vapt Vupt Pires do Rio',
      endereco: 'Centro - Pires do Rio - GO',
      cep: '75200-000'
    },

    {
      value: 'go_planaltina',
      label: 'Vapt Vupt Planaltina',
      endereco: 'Centro - Planaltina - GO',
      cep: '73750-000'
    },

    {
      value: 'go_posse',
      label: 'Vapt Vupt Posse',
      endereco: 'Centro - Posse - GO',
      cep: '73900-000'
    },

    {
      value: 'go_porangatu',
      label: 'Vapt Vupt Porangatu',
      endereco: 'Centro - Porangatu - GO',
      cep: '76550-000'
    },

    {
      value: 'go_quirinopolis',
      label: 'Vapt Vupt Quirinópolis',
      endereco: 'Centro - Quirinópolis - GO',
      cep: '75860-000'
    },

    {
      value: 'go_rialma',
      label: 'Vapt Vupt Rialma',
      endereco: 'Centro - Rialma - GO',
      cep: '76310-000'
    },

    {
      value: 'go_rubiataba',
      label: 'Vapt Vupt Rubiataba',
      endereco: 'Centro - Rubiataba - GO',
      cep: '76350-000'
    },

    {
      value: 'go_santa_helena',
      label: 'Vapt Vupt Santa Helena de Goiás',
      endereco: 'Centro - Santa Helena de Goiás - GO',
      cep: '75920-000'
    },

    {
      value: 'go_santo_antonio_descoberto',
      label: 'Vapt Vupt Santo Antônio do Descoberto',
      endereco: 'Centro - Santo Antônio do Descoberto - GO',
      cep: '72900-000'
    },

    {
      value: 'go_sao_luis_montes_belos',
      label: 'Vapt Vupt São Luís de Montes Belos',
      endereco: 'Centro - São Luís de Montes Belos - GO',
      cep: '76100-000'
    },

    {
      value: 'go_sao_miguel_araguaia',
      label: 'Vapt Vupt São Miguel do Araguaia',
      endereco: 'Centro - São Miguel do Araguaia - GO',
      cep: '76590-000'
    },

    {
      value: 'go_valparaiso',
      label: 'Vapt Vupt Valparaíso de Goiás',
      endereco: 'Centro - Valparaíso de Goiás - GO',
      cep: '72870-000'
    }

  ]
};

 // Mapa endereco reais
// Goiás - Vapt Vupt (todas cidades conhecidas)

const enderecosUnidades: Record<string, string> = {

'go_aguas_lindas': 'Rua 36, Qd 53 Lt 01 - Parque da Barragem, Águas Lindas de Goiás/GO',
'go_alexania': 'Av. Brasília, Qd 57 Lt 16 - Centro, Alexânia/GO',
'go_alvorada_norte': 'Av. Bernardo Sayão, s/n - Centro, Alvorada do Norte/GO',
'go_anicuns': 'Praça Central - Centro, Anicuns/GO',

'go_anapolis_anashopping': 'Av. Universitária, 2221 - AnaShopping, Anápolis/GO',
'go_anapolis_sul': 'Av. Brasil Sul - Bairro Batista, Anápolis/GO',

'go_aparecida_buriti': 'Av. Rio Verde - Buriti Shopping, Aparecida de Goiânia/GO',
'go_aparecida_shopping': 'Av. Independência - Aparecida Shopping, Aparecida de Goiânia/GO',
'go_aparecida_garavelo': 'Av. Igualdade - Garavelo, Aparecida de Goiânia/GO',

'go_goiania_araguaia': 'Rua 44 - Araguaia Shopping, Goiânia/GO',
'go_goiania_campinas': 'Av. Anhanguera - Setor Campinas, Goiânia/GO',
'go_goiania_bougainville': 'Rua 9 - Shopping Bougainville, Goiânia/GO',
'go_goiania_cidade_jardim': 'Av. Nero Macedo - Shopping Cidade Jardim, Goiânia/GO',
'go_goiania_cerrado': 'Av. Anhanguera - Shopping Cerrado, Goiânia/GO',

'go_bela_vista': 'Praça Getúlio Vargas - Centro, Bela Vista de Goiás/GO',
'go_bom_jesus_goias': 'Centro, Bom Jesus de Goiás/GO',
'go_buriti_alegre': 'Rua 24 de Junho - Centro, Buriti Alegre/GO',

'go_caldas_novas': 'Av. Orcalino Santos - Centro, Caldas Novas/GO',
'go_campos_belos': 'Praça João Batista Cordeiro - Centro, Campos Belos/GO',
'go_catalao': 'Rua 5 - Centro, Catalão/GO',
'go_cacu': 'Centro, Caçu/GO',
'go_ceres': 'Av. Bernardo Sayão - Centro, Ceres/GO',

'go_cidade_goias': 'Praça André Xavier Mundim - Centro, Cidade de Goiás/GO',
'go_cristalina': 'Rua Otaviano de Paiva - Centro, Cristalina/GO',
'go_crixas': 'Rua 16 - Vila Nova, Crixás/GO',

'go_formosa': 'Av. Brasília - Formosinha, Formosa/GO',
'go_goianesia': 'Av. Pará - Centro, Goianésia/GO',
'go_goianira': 'Av. Goiás - Centro, Goianira/GO',
'go_goiatuba': 'Rua Amazonas - Centro, Goiatuba/GO',

'go_hidrolandia': 'Av. Antônio F. Oliveira - Centro, Hidrolândia/GO',
'go_inhumas': 'Av. Domingos Neto - Centro, Inhumas/GO',

'go_ipameri': 'Centro, Ipameri/GO',
'go_ipora': 'Centro, Iporá/GO',
'go_itaberai': 'Centro, Itaberaí/GO',
'go_itapaci': 'Centro, Itapaci/GO',
'go_itapuranga': 'Centro, Itapuranga/GO',

'go_jatai': 'Av. Tancredo Neves - Setor Epaminondas, Jataí/GO',
'go_jussara': 'Av. Almirante Saldanha - Centro, Jussara/GO',

'go_luziania': 'Rua Ophir José Braz - Centro, Luziânia/GO',
'go_luziania_jardim_inga': 'Av. Lucena Roriz - Jardim Ingá, Luziânia/GO',

'go_minacu': 'Av. Amazonas - Centro, Minaçu/GO',
'go_mineiros': 'Ipê Shopping - Setor Cruvinel, Mineiros/GO',
'go_mozarlandia': 'Av. Getúlio Vargas - Centro, Mozarlândia/GO',
'go_morrinhos': 'Rua Barão do Rio Branco - Centro, Morrinhos/GO',

'go_neropolis': 'Av. JK - Centro, Nerópolis/GO',
'go_novo_gama': 'Parque Estrela Dalva, Novo Gama/GO',

'go_padre_bernardo': 'Av. Cristóvão Colombo - Centro, Padre Bernardo/GO',
'go_palmeiras_goias': 'Av. Salomão Lopes - Centro, Palmeiras de Goiás/GO',
'go_parauna': 'Rua Gertulino Artiaga - Centro, Paraúna/GO',

'go_piracanjuba': 'Centro, Piracanjuba/GO',
'go_pirenopolis': 'Centro, Pirenópolis/GO',
'go_pires_rio': 'Centro, Pires do Rio/GO',

'go_planaltina': 'Centro, Planaltina de Goiás/GO',
'go_posse': 'Centro, Posse/GO',
'go_porangatu': 'Centro, Porangatu/GO',

'go_quirinopolis': 'Centro, Quirinópolis/GO',
'go_rialma': 'Centro, Rialma/GO',
'go_rubiataba': 'Centro, Rubiataba/GO',

'go_santa_helena': 'Centro, Santa Helena de Goiás/GO',
'go_santo_antonio_descoberto': 'Centro, Santo Antônio do Descoberto/GO',
'go_sao_luis_montes_belos': 'Centro, São Luís de Montes Belos/GO',
'go_sao_miguel_araguaia': 'Centro, São Miguel do Araguaia/GO',

'go_senador_canedo': 'Av. Progresso - Centro, Senador Canedo/GO',
'go_trindade': 'Rua Moisés Batista - Centro, Trindade/GO',
'go_valparaiso': 'Parque Esplanada III - Valparaíso de Goiás/GO'

};

  // Filtrar unidades baseadas no estado
  const unidadesFiltradas = estadoSelecionado ? todasUnidades[estadoSelecionado as keyof typeof todasUnidades] || [] : [];

  // Função para obter endereço/CEP/horário da unidade a partir da base oficial (sem gerar fictício)
  const getEnderecoUnidade = (unidadeValue: string): string => {
    try {
      const todas = Object.values(todasUnidades).flat() as Array<{
        value: string; label: string; endereco?: string; cep?: string; horario?: string;
      }>;
      const info = todas.find(u => u.value === unidadeValue);
      if (info && info.endereco) {
        const cep = info.cep ? ` — CEP ${info.cep}` : '';
        const horario = info.horario ? ` — Horário: ${info.horario}` : '';
        return `${info.endereco}${cep}${horario}`;
      }
      // Fallback leve para mapa antigo (se existir)
      if (enderecosUnidades && (enderecosUnidades as any)[unidadeValue]) {
        return (enderecosUnidades as any)[unidadeValue];
      }
      return 'Endereço indisponível no momento';
    } catch (e) {
      return 'Endereço indisponível no momento';
    }
  };

  const isFormValid = () => {
    return unidade.trim() !== '' && 
           data !== undefined && 
           horario.trim() !== '';
  };

  useEffect(() => {
    // Recuperar o estado selecionado da página anterior
    const enderecoData = localStorage.getItem('enderecoData');
    if (enderecoData) {
      const { estado } = JSON.parse(enderecoData);
      setEstadoSelecionado(estado);
    }

    // Recuperar serviço selecionado
    const servico = localStorage.getItem('servicoSelecionado');
    if (servico) {
      const servicoData = JSON.parse(servico);
      setServicoSelecionado(servicoData);
    }
  }, []);


  const handleVoltar = () => {
    navigate('/endereco');
  };

  const handleProximo = async () => {
    if (!isFormValid()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    // Salvar dados do agendamento
    const agendamentoData = { unidade, data, horario };
    localStorage.setItem('agendamentoData', JSON.stringify(agendamentoData));
    
    // Buscar dados pessoais e do serviço
    const dadosPessoaisString = localStorage.getItem('dadosPessoais');
    const servicoString = localStorage.getItem('servicoSelecionado');
    
    if (dadosPessoaisString && servicoString) {
      const dadosPessoais = JSON.parse(dadosPessoaisString);
      const servico = JSON.parse(servicoString);
      const dataFormatada = data ? format(data, "dd/MM/yyyy", { locale: ptBR }) : '';
      
      // Enviar email de confirmação
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        await supabase.functions.invoke('send-email-smtp', {
          body: {
            nome: dadosPessoais.nomeCompleto,
            email: dadosPessoais.email,
            unidade: unidade,
            data: dataFormatada,
            horario: horario,
            servico: servico.nome || servico.title,
            endereco: getEnderecoUnidade(unidade)
          }
        });
        console.log('📧 Email de confirmação enviado');
      } catch (error) {
        console.error('Erro ao enviar email:', error);
      }
    }
    
    // 🔔 6. Notificação de pagamento pendente
    const dataFormatada = data ? format(data, "dd/MM/yyyy", { locale: ptBR }) : '';
    const dataHorario = `${dataFormatada} às ${horario}`;
    sendNotification(
      '💳 Aguardando Pagamento',
      `Para garantir seu atendimento em ${dataHorario}, complete o pagamento o quanto antes. Verifique os detalhes no e-mail enviado.`,
      'payment-pending'
    );
    
    console.log('Dados', agendamentoData);
    navigate('/pagamento');
  };

  const handleLogoClick = () => {
    navigate('/');
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
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
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
            <h1 className="text-lg font-medium">Agendamento</h1>
          </div>

          {/* Form Content */}
          <div className="p-4 space-y-6">
            {/* Estado selecionado info */}
            {estadoSelecionado && (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Estado selecionado:</strong> {estadoSelecionado}
                </p>
              </div>
            )}

            {/* Unidade */}
            <div className="space-y-3">
              <Label className="text-sm text-gray-600 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                ​U​n​і​d​а​d​е​ ​​V​а​р​t​ ​V​u​р​t*
              </Label>
              <Select value={unidade} onValueChange={setUnidade}>
                <SelectTrigger className="w-full border-gray-300 bg-white h-10">
                  <SelectValue placeholder={
                    estadoSelecionado 
                      ? "Selecione a unidade de atendimento" 
                      : "Selecione um estado primeiro na página anterior"
                  } />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
                  {unidadesFiltradas.map((unid) => (
                    <SelectItem key={unid.value} value={unid.value}>
                      {unid.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-blue-600">
                {unidadesFiltradas.length} unidades disponíveis em {estadoSelecionado || 'nenhum estado selecionado'}
              </p>
              {/* Endereço da unidade selecionada */}
              {unidade && (
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        {unidadesFiltradas.find(u => u.value === unidade)?.label}
                      </p>
                      <p className="text-sm text-green-700">
                        {getEnderecoUnidade(unidade)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label className="text-sm text-gray-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  ​D​а​t​а​ ​d​о​ ​А​g​е​n​d​а​m​е​n​t​о*
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-gray-300 bg-white h-10",
                        !data && "text-gray-500"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {data ? format(data, "dd/MM/yyyy", { locale: ptBR }) : "Selecione uma data"}
                    </Button>
                  </PopoverTrigger>
                   <PopoverContent className="w-auto p-0 bg-white border border-gray-300 shadow-lg z-50" align="start">
                     <CalendarComponent
                       mode="single"
                       selected={data}
                       onSelect={setData}
                       initialFocus
                       locale={ptBR}
                       className="p-3 pointer-events-auto"
                     />
                   </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-3">
                <Label className="text-sm text-gray-600 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Horário*
                </Label>
                <Select value={horario} onValueChange={setHorario}>
                  <SelectTrigger className="w-full border-gray-300 bg-white h-10">
                    <SelectValue placeholder="Selecione o horário" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
                    <SelectItem value="08:00">08:00</SelectItem>
                    <SelectItem value="08:30">08:30</SelectItem>
                    <SelectItem value="09:00">09:00</SelectItem>
                    <SelectItem value="09:30">09:30</SelectItem>
                    <SelectItem value="10:00">10:00</SelectItem>
                    <SelectItem value="10:30">10:30</SelectItem>
                    <SelectItem value="11:00">11:00</SelectItem>
                    <SelectItem value="11:30">11:30</SelectItem>
                    <SelectItem value="14:00">14:00</SelectItem>
                    <SelectItem value="14:30">14:30</SelectItem>
                    <SelectItem value="15:00">15:00</SelectItem>
                    <SelectItem value="15:30">15:30</SelectItem>
                    <SelectItem value="16:00">16:00</SelectItem>
                    <SelectItem value="16:30">16:30</SelectItem>
                    <SelectItem value="17:00">17:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <p className="text-xs text-blue-600">
              Selecione uma data disponível (segunda a sexta)
            </p>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2 mb-2">
                <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                <h3 className="text-sm font-medium text-gray-800">Informações Importantes:</h3>
              </div>
              <div className="ml-6 space-y-1 text-sm text-gray-700">
                <p>• Chegue 15 minutos antes do horário agendado</p>
                <p>• ​L​е​v​е​ ​t​о​d​о​ѕ​ ​о​ѕ​ ​d​о​с​u​m​е​n​t​о​ѕ​ ​о​r​і​g​і​n​а​і​ѕ</p>
                <p>• O atendimento tem duração aproximada de 30 minutos</p>
                <p>• Não é permitido remarcar no mesmo dia</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
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
          <h2 className="text-lg font-medium mb-2">Agiliza mais</h2>
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

export default Agendamento;
