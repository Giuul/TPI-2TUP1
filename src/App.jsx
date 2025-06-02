import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/assets/styles/styles.css';
import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoutes.jsx"
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
import Userspage from './pages/Userspage.jsx';
import { jwtDecode } from 'jwt-decode';


function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState(''); 
  const [userId, setUserId] = useState('');  
  const navigate = useNavigate();

 useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp < currentTime) {
                handleLogout();
            } else {
                setIsLoggedIn(true);
                setUsername(localStorage.getItem('username'));
                setUserRole(localStorage.getItem('role') || decodedToken.role);
                setUserId(localStorage.getItem('userId') || decodedToken.id);
            }
        } catch (e) {
            console.error("Token inválido o expirado:", e);
            handleLogout();
        }
    }
}, []);

   const handleLogin = (loginData) => {
    setIsLoggedIn(true);
    setUsername(loginData.username); 
    setUserRole(loginData.role);
    setUserId(loginData.userId);

    localStorage.setItem('token', loginData.token);
    localStorage.setItem('username', loginData.username); 
    localStorage.setItem('role', loginData.role);
    localStorage.setItem('userId', loginData.userId);
    localStorage.setItem('isLoggedIn', 'true');
};

    const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setUserRole('');
    setUserId('');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('isLoggedIn');
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
          {/*USUARIO*/}
            <Route path="/misturnos" element={
            <ProtectedRoute isLoggedIn={isLoggedIn} userRole={userRole} allowedRoles={['user', 'admin', 'superadmin']}> <MisTurnos /> </ProtectedRoute>}
        />
        <Route path="/miPerfil" element={
            <ProtectedRoute isLoggedIn={isLoggedIn} userRole={userRole} allowedRoles={['user', 'admin', 'superadmin']}> <MiPerfil username={username} userId={userId} userRole={userRole}/> </ProtectedRoute>}
        />

        {/* ADMINISTRADOR Y SUPERADMINISTRADOR */}
            <Route path="/agenda" element={
            <ProtectedRoute isLoggedIn={isLoggedIn} userRole={userRole} allowedRoles={['admin', 'superadmin']}> <Agenda /> </ProtectedRoute>}
        />
        <Route path="/users" element={
            <ProtectedRoute isLoggedIn={isLoggedIn} userRole={userRole} allowedRoles={['admin', 'superadmin']}>
            <Userspage currentUserRole={userRole} currentUserId={userId} /> 
            </ProtectedRoute>}
        />
        <Route path="/programar-turnos" element={ 
            <ProtectedRoute isLoggedIn={isLoggedIn} userRole={userRole} allowedRoles={['admin', 'superadmin', 'user']}> <ProgramarTurnos /> </ProtectedRoute>}
        />
      </Routes>
    </>
  );
}

export default App;