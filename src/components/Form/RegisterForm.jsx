import React, { useState } from 'react';
import "./forms.css";

const RegisterForm = ({ onSubmit, errores, refs }) => {

    const [formData, setFormData] = useState({
        dni: "",
        email: "",
        name: "",
        lastname: "",
        tel: "",
        address: "",
        password: "",
        repPassword: ""
    });


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div>
            <div className="register-container">
                <form className="register-form" onSubmit={handleSubmit}>
                    <label>DNI</label>
                    <input
                        type="text" 
                        name="dni"
                        value={formData.dni}
                        onChange={handleChange}
                        ref={refs.dni} 
                    />
                    {errores.dni && <p className="error-text">{errores.dni}</p>} 
                    <label>CORREO ELECTRONICO</label>
                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        ref={refs.email}
                    />
                    {errores.email && <p className="error-text">{errores.email}</p>}
                    <label>NOMBRE</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        ref={refs.name}
                    />
                    {errores.name && <p className="error-text">{errores.name}</p>}
                    <label>APELLIDO</label>
                    <input
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        ref={refs.lastname}
                    />
                    {errores.lastname && <p className="error-text">{errores.lastname}</p>}
                    <label>TELEFONO</label>
                    <input
                        type="tel"
                        name="tel"
                        value={formData.tel}
                        onChange={handleChange}
                        ref={refs.tel}
                    />
                    {errores.tel && <p className="error-text">{errores.tel}</p>}
                    <label>DIRECCION</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        ref={refs.address}
                    />
                    {errores.address && <p className="error-text">{errores.address}</p>}
                    <label>CONTRASEÑA</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        ref={refs.password}
                    />
                    {errores.password && <p className="error-text">{errores.password}</p>}
                    <label>REPETIR CONTRASEÑA</label>
                    <input
                        type="password"
                        name="repPassword"
                        value={formData.repPassword}
                        onChange={handleChange}
                        ref={refs.repPassword}
                    />
                    {errores.repPassword && <p className="error-text">{errores.repPassword}</p>}
                    <button type="submit">CREAR CUENTA</button>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;
