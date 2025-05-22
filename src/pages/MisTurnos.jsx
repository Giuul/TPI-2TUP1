import React from 'react';
import Turnos from '../components/Turnos/Turnos'; 
import ClearisFooter from '../components/ClearisFooter/ClearisFooter';

const MisTurnos = () => {

  return (
    <div>
      <div className="mis-turnos-container">
        <h1>Mis Turnos</h1>
        <Turnos /> 
      </div>
      <ClearisFooter />
    </div>
  );
};

export default MisTurnos;