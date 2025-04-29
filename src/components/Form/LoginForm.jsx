import React, { useState } from 'react'

const LoginForm = ({ onSubmit }) => {

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) onSubmit(formData);
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <label>CORREO ELECTRONICO</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <label>CONTRASEÑA</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <button type="submit">INGRESAR</button>
                <a href="/register" className="crear-cuenta">CREAR CUENTA</a>
            </form>
        </div>
    );
};


export default LoginForm;