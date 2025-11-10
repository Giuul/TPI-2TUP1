import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Services.css";

const Service = ({ id, img, title, desc }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      localStorage.setItem('servicioSeleccionado', id.toString());
      navigate('/programar-turnos');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className='contenedorIndividual'>
      <h4>{title}</h4>
      <div className="image-container">
        <img className='img-servicios' src={img} alt={title} />
        <div className="description">
          <div className="text-container">
            <p>{desc}</p>
            <button className="btn-turno" onClick={handleClick}>
              Sacar turno
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Service;
