

const ValidationsRegister = ({ datos }) => {
  
    const errores = {};
    if (!datos.email.trim()) {
        errores.email = "El email es obligatorio";
    }else if (!/\S+@\S+\.\S+/.test(datos.email)) {
        errores.email = "El email no es válido";
    }

    if (!datos.name.trim()) {
        errores.name = "El nombre es obligatorio";
      } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(datos.name)) {
        errores.name = "Solo se permiten letras";
    }

    if (!datos.lastname.trim()) {
        errores.lastname = "El apellido es obligatorio";
        } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(datos.lastname)) {
        errores.lastname = "Solo se permiten letras";
    }

    if (!datos.tel.trim()) {
        errores.tel = "El telefono es obligatorio";
        } else if (!/^[0-9]{10}$/.test(datos.tel)) {
        errores.tel = "Solo se permiten numeros";
    }

    if (!datos.address.trim()) {
        errores.address = "La direccion es obligatoria";
        } else if (!/^[a-zA-Z0-9\s\.,#\-°]+$/.test(datos.address)) {
        errores.address = "Solo se permiten letras y numeros";
    }

    if (!datos.password.trim()) {
        errores.password = "La contraseña es obligatoria";
      } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(datos.password)) {
        errores.password = "Mínimo 8 caracteres, incluyendo letras y números";
    }

    if (!datos.repPassword.trim()) {
        errores.repPassword = "Repetir la contraseña es obligatorio";
      } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(datos.repPassword)) {
        errores.repPassword = "Mínimo 8 caracteres, incluyendo letras y números";
    }
    
    return errores;

};

export default ValidationsRegister