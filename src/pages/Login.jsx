import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/Form/LoginForm';
import Validations from '../components/Validations/Validations';
import LoginContainer from '../components/Form/LoginContainer';

function Login({ onLogin }) {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [errores, setErrores] = useState({});
  const [exito, setExito] = useState(false);
  const navigate = useNavigate();

  const manejarEnvio = (formData) => {
    const validationErrors = Validations({ datos: formData });

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

      // SIMULACION DE AUTENTICACION HASTA ARMAR BACK

      if (formData.email === 'test@example.com' && formData.password === 'password5') {
        // SI SE LOGUEA BIEN
        setExito(true);
        onLogin(formData.email);

        setTimeout(() => navigate("/"), 1000);
      } else {
        // SI SE LOGUEA MAL
        setErrores({ credenciales: 'Email o contraseña incorrectos.' });
        setExito(false);
      }
    }
  };

  const Login = ({ onLogin }) => {
    return <LoginContainer onLogin={onLogin} />;
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
          {errores.credenciales && (
            <p className="text-red-500 text-center mt-2">{errores.credenciales}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Login;
