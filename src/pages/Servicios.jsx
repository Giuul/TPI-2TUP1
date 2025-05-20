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
      <div className='contenedorServicios'>
        <Service img={ClearisBrazos} title="BRAZOS" desc={"Logra unos brazos suaves y sin vello con nuestro tratamiento de depilación especializada. Desde los hombros hasta las muñecas, eliminamos el vello de forma eficaz y duradera, brindándote una sensación de confort y libertad en cada movimiento."}/>
        <Service img={ClearisPiernas} title="PIERNAS" desc={"Libera tus piernas del vello con nuestro tratamiento de depilación corporal. Ya sea completa o por zonas, te ofrecemos una piel suave y sedosa por más tiempo. Olvídate de la rutina diaria y presume de unas piernas impecables y listas para cualquier ocasión."}/>
        <Service img={ClearisFacial} title="FACIAL" desc={"Redescubre una piel suave y radiante en tu rostro con nuestro tratamiento de depilación facial. Eliminamos delicadamente el vello no deseado de zonas como el labio superior, las cejas, el mentón y las mejillas, revelando una tez limpia y luminosa. Disfruta de una sensación de frescura y confianza duradera."}/>
      </div>
      <ClearisFooter />
    </div>
  );
};

export default Servicios;