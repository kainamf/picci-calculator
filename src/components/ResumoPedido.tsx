import React from 'react';

interface ServicoSelecionado {
  id: string;
  nome: string;
  valor: number;
}

interface ResumoPedidoProps {
  servicosSelecionados: ServicoSelecionado[];
  total: number;
  onNovaCotacao: () => void;
}

const ResumoPedido: React.FC<ResumoPedidoProps> = ({ servicosSelecionados, total, onNovaCotacao }) => (
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
          R$ {total.toFixed(2)}
        </span>
      </div>
    </div>
    <div className="flex gap-3">
      <button
        onClick={onNovaCotacao}
        className="flex-1 px-6 py-3 bg-picci2 text-white rounded-lg hover:bg-picci1 transition-colors font-semibold"
      >
        Nova Cotação
      </button>
    </div>
  </div>
);

export default ResumoPedido;
