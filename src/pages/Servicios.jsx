import React, { useEffect, useState } from 'react';
import "./pages.css";
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
          let imageType = 'jpeg';
          if (service.imagen?.startsWith('iVBOR')) imageType = 'png'; 

          return (
            <Service
              key={service.id}
              img={
                service.imagen
                  ? `data:image/${imageType};base64,${service.imagen}`
                  : 'https://via.placeholder.com/150'
              }
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