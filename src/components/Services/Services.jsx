import React from 'react';
import './Services.css'; // Puedes crear un archivo CSS para este componente

const Service = ({ img, title }) => {
  return (
    <div className='contenedorIndividual'>
      <img className='img-servicios' src={img} alt={title} />
      <p>{title}</p>
    </div>
  );
};

export default Service;