import ClearisFooter from '../components/ClearisFooter/ClearisFooter'
import ClearisNavbar from '../components/ClearisNavbar/ClearisNavbar'

const Nosotros = () => {
  return (
    <div>
      <ClearisNavbar />
      <div className='who-we-are'>
       <h1>¿Quiénes somos?</h1>
       <p>Clearis es un centro especializado en depilación definitiva que combina tecnología de
       vanguardia con atención personalizada, en un ambiente cálido y profesional.</p>
       <p>En Clearis, creemos en el poder de sentirse bien con uno mismo.</p>
        <p>Nuestro objetivo es ofrecer una experiencia transformadora para cada persona 
       que nos elige, brindando tratamientos seguros, eficaces y adaptados a cada tipo de piel.</p>
      </div>
      <ClearisFooter/>
    </div>
  )
}
export default Nosotros