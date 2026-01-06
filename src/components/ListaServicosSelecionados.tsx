import React from 'react';
import { X, Calculator } from 'lucide-react';

interface ServicoSelecionado {
  id: string;
  nome: string;
  valor: number;
}

interface ListaServicosSelecionadosProps {
  servicosSelecionados: ServicoSelecionado[];
  onRemover: (index: number) => void;
  onConfirmar: () => void;
}

const ListaServicosSelecionados: React.FC<ListaServicosSelecionadosProps> = ({ servicosSelecionados, onRemover, onConfirmar }) => (
  <>
    {servicosSelecionados.length > 0 ? (
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
                  onClick={() => onRemover(index)}
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
            onClick={onConfirmar}
            className="px-8 py-3 bg-picci1 text-white rounded-lg hover:bg-picci2 transition-colors font-semibold text-lg"
          >
            Confirmar
          </button>
        </div>
      </div>
    ) : (
      <div className="text-center py-12 text-slate-400">
        <Calculator className="w-16 h-16 mx-auto mb-3 opacity-30" />
        <p>Nenhum serviço selecionado ainda</p>
        <p className="text-sm mt-1">Selecione serviços acima e clique em Confirmar</p>
      </div>
    )}
  </>
);

export default ListaServicosSelecionados;
