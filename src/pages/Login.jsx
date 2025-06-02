import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/Form/LoginForm';
import ValidationsLogin from '../components/Validations/validationsLogin';

function Login({ onLogin }) {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [errores, setErrores] = useState({});
  const [exito, setExito] = useState(false);
  const navigate = useNavigate();

  const manejarEnvio = async (formData) => {
    const validationErrors = ValidationsLogin({ datos: formData });

    if (Object.keys(validationErrors).length > 0) {
      if (validationErrors.email && emailRef.current) {
        emailRef.current.focus();
      } else if (validationErrors.password && passwordRef.current) {
        passwordRef.current.focus();
      }
      setErrores(validationErrors);
      setExito(false);
    } else {
      setErrores({});
      try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          setErrores({ credenciales: data.message || 'Error de autenticación' });
          setExito(false);
          return;
        }

        localStorage.setItem('authtoken', data.token);

        // Aseguramos que el role esté en minúsculas
        const lowerCaseRole = data.role.toLowerCase();
        setExito(true);

        // Guardamos correctamente el rol
        onLogin(formData.email, lowerCaseRole);

        setTimeout(() => navigate('/'), 3000);
      } catch (error) {
        setErrores({ credenciales: 'Error de conexión con el servidor' });
        setExito(false);
      }
    }
  };

  return (
    <div className="login-page-container">
      {exito ? (
        <div className="login-success-message">
          ¡Ingreso exitoso! Redirigiendo...
        </div>
      ) : (
        <div className="login-container">
          <LoginForm
            onSubmit={manejarEnvio}
            errores={errores}
            refs={{ email: emailRef, password: passwordRef }}
          />
        </div>
      )}
    </div>
  );
}

export default Login;