import React, { useState, useEffect } from 'react';
import "./profile.css";

const Profile = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    direccion: ''
  });

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('perfil');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleModificar = () => {
    setEditMode(true);
  };

  const handleConfirmar = (e) => {
    e.preventDefault();
    localStorage.setItem('perfil', JSON.stringify(formData));
    alert("Datos actualizados correctamente");
    setEditMode(false);
  };

  return (
    <div className="perfil-container">
      <form className="perfil-form">
        <h2 className="perfil-titulo">MI PERFIL</h2>

        <label>Nombre completo</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          disabled={!editMode}
        />

        <label>Correo electrónico</label>
        <input
          type="email"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          disabled={!editMode}
        />

        <label>Teléfono</label>
        <input
          type="tel"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          disabled={!editMode}
        />

        <label>Dirección</label>
        <input
          type="text"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          disabled={!editMode}
        />

        <div className="perfil-buttons">
          {!editMode && (
            <button type="button" onClick={handleModificar}>
              MODIFICAR DATOS
            </button>
          )}
          {editMode && (
            <button type="button" onClick={handleConfirmar}>
              CONFIRMAR
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Profile;
