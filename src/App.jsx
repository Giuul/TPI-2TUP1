import React, { useState, useEffect } from 'react'; 
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/assets/styles/styles.css';

import { jwtDecode } from 'jwt-decode'; 


import Home from "./pages/Home";
import Nosotros from './pages/Nosotros.jsx';
import Servicios from './pages/Servicios.jsx';
import Contacto from './pages/Contacto.jsx';
import Login from './pages/Login.jsx';
import Register from "./pages/Register.jsx";
import MisTurnos from "./pages/MisTurnos.jsx";
import ProgramarTurnos from "./pages/ProgramarTurnos.jsx";
import Userspage from './pages/Userspage'; 
import MiPerfil from "./pages/MiPerfil.jsx";
import Agenda from "./pages/Agenda.jsx";
import ClearisNavbar from './components/ClearisNavbar/ClearisNavbar';

function App() {
    const navigate = useNavigate(); 

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState(''); 

    useEffect(() => {
        const token = localStorage.getItem('authtoken');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    console.log('Token expirado, eliminando de localStorage.');
                    localStorage.removeItem('authtoken');
                    setIsLoggedIn(false);
                    setUsername('');
                } else {
                    setIsLoggedIn(true);
                    setUsername(decoded.email);
                }
            } catch (error) {
                console.error("Error decodificando token o token inválido:", error);
                localStorage.removeItem('authtoken'); 
                setIsLoggedIn(false);
                setUsername('');
            }
        }
    }, []); 

    const handleLogin = (email) => { 
        setIsLoggedIn(true);
        setUsername(email);
    };

    const handleLogout = () => {
        localStorage.removeItem('authtoken'); 
        setIsLoggedIn(false);
        setUsername('');
        alert('Has cerrado sesión.');
        navigate('/login'); 
    };

    const ProtectedRoute = ({ children }) => {
        if (!isLoggedIn) {
            return <Navigate to="/login" replace />;
        }
        return children; 
    };

    return (
        <>
            <ClearisNavbar isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/nosotros" element={<Nosotros />} />
                <Route path="/servicios" element={<Servicios />} />
                <Route path="/contacto" element={<Contacto />} />
                
                <Route
                    path="/login"
                    element={isLoggedIn ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />}
                />
                
                <Route path="/register" element={<Register />} />
                <Route path="/misturnos" element={<ProtectedRoute><MisTurnos /></ProtectedRoute>} />
                <Route path="/agenda" element={<ProtectedRoute><Agenda /></ProtectedRoute>} />
                <Route path="/programar-turnos" element={<ProtectedRoute><ProgramarTurnos /></ProtectedRoute>} />
                <Route path="/miPerfil" element={<ProtectedRoute><MiPerfil username={username} /></ProtectedRoute>} />
                <Route path="/users" element={<ProtectedRoute><Userspage /></ProtectedRoute>}></Route>
            </Routes>
        </>
    );
}

export default App;