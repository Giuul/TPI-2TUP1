import React, { useEffect, useState } from 'react';
import ClearisFooter from '../components/ClearisFooter/ClearisFooter';
import Service from '../components/Services/Services';

const Servicios = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/service')
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(error => console.error('Error al cargar servicios:', error));
  }, []);

  return (
    <div>
      <div className='contenedorServicios'>
        {services.map(service => {
          const base64Image = typeof service.imagen === 'string' ? service.imagen : null;

          let imageType = 'jpeg';
          if (base64Image?.startsWith('iVBOR')) imageType = 'png';

          return (
            <Service
              key={service.id}
              id={service.id}
              img={service.imagen || '/img/placeholder.png'}
              title={service.nombre}
              desc={service.descripcion}
            />
          );
        })}

      </div>
      <ClearisFooter />
    </div>
  );
};

export default Servicios;
