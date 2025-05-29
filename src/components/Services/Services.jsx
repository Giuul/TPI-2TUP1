import React from 'react';
import './services.css';

const Service = ({ img, title, desc }) => {
  return (
    <div className='contenedorIndividual'>
      <div className="image-container">
        <img className='img-servicios' src={img} alt={title} />
        <p className="description">{desc}</p>
      </div>
      <h4>{title}</h4>
    </div>
  );
};

export default Service;