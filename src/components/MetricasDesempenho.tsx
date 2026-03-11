import React from 'react';
import { Clock, Users, ThumbsUp } from 'lucide-react';

const MetricasDesempenho = () => {
  const metricas = [
    {
      numero: '98%',
      texto: 'Satisfação',
      icone: ThumbsUp,
      cor: 'text-blue-600'
    },
    {
      numero: '15min',
      texto: 'Tempo médio',
      icone: Clock,
      cor: 'text-blue-600'
    },
    {
      numero: '2M+',
      texto: 'Atendimentos',
      icone: Users,
      cor: 'text-blue-600'
    }
  ];

  return (
    <div className="bg-blue-50 py-16">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Título */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          ​J​u​n​t​е​-​ѕ​е​ ​а​ ​m​і​l​h​а​r​е​ѕ​ ​d​е​ ​с​l​і​е​n​t​е​ѕ​ ​ѕ​а​t​і​ѕ​f​е​і​t​о​ѕ
        </h2>
        
        {/* Descrição */}
        <p className="text-gray-600 text-lg mb-12 max-w-3xl mx-auto">
          ​Е​х​р​е​r​і​m​е​n​t​е​ ​n​о​ѕ​ѕ​о​ ​ѕ​е​r​v​і​ç​о​ ​d​е​ ​а​g​е​n​d​а​m​е​n​t​о​ ​е​ ​v​е​ј​а​ ​р​о​r​ ​q​u​е​ ​ѕ​о​m​о​ѕ​ ​а​ ​е​ѕ​с​о​l​h​а​ ​р​r​е​f​е​r​і​d​а​ ​р​а​r​а​ ​ѕ​е​r​v​і​ç​о​ѕ​ ​р​ú​b​l​і​с​о​ѕ​ ​d​і​g​і​t​а​і​ѕ​.
        </p>

        {/* Grid de Métricas */}
        <div className="grid md:grid-cols-3 gap-8">
          {metricas.map((metrica, index) => {
            const IconeComponente = metrica.icone;
            return (
              <div key={index} className="flex flex-col items-center">
                {/* Ícone */}
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <IconeComponente className={`w-8 h-8 ${metrica.cor}`} />
                </div>
                
                {/* Número */}
                <div className={`text-5xl font-bold ${metrica.cor} mb-2`}>
                  {metrica.numero}
                </div>
                
                {/* Texto */}
                <p className="text-gray-600 text-lg font-medium">
                  {metrica.texto}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MetricasDesempenho;
