import React, { useState } from 'react';
import './services.css';

const Service = ({ img, title, desc }) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  return (
    <div
      className='contenedorIndividual'
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <div className="image-container">
        <img className='img-servicios' src={img} alt={title} />
      </div>
      <h4>{title}</h4>
      <p className={`description ${isHovering ? 'visible' : ''}`}>{desc}</p>
    </div>
  );
};

export default Service;