import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


const HistorialClinico = () => {
    const { dni } = useParams();
    const navigate = useNavigate();

    const [pacienteInfo, setPacienteInfo] = useState(null); 
    const [turnosHistoricos, setTurnosHistoricos] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showObsModal, setShowObsModal] = useState(false);
    const [selectedTurnoObs, setSelectedTurnoObs] = useState(null);

    const openObsModal = (turno) => {
        setSelectedTurnoObs(turno);
        setShowObsModal(true);
    };

    const closeObsModal = () => {
        setShowObsModal(false);
        setSelectedTurnoObs(null);
    };
    
    const handleGuardarObservacion = async (turnoId, observaciones) => {
        const token = localStorage.getItem("authtoken");
        try {
            const response = await fetch(`http://localhost:3000/admin/turnos/${turnoId}/observacion`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ observaciones })
            });

            if (!response.ok) throw new Error("Error al guardar observación");

            setTurnosHistoricos(prevTurnos => 
                prevTurnos.map(t => 
                    t.id === turnoId ? { ...t, observaciones: observaciones } : t
                )
            );

            alert("Observación guardada con éxito.");
            closeObsModal();
        } catch (err) {
            alert("No se pudo guardar la observación: " + err.message);
        }
    };


    useEffect(() => {
        const fetchHistorial = async () => {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('authtoken');
            if (!token) return navigate('/login');

            try {
                const decodedToken = jwtDecode(token);
                const role = decodedToken.role;
                if (!["profesional", "admin", "superadmin"].includes(role)) {
                    throw new Error("Acceso denegado. Solo personal autorizado puede ver historiales.");
                }
            } catch (e) {
                setError("Error de autenticación. Por favor, vuelve a iniciar sesión.");
                setLoading(false);
                return;
            }

            const historialUrl = `http://localhost:3000/turnos/paciente/${dni}/historial`;

            try {
                const res = await fetch(historialUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.mensaje || "Error al obtener el historial.");
                }
                
                const data = await res.json(); 
                
                if (data && data.length > 0) {
                    const { usuario } = data[0]; 
                    if (usuario) {
                        setPacienteInfo(usuario); 
                    }
                    setTurnosHistoricos(data);
                } else {
                    setPacienteInfo({ name: "Paciente", lastname: "Desconocido", id: dni });
                    setTurnosHistoricos([]);
                }
                
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (dni) {
            fetchHistorial();
        }
    }, [dni, navigate]);


    if (loading) return <div className="historial-container"><p>Cargando Historial Clínico...</p></div>;
    if (error) return <div className="historial-container"><p className="error-message">Error: {error}</p></div>;
    if (!pacienteInfo) return <div className="historial-container"><p className="error-message">No se pudieron cargar los datos del paciente.</p></div>;

    return (
        <div className="historial-container">
            <h2 className="historial-title">
                Historial Clínico de {pacienteInfo.name} {pacienteInfo.lastname}
            </h2>
            

            <div className="historial-section">
                <h3>Registro de Turnos Pasados</h3>
                {turnosHistoricos.length === 0 ? (
                    <p className="no-data">No hay turnos históricos registrados para este paciente.</p>
                ) : (
                    <table className="historial-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Servicio</th>
                                <th>Profesional</th>
                                <th>Asistencia</th>
                                <th>Observaciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {turnosHistoricos.map((turno) => (
                                <tr key={turno.id} className={turno.asistio ? 'turno-asistio' : 'turno-ausente'}>
                                    <td>{turno.dia}</td>
                                    <td>{turno.hora}</td>
                                    <td>{turno.servicio?.nombre || "N/A"}</td>
                                    <td>
                                        {turno.profesional 
                                            ? `${turno.profesional.name} ${turno.profesional.lastname}` 
                                            : "Sin asignar"}
                                    </td>
                                    <td>
                                        <span className={`asistencia-badge ${turno.asistio ? 'asistio' : 'ausente'}`}>
                                            {turno.asistio ? 'Sí' : 'No'}
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                            onClick={() => openObsModal(turno)}
                                            className="btn-observaciones"
                                        >
                                            {turno.observaciones ? "Ver/Editar" : "Agregar"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            
            
            <button onClick={() => navigate(-1)} className="btn-back">
                ← Volver a la Agenda
            </button>

            
            {showObsModal && selectedTurnoObs && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <h3>Observación - Turno {selectedTurnoObs.dia} {selectedTurnoObs.hora}</h3>
                        <textarea 
                            id="observacion-text"
                            defaultValue={selectedTurnoObs.observaciones || ""}
                            rows="5" 
                            placeholder="Escriba aquí las observaciones de la sesión..."
                            style={{width: '90%', padding: '10px'}}
                        />
                        <div className="modal-actions">
                            <button className="modal-cancel-button" onClick={closeObsModal}>Cerrar</button>
                            <button 
                                className="modal-confirm-button" 
                                onClick={() => handleGuardarObservacion(selectedTurnoObs.id, document.getElementById('observacion-text').value)}
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HistorialClinico;