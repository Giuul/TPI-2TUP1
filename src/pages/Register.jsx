import React from 'react'
import RegisterForm from '../components/Form/RegisterForm'
import ValidationsRegister from '../components/Validations/ValidationsRegister';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const dniRef= useRef(null);
  const emailRef = useRef(null);
  const nameRef = useRef(null);
  const lastnameRef = useRef(null);
  const telRef = useRef(null);
  const addressRef = useRef(null);
  const passwordRef = useRef(null);
  const repPasswordRef = useRef(null);
  const [errores, setErrores] = useState({});
  const [exito, setExito] = useState(false);

  const manejarEnvio = async (formData) => {
    const erroresValidacion = ValidationsRegister({ datos: formData });

    if (Object.keys(erroresValidacion).length > 0) {
      if (erroresValidacion.dni && dniRef.current) {
        dniRef.current.focus();
      } else if (erroresValidacion.email && emailRef.current) {
        emailRef.current.focus();
      } else if (erroresValidacion.name && nameRef.current) {
        nameRef.current.focus();
      }  else if (erroresValidacion.lastname && lastnameRef.current) {
        lastnameRef.current.focus();  
      } else if (erroresValidacion.tel && telRef.current) { 
        telRef.current.focus();
      } else if (erroresValidacion.address && addressRef.current) {
        addressRef.current.focus();
      } else if (erroresValidacion.password && passwordRef.current) {
        passwordRef.current.focus();
      } else if (erroresValidacion.repPassword && repPasswordRef.current) {
        repPasswordRef.current.focus();
      }
      setErrores(erroresValidacion);
      setExito(false);
    } else {
      setErrores({});
      setExito(false);

      try {
        const urlBackend = `http://localhost:3000/users`; 

        const datosParaBackend = {
          id: formData.dni,         
          name: formData.name,      
          lastname: formData.lastname, 
          email: formData.email,   
          tel: formData.tel,        
          address: formData.address, 
          password: formData.password, 
          repPassword: formData.repPassword,
        };
        console.log("Datos que se envían al backend:", JSON.stringify(datosParaBackend, null, 2));
        const response = await fetch(urlBackend, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(datosParaBackend),
        });

        const data = await response.json();

        if (response.ok) {
          console.log("Usuario creado exitosamente:", data);
          setExito(true);
          setTimeout(() => navigate("/"), 3000);
        } else {
          console.error("Error al crear usuario:", data.message || "Error desconocido");
          setErrores({ general: data.message || "No se pudo crear el usuario." });
          setExito(false);
        }
      } catch (error) {
        console.error("Error en la conexión con el backend:", error);
        setErrores({ general: "No se pudo conectar con el servidor. Intenta de nuevo." });
        setExito(false);
      }
    }
  };

  return (
    <div>
      {exito && (
        <div className="login-success-message">
          ¡Registro exitoso! Redirigiendo...
        </div>
      )}
      {!exito && (
        <div className="login-container">
          <RegisterForm
            onSubmit={manejarEnvio}
            errores={errores}
            refs={{ dni: dniRef, email: emailRef, name: nameRef, lastname: lastnameRef, tel: telRef, address: addressRef, password: passwordRef, repPassword: repPasswordRef }}
          />
        </div>
      )}
    </div>
  );
};

export default Register;