import React, { useState } from 'react'
import "./profile.css";

const Profile = () => {
    const [formData,setFormData] = useState({
        nombre: '',
        correo:'',
        telefono: '',
        direccion:''
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

     const handleModificar = () => {
    // Lógica para habilitar la edición, si fuera necesario
    alert("Modo edición activado (esto se puede reemplazar por lógica real)");
    };

    const handleConfirmar = (e) => {
       e.preventDefault();
        // Acá iría la lógica para guardar los datos (ej. API call)
        console.log('Datos confirmados:', formData);
        alert("Datos actualizados correctamente");
    };
    
  return (
    <div className="perfil-container">
      <form className="perfil-form">
        <h2 className="perfil-titulo">MI PERFIL</h2>
        <label>Nombre completo</label>
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} />

        <label>Correo electrónico</label>
        <input type="email" name="correo" value={formData.correo} onChange={handleChange} />

        <label>Teléfono</label>
        <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} />

        <label>Dirección</label>
        <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} />

        <div className="perfil-buttons">
          <button type="button" onClick={handleModificar}>MODIFICAR DATOS</button>
          <button type="button" onClick={handleConfirmar}>CONFIRMAR</button>
        </div>
      </form>
    </div>
  );
}

export default Profile;