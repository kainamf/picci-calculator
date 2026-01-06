import React from 'react';

const Header: React.FC = () => (
  <div className="bg-gradient-to-r from-picci1 via-picci2 to-picci3 p-8 text-white">
    <div className="flex items-center gap-6">
      <img src="/assets/picci-perfil.jpg" alt="Logo Picci" className="w-28 h-28 rounded-full border-4 border-picciBg shadow-lg" />
      <div>
        <h1 className="text-3xl font-bold">Calculadora de Serviços</h1>
        <p className="text-picciBg mt-1">Selecione os serviços desejados e calcule o total</p>
      </div>
    </div>
  </div>
);

export default Header;
