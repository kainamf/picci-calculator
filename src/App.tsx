import { useEffect, useState } from 'react';
import Header from './components/Header';
import ServicoSelector from './components/ServicoSelector';
import ListaServicosSelecionados from './components/ListaServicosSelecionados';
import ResumoPedido from './components/ResumoPedido';

interface ServicoSelecionado {
  id: string;
  nome: string;
  valor: number;
}

function App() {
  const [servicos, setServicos] = useState<any[]>([]);
  const [servicosSelecionados, setServicosSelecionados] = useState<ServicoSelecionado[]>([]);
  const [servicosAtuais, setServicosAtuais] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarResultado, setMostrarResultado] = useState(false);

  useEffect(() => {
    carregarServicosExcel();
  }, []);

  const carregarServicosExcel = async () => {
    try {
      // ID da planilha e nome da aba
      const sheetId = '1JwsB9ibBEsLTubN5l1ihgMVkLfGDbZyb';
      const sheetName = 'Planilha1'; // Altere se o nome da aba for diferente
      // URL pública para exportar como CSV
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
      const response = await fetch(url);
      const csvText = await response.text();
      // LOG para depuração do CSV
      console.log('CSV bruto:', csvText);
      const rows = csvText.split('\n').filter(Boolean).map(row => row.split(','));
      console.log('Rows:', rows);
      // Ajuste: remover aspas e juntar colunas de preço
      const clean = (str: string) => str.replace(/^"|"$/g, '').trim();
      const headers = rows[0].map(clean);
      const data = rows.slice(1).map(row => {
        // Juntar colunas de preço se necessário
        let servico = clean(row[0] || '');
        let preco = '';
        if (row.length >= 3) {
          preco = clean((row[1] || '') + ',' + (row[2] || ''));
        } else {
          preco = clean(row[1] || '');
        }
        return {
          SERVIÇOS: servico,
          PREÇO: preco
        };
      });
      console.log('Data parsed ajustado:', data);
      // Filtra e adapta para o formato esperado
      const servicosFormatados = data
        .filter(row => row['SERVIÇOS'] && row['PREÇO'])
        .map((row, idx) => ({
          id: String(idx),
          nome: String(row['SERVIÇOS']).trim(),
          valor: Number(String(row['PREÇO']).replace(/[^\d,\.]/g, '').replace(',', '.'))
        }));
      setServicos(servicosFormatados);
    } catch (error) {
      console.error('Erro ao carregar serviços do Google Sheets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelecionarServicos = (value: any[]) => {
    setServicosAtuais(value);
    setServicosSelecionados(value.map(servico => ({
      id: servico.id,
      nome: servico.nome,
      valor: servico.valor,
    })));
  };

  const removerServico = (index: number) => {
    setServicosSelecionados(servicosSelecionados.filter((_, i) => i !== index));
  };

  const calcularTotal = () => {
    return servicosSelecionados.reduce((total, servico) => total + servico.valor, 0);
  };

  const confirmar = () => {
    if (servicosSelecionados.length > 0) {
      setMostrarResultado(true);
    }
  };

  const reiniciar = () => {
    setServicosSelecionados([]);
    setMostrarResultado(false);
    setServicosAtuais([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-picciBg flex items-center justify-center">
        <div className="text-picci3">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-picciBg py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <Header />
          <div className="p-8">
            {!mostrarResultado ? (
              <div className="space-y-6">
                <ServicoSelector
                  servicos={servicos}
                  servicosAtuais={servicosAtuais}
                  onSelecionar={handleSelecionarServicos}
                />
                <ListaServicosSelecionados
                  servicosSelecionados={servicosSelecionados}
                  onRemover={removerServico}
                  onConfirmar={confirmar}
                />
              </div>
            ) : (
              <ResumoPedido
                servicosSelecionados={servicosSelecionados}
                total={calcularTotal()}
                onNovaCotacao={reiniciar}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;