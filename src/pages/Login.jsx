
import LoginForm from '../components/Form/LoginForm';
import Validations from '../components/Validations/Validations';
import ClearisNavbar from '../components/ClearisNavbar/ClearisNavbar';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';


function Login() {

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [errores,setErrores] = useState({});
  const [exito,setExito] = useState(false);
  const navigate = useNavigate();

  const manejarEnvio = (FormData) => {
    const errores = Validations( { datos: FormData });
  

    if (Object.keys(errores).length > 0) {
      if(errores.email && emailRef.current){
        emailRef.current.focus();
      } else if (errores.password && passwordRef.current){
        passwordRef.current.focus();
      };
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
     <ClearisNavbar />
      {exito && (
       <div className="login-success-message">
         ¡Ingreso exitoso!
       </div>
      )}
      {!exito && (
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
};

export default Login;