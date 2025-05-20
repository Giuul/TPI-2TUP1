import ClearisFooter from '../components/ClearisFooter/ClearisFooter';
import ClearisNavbar from '../components/ClearisNavbar/ClearisNavbar';
import "./pages.css";

const Contacto = () => {
  return (
    <div>
      <div className='contactDiv'>
        <div className='dateContact'>
          <p className='pDateContact'>ESPAÑA 1400, ROSARIO, SANTA FE</p>
          <p className='pDateContact'>CLEARIS@GMAIL.COM</p>
          <p className='pDateContact'>+3413768965</p>
          <p className='pDateContact'>LUNES A SABADO 08:00 A 20:00HS</p>
        </div>
        
        <div className='map'>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3347.948742406237!2d-60.650957824532426!3d-32.9523626735908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b7ab13a391fb3d%3A0xe872a1c906f37291!2sEspa%C3%B1a%201400%2C%20S2000%20Rosario%2C%20Santa%20Fe!5e0!3m2!1ses!2sar!4v1745881462985!5m2!1ses!2sar"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      <ClearisFooter/>
    </div>
  )
}

export default Contacto
