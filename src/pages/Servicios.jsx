import React from 'react';
import "./pages.css";
import ClearisFooter from '../components/ClearisFooter/ClearisFooter';
import ClearisPiernas from '../assets/img/ClearisPiernas.png';
import ClearisFacial from '../assets/img/ClearisFacial.png';
import ClearisBrazos from '../assets/img/ClearisBrazos.png';
import ClearisNavbar from '../components/ClearisNavbar/ClearisNavbar';
import Service from '../components/Services/Services'; 

const Servicios = () => {
  return (
    <div>
      <ClearisNavbar />
      <div className='contenedorServicios'>
        <Service img={ClearisBrazos} title="BRAZOS" />
        <Service img={ClearisPiernas} title="PIERNAS" />
        <Service img={ClearisFacial} title="FACIAL" />
      </div>
      <ClearisFooter />
    </div>
  );
};

export default Servicios;