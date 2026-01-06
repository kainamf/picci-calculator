import { useEffect, useState } from 'react';
import { Calculator, Plus, X } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ServicoSelecionado {
  id: string;
  nome: string;
  valor: number;
}

function App() {
  const [servicos, setServicos] = useState<any[]>([]);
  const [servicosSelecionados, setServicosSelecionados] = useState<ServicoSelecionado[]>([]);
  const [servicoAtual, setServicoAtual] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [mostrarResultado, setMostrarResultado] = useState(false);

  useEffect(() => {
    carregarServicosExcel();
  }, []);

  const carregarServicosExcel = async () => {
    try {
      // Busca o arquivo Excel via fetch
      const response = await fetch('assets/precificação - picci.xlsx');
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      // Supondo que os dados estão na primeira planilha
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      // Filtra e adapta para o formato esperado
      const servicosFormatados = data
        .filter((row: any) => row['SERVIÇOS'] && row['PREÇO'])
        .map((row: any, idx: number) => ({
          id: String(idx),
          nome: String(row['SERVIÇOS']).trim(),
          valor: Number(String(row['PREÇO']).replace(/[^\d,\.]/g, '').replace(',', '.'))
        }));
      setServicos(servicosFormatados);
    } catch (error) {
      console.error('Erro ao carregar serviços do Excel:', error);
    } finally {
      setLoading(false);
    }
  };

  const adicionarServico = () => {
    if (!servicoAtual) return;

    const servico = servicos.find(s => s.id === servicoAtual);
    if (!servico) return;

    setServicosSelecionados([
      ...servicosSelecionados,
      {
        id: servico.id,
        nome: servico.nome,
        valor: servico.valor,
      },
    ]);
    setServicoAtual('');
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
    setServicoAtual('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-700 to-slate-900 p-8 text-white">
            <div className="flex items-center gap-3">
              <Calculator className="w-10 h-10" />
              <div>
                <h1 className="text-3xl font-bold">Calculadora de Serviços</h1>
                <p className="text-slate-300 mt-1">Selecione os serviços desejados e calcule o total</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {!mostrarResultado ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Adicionar Serviço
                  </label>
                  <div className="flex gap-3">
                    <select
                      value={servicoAtual}
                      onChange={(e) => setServicoAtual(e.target.value)}
                      className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                    >
                      <option value="">Selecione um serviço</option>
                      {servicos.map((servico: any) => (
                        <option key={servico.id || servico.nome} value={servico.id || servico.nome}>
                          {servico.nome} - R$ {Number(servico.valor).toFixed(2)}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={adicionarServico}
                      disabled={!servicoAtual}
                      className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
                    >
                      <Plus className="w-5 h-5" />
                      Adicionar
                    </button>
                  </div>
                </div>

                {servicosSelecionados.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">
                      Serviços Selecionados ({servicosSelecionados.length})
                    </h3>
                    <div className="space-y-2">
                      {servicosSelecionados.map((servico, index) => (
                        <div
                          key={`${servico.id}-${index}`}
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
                        >
                          <span className="font-medium text-slate-700">{servico.nome}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-slate-900 font-semibold">
                              R$ {servico.valor.toFixed(2)}
                            </span>
                            <button
                              onClick={() => removerServico(index)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={confirmar}
                        className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg"
                      >
                        Confirmar
                      </button>
                    </div>
                  </div>
                )}

                {servicosSelecionados.length === 0 && (
                  <div className="text-center py-12 text-slate-400">
                    <Calculator className="w-16 h-16 mx-auto mb-3 opacity-30" />
                    <p>Nenhum serviço selecionado ainda</p>
                    <p className="text-sm mt-1">Selecione serviços acima para começar</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    Resumo do Pedido
                  </h3>
                  <div className="space-y-3">
                    {servicosSelecionados.map((servico, index) => (
                      <div
                        key={`${servico.id}-${index}`}
                        className="flex justify-between items-center p-4 bg-slate-50 rounded-lg"
                      >
                        <span className="font-medium text-slate-700">{servico.nome}</span>
                        <span className="text-slate-900 font-semibold">
                          R$ {servico.valor.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t-2 border-slate-200 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-slate-800">Total</span>
                    <span className="text-3xl font-bold text-green-600">
                      R$ {calcularTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={reiniciar}
                    className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-semibold"
                  >
                    Nova Cotação
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
