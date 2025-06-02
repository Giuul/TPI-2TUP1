import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/Form/LoginForm';
import axios from 'axios';

const Login = ({ onLogin }) => {
    const navigate = useNavigate();

    const [validationErrors, setValidationErrors] = useState({});
    const [apiError, setApiError] = useState('');

    const formRefs = {
        email: useRef(null),
        password: useRef(null),
    };

    const validateForm = (formData) => {
        const errors = {};
        if (!formData.email) {
            errors.email = "El correo electrónico es requerido.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "El formato del correo electrónico no es válido.";
        }
        if (!formData.password) {
            errors.password = "La contraseña es requerida.";
        }
        return errors;
    };

    const handleLoginFormSubmit = async (formData) => {
        setValidationErrors({});
        setApiError('');

        const clientErrors = validateForm(formData);
        if (Object.keys(clientErrors).length > 0) {
            setValidationErrors(clientErrors);
            if (clientErrors.email && formRefs.email.current) {
                formRefs.email.current.focus();
            } else if (clientErrors.password && formRefs.password.current) {
                formRefs.password.current.focus();
            }
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/login', {
                email: formData.email,
                password: formData.password,
            });

            if (response.data && response.data.token && response.data.user) {
                onLogin({
                    token: response.data.token,
                    username: `${response.data.user.name} ${response.data.user.lastname}`, 
                    role: response.data.user.role,
                    userId: response.data.user.id,
                    email: response.data.user.email 
                });

                navigate('/');
            } else {
                setApiError("Respuesta inesperada del servidor. Inténtalo de nuevo.");
            }
        } catch (error) {
            console.error('Error durante el inicio de sesión:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setApiError(error.response.data.message);
            } else if (error.request) {
                setApiError("No se pudo conectar con el servidor. Verifica tu conexión o inténtalo más tarde.");
            } else {
                setApiError("Ocurrió un error inesperado. Por favor, inténtalo de nuevo.");
            }
        }
    };

    const erroresParaFormulario = {
        ...validationErrors,
        credenciales: apiError,
    };

    return (
        <div className="login-page-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 120px)', padding: '20px' }}>
            <LoginForm
                onSubmit={handleLoginFormSubmit}
                errores={erroresParaFormulario}
                refs={formRefs}
            />
        </div>
    );
};

export default Login;