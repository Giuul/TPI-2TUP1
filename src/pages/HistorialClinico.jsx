import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ObservacionesModal from '../components/ListaSesiones/ObservacionModal';
import '../components/Turnos/turnos.css';

const HistorialClinico = () => {
    const { dni } = useParams();
    const navigate = useNavigate();

    const [pacienteInfo, setPacienteInfo] = useState(null); 
    const [turnosHistoricos, setTurnosHistoricos] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showObsModal, setShowObsModal] = useState(false);
    const [selectedTurnoObs, setSelectedTurnoObs] = useState(null);
    const [loadingObs, setLoadingObs] = useState(false);
    const [errorObs, setErrorObs] = useState(null); 

    const openObsModal = (turno) => {
        const displayTurno = {
            ...turno,
            usuarioDisplay: `${pacienteInfo.name} ${pacienteInfo.lastname} (DNI: ${pacienteInfo.id})`, 
            profesionalDisplay: turno.profesional 
                ? `${turno.profesional.name} ${turno.profesional.lastname}` 
                : "Sin asignar",
        };
        setSelectedTurnoObs(displayTurno);
        setShowObsModal(true);
        setErrorObs(null); 
    };

    const closeObsModal = () => {
        setShowObsModal(false);
        setSelectedTurnoObs(null);
        setErrorObs(null);
    };
    
    const handleGuardarObservacion = async (turnoId, observaciones) => {
        const token = localStorage.getItem("authtoken");
        setLoadingObs(true); 
        setErrorObs(null); 

        try {
            const response = await fetch(`http://localhost:3000/admin/turnos/${turnoId}/observaciones`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ observaciones })
            });

            if (!response.ok) throw new Error("Error al guardar observación.");

            setTurnosHistoricos(prevTurnos => 
                prevTurnos.map(t => 
                    t.id === turnoId ? { ...t, observaciones: observaciones } : t
                )
            );
            
            setSelectedTurnoObs(prev => prev ? {...prev, observaciones: observaciones} : null);

            alert("Observación guardada con éxito.");
            closeObsModal();
        } catch (err) {
            setErrorObs(err.message); 
        } finally {
            setLoadingObs(false); 
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
                    throw new Error("Acceso denegado.");
                }
            } catch (e) {
                setError("Error de autenticación.");
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
                
                const { pacienteInfo: apiPacienteInfo, historial: apiTurnosHistoricos } = data;

                if (apiPacienteInfo) {
                    setPacienteInfo(apiPacienteInfo);
                } else {
                    setPacienteInfo({ name: "Paciente", lastname: "No Disponible", id: dni });
                }
                setTurnosHistoricos(apiTurnosHistoricos || []);
                
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
                Historial Clínico de {pacienteInfo.name} {pacienteInfo.lastname} (DNI: {pacienteInfo.id})
            </h2>
            
            <div className="historial-section">
                <h3>Registro de Turnos Pasados</h3>
                {turnosHistoricos.length === 0 ? (
                    <p className="no-data">No hay turnos históricos asistidos registrados para este paciente.</p>
                ) : (
                    
                    <div className="historial-table-wrapper">
                        <table className="turnos-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '25%' }}>Fecha</th>
                                    <th>Hora</th>
                                    <th>Servicio</th>
                                    <th>Profesional</th>
                                    <th style={{ width: '150px' }}>Observaciones</th> 
                                </tr>
                            </thead>
                            <tbody>
                                {turnosHistoricos.map((turno) => (
                                    <tr key={turno.id} className={'turno-asistio'}>
                                        
                                        
                                        <td style={{ textAlign: 'left', paddingLeft: '20px' }}>{turno.dia}</td> 
                                        
                                        <td>{turno.hora}</td>
                                        <td>{turno.servicio?.nombre || "N/A"}</td>
                                        <td>
                                            {turno.profesional 
                                                ? `${turno.profesional.name} ${turno.profesional.lastname}` 
                                                : "Sin asignar"}
                                        </td>
                                        
                                        <td className="actions-cell"> 
                                            <button 
                                                onClick={() => openObsModal(turno)}
                                                className="btn-secundario" 
                                                style={{ width: '85px', minWidth: '85px' }}
                                            >
                                                {turno.observaciones ? "Ver/Editar" : "Agregar"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            
            
            <button onClick={() => navigate(-1)} className="btn-back">
                ← Volver a la Agenda
            </button>

            <ObservacionesModal
                show={showObsModal}
                onClose={closeObsModal}
                turno={selectedTurnoObs}
                onGuardar={handleGuardarObservacion}
                loading={loadingObs}
                error={errorObs}
            />
            
        </div>
    );
};

export default HistorialClinico;