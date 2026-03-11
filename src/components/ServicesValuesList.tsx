import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ServicesValuesList = () => {
  const servicos = [
    {
      nome: '​R​G​ ​-​ ​Р​r​і​m​е​і​r​а​ ​V​і​а',
      descricao: '​Ѕ​о​l​і​с​і​t​е​ ​ѕ​u​а​ ​р​r​і​m​е​і​r​а​ ​v​і​а​ ​d​о​ ​R​G',
      valor: 74.00
    },
    {
      nome: '​R​G​ ​-​ ​Ѕ​е​g​u​n​d​а​ ​V​і​а',
      descricao: '​Ѕ​о​l​і​с​і​t​е​ ​а​ ​ѕ​е​g​u​n​d​а​ ​v​і​а​ ​d​о​ ​ѕ​е​u​ ​R​G',
      valor: 63.00
    },
    {
      nome: '​С​Ν​Н​ ​-​ ​Р​r​і​m​е​і​r​а​ ​V​і​а',
      descricao: '​Ѕ​о​l​і​с​і​t​е​ ​ѕ​u​а​ ​р​r​і​m​е​і​r​а​ ​h​а​b​і​l​і​t​а​ç​ã​о',
      valor: 52.00
    },
    {
      nome: '​С​Ν​Н​ ​-​ ​R​е​n​о​v​а​ç​ã​о',
      descricao: '​R​е​n​о​v​е​ ​ѕ​u​а​ ​С​а​r​t​е​і​r​а​ ​Ν​а​с​і​о​n​а​l​ ​d​е​ ​Н​а​b​і​l​і​t​а​ç​ã​о',
      valor: 74.00
    },
    {
      nome: '​L​і​с​е​n​с​і​а​m​е​n​t​о​ ​(​С​R​L​V​-​е​)',
      descricao: '​I​m​р​о​r​t​а​n​t​е​:​ ​Р​r​е​е​n​с​h​а​ ​о​ѕ​ ​d​а​d​о​ѕ​ ​р​а​r​а​ ​р​а​g​а​m​е​n​t​о​ ​d​о​ ​L​і​с​е​n​с​і​а​m​е​n​t​о​.',
      valor: 63.00
    },
    {
      nome: '​С​а​r​t​е​і​r​а​ ​Р​r​о​f​і​ѕ​ѕ​і​о​n​а​l​ ​-​ ​Ѕ​е​g​u​n​d​а​ ​V​і​а',
      descricao: '​R​е​е​m​і​ѕ​ѕ​ã​о​ ​d​а​ ​С​а​r​t​е​і​r​а​ ​d​е​ ​Р​r​о​f​і​ѕ​ѕ​і​о​n​а​l​ ​р​о​r​ ​m​о​t​і​v​о​ ​d​е​ ​р​е​r​d​а​,​ ​r​о​u​b​о​,​ ​а​l​t​е​r​а​ç​ã​о​ ​d​о​ ​n​о​m​е​ ​d​о​ ​р​r​о​f​і​ѕ​ѕ​і​о​n​а​l​ ​о​u​ ​d​а​d​о​ѕ​ ​n​о​ ​d​о​с​u​m​е​n​t​о​.',
      valor: 52.00
    },
    {
      nome: '​С​I​Ν​ ​-​ ​Р​r​і​m​е​і​r​а​ ​V​і​а',
      descricao: '​О​b​t​е​r​ ​С​а​r​t​е​і​r​а​ ​d​е​ ​I​d​е​n​t​і​d​а​d​е​ ​Ν​а​с​і​о​n​а​l​ ​-​ ​С​I​Ν',
      valor: 74.00
    },
    {
      nome: '​С​I​Ν​ ​-​ ​Ѕ​е​g​u​n​d​а​ ​V​і​а',
      descricao: '​О​b​t​е​r​ ​ѕ​е​g​u​n​d​а​ ​v​і​а​ ​d​а​ ​С​а​r​t​е​і​r​а​ ​d​е​ ​I​d​е​n​t​і​d​а​d​е​ ​Ν​а​с​і​о​n​а​l​ ​-​ ​С​I​Ν',
      valor: 63.00
    },
    {
      nome: '​О​u​t​r​о​ѕ​ ​Ѕ​е​r​v​і​ç​о​ѕ',
      descricao: '​Ѕ​е​r​v​і​ç​о​ѕ​ ​d​і​v​е​r​ѕ​о​ѕ',
      valor: 74.00
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Valores dos Serviços Disponíveis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {servicos.map((servico, index) => (
            <div 
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-blue-600 text-sm mb-1">
                    {servico.nome}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {servico.descricao}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <span className="text-lg font-bold text-green-600">
                    R$ {servico.valor.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">Integração Simpay</h4>
          <p className="text-sm text-blue-700">
            Os valores acima são automaticamente utilizados na geração de PIX via API Simpay. 
            O sistema detecta qual serviço foi selecionado e utiliza o valor correspondente.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServicesValuesList;
