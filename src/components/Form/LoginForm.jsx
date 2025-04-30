import React, { useState } from 'react'

const LoginForm = ({ onSubmit, errores, refs }) => {

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
        onSubmit(formData);
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
                    ref={refs.email}
                />
                {errores.email && <p style={ {color:"red"}}>{ errores.email }</p>}
                <label>CONTRASEÑA</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    ref={refs.password}
                />
                {errores.password && <p style={ {color : "red"}}>{ errores.password }</p>}
                <button type="submit">INGRESAR</button>
                <a href="/register" className="crear-cuenta">CREAR CUENTA</a>
            </form>
        </div>
    );
};


export default LoginForm;