import React, { useState, useRef } from 'react';
import LoginForm from './LoginForm';
import { useNavigate } from 'react-router-dom';

const LoginContainer = ({ onLogin }) => {
    const [errores, setErrores] = useState({});
    const refs = {
        email: useRef(null),
        password: useRef(null),
    };

    const navigate = useNavigate();

    const handleLogin = async ({ email, password }) => {
        setErrores({});

        if (!email || !password) {
            setErrores({
                email: !email ? 'El email es obligatorio' : '',
                password: !password ? 'La contraseña es obligatoria' : ''
            });
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (!res.ok) {
                setErrores({
                    credenciales: data.message || 'Usuario o contraseña incorrectos'
                });
                return;
            }

            localStorage.setItem('token', data.token);
            alert(`Bienvenido, ${data.user.name}`);
            if (onLogin) onLogin(data.user);
            navigate('/');
        } catch (error) {
            setErrores({ password: 'Error de conexión con el servidor' });
            console.error(error);
        }
    };


    return (
        <LoginForm
            onSubmit={handleLogin}
            errores={errores}
            refs={refs}
        />
    );
};

export default LoginContainer;
