import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/assets/styles/styles.css';


import Home from "./pages/Home";
import Nosotros from './pages/Nosotros.jsx';
import Servicios from './pages/Servicios.jsx';
import Contacto from './pages/Contacto.jsx';
import Login from './pages/Login.jsx';
import Register from "./pages/Register.jsx";
import MisTurnos from "./pages/MisTurnos.jsx";
import Agenda from "./pages/Agenda.jsx"
import ProgramarTurnos from "./pages/ProgramarTurnos.jsx";
import MiPerfil from "./pages/MiPerfil.jsx";
import ClearisNavbar from './components/ClearisNavbar/ClearisNavbar';
import Userspage from './pages/Userspage';


function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedLogin = localStorage.getItem('isLoggedIn');
    const storedUsername = localStorage.getItem('username');

    if (storedLogin === 'true' && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
    localStorage.setItem('username', username);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('username');
    localStorage.removeItem('isLoggedIn');
    alert('Has cerrado sesión.');
    navigate('/login');
  };

  return (
    <>
      <ClearisNavbar isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/misturnos" element={<MisTurnos />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/programar-turnos" element={<ProgramarTurnos />} />
        <Route path="/miPerfil" element={<MiPerfil username={username} />} />
        <Route path="/users" element={<Userspage />}></Route>
      </Routes>
    </>
  );
}

export default App;