import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import "./TurnosProfesional.css";

const ConfirmationModal = ({ show, message, onConfirm, onCancel, onClose }) => {
    if (!show) {
        return null;
    }
    
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>{message}</p>
                <div className="modal-actions">
                    {onConfirm && onCancel ? (
                        <>
                            <button onClick={onConfirm} className="modal-confirm-button">Sí</button>
                            <button onClick={onCancel} className="modal-cancel-button">No</button>
                        </>
                    ) : (
                        <button onClick={onClose} className="modal-confirm-button">Aceptar</button>
                    )}
                </div>
            </div>
        </div>
    );
};

const TurnosProfesional = () => {
    const [listaDeTurnos, setListaDeTurnos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    
    const navigate = useNavigate();

    const formatDuration = (duracion) => `${duracion} minutos`;

    const fetchData = async (url, options = {}) => {
        const token = localStorage.getItem('authtoken');
        if (!token) {
            throw new Error("No estás autenticado. Por favor, inicia sesión.");
        }
        
        const response = await fetch(url, {
            ...options,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                ...options.headers,
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Error desconocido del servidor' }));
            throw new Error(errorData.message || `Error en la petición (Status: ${response.status})`);
        }
        return response.json();
    };

    const fetchTurnos = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchData('http://localhost:3000/misturnos');

            const turnosTransformados = data.map((turno) => ({
                id: turno.id,
                paciente: `${turno.usuario?.name || 'N/A'} ${turno.usuario?.lastname || 'N/A'}`,
                dniPaciente: turno.dniusuario,
                servicios: turno.servicio?.nombre || 'Servicio no especificado',
                fecha: turno.dia,
                hora: turno.hora,
                duracion: turno.servicio?.duracion !== undefined ? formatDuration(turno.servicio.duracion) : 'N/A',
                atendido: turno.atendido || false,
            }));

            setListaDeTurnos(turnosTransformados);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTurnos();
    }, []);

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
        setSuccessMessage('');
    };

    const handleMarcarAtendido = async (turnoId) => {
        setLoading(true);
        try {
            const url = `http://localhost:3000/misturnos/${turnoId}/atendido`;
            const data = await fetchData(url, { method: 'PUT' });

            setListaDeTurnos(prev => 
                prev.map(t => t.id === turnoId ? { ...t, atendido: true } : t)
            );

            setSuccessMessage(`Turno ${data.turno.id} marcado como atendido.`);
            setShowSuccessModal(true);

        } catch (error) {
            console.error('Error al marcar turno como atendido:', error);
            setError(`No se pudo marcar el turno: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    const handleVerFicha = (dniPaciente) => {
        navigate(`/profesional/historial?dni=${dniPaciente}`);
    };

    if (loading) {
        return <p>Cargando turnos...</p>;
    }

    if (error) {
        return (
            <ConfirmationModal
                show={true}
                message={`Error al cargar: ${error}`}
                onClose={() => setError(null)}
            />
        );
    }

    return (
        <div className="turnos-container">
            <h2 className="turnos-title">TURNOS ASIGNADOS PARA HOY</h2>
            
            {listaDeTurnos.length === 0 ? (
                <p>No tienes turnos programados para hoy.</p>
            ) : (
                <table className="turnos-table">
                    <thead>
                        <tr>
                            <th>Paciente</th>
                            <th>Servicio</th>
                            <th>Hora</th>
                            <th>Duración</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaDeTurnos.map(turno => (
                            <tr key={turno.id}>
                                <td>{turno.paciente}</td>
                                <td>{turno.servicios}</td>
                                <td>{turno.hora}</td>
                                <td>{turno.duracion}</td>
                                <td>
                                    <input 
                                        type="checkbox"
                                        checked={turno.atendido}
                                        onChange={() => handleMarcarAtendido(turno.id)}
                                        disabled={turno.atendido || loading}
                                    />
                                    {turno.atendido ? ' Atendido' : ' Pendiente'}
                                </td>
                                <td>
                                    <button 
                                        className="ver-ficha-button"
                                        onClick={() => handleVerFicha(turno.dniPaciente)}
                                        disabled={loading}
                                    >
                                        Ver Ficha
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            
            <ConfirmationModal
                show={showSuccessModal}
                message={successMessage}
                onClose={closeSuccessModal}
            />
        </div>
    );
};

export default TurnosProfesional;