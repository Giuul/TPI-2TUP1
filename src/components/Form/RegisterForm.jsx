import React, { useState, useRef } from 'react'; 
import "./forms.css";
import ValidationsRegister from '../../components/Validations/ValidationsRegister.jsx'; 


const RegisterForm = ({ onSubmit }) => {

    const [formData, setFormData] = useState({
        dni: "",
        email: "",
        name: "",
        lastname: "",
        tel: "",
        address: "",
        password: "",
        repPassword: "",
        role: "user", 
    });

    const [formErrors, setFormErrors] = useState({});
    const inputRefs = {
        dni: useRef(null),
        email: useRef(null),
        name: useRef(null),
        lastname: useRef(null),
        tel: useRef(null),
        address: useRef(null),
        password: useRef(null),
        repPassword: useRef(null),
    };



    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value, 
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = ValidationsRegister({ datos: formData });
        setFormErrors(newErrors); 
        if (Object.keys(newErrors).length === 0) {
            onSubmit(formData);
        }else {
            const firstErrorField = Object.keys(newErrors)[0];
            if (inputRefs[firstErrorField] && inputRefs[firstErrorField].current) {
                inputRefs[firstErrorField].current.focus();
            }
        }
    
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
                        ref={inputRefs.dni} 
                    />
                    {formErrors.dni && <p className="error-text">{formErrors.dni}</p>} 

                    <label>CORREO ELECTRONICO</label>
                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        ref={inputRefs.email}
                    />
                    {formErrors.email && <p className="error-text">{formErrors.email}</p>}

                    <label>NOMBRE</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        ref={inputRefs.name}
                    />
                    {formErrors.name && <p className="error-text">{formErrors.name}</p>}

                    <label>APELLIDO</label>
                    <input
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        ref={inputRefs.lastname}
                    />
                    {formErrors.lastname && <p className="error-text">{formErrors.lastname}</p>}

                    <label>TELEFONO</label>
                    <input
                        type="tel"
                        name="tel"
                        value={formData.tel}
                        onChange={handleChange}
                        ref={inputRefs.tel}
                    />
                    {formErrors.tel && <p className="error-text">{formErrors.tel}</p>}

                    <label>DIRECCION</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        ref={inputRefs.address}
                    />
                    {formErrors.address && <p className="error-text">{formErrors.address}</p>}

                    <label>CONTRASEÑA</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        ref={inputRefs.password}
                    />
                    {formErrors.password && <p className="error-text">{formErrors.password}</p>}

                    <label>REPETIR CONTRASEÑA</label>
                    <input
                        type="password"
                        name="repPassword"
                        value={formData.repPassword}
                        onChange={handleChange}
                        ref={inputRefs.repPassword}
                    />
                    {formErrors.repPassword && <p className="error-text">{formErrors.repPassword}</p>}
                    {formErrors.general && <p className="error-text general-error">{formErrors.general}</p>}
                    <button type="submit">CREAR CUENTA</button>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;

