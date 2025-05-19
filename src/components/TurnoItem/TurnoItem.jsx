import React from 'react';
import './turnoitem.css'

const TurnoItem = ({ id, servicios, fecha, hora, duracion, onEliminar }) => {
  return (
    <div className="turnoitem">
      <p>{servicios}</p>
      <p>{fecha}</p>
      <p>{hora}</p>
      <p>{duracion}</p>
      <button onClick={() => onEliminar(id)}>Eliminar</button>
    </div>
  );
};

export default TurnoItem;