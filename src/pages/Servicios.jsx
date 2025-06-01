import React from 'react';
import { useEffect, useState } from 'react';
import "./pages.css";
import ClearisFooter from '../components/ClearisFooter/ClearisFooter';
import ClearisPiernas from '../assets/img/ClearisPiernas.png';
import ClearisFacial from '../assets/img/ClearisFacial.png';
import ClearisBrazos from '../assets/img/ClearisBrazos.png';
import Service from '../components/Services/Services';


const Servicios = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/service')
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(error => console.error('Error al cargar servicios:', error));
  }, []);

  const imageMap = {
    "PIERNAS": ClearisPiernas,
    "FACIAL": ClearisFacial,
    "BRAZOS": ClearisBrazos,
  };

  return (
    <div>
      <div className='contenedorServicios'>
        {services.map(service => (
          <Service
            key={service.id}
            img={imageMap[service.nombre.toUpperCase()] || 'https://via.placeholder.com/150'}
            title={service.nombre}
            desc={service.descripcion}
          />
        ))}
      </div>
      <ClearisFooter />
    </div>
  );
};

export default Servicios;