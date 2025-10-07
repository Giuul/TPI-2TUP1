import React from 'react';
import './services.css';

const Service = ({ img, title, desc }) => {
  return (
    <div className='contenedorIndividual'>
      <h4>{title}</h4>
      <div className="image-container">
        <img className='img-servicios' src={img} alt={title} />
        <p className="description">{desc}</p>
      </div>
    </div>
  );
};

export default Service;
