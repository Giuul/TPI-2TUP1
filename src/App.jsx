import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import 'bootstrap/dist/css/bootstrap.min.css'
import '../src/assets/styles/styles.css'
import Nosotros from './pages/Nosotros.jsx'
import Servicios from './pages/Servicios.jsx'
import Contacto from './pages/Contacto.jsx'
import Login from './pages/Login.jsx'
import Register from "./pages/Register.jsx"

function App() {

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
