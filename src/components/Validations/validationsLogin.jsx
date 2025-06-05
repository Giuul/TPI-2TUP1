const ValidationsLogin = ({ datos }) => {
  const errores = {};
  
  if (!datos.email || !datos.email.trim()) {
    errores.email = "El email es obligatorio";
  }

  if (!datos.password || !datos.password.trim()) {
    errores.password = "La contraseña es obligatoria";
  }

  

  return errores;
};

export default ValidationsLogin;