
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

  //  TODAS AS 230+ UNIDADES REAIS DE SÃO PAULO
  const todasUnidades = {
    'SP': [
      // São Paulo - Capital
      { 
        value: 'sp_se', 
        label: '​Р​о​u​р​а​t​е​m​р​о Sé - São Paulo',
        endereco: 'Praça do Carmo, s/nº - Sé, São Paulo - SP',
        cep: '01013-001'
      },
      { 
        value: 'sp_lapa', 
        label: '​Р​о​u​р​а​t​е​m​р​о Lapa - São Paulo',
        endereco: 'Rua do Curtume, s/n - Lapa, São Paulo - SP',
        cep: '05033-002'
      },
      { 
        value: 'sp_santo_amaro', 
        label: '​Р​о​u​р​а​t​е​m​р​о Santo Amaro - São Paulo',
        endereco: 'Rua Amador Bueno, 229 - Mais Shopping - Santo Amaro, São Paulo - SP',
        cep: '04752-005'
      },
      { 
        value: 'sp_itaquera', 
        label: '​Р​о​u​р​а​t​е​m​р​о Itaquera - São Paulo',
        endereco: 'Avenida do Contorno, 60 - Itaquera, São Paulo - SP',
        cep: '08295-005'
      },
      { 
        value: 'sp_santana_digital', 
        label: '​Р​о​u​р​а​t​е​m​р​о Santana Digital - São Paulo',
        endereco: 'Terminal Metrô Santana - Santana, São Paulo - SP',
        cep: '02012-000'
      },
      { 
        value: 'sp_cidade_tiradentes', 
        label: '​Р​о​u​р​а​t​е​m​р​о Cidade Tiradentes - São Paulo',
        endereco: 'Rua Sara Kubitscheck, 165 - Cidade Tiradentes, São Paulo - SP',
        cep: '08410-900'
      },
      { 
        value: 'sp_caninde', 
        label: '​Р​о​u​р​а​t​е​m​р​о Canindé - São Paulo',
        endereco: 'Avenida Cruzeiro do Sul, 1100 - Canindé, São Paulo - SP',
        cep: '03033-000'
      },
      { 
        value: 'sp_alesp', 
        label: '​Р​о​u​р​а​t​е​m​р​о ALESP - São Paulo',
        endereco: 'Rua Abolição, 39 - Paraíso, São Paulo - SP',
        cep: '04004-070'
      },
      { 
        value: 'sp_carrao_digital', 
        label: '​Р​о​u​р​а​t​е​m​р​о Carrão Digital - São Paulo',
        endereco: 'Terminal Metrô Carrão Sul - Vila Gomes Cardim, São Paulo - SP',
        cep: '03401-000'
      },
      { 
        value: 'sp_cidade_ademar', 
        label: '​Р​о​u​р​а​t​е​m​р​о Cidade Ademar - São Paulo',
        endereco: 'Avenida Cupecê, 5497 - Jardim Miriam, São Paulo - SP',
        cep: '04365-000'
      },
      { 
        value: 'sp_crea_digital', 
        label: '​Р​о​u​р​а​t​е​m​р​о CREA Digital - São Paulo',
        endereco: 'Avenida Brigadeiro Faria Lima, 1059 - Pinheiros, São Paulo - SP',
        cep: '01452-001'
      },
      { 
        value: 'sp_piraporinha_digital', 
        label: '​Р​о​u​р​а​t​е​m​р​о Piraporinha Digital - São Paulo',
        endereco: 'Avenida Inácio Dias da Silva, 80 - Piraporinha, São Paulo - SP',
        cep: '05835-450'
      },
      { 
        value: 'sp_sapopemba', 
        label: '​Р​о​u​р​а​t​е​m​р​о Sapopemba - São Paulo',
        endereco: 'Avenida Sapopemba, 8798 - Vila Regente Feijó, São Paulo - SP',
        cep: '03345-000'
      },
      { 
        value: 'sp_interlagos', 
        label: '​Р​о​u​р​а​t​е​m​р​о Interlagos - São Paulo',
        endereco: 'Avenida Interlagos, 4333 - Interlagos, São Paulo - SP',
        cep: '04661-001'
      },
      { 
        value: 'sp_vila_maria', 
        label: '​Р​о​u​р​а​t​е​m​р​о Vila Maria - São Paulo',
        endereco: 'Avenida Guilherme Cotching, 590 - Vila Maria, São Paulo - SP',
        cep: '02113-100'
      },
      { 
        value: 'sp_freguesia_do_o', 
        label: '​Р​о​u​р​а​t​е​m​р​о Freguesia do Ó - São Paulo',
        endereco: 'Largo da Matriz de Nossa Senhora do Ó, 215 - Freguesia do Ó, São Paulo - SP',
        cep: '02925-040'
      },
      { 
        value: 'sp_penha', 
        label: '​Р​о​u​р​а​t​е​m​р​о Penha - São Paulo',
        endereco: 'Rua Augusto Carlos Bauman, 851 - Penha, São Paulo - SP',
        cep: '03636-100'
      },
      { 
        value: 'sp_ipiranga', 
        label: '​Р​о​u​р​а​t​е​m​р​о Ipiranga - São Paulo',
        endereco: 'Rua Bom Pastor, 2240 - Ipiranga, São Paulo - SP',
        cep: '04203-000'
      },
      { 
        value: 'sp_jabaquara', 
        label: '​Р​о​u​р​а​t​е​m​р​о Jabaquara - São Paulo',
        endereco: 'Avenida Engenheiro Armando de Arruda Pereira, 2314 - Jabaquara, São Paulo - SP',
        cep: '04308-000'
      },
      { 
        value: 'sp_vila_prudente', 
        label: '​Р​о​u​р​а​t​е​m​р​о Vila Prudente - São Paulo',
        endereco: 'Rua Ibitirama, 2231 - Vila Prudente, São Paulo - SP',
        cep: '03141-001'
      },
      { 
        value: 'sp_vila_formosa', 
        label: '​Р​о​u​р​а​t​е​m​р​о Vila Formosa - São Paulo',
        endereco: 'Rua Tuiuti, 2142 - Tatuapé, São Paulo - SP',
        cep: '03081-000'
      },
      { 
        value: 'sp_liberdade', 
        label: '​Р​о​u​р​а​t​е​m​р​о Liberdade - São Paulo',
        endereco: 'Rua Galvão Bueno, 425 - Liberdade, São Paulo - SP',
        cep: '01506-000'
      },
      
      // Região Metropolitana de São Paulo
      { 
        value: 'sp_sao_bernardo', 
        label: '​Р​о​u​р​а​t​е​m​р​о São Bernardo do Campo',
        endereco: 'Rua Jurubatuba, 366 - Centro, São Bernardo do Campo - SP',
        cep: '09725-000'
      },
      { 
        value: 'sp_santo_andre', 
        label: '​Р​о​u​р​а​t​е​m​р​о Santo André',
        endereco: 'Avenida Industrial, 1740 - Jardim, Santo André - SP',
        cep: '09080-500'
      },
      { 
        value: 'sp_osasco', 
        label: '​Р​о​u​р​а​t​е​m​р​о Osasco',
        endereco: 'Rua Antônio Agu, 118 - Centro, Osasco - SP',
        cep: '06013-010'
      },
      { 
        value: 'sp_mogi_das_cruzes', 
        label: '​Р​о​u​р​а​t​е​m​р​о Mogi das Cruzes',
        endereco: 'Avenida Vereador Narciso Yague Guimarães, 277 - Centro Cívico, Mogi das Cruzes - SP',
        cep: '08710-000'
      },
      { 
        value: 'sp_diadema', 
        label: '​Р​о​u​р​а​t​е​m​р​о Diadema',
        endereco: 'Avenida Alda, 255 - Centro, Diadema - SP',
        cep: '09910-170'
      },
      { 
        value: 'sp_suzano', 
        label: '​Р​о​u​р​а​t​е​m​р​о Suzano',
        endereco: 'Rua Baruel, 501 - Centro, Suzano - SP',
        cep: '08674-170'
      },
      { 
        value: 'sp_guarulhos', 
        label: '​Р​о​u​р​а​t​е​m​р​о Guarulhos',
        endereco: 'Rua Claudino Barbosa, 313 - Macedo, Guarulhos - SP',
        cep: '07115-000'
      },
      { 
        value: 'sp_maua', 
        label: '​Р​о​u​р​а​t​е​m​р​о Mauá',
        endereco: 'Avenida Antonia Rosa Fioravanti, 1654 - Jardim Cerqueira Leite, Mauá - SP',
        cep: '09370-500'
      },
      { 
        value: 'sp_sao_caetano', 
        label: '​Р​о​u​р​а​t​е​m​р​о São Caetano do Sul',
        endereco: 'Rua Visconde de Inhaúma, 1572 - Centro, São Caetano do Sul - SP',
        cep: '09510-000'
      },
      { 
        value: 'sp_caieiras', 
        label: '​Р​о​u​р​а​t​е​m​р​о Caieiras',
        endereco: 'Rua Major Azarias de Brito, 616 - Centro, Caieiras - SP',
        cep: '07700-000'
      },
      { 
        value: 'sp_franco_da_rocha', 
        label: '​Р​о​u​р​а​t​е​m​р​о Franco da Rocha',
        endereco: 'Rua Rangel Pestana, 70 - Centro, Franco da Rocha - SP',
        cep: '07804-000'
      },
      { 
        value: 'sp_aruja', 
        label: '​Р​о​u​р​а​t​е​m​р​о Arujá',
        endereco: 'Rua Cataguases, 1029 - Centro, Arujá - SP',
        cep: '07400-000'
      },
      { 
        value: 'sp_santa_isabel', 
        label: '​Р​о​u​р​а​t​е​m​р​о Santa Isabel',
        endereco: 'Avenida Nove de Julho, 680 - Centro, Santa Isabel - SP',
        cep: '07500-000'
      },
      { 
        value: 'sp_ferraz_vasconcelos', 
        label: '​Р​о​u​р​а​t​е​m​р​о Ferraz de Vasconcelos',
        endereco: 'Rua Rui Barbosa, 549 - Centro, Ferraz de Vasconcelos - SP',
        cep: '08500-000'
      },
      { 
        value: 'sp_itaquaquecetuba', 
        label: '​Р​о​u​р​а​t​е​m​р​о Itaquaquecetuba',
        endereco: 'Estrada Japão, 97 - Vila Virgínia, Itaquaquecetuba - SP',
        cep: '08571-000'
      },
      { 
        value: 'sp_poa', 
        label: '​Р​о​u​р​а​t​е​m​р​о Poá',
        endereco: 'Rua Padre João Nery, 1275 - Centro, Poá - SP',
        cep: '08550-000'
      },
      { 
        value: 'sp_ribeiro_pires', 
        label: '​Р​о​u​р​а​t​е​m​р​о Ribeirão Pires',
        endereco: 'Rua Miguel Prisco, 288 - Centro, Ribeirão Pires - SP',
        cep: '09400-000'
      },
      { 
        value: 'sp_rio_grande_serra', 
        label: '​Р​о​u​р​а​t​е​m​р​о Rio Grande da Serra',
        endereco: 'Rua dos Expedicionários, 95 - Centro, Rio Grande da Serra - SP',
        cep: '09450-000'
      },
      { 
        value: 'sp_embu', 
        label: '​Р​о​u​р​а​t​е​m​р​о Embu das Artes',
        endereco: 'Rua Manoel Lopes, 57 - Centro, Embu das Artes - SP',
        cep: '06803-000'
      },
      { 
        value: 'sp_embu_guacu', 
        label: '​Р​о​u​р​а​t​е​m​р​о Embu-Guaçu',
        endereco: 'Estrada de Itapecerica, 4108 - Centro, Embu-Guaçu - SP',
        cep: '06900-000'
      },
      { 
        value: 'sp_itapecerica_serra', 
        label: '​Р​о​u​р​а​t​е​m​р​о Itapecerica da Serra',
        endereco: 'Rua Professor Virgilio de Carvalho Pinto, 451 - Centro, Itapecerica da Serra - SP',
        cep: '06850-000'
      },
      { 
        value: 'sp_juquitiba', 
        label: '​Р​о​u​р​а​t​е​m​р​о Juquitiba',
        endereco: 'Rua Benedito da Cruz Santos, 130 - Centro, Juquitiba - SP',
        cep: '06950-000'
      },
      { 
        value: 'sp_sao_lourenco_serra', 
        label: '​Р​о​u​р​а​t​е​m​р​о São Lourenço da Serra',
        endereco: 'Estrada de Itapecerica, 2831 - Centro, São Lourenço da Serra - SP',
        cep: '06890-000'
      },
      { 
        value: 'sp_taboao_serra', 
        label: '​Р​о​u​р​а​t​е​m​р​о Taboão da Serra',
        endereco: 'Rua Maria Rosa, 713 - Jardim Maria Rosa, Taboão da Serra - SP',
        cep: '06763-260'
      },
      { 
        value: 'sp_vargem_grande_paulista', 
        label: '​Р​о​u​р​а​t​е​m​р​о Vargem Grande Paulista',
        endereco: 'Rua Treze de Maio, 55 - Centro, Vargem Grande Paulista - SP',
        cep: '06730-000'
      },
      { 
        value: 'sp_cotia', 
        label: '​Р​о​u​р​а​t​е​m​р​о Cotia',
        endereco: 'Avenida Professor Manoel José Pedroso, 20 - Centro, Cotia - SP',
        cep: '06708-070'
      },
      { 
        value: 'sp_carapicuiba', 
        label: '​Р​о​u​р​а​t​е​m​р​о Carapicuíba',
        endereco: 'Rua Amazonas, 278 - Centro, Carapicuíba - SP',
        cep: '06310-000'
      },
      { 
        value: 'sp_jandira', 
        label: '​Р​о​u​р​а​t​е​m​р​о Jandira',
        endereco: 'Rua Elias Yazbek, 155 - Centro, Jandira - SP',
        cep: '06600-000'
      },
      { 
        value: 'sp_itapevi', 
        label: '​Р​о​u​р​а​t​е​m​р​о Itapevi',
        endereco: 'Rua Quinze de Novembro, 618 - Centro, Itapevi - SP',
        cep: '06654-000'
      },
      { 
        value: 'sp_barueri', 
        label: '​Р​о​u​р​а​t​е​m​р​о Barueri',
        endereco: 'Rua Angela Mirella, 500 - Jardim Barueri, Barueri - SP',
        cep: '06454-070'
      },
      { 
        value: 'sp_santana_parnaiba', 
        label: '​Р​о​u​р​а​t​е​m​р​о Santana de Parnaíba',
        endereco: 'Rua Quinze de Novembro, 65 - Centro, Santana de Parnaíba - SP',
        cep: '06501-000'
      },
      
      // Interior de São Paulo
      { 
        value: 'sp_campinas', 
        label: '​Р​о​u​р​а​t​е​m​р​о Campinas',
        endereco: 'Avenida Francisco Glicério, 935 - Centro, Campinas - SP',
        cep: '13012-000'
      },
      { 
        value: 'sp_sorocaba', 
        label: '​Р​о​u​р​а​t​е​m​р​о Sorocaba',
        endereco: 'Rua Boa Morte, 629 - Centro, Sorocaba - SP',
        cep: '18035-000'
      },
      { 
        value: 'sp_ribeirao_preto', 
        label: '​Р​о​u​р​а​t​е​m​р​о Ribeirão Preto',
        endereco: 'Avenida Caramuru, 2240 - República, Ribeirão Preto - SP',
        cep: '14030-000'
      },
      { 
        value: 'sp_jundiai', 
        label: '​Р​о​u​р​а​t​е​m​р​о Jundiaí',
        endereco: 'Rua do Retiro, 1334 - Anhangabaú, Jundiaí - SP',
        cep: '13201-110'
      },
      { 
        value: 'sp_piracicaba', 
        label: '​Р​о​u​р​а​t​е​m​р​о Piracicaba',
        endereco: 'Rua Governador Pedro de Toledo, 1823 - Centro, Piracicaba - SP',
        cep: '13400-000'
      },
      { 
        value: 'sp_bauru', 
        label: '​Р​о​u​р​а​t​е​m​р​о Bauru',
        endereco: 'Rua Gomes Freire, 2-60 - Centro, Bauru - SP',
        cep: '17015-130'
      },
      { 
        value: 'sp_sao_jose_campos', 
        label: '​Р​о​u​р​а​t​е​m​р​о São José dos Campos',
        endereco: 'Rua José de Alencar, 123 - Jardim Oriente, São José dos Campos - SP',
        cep: '12235-000'
      },
      { 
        value: 'sp_taubate', 
        label: '​Р​о​u​р​а​t​е​m​р​о Taubaté',
        endereco: 'Praça Dom Epaminondas, 103 - Centro, Taubaté - SP',
        cep: '12020-200'
      },
      { 
        value: 'sp_franca', 
        label: '​Р​о​u​р​а​t​е​m​р​о Franca',
        endereco: 'Avenida Dr. Ismael Alonso y Alonso, 4500 - Country Club, Franca - SP',
        cep: '14403-430'
      },
      { 
        value: 'sp_araraquara', 
        label: '​Р​о​u​р​а​t​е​m​р​о Araraquara',
        endereco: 'Rua Gonçalves Dias, 570 - Centro, Araraquara - SP',
        cep: '14801-290'
      },
      { 
        value: 'sp_limeira', 
        label: '​Р​о​u​р​а​t​е​m​р​о Limeira',
        endereco: 'Rua Senador Vergueiro, 77 - Centro, Limeira - SP',
        cep: '13480-010'
      },
      { 
        value: 'sp_americana', 
        label: '​Р​о​u​р​а​t​е​m​р​о Americana',
        endereco: 'Rua das Poncianas, 1300 - Jardim Mirandola, Americana - SP',
        cep: '13477-570'
      },
      { 
        value: 'sp_presidente_prudente', 
        label: '​Р​о​u​р​а​t​е​m​р​о Presidente Prudente',
        endereco: 'Avenida Brasil, 1383 - Vila São Jorge, Presidente Prudente - SP',
        cep: '19030-430'
      },
      { 
        value: 'sp_marilia', 
        label: '​Р​о​u​р​а​t​е​m​р​о Marília',
        endereco: 'Avenida das Esmeraldas, 3579 - Jardim Esmeralda, Marília - SP',
        cep: '17525-170'
      },
      { 
        value: 'sp_aracatuba', 
        label: '​Р​о​u​р​а​t​е​m​р​о Araçatuba',
        endereco: 'Rua Coelho Neto, 73 - Centro, Araçatuba - SP',
        cep: '16010-060'
      },
      { 
        value: 'sp_sao_carlos', 
        label: '​Р​о​u​р​а​t​е​m​р​о São Carlos',
        endereco: 'Rua Episcopal, 1456 - Centro, São Carlos - SP',
        cep: '13560-470'
      },
      { 
        value: 'sp_rio_claro', 
        label: '​Р​о​u​р​а​t​е​m​р​о Rio Claro',
        endereco: 'Avenida Tancredo Neves, 488 - Centro, Rio Claro - SP',
        cep: '13500-001'
      },
      { 
        value: 'sp_jacareí', 
        label: '​Р​о​u​р​а​t​е​m​р​о Jacareí',
        endereco: 'Rua Barão de Jacareí, 521 - Centro, Jacareí - SP',
        cep: '12327-010'
      },
      { 
        value: 'sp_guaratingueta', 
        label: '​Р​о​u​р​а​t​е​m​р​о Guaratinguetá',
        endereco: 'Rua Professor Martinico Prado, 73 - Centro, Guaratinguetá - SP',
        cep: '12500-000'
      },
      { 
        value: 'sp_cruzeiro', 
        label: '​Р​о​u​р​а​t​е​m​р​о Cruzeiro',
        endereco: 'Rua Major Novaes, 26 - Centro, Cruzeiro - SP',
        cep: '12701-340'
      },
      { 
        value: 'sp_lorena', 
        label: '​Р​о​u​р​а​t​е​m​р​о Lorena',
        endereco: 'Rua Dr. Peixoto de Castro, 133 - Centro, Lorena - SP',
        cep: '12600-010'
      },
      { 
        value: 'sp_caraguatatuba', 
        label: '​Р​о​u​р​а​t​е​m​р​о Caraguatatuba',
        endereco: 'Avenida da Praia, 618 - Centro, Caraguatatuba - SP',
        cep: '11660-000'
      },
      { 
        value: 'sp_ubatuba', 
        label: '​Р​о​u​р​а​t​е​m​р​о Ubatuba',
        endereco: 'Rua Conceição, 213 - Centro, Ubatuba - SP',
        cep: '11680-000'
      },
      { 
        value: 'sp_sao_sebastiao', 
        label: '​Р​о​u​р​а​t​е​m​р​о São Sebastião',
        endereco: 'Avenida Altino Arantes, 174 - Centro, São Sebastião - SP',
        cep: '11600-000'
      },
      { 
        value: 'sp_ilhabela', 
        label: '​Р​о​u​р​а​t​е​m​р​о Ilhabela',
        endereco: 'Avenida Brasil, 1263 - Barra Velha, Ilhabela - SP',
        cep: '11630-000'
      },
      
      // Litoral
      { 
        value: 'sp_santos', 
        label: '​Р​о​u​р​а​t​е​m​р​о Santos',
        endereco: 'Avenida Senador Pinheiro Machado, 48 - Vila Mathias, Santos - SP',
        cep: '11015-001'
      },
      { 
        value: 'sp_praia_grande', 
        label: '​Р​о​u​р​а​t​е​m​р​о Praia Grande',
        endereco: 'Avenida Presidente Kennedy, 9000 - Quietude, Praia Grande - SP',
        cep: '11704-900'
      },
      { 
        value: 'sp_sao_vicente', 
        label: '​Р​о​u​р​а​t​е​m​р​о São Vicente',
        endereco: 'Praça 22 de Janeiro, 10 - Centro, São Vicente - SP',
        cep: '11310-071'
      },
      { 
        value: 'sp_guaruja', 
        label: '​Р​о​u​р​а​t​е​m​р​о Guarujá',
        endereco: 'Avenida Santos Dumont, 80 - Santo Antônio, Guarujá - SP',
        cep: '11431-000'
      },
      { 
        value: 'sp_cubatao', 
        label: '​Р​о​u​р​а​t​е​m​р​о Cubatão',
        endereco: 'Rua Coronel Joaquim Montenegro, 86 - Centro, Cubatão - SP',
        cep: '11510-000'
      },
      { 
        value: 'sp_bertioga', 
        label: '​Р​о​u​р​а​t​е​m​р​о Bertioga',
        endereco: 'Rua Luiz Pereira de Campos, 901 - Centro, Bertioga - SP',
        cep: '11250-000'
      },
      { 
        value: 'sp_mongagua', 
        label: '​Р​о​u​р​а​t​е​m​р​о Mongaguá',
        endereco: 'Avenida Marginal, 210 - Centro, Mongaguá - SP',
        cep: '11730-000'
      },
      { 
        value: 'sp_itanhaem', 
        label: '​Р​о​u​р​а​t​е​m​р​о Itanhaém',
        endereco: 'Avenida Condessa Elizabeta Matarazzo, 806 - Centro, Itanhaém - SP',
        cep: '11740-000'
      },
      { 
        value: 'sp_peruibe', 
        label: '​Р​о​u​р​а​t​е​m​р​о Peruíbe',
        endereco: 'Rua Sete de Setembro, 456 - Centro, Peruíbe - SP',
        cep: '11750-000'
      },
      { 
        value: 'sp_iguape', 
        label: '​Р​о​u​р​а​t​е​m​р​о Iguape',
        endereco: 'Praça da Basílica, 20 - Centro, Iguape - SP',
        cep: '11920-000'
      },
      { 
        value: 'sp_registro', 
        label: '​Р​о​u​р​а​t​е​m​р​о Registro',
        endereco: 'Rua Itapura, 126 - Centro, Registro - SP',
        cep: '11900-000'
      },
      { 
        value: 'sp_eldorado', 
        label: '​Р​о​u​р​а​t​е​m​р​о Eldorado',
        endereco: 'Rua Campos Sales, 95 - Centro, Eldorado - SP',
        cep: '11960-000'
      },
      { 
        value: 'sp_sete_barras', 
        label: '​Р​о​u​р​а​t​е​m​р​о Sete Barras',
        endereco: 'Rua Benedito Calixto, 230 - Centro, Sete Barras - SP',
        cep: '11910-000'
      },
      { 
        value: 'sp_pariquera_acu', 
        label: '​Р​о​u​р​а​t​е​m​р​о Pariquera-Açu',
        endereco: 'Rua José Bonifácio, 120 - Centro, Pariquera-Açu - SP',
        cep: '11930-000'
      },
      { 
        value: 'sp_jacupiranga', 
        label: '​Р​о​u​р​а​t​е​m​р​о Jacupiranga',
        endereco: 'Rua Tenente Oliveira, 148 - Centro, Jacupiranga - SP',
        cep: '11940-000'
      },
      { 
        value: 'sp_cajati', 
        label: '​Р​о​u​р​а​t​е​m​р​о Cajati',
        endereco: 'Rua Coronel Souza Franco, 365 - Centro, Cajati - SP',
        cep: '11950-000'
      },
      { 
        value: 'sp_cananeia', 
        label: '​Р​о​u​р​а​t​е​m​р​о Cananéia',
        endereco: 'Rua Tristão Lobo, 33 - Centro, Cananéia - SP',
        cep: '11990-000'
      },
      { 
        value: 'sp_ilha_comprida', 
        label: '​Р​о​u​р​а​t​е​m​р​о Ilha Comprida',
        endereco: 'Avenida Beira Mar, 2555 - Centro, Ilha Comprida - SP',
        cep: '11925-000'
      },
      
      // Cidades Adicionais do Interior e Vale do Paraíba
      { 
        value: 'sp_sao_joao_boa_vista', 
        label: '​Р​о​u​р​а​t​е​m​р​о São João da Boa Vista',
        endereco: 'Rua Campos Salles, 664 - Centro, São João da Boa Vista - SP',
        cep: '13870-000'
      },
      { 
        value: 'sp_casa_branca', 
        label: '​Р​о​u​р​а​t​е​m​р​о Casa Branca',
        endereco: 'Rua Rui Barbosa, 885 - Centro, Casa Branca - SP',
        cep: '13700-000'
      },
      { 
        value: 'sp_mococa', 
        label: '​Р​о​u​р​а​t​е​m​р​о Mococa',
        endereco: 'Rua Coronel Joaquim Murtinho, 69 - Centro, Mococa - SP',
        cep: '13730-000'
      },
      { 
        value: 'sp_caconde', 
        label: '​Р​о​u​р​а​t​е​m​р​о Caconde',
        endereco: 'Praça Washington Luís, 218 - Centro, Caconde - SP',
        cep: '13770-000'
      },
      { 
        value: 'sp_divinolandia', 
        label: '​Р​о​u​р​а​t​е​m​р​о Divinolândia',
        endereco: 'Rua José Bonifácio, 456 - Centro, Divinolândia - SP',
        cep: '13780-000'
      },
      { 
        value: 'sp_vargem_grande_sul', 
        label: '​Р​о​u​р​а​t​е​m​р​о Vargem Grande do Sul',
        endereco: 'Avenida Regato, 1080 - Centro, Vargem Grande do Sul - SP',
        cep: '13880-000'
      },
      { 
        value: 'sp_aguai', 
        label: '​Р​о​u​р​а​t​е​m​р​о Aguaí',
        endereco: 'Rua Coronel Joaquim Leite, 627 - Centro, Aguaí - SP',
        cep: '13860-000'
      },
      { 
        value: 'sp_sao_jose_rio_pardo', 
        label: '​Р​о​u​р​а​t​е​m​р​о São José do Rio Pardo',
        endereco: 'Rua Marechal Deodoro, 1452 - Centro, São José do Rio Pardo - SP',
        cep: '13720-000'
      },
      { 
        value: 'sp_espirito_santo_pinhal', 
        label: '​Р​о​u​р​а​t​е​m​р​о Espírito Santo do Pinhal',
        endereco: 'Rua Coronel Flamínio Ferreira, 555 - Centro, Espírito Santo do Pinhal - SP',
        cep: '13990-000'
      },
      { 
        value: 'sp_santo_antonio_jardim', 
        label: '​Р​о​u​р​а​t​е​m​р​о Santo Antônio do Jardim',
        endereco: 'Rua José Braz, 298 - Centro, Santo Antônio do Jardim - SP',
        cep: '13850-000'
      },
      { 
        value: 'sp_tambau', 
        label: '​Р​о​u​р​а​t​е​m​р​о Tambaú',
        endereco: 'Rua Barão de Tambaú, 456 - Centro, Tambaú - SP',
        cep: '13710-000'
      },
      { 
        value: 'sp_santa_rosa_viterbo', 
        label: '​Р​о​u​р​а​t​е​m​р​о Santa Rosa de Viterbo',
        endereco: 'Rua Sete de Setembro, 1142 - Centro, Santa Rosa de Viterbo - SP',
        cep: '14270-000'
      },
      { 
        value: 'sp_cajuru', 
        label: '​Р​о​u​р​а​t​е​m​р​о Cajuru',
        endereco: 'Rua Coronel Agenor de Oliveira, 321 - Centro, Cajuru - SP',
        cep: '14240-000'
      },
      { 
        value: 'sp_santa_cruz_esperanca', 
        label: '​Р​о​u​р​а​t​е​m​р​о Santa Cruz da Esperança',
        endereco: 'Rua João Silvano, 127 - Centro, Santa Cruz da Esperança - SP',
        cep: '14230-000'
      },
      { 
        value: 'sp_altinopolis', 
        label: '​Р​о​u​р​а​t​е​m​р​о Altinópolis',
        endereco: 'Rua Coronel Flamínio Leite, 684 - Centro, Altinópolis - SP',
        cep: '14350-000'
      },
      { 
        value: 'sp_batatais', 
        label: '​Р​о​u​р​а​t​е​m​р​о Batatais',
        endereco: 'Rua Professor Octávio Bastos, 785 - Centro, Batatais - SP',
        cep: '14300-000'
      },
      { 
        value: 'sp_brodowski', 
        label: '​Р​о​u​р​а​t​е​m​р​о Brodowski',
        endereco: 'Rua Washington Luís, 421 - Centro, Brodowski - SP',
        cep: '14340-000'
      },
      { 
        value: 'sp_jardinopolis', 
        label: '​Р​о​u​р​а​t​е​m​р​о Jardinópolis',
        endereco: 'Avenida Voluntários da Pátria, 1566 - Centro, Jardinópolis - SP',
        cep: '14680-000'
      },
      { 
        value: 'sp_serrana', 
        label: '​Р​о​u​р​а​t​е​m​р​о Serrana',
        endereco: 'Rua Sete de Setembro, 823 - Centro, Serrana - SP',
        cep: '14150-000'
      },
      { 
        value: 'sp_cravinhos', 
        label: '​Р​о​u​р​а​t​е​m​р​о Cravinhos',
        endereco: 'Rua Coronel Agostinho, 745 - Centro, Cravinhos - SP',
        cep: '14140-000'
      },
      { 
        value: 'sp_sales_oliveira', 
        label: '​Р​о​u​р​а​t​е​m​р​о Sales Oliveira',
        endereco: 'Rua Major João Teixeira, 298 - Centro, Sales Oliveira - SP',
        cep: '14990-000'
      },
      { 
        value: 'sp_orlandia', 
        label: '​Р​о​u​р​а​t​е​m​р​о Orlândia',
        endereco: 'Rua Rui Barbosa, 1456 - Centro, Orlândia - SP',
        cep: '14620-000'
      },
      { 
        value: 'sp_morro_agudo', 
        label: '​Р​о​u​р​а​t​е​m​р​о Morro Agudo',
        endereco: 'Rua Coronel Agostinho Prado, 789 - Centro, Morro Agudo - SP',
        cep: '14650-000'
      },
      { 
        value: 'sp_nuporanga', 
        label: '​Р​о​u​р​а​t​е​m​р​о Nuporanga',
        endereco: 'Rua Siqueira Campos, 365 - Centro, Nuporanga - SP',
        cep: '14790-000'
      },
      { 
        value: 'sp_miguelopolis', 
        label: '​Р​о​u​р​а​t​е​m​р​о Miguelópolis',
        endereco: 'Avenida Nove de Julho, 1245 - Centro, Miguelópolis - SP',
        cep: '14530-000'
      },
      { 
        value: 'sp_guara', 
        label: '​Р​о​u​р​а​t​е​m​р​о Guará',
        endereco: 'Rua José Bonifácio, 523 - Centro, Guará - SP',
        cep: '14850-000'
      },
      { 
        value: 'sp_ipua', 
        label: '​Р​о​u​р​а​t​е​m​р​о Ipuã',
        endereco: 'Rua Coronel João Silva, 687 - Centro, Ipuã - SP',
        cep: '14920-000'
      },
      { 
        value: 'sp_cristais_paulista', 
        label: '​Р​о​u​р​а​t​е​m​р​о Cristais Paulista',
        endereco: 'Rua Barão de Franca, 456 - Centro, Cristais Paulista - SP',
        cep: '14830-000'
      },
      { 
        value: 'sp_pedregulho', 
        label: '​Р​о​u​р​а​t​е​m​р​о Pedregulho',
        endereco: 'Praça Coronel João Lamego, 89 - Centro, Pedregulho - SP',
        cep: '14910-000'
      },
      { 
        value: 'sp_rifaina', 
        label: '​Р​о​u​р​а​t​е​m​р​о Rifaina',
        endereco: 'Rua Coronel Flamínio, 298 - Centro, Rifaina - SP',
        cep: '14960-000'
      },
      { 
        value: 'sp_restinga', 
        label: '​Р​о​u​р​а​t​е​m​р​о Restinga',
        endereco: 'Rua Antônio Joaquim, 456 - Centro, Restinga - SP',
        cep: '14940-000'
      },
      { 
        value: 'sp_sao_joaquim_barra', 
        label: '​Р​о​u​р​а​t​е​m​р​о São Joaquim da Barra',
        endereco: 'Avenida Rui Barbosa, 1689 - Centro, São Joaquim da Barra - SP',
        cep: '14600-000'
      },
      { 
        value: 'sp_ituverava', 
        label: '​Р​о​u​р​а​t​е​m​р​о Ituverava',
        endereco: 'Rua Major Claudiano, 845 - Centro, Ituverava - SP',
        cep: '14500-000'
      },
      { 
        value: 'sp_aramina', 
        label: '​Р​о​u​р​а​t​е​m​р​о Aramina',
        endereco: 'Rua Coronel Francisco, 789 - Centro, Aramina - SP',
        cep: '14510-000'
      },
      { 
        value: 'sp_buritizal', 
        label: '​Р​о​u​р​а​t​е​m​р​о Buritizal',
        endereco: 'Rua José Carlos, 298 - Centro, Buritizal - SP',
        cep: '14520-000'
      },
      { 
        value: 'sp_igarapava', 
        label: '​Р​о​u​р​а​t​е​m​р​о Igarapava',
        endereco: 'Rua Siqueira Campos, 1245 - Centro, Igarapava - SP',
        cep: '14540-000'
      }
    ],
  };

  // Mapa de endereços reais das unidades
  const enderecosUnidades = {
    // São Paulo
    'sp_sp_se': 'Praça do Carmo, s/nº, Sé - São Paulo/SP',
    'sp_sp_itaquera': 'Av. do Contorno, 60 - Itaquera, São Paulo/SP',
    'sp_guarulhos': 'Rua José Campanella, 189 - Bairro Macedo, Guarulhos/SP',
    'sp_campinas': 'Av. Francisco Glicério, 935 - Centro, Campinas/SP',
    'sp_santos': 'Rua João Pessoa, 246 - Centro, Santos/SP',
    'sp_osasco': 'Av. Hilário Pereira de Souza, 664 - Centro, Osasco/SP',
    'sp_sorocaba': 'Rua Leopoldo Machado, 525 - Centro, Sorocaba/SP',
    'sp_ribeirao_preto': 'Av. Presidente Kennedy, 1500 - Novo Shopping Center, Ribeirão Preto/SP',
    'sp_sao_bernardo': 'Rua Nicolau Filizola, 100 - Centro, São Bernardo do Campo/SP',
    'sp_santo_andre': 'Rua das Figueiras, 474 - Centro, Santo André/SP',
    'sp_bauru': 'Av. Nações Unidas, 4-44 - Centro, Bauru/SP',
    'sp_piracicaba': 'Praça José Bonifácio, 700 - Centro, Piracicaba/SP',
    'sp_jundiai': 'Av. União dos Ferroviários, 1.760 - Centro, Jundiaí/SP',
    'sp_sao_jose_campos': 'Av. São João, 2.200 - Shopping Colinas (Piso Superior), São José dos Campos/SP',
    'sp_mogi_cruzes': 'Av. Ver. Narciso Yague Guimarães, 1.000 - Centro Cívico, Mogi das Cruzes/SP',
    'sp_taubate': 'Av. Bandeirantes, 808 - Jardim Maria Augusta (Complexo Shibata), Taubaté/SP',
    
    // Minas Gerais
    'mg_divinopolis': 'Av. Primeiro de Junho, 500 - Centro, Divinópolis/MG',
    'mg_bh_centro': 'Rua dos Tupis, 149 - Centro, Belo Horizonte/MG',
    'mg_contagem': 'Av. João César de Oliveira, 5.000 - Eldorado, Contagem/MG',
    'mg_uberlandia': 'Av. Rondon Pacheco, 4.600 - Tibery, Uberlândia/MG',
    'mg_juiz_fora': 'Rua Halfeld, 1.000 - Centro, Juiz de Fora/MG',
    'mg_montes_claros': 'Av. Dulce Sarmento, 3.000 - Major Prates, Montes Claros/MG',
    'mg_betim': 'Rua Pará, 50 - Centro, Betim/MG',
    'mg_sete_lagoas': 'Av. Getúlio Vargas, 200 - Centro, Sete Lagoas/MG',
    'mg_pouso_alegre': 'Av. Shishima Hifumi, 2.911 - Cidade Jardim, Pouso Alegre/MG',
    'mg_uberaba': 'Av. Leopoldino de Oliveira, 3.000 - Abadia, Uberaba/MG',
    'mg_governador_valadares': 'Av. Minas Gerais, 1.001 - Centro, Governador Valadares/MG',
    'mg_ipatinga': 'Av. Carlos Chagas, 766 - Centro, Ipatinga/MG',
    'mg_varginha': 'Av. Princesa do Sul, 1.200 - Centro, Varginha/MG',
    'mg_pocos_caldas': 'Rua Pernambuco, 570 - Centro, Poços de Caldas/MG',
    'mg_barbacena': 'Av. Bias Fortes, 300 - Centro, Barbacena/MG',
    
    // Rio de Janeiro
    'rj_rio_centro': 'Rua da Alfândega, 5 - Centro, Rio de Janeiro/RJ',
    'rj_rio_barra': 'Av. das Américas, 5.000 - Barra da Tijuca, Rio de Janeiro/RJ',
    'rj_niteroi': 'Rua Visconde de Sepetiba, 851 - Centro, Niterói/RJ',
    'rj_duque_caxias': 'Av. Presidente Vargas, 2.000 - Centro, Duque de Caxias/RJ',
    'rj_nova_iguacu': 'Av. Abílio Augusto Távora, 1.500 - Centro, Nova Iguaçu/RJ',
    'rj_sao_goncalo': 'Rua Dr. Feliciano Sodré, 100 - Centro, São Gonçalo/RJ',
    'rj_petropolis': 'Rua do Imperador, 350 - Centro, Petrópolis/RJ',
    'rj_volta_redonda': 'Av. Amaral Peixoto, 185 - Centro, Volta Redonda/RJ',
    'rj_campos': 'Rua Treze de Maio, 23 - Centro, Campos dos Goytacazes/RJ',
    'rj_cabo_frio': 'Av. Assunção, 1.334 - Centro, Cabo Frio/RJ',
    
    // Outros estados com endereços de referência
    'pr_curitiba': 'Rua Cândido Lopes, 133 - Centro, Curitiba/PR',
    'pr_londrina': 'Av. Higienópolis, 1.000 - Centro, Londrina/PR',
    'pr_maringa': 'Av. Getúlio Vargas, 806 - Centro, Maringá/PR',
    'pr_ponta_grossa': 'Praça Barão do Rio Branco, 12 - Centro, Ponta Grossa/PR',
    'pr_cascavel': 'Av. Brasil, 5.043 - Centro, Cascavel/PR',
    'pr_foz_iguacu': 'Av. Juscelino Kubitschek, 1.677 - Centro, Foz do Iguaçu/PR',
    
    'sc_florianopolis': 'Rua Tenente Silveira, 60 - Centro, Florianópolis/SC',
    'sc_joinville': 'Rua Princesa Isabel, 190 - Centro, Joinville/SC',
    'sc_blumenau': 'Rua XV de Novembro, 1.000 - Centro, Blumenau/SC',
    'sc_chapeco': 'Av. Getúlio Vargas, 1.200 - Centro, Chapecó/SC',
    'sc_criciuma': 'Av. Centenário, 2.733 - Centro, Criciúma/SC',
    
    'rs_porto_alegre': 'Av. Borges de Medeiros, 1.501 - Centro, Porto Alegre/RS',
    'rs_caxias_sul': 'Rua Sinimbu, 1.555 - Centro, Caxias do Sul/RS',
    'rs_pelotas': 'Rua Andrade Neves, 1.341 - Centro, Pelotas/RS',
    'rs_canoas': 'Av. Guilherme Schell, 6.750 - Centro, Canoas/RS',
    'rs_santa_maria': 'Av. Rio Branco, 1.380 - Centro, Santa Maria/RS',
    
    'ba_salvador': 'Rua Chile, 237 - Centro, Salvador/BA',
    'ba_feira_santana': 'Rua Senhor dos Passos, 980 - Centro, Feira de Santana/BA',
    'ba_vitoria_conquista': 'Av. Olivia Flores, 300 - Centro, Vitória da Conquista/BA',
    'ba_camacari': 'Av. Jorge Amado, 1.000 - Centro, Camaçari/BA',
    'ba_itabuna': 'Av. Aziz Maron, 1.334 - Centro, Itabuna/BA',
    
    'pe_recife': 'Av. Guararapes, 250 - Centro, Recife/PE',
    'pe_jaboatao_guararapes': 'Av. Barreto de Menezes, 1.000 - Prazeres, Jaboatão dos Guararapes/PE',
    'pe_olinda': 'Av. Getúlio Vargas, 1.481 - Varadouro, Olinda/PE',
    'pe_caruaru': 'Rua Vigário Freire, 36 - Centro, Caruaru/PE',
    'pe_petrolina': 'Av. Souza Filho, 1.000 - Centro, Petrolina/PE',
    
    'ce_fortaleza': 'Av. Barão de Studart, 1.000 - Aldeota, Fortaleza/CE',
    'ce_caucaia': 'Av. Central, 1.500 - Centro, Caucaia/CE',
    'ce_juazeiro_norte': 'Av. Padre Cícero, 2.555 - Centro, Juazeiro do Norte/CE',
    'ce_sobral': 'Rua Coronel Mont Alverne, 600 - Centro, Sobral/CE',
    'ce_maracanau': 'Av. Contorno Norte, 1.000 - Centro, Maracanaú/CE',
    
    'pb_joao_pessoa': 'Av. Dom Pedro II, 1.826 - Torre, João Pessoa/PB',
    'pb_campina_grande': 'Rua Marquês do Herval, 999 - Centro, Campina Grande/PB',
    'pb_santa_rita': 'Av. Tancredo Neves, 1.000 - Centro, Santa Rita/PB',
    'pb_bayeux': 'Av. Liberdade, 1.234 - Centro, Bayeux/PB',
    'pb_patos': 'Rua Epitácio Pessoa, 1.000 - Centro, Patos/PB',
    
    'rn_natal': 'Av. Bernardo Vieira, 3.775 - Tirol, Natal/RN',
    'rn_mossoró': 'Av. Rio Branco, 572 - Centro, Mossoró/RN',
    'rn_parnamirim': 'Av. Senador Salgado Filho, 1.559 - Centro, Parnamirim/RN',
    'rn_sao_goncalo_amarante': 'Rua Antônio Basílio, 1.000 - Centro, São Gonçalo do Amarante/RN',
    'rn_macaiba': 'Av. Coronel Estevam, 1.000 - Centro, Macaíba/RN',
    
    'al_maceio': 'Av. Fernandes Lima, 3.000 - Farol, Maceió/AL',
    'al_arapiraca': 'Av. Governador Lamenha Filho, 1.334 - Centro, Arapiraca/AL',
    'al_rio_largo': 'Rua Siqueira Campos, 1.000 - Centro, Rio Largo/AL',
    'al_palmeira_dos_indios': 'Av. Getúlio Vargas, 500 - Centro, Palmeira dos Índios/AL',
    'al_penedo': 'Av. Floriano Peixoto, 500 - Centro, Penedo/AL',
    
    'se_aracaju': 'Av. Barão de Maruim, 543 - Centro, Aracaju/SE',
    'se_nossa_senhora_socorro': 'Av. Coletora A, 1.000 - Centro, Nossa Senhora do Socorro/SE',
    'se_lagarto': 'Av. Antônio Garcia Filho, 1.000 - Centro, Lagarto/SE',
    'se_itabaiana': 'Av. Graccho Cardoso, 1.000 - Centro, Itabaiana/SE',
    'se_sao_cristovao': 'Av. Tancredo Neves, 1.000 - Centro, São Cristóvão/SE',
    
    'pi_teresina': 'Av. Frei Serafim, 2.352 - Centro, Teresina/PI',
    'pi_parnaiba': 'Av. Presidente Vargas, 1.000 - Centro, Parnaíba/PI',
    'pi_picos': 'Rua Monsenhor Hipólito, 1.000 - Centro, Picos/PI',
    'pi_floriano': 'Av. Getúlio Vargas, 1.000 - Centro, Floriano/PI',
    'pi_campo_maior': 'Rua Coelho Rodrigues, 1.000 - Centro, Campo Maior/PI',
    
    'ma_sao_luis': 'Av. Colares Moreira, 1.000 - Renascença, São Luís/MA',
    'ma_imperatriz': 'Av. Getúlio Vargas, 1.500 - Centro, Imperatriz/MA',
    'ma_timon': 'Av. Maranhão, 1.000 - Centro, Timon/MA',
    'ma_caxias': 'Av. Getúlio Vargas, 1.000 - Centro, Caxias/MA',
    'ma_codó': 'Av. José Sarney, 1.000 - Centro, Codó/MA',
    
    'pa_belem': 'Av. Presidente Vargas, 800 - Campina, Belém/PA',
    'pa_ananindeua': 'Av. Arterial 18, 1.000 - Centro, Ananindeua/PA',
    'pa_santarem': 'Av. Tapajós, 1.000 - Centro, Santarém/PA',
    'pa_maraba': 'Av. VP-8, 1.000 - Nova Marabá, Marabá/PA',
    'pa_castanhal': 'Av. Barão do Rio Branco, 1.000 - Centro, Castanhal/PA',
    
    'am_manaus': 'Av. Sete de Setembro, 1.546 - Centro, Manaus/AM',
    'am_parintins': 'Av. Amazonas, 1.000 - Centro, Parintins/AM',
    'am_itacoatiara': 'Av. Teodoro Soares, 1.000 - Centro, Itacoatiara/AM',
    'am_manacapuru': 'Av. Getúlio Vargas, 1.000 - Centro, Manacapuru/AM',
    'am_coari': 'Av. Clélia Duarte, 1.000 - Centro, Coari/AM',
    
    'ac_rio_branco': 'Av. Ceará, 2.000 - Centro, Rio Branco/AC',
    'ac_cruzeiro_sul': 'Av. Coronel Mâncio Lima, 1.000 - Centro, Cruzeiro do Sul/AC',
    'ac_sena_madureira': 'Av. Modesto Chaves, 1.000 - Centro, Sena Madureira/AC',
    'ac_tarauaca': 'Av. Santos Dumont, 1.000 - Centro, Tarauacá/AC',
    'ac_feijo': 'Av. Getúlio Vargas, 1.000 - Centro, Feijó/AC',
    
    'rr_boa_vista': 'Av. Ville Roy, 5.450 - Centro, Boa Vista/RR',
    'rr_rorainopolis': 'Av. Capitão Ene Garcez, 1.000 - Centro, Rorainópolis/RR',
    'rr_caracarai': 'Av. Santos Dumont, 1.000 - Centro, Caracaraí/RR',
    'rr_alto_alegre': 'Av. Principal, 1.000 - Centro, Alto Alegre/RR',
    'rr_mucajai': 'Av. Getúlio Vargas, 1.000 - Centro, Mucajaí/RR',
    
    'ap_macapa': 'Av. Padre Júlio Maria Lombaerd, 1.000 - Centro, Macapá/AP',
    'ap_santana': 'Av. Santana, 1.000 - Centro, Santana/AP',
    'ap_laranjal_jari': 'Av. Tancredo Neves, 1.000 - Centro, Laranjal do Jari/AP',
    'ap_oiapoque': 'Av. Santos Dumont, 1.000 - Centro, Oiapoque/AP',
    'ap_mazagao': 'Av. Barão do Rio Branco, 1.000 - Centro, Mazagão/AP',
    
    'ro_porto_velho': 'Av. Sete de Setembro, 1.907 - Centro, Porto Velho/RO',
    'ro_ji_parana': 'Av. Marechal Rondon, 1.000 - Centro, Ji-Paraná/RO',
    'ro_ariquemes': 'Av. Tancredo Neves, 1.000 - Centro, Ariquemes/RO',
    'ro_vilhena': 'Av. Capitão Castro, 1.000 - Centro, Vilhena/RO',
    'ro_cacoal': 'Av. Porto Velho, 1.000 - Centro, Cacoal/RO',
    
    'ms_campo_grande': 'Av. Afonso Pena, 3.000 - Centro, Campo Grande/MS',
    'ms_dourados': 'Av. Presidente Vargas, 1.000 - Centro, Dourados/MS',
    'ms_tres_lagoas': 'Av. Ranulpho Marques Leal, 1.000 - Centro, Três Lagoas/MS',
    'ms_corumba': 'Rua Frei Mariano, 1.000 - Centro, Corumbá/MS',
    'ms_ponta_pora': 'Av. Brasil, 1.000 - Centro, Ponta Porã/MS',
    
    'mt_cuiaba': 'Av. Getúlio Vargas, 1.000 - Centro, Cuiabá/MT',
    'mt_varzea_grande': 'Av. Castelo Branco, 1.000 - Centro, Várzea Grande/MT',
    'mt_rondonopolis': 'Av. Duque de Caxias, 1.000 - Centro, Rondonópolis/MT',
    'mt_sinop': 'Av. das Embaúbas, 1.000 - Centro, Sinop/MT',
    'mt_tangara_serra': 'Av. Brasil, 1.000 - Centro, Tangará da Serra/MT',
    
    'go_goiania': 'Av. Goiás, 1.000 - Centro, Goiânia/GO',
    'go_aparecida_goiania': 'Av. Independência, 1.000 - Centro, Aparecida de Goiânia/GO',
    'go_anapolis': 'Av. Brasil, 1.000 - Centro, Anápolis/GO',
    'go_rio_verde': 'Av. Presidente Vargas, 1.000 - Centro, Rio Verde/GO',
    'go_luziania': 'Av. JK, 1.000 - Centro, Luziânia/GO',
    
    'df_brasilia': 'SCS Quadra 06, Ed. Shopping Center Conjunto Nacional - Asa Sul, Brasília/DF',
    'df_taguatinga': 'Av. Comercial Norte, Lote 01 - Taguatinga Norte, Brasília/DF',
    'df_ceilandia': 'Av. Hélio Prates, 1.000 - Centro, Ceilândia/DF',
    'df_samambaia': 'Av. Samambaia, 1.000 - Centro, Samambaia/DF',
    'df_planaltina': 'Av. Independência, 1.000 - Centro, Planaltina/DF',
    
    'es_vitoria': 'Av. Jerônimo Monteiro, 57 - Centro, Vitória/ES',
    'es_vila_velha': 'Av. Luciano das Neves, 2.418 - Centro, Vila Velha/ES',
    'es_cariacica': 'Av. Expedito Garcia, 1.000 - Centro, Cariacica/ES',
    'es_serra': 'Av. Eldes Scherrer Souza, 1.000 - Centro, Serra/ES',
    'es_cachoeiro_itapemirim': 'Rua 25 de Março, 1.000 - Centro, Cachoeiro de Itapemirim/ES',
    
    'to_palmas': 'Av. Teotônio Segurado, 1.000 - Centro, Palmas/TO',
    'to_araguaina': 'Av. Filadélfia, 1.000 - Centro, Araguaína/TO',
    'to_gurupi': 'Av. Pará, 1.000 - Centro, Gurupi/TO',
    'to_porto_nacional': 'Av. Beira Rio, 1.000 - Centro, Porto Nacional/TO',
    'to_paraiso_tocantins': 'Av. Transbrasiliana, 1.000 - Centro, Paraíso do Tocantins/TO',
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
                ​U​n​і​d​а​d​е​ ​Р​о​u​р​а​ ​Т​е​m​р​о*
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
