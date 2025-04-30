import React, { useState } from 'react'

const RegisterForm = ({ onSubmit }) => {

    const [formData, setFormData] = useState({
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
                    <label>CORREO ELECTRONICO</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <label>NOMBRE</label>
                    <input
                        type="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <label>APELLIDO</label>
                    <input
                        type="lastname"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                    />
                    <label>TELEFONO</label>
                    <input
                        type="tel"
                        name="tel"
                        value={formData.tel}
                        onChange={handleChange}
                    />
                    <label>DIRECCION</label>
                    <input
                        type="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                    <label>CONTRASEÑA</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <label>REPETIR CONTRASEÑA</label>
                    <input
                        type="repPassword"
                        name="repPassword"
                        value={formData.repPassword}
                        onChange={handleChange}
                    />
                    <button type="submit">CREAR CUENTA</button>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;
