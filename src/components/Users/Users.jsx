import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './users.css';

const Users = () => {
    const navigate = useNavigate();
    const [dniBusqueda, setDniBusqueda] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editarUserId, setEditarUserId] = useState(null); 
    const [formData, setFormData] = useState({ id: '', name: '', lastname: '', email: '', tel: '', address: '' });

   
    const fetchUsers = async () => {
        try {
            setLoading(true); 
            const response = await axios.get('http://localhost:3000/users');
            setUsers(response.data);
            setError(null); 
        } catch (err) {
            setError('Error al cargar los usuarios. Por favor, intenta de nuevo más tarde.');
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(); 
    }, []);

    const usersFiltrados = users.filter(user =>
        user.id.toString().includes(dniBusqueda)
    );

    
    const eliminarTurno = async (userId) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario con DNI ${userId}?`)) {
            try {
                await axios.delete(`http://localhost:3000/users/${userId}`);
                alert('Usuario eliminado exitosamente.');
                fetchUsers(); 
            } catch (err) {
                console.error("Error al eliminar usuario:", err);
                setError('Error al eliminar el usuario. Por favor, intenta de nuevo.');
                
            }
        }
    };

    
    const abrirEditor = (user) => { 
        setEditarUserId(user.id); 
        setFormData({ ...user }); 
    };

    
    const guardarCambios = async () => {
        try {
            const response = await axios.put(`http://localhost:3000/users/${editarUserId}`, formData);
            alert(response.data.message || 'Usuario actualizado exitosamente.');
            cerrarEditor(); 
            fetchUsers(); 
        } catch (err) {
            console.error("Error al guardar cambios:", err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(`Error al guardar cambios: ${err.response.data.message}`);
            } else {
                setError('Error al guardar cambios. Por favor, intenta de nuevo.');
            }
        }
    };

    const cerrarEditor = () => {
        setEditarUserId(null); 
        setFormData({ id: '', name: '', lastname: '', email: '', tel: '', address: '' });
    };

    if (loading) {
        return <div className="schedule-page">Cargando usuarios...</div>;
    }

    if (error) {
        return <div className="schedule-page error-message">{error}</div>;
    }

    return (
        <div className="schedule-page">
            <h1>USUARIOS REGISTRADOS</h1>

            <div className="botones">
                <button className="btn-principal" onClick={() => navigate('/Register')}>
                    CREAR USUARIO
                </button>
                <button className="btn-principal" onClick={() => navigate('/programar-turnos')}>
                    PROGRAMAR TURNO
                </button>

                <div className="buscar">
                    <label>BUSCAR POR DNI</label>
                    <input
                        type="text"
                        placeholder="..."
                        value={dniBusqueda}
                        onChange={(e) => setDniBusqueda(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>DNI</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Dirección</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersFiltrados.length > 0 ? (
                            usersFiltrados.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.lastname}</td>
                                    <td>{user.email}</td>
                                    <td>{user.tel}</td>
                                    <td>{user.address}</td>
                                    <td className="actions-cell">
                                        <button className="btn-editar" onClick={() => abrirEditor(user)}>
                                            <i className="bi bi-pencil"></i> Editar
                                        </button>
                                        <button className="btn-eliminar" onClick={() => eliminarTurno(user.id)}>
                                            <i className="bi bi-trash"></i> Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">No se encontraron usuarios.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {editarUserId !== null && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Editar Usuario (DNI: {formData.id})</h3> 
                        <label>DNI</label>
                        <input
                            value={formData.id}
                            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                            disabled 
                        />
                        <label>Nombre</label>
                        <input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <label>Apellido</label>
                        <input
                            value={formData.lastname}
                            onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                        />
                        <label>Email</label>
                        <input
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <label>Teléfono</label>
                        <input
                            value={formData.tel}
                            onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
                        />
                        <label>Dirección</label>
                        <input
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />

                        <div className="modal-buttons">
                            <button onClick={guardarCambios} className="btn-principal">Guardar</button>
                            <button onClick={cerrarEditor} className="btn-cancelar">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;