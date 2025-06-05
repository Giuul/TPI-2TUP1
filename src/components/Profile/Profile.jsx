import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import "./profile.css";


const Profile = ({ onAccountDelete }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        dni: '',
        name: '',
        lastname: '',
        email: '',
        tel: '',
        address: ''
    });

    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');


            if (!token) {
                setError("No se ha iniciado sesión. Redirigiendo al login...");
                setLoading(false);
                setTimeout(() => navigate('/login'), 1500);
                return;
            }

            let userIdFromToken;
            try {
                const decodedToken = jwtDecode(token);

                userIdFromToken = decodedToken.id;
                setCurrentUserId(userIdFromToken);
            } catch (e) {
                console.error("Error al decodificar el token:", e);
                setError("Token inválido o expirado. Por favor, inicia sesión de nuevo. Redirigiendo al login...");
                setLoading(false);
                setTimeout(() => navigate('/login'), 1500);
                return;
            }


            try {
                const response = await axios.get(`http://localhost:3000/users/${userIdFromToken}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const userData = response.data;
                setFormData({
                    dni: userData.id || '',
                    name: userData.name || '',
                    lastname: userData.lastname || '',
                    email: userData.email || '',
                    tel: userData.tel || '',
                    address: userData.address || ''
                });
                setError(null);
            } catch (err) {
                console.error("Error al cargar los datos del perfil:", err);
                if (err.response && err.response.status === 401) {
                    setError("Sesión expirada o no autorizado. Redirigiendo al login...");
                    setTimeout(() => navigate('/login'), 1500);
                } else {
                    setError("Error al cargar los datos del perfil. Inténtalo de nuevo.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleModificar = () => {
        setEditMode(true);
    };


    const handleConfirmar = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token || !currentUserId) {
            setError("Error de autenticación. No se pudo guardar el perfil. Redirigiendo al login...");
            setLoading(false);
            setTimeout(() => navigate('/login'), 1500);
            return;
        }

        try {

            const response = await axios.put(`http://localhost:3000/users/${currentUserId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            alert(response.data.message || "Datos actualizados correctamente.");
            setEditMode(false);
        } catch (err) {
            console.error("Error al guardar los datos del perfil:", err);
            if (err.response && err.response.status === 401) {
                setError("Sesión expirada o no autorizado. Redirigiendo al login...");
                setTimeout(() => navigate('/login'), 1500);
            } else if (err.response && err.response.data && err.response.data.message) {
                setError(`Error al guardar: ${err.response.data.message}`);
            } else {
                setError("Error al guardar los datos del perfil. Inténtalo de nuevo.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.")) {
            return;
        }

        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        if (!token || !currentUserId) {
            setError("Error de autenticación. No se pudo eliminar la cuenta. Redirigiendo al login...");
            setLoading(false);
            setTimeout(() => navigate('/login'), 1500);
            return;
        }

        try {
            await axios.delete(`http://localhost:3000/users/${currentUserId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            alert("Cuenta eliminada exitosamente.");

            if (onAccountDelete) {
                onAccountDelete();
            } else {
                localStorage.removeItem('token');
            }

            setTimeout(() => {
                navigate('/login');
            }, 100);

        } catch (err) {
            console.error("Error al eliminar la cuenta:", err);
            if (err.response && err.response.status === 401) {
                setError("Sesión expirada o no autorizado para eliminar. Redirigiendo al login...");
                setTimeout(() => navigate('/login'), 1500);
            } else if (err.response && err.response.data && err.response.data.message) {
                setError(`Error al eliminar la cuenta: ${err.response.data.message}`);
            } else {
                setError("Error al eliminar la cuenta. Inténtalo de nuevo.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="perfil-container"><p>Cargando perfil...</p></div>;
    }

    if (error) {
        return <div className="perfil-container"><p className="error-message">{error}</p></div>;
    }

    return (
        <div className="perfil-container">
            <form className="perfil-form" onSubmit={handleConfirmar}>
                <h2 className="perfil-titulo">MI PERFIL</h2>

                <label>DNI</label>
                <input
                    type="text"
                    name="dni"
                    value={formData.dni}
                    disabled={true}
                />

                <label>Nombre</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!editMode}
                />

                <label>Apellido</label>
                <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    disabled={!editMode}
                />

                <label>Correo electrónico</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!editMode}
                />

                <label>Teléfono</label>
                <input
                    type="tel"
                    name="tel"
                    value={formData.tel}
                    onChange={handleChange}
                    disabled={!editMode}
                />

                <label>Dirección</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
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
                        <button type="submit">
                            CONFIRMAR
                        </button>
                    )}
                    <button
                        type="button" onClick={handleDeleteAccount}
                    >
                        ELIMINAR CUENTA
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;