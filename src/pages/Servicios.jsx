import React from 'react'
import "./pages.css";
import ClearisFooter from '../components/ClearisFooter/ClearisFooter'
import ClearisPiernas from '../assets/img/ClearisPiernas.png';
import ClearisFacial from '../assets/img/ClearisFacial.png';
import ClearisBrazos from '../assets/img/ClearisBrazos.png';
import ClearisNavbar from '../components/ClearisNavbar/ClearisNavbar';


const Servicios = () => {
  return (

    <div>
      <ClearisNavbar />
      <div className='contenedorServicios'>
        <div className='contenedorIndividual'>
          <img className='img-servicios' src={ClearisBrazos} alt="brazos" />
          <p>BRAZOS</p>
        </div>
        <div className='contenedorIndividual'>
          <img className='img-servicios' src={ClearisPiernas} alt="piernas" />
          <p>PIERNAS</p>
        </div>
        <div className='contenedorIndividual'>
          <img className='img-servicios' src={ClearisFacial} alt="facial" />
          <p>FACIAL</p>
        </div>
      </div>
      <ClearisFooter/>
    </div>
  )
}

export default Servicios