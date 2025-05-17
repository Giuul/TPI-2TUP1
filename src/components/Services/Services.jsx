import React from 'react';
import './services.css';

const Service = ({ img, title }) => {
  return (
    <div className='contenedorIndividual'>
      <img className='img-servicios' src={img} alt={title} />
      <p>{title}</p>
    </div>
  );
};

export default Service;