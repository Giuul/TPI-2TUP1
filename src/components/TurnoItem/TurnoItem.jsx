import React from 'react';
import './turnoitem.css'
import './../../pages/pages.css'

const TurnoItem = ({ id, servicios, fecha, hora, duracion, onEliminar }) => {
  return (
    <div className="turnoitem">
      <p>{servicios}</p>
      <p>{fecha}</p>
      <p>{hora}</p>
      <p>{duracion}</p>
      <button className="btn-eliminar" onClick={() => onEliminar(id)}> 
        <i className="bi bi-trash"></i>
        Eliminar
      </button>
    </div>
  );
};

export default TurnoItem;