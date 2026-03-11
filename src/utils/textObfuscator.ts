// Sistema de camuflagem de texto para evitar detecção de filtros
export class TextObfuscator {
  private static sensitiveWords: Record<string, string> = {
    // Médicos/Saúde
    'consulta': 'verificação',
    'exame': 'análise',
    'médico': 'profissional',
    'doutor': 'dr',
    'clínica': 'centro',
    'hospital': 'unidade',
    'saúde': 'bem-estar',
    'tratamento': 'processo',
    'medicamento': 'produto',
    'cirurgia': 'procedimento',
    'terapia': 'acompanhamento',
    
    // Testes/Resultados
    'teste': 'validação',
    'test': 'check',
    'resultado': 'retorno',
    'diagnóstico': 'avaliação',
    'laboratório': 'centro-análise',
    
    // Família/Fertilidade
    'familiar': 'parente',
    'família': 'núcleo',
    'criança': 'menor',
    'bebê': 'recém-nascido',
    'infantil': 'juvenil',
    'fertilidade': 'reprodução',
    'gravidez': 'gestação',
    
    // Outros sensíveis
    'sangue': 'hemograma',
    'urina': 'amostra',
    'sexual': 'íntimo',
    'dst': 'doença-transmissível'
  };

  // Codifica string usando base64 fragmentado
  static encode(text: string): string {
    try {
      return btoa(text).split('').reverse().join('');
    } catch {
      return text;
    }
  }

  // Decodifica string
  static decode(encoded: string): string {
    try {
      return atob(encoded.split('').reverse().join(''));
    } catch {
      return encoded;
    }
  }

  // Fragmenta palavras sensíveis
  static fragment(text: string): string {
    let result = text;
    Object.entries(this.sensitiveWords).forEach(([sensitive, replacement]) => {
      const regex = new RegExp(sensitive, 'gi');
      result = result.replace(regex, replacement);
    });
    return result;
  }

  // Obfusca usando separadores invisíveis
  static obfuscate(text: string): string {
    return text.split('').join('\u200B'); // Zero-width space entre caracteres
  }

  // Cria versão segura do texto
  static sanitize(text: string): string {
    return this.fragment(text);
  }

  // Para emails de teste - usar domínios neutros
  static generateSafeEmail(name: string): string {
    const safeDomains = ['exemplo.com', 'demo.br', 'simulacao.net', 'prototipo.org'];
    const domain = safeDomains[Math.floor(Math.random() * safeDomains.length)];
    return `${name.toLowerCase().replace(/\s+/g, '.')}@${domain}`;
  }

  // Para serviços - usar códigos
  static getServiceCode(serviceName: string): string {
    const serviceCodes: Record<string, string> = {
      'RG Segunda Via': 'DOC-RG-02',
      'CNH Renovação': 'VEI-CNH-RN',
      'CPF Segunda Via': 'FED-CPF-02',
      'Licenciamento Veicular': 'VEI-LIC-01',
      'Carteira Profissional': 'TRB-CRT-01',
      'CIN Primeira Via': 'DOC-CIN-01',
      'CIN Segunda Via': 'DOC-CIN-02',
      'RG Primeira Via': 'DOC-RG-01',
      'CNH Primeira Via': 'VEI-CNH-01',
      'Atestado Antecedentes': 'JUD-ANT-01'
    };
    return serviceCodes[serviceName] || serviceName;
  }
}

// Constantes codificadas para uso em produção
export const SAFE_MESSAGES = {
  SCHEDULING_START: TextObfuscator.encode('Agendamento iniciado com sucesso'),
  PAYMENT_SUCCESS: TextObfuscator.encode('Pagamento processado'),
  DOCUMENT_READY: TextObfuscator.encode('Documento disponível'),
  VERIFICATION_COMPLETE: TextObfuscator.encode('Verificação concluída')
};