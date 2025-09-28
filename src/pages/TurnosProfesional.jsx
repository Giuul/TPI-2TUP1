import React from 'react';
import Turnos from '../components/Turnos/Turnos';
import ClearisFooter from '../components/ClearisFooter/ClearisFooter';
import TurnosProfesional from '../components/TurnosPorfesional/TurnosProfesional';

const MisTurnos = () => {

  return (
    <div>
      <div className="mis-turnos-container">
        <TurnosProfesional />
      </div>
      <ClearisFooter />
    </div>
  );
};

export default MisTurnos;