import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

interface Servico {
  id: string;
  nome: string;
  valor: number;
}

interface ServicoSelectorProps {
  servicos: Servico[];
  servicosAtuais: Servico[];
  onSelecionar: (value: Servico[]) => void;
}

const ServicoSelector: React.FC<ServicoSelectorProps> = ({ servicos, servicosAtuais, onSelecionar }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-3">
      Adicionar Serviço
    </label>
    <div className="flex flex-col sm:flex-row gap-3">
      <Autocomplete
        multiple
        options={servicos}
        getOptionLabel={option => `${option.nome} - R$ ${Number(option.valor).toFixed(2)}`}
        value={servicosAtuais}
        onChange={(_, value) => onSelecionar(value as Servico[])}
        disableCloseOnSelect
        renderInput={params => (
          <TextField {...params} label="Serviços" placeholder="Selecione serviços" />
        )}
        className="flex-1"
      />
    </div>
  </div>
);

export default ServicoSelector;
