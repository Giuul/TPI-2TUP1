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
import ProgramarTurnosAdmin from './pages/ProgramarTurnosAdmin.jsx';
import MiPerfil from "./pages/MiPerfil.jsx";
import ClearisNavbar from './components/ClearisNavbar/ClearisNavbar';
import Userspage from './pages/Userspage.jsx';
import { jwtDecode } from 'jwt-decode';


function App() {


  const initialIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const initialUsername = localStorage.getItem('username') || '';
  const initialUserRole = localStorage.getItem('role') || '';
  const initialUserId = localStorage.getItem('userId') || '';

  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);
  const [username, setUsername] = useState(initialUsername);
  const [userRole, setUserRole] = useState(initialUserRole);
  const [userId, setUserId] = useState(initialUserId);

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
          setUsername(localStorage.getItem('username') || decodedToken.username);
          setUserRole(localStorage.getItem('role') || decodedToken.role);
          setUserId(localStorage.getItem('userId') || decodedToken.id);
        }
      } catch (e) {
        console.error("Token inválido o expirado:", e);
        handleLogout();
      }
    } else {
      setIsLoggedIn(false);
      setUsername('');
      setUserRole('');
      setUserId('');
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
      <ClearisNavbar isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} userRole={userRole} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/programar-turnos" element={<ProgramarTurnos />} />
        <Route path="/misturnos" element={
          <ProtectedRoute isLoggedIn={isLoggedIn} userRole={userRole} allowedRoles={['user', 'admin', 'superadmin']}> <MisTurnos /> </ProtectedRoute>}
        />
        <Route path="/miPerfil" element={
          <ProtectedRoute isLoggedIn={isLoggedIn} userRole={userRole} allowedRoles={['user', 'admin', 'superadmin']}>
            <MiPerfil username={username} userId={userId} userRole={userRole} onAccountDelete={handleLogout} />
          </ProtectedRoute>}
        />
        <Route path="/misturnos" element={
          <ProtectedRoute isLoggedIn={isLoggedIn} userRole={userRole} allowedRoles={['admin', 'superadmin']}> <Agenda /> </ProtectedRoute>}
        />
        <Route path="/users" element={
          <ProtectedRoute isLoggedIn={isLoggedIn} userRole={userRole} allowedRoles={['admin', 'superadmin']}>
            <Userspage currentUserRole={userRole} currentUserId={userId} />
          </ProtectedRoute>}
        />
        <Route path="/programar-turnos-admin" element={
          <ProtectedRoute isLoggedIn={isLoggedIn} userRole={userRole} allowedRoles={['admin', 'superadmin', 'user']}> <ProgramarTurnosAdmin /> </ProtectedRoute>}
        />
      </Routes>
    </>
  );
}

export default App;