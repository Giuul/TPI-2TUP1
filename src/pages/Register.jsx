import React from 'react'
import RegisterForm from '../components/Form/RegisterForm'
import ValidationsRegister from '../components/Validations/ValidationsRegister';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Register = () => {
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const nameRef = useRef(null);
  const lastnameRef = useRef(null);
  const telRef = useRef(null);
  const addressRef = useRef(null);
  const passwordRef = useRef(null);
  const repPasswordRef = useRef(null);
  const [errores, setErrores] = useState({});
  const [exito, setExito] = useState(false);

  const manejarEnvio = (FormData) => {
    const errores = ValidationsRegister({ datos: FormData });



    if (Object.keys(errores).length > 0) {
      if (errores.email && emailRef.current) {
        emailRef.current.focus();
      } else if (errores.name && nameRef.current) {
        nameRef.current.focus();
      } else if (errores.lastname && lastnameRef.current) {
        lastnameRef.current.focus();
      } else if (errores.tel && telRef.current) {
        telRef.current.focus();
      } else if (errores.address && addressRef.current) {
        addressRef.current.focus();
      } else if (errores.password && passwordRef.current) {
        passwordRef.current.focus();
      } else if (errores.repPassword && repPasswordRef.current) {
        repPasswordRef.current.focus();
      }
      setErrores(errores);
      setExito(false);
    } else {
      setErrores({});
      setExito(true);
      setTimeout(() => navigate("/"), 2000);
    };
  };



  return (
    <div>
      {exito && (
        <div className="login-success-message">
          ¡Ingreso exitoso!
        </div>
      )}
      {!exito && (
        <div className="login-container">
          <RegisterForm
            onSubmit={manejarEnvio}
            errores={errores}
            refs={{ email: emailRef, name: nameRef, lastname: lastnameRef, tel: telRef, address: addressRef, password: passwordRef, repPassword: repPasswordRef }}
          />
        </div>
      )}
    </div>
  );
};

export default Register;
