import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ListaSesiones from '../components/ListaSesiones/Listasesiones';
import ObservacionModal from '../components/ListaSesiones/ObservacionModal';

const HistorialClinico = () => {
    const { dni } = useParams();
    const navigate = useNavigate();

    const [patientData, setPatientData] = useState(null);
    const [sesiones, setSesiones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [currentProfessional, setCurrentProfessional] = useState({ name: "N/A", id: null });

    useEffect(() => {
        const fetchHistorial = async () => {
            const token = localStorage.getItem('authtoken');
            if (!token) return navigate('/login');

            try {
                const decodedToken = jwtDecode(token);
                const role = decodedToken.role;
                const name = decodedToken.name || "N/A";
                const id = decodedToken.id || null;
                setCurrentProfessional({ name, id });

                if (!["profesional", "admin", "superadmin"].includes(role)) {
                    throw new Error("Acceso denegado. Solo personal autorizado puede ver historiales.");
                }
            } catch (e) {
                setError("Error de autenticación. Por favor, vuelve a iniciar sesión.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/patients/${dni}/sessions`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.status === 404) throw new Error(`Paciente con DNI ${dni} no encontrado.`);
                if (!response.ok) throw new Error(`Error al cargar historial (${response.status})`);

                const data = await response.json();
                setPatientData(data.patient);
                setSesiones(data.sessions);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHistorial();
    }, [dni, navigate]);

    const openModalGeneral = () => {
        if (sesiones.length === 0) {
            const nuevaSesion = {
                id: 'temp',
                observaciones: '',
                profesional: currentProfessional,
                createdAt: new Date()
            };
            setSelectedSession(nuevaSesion);
            setShowModal(true);
            return;
        }
        setSelectedSession(sesiones[0]);
        setShowModal(true);
    };

    const handleGuardarObservacion = async (sessionId, observaciones) => {
        const token = localStorage.getItem("authtoken");

        try {
            let updatedSession;

            if (sessionId === 'temp') {
                const response = await fetch(`http://localhost:3000/patients/${dni}/sessions`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ descripcion: observaciones })
                });

                if (!response.ok) throw new Error("Error al crear la nueva sesión");

                const data = await response.json();
                updatedSession = data.session;
            } else {
                const response = await fetch(`http://localhost:3000/sessions/${sessionId}/observacion`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ observaciones })
                });

                if (!response.ok) throw new Error("Error al guardar observación");
                updatedSession = await response.json();
            }

            setSesiones(prev => {
                const index = prev.findIndex(s => s.id === updatedSession.id);
                if (index !== -1) {
                    return prev.map(s => s.id === updatedSession.id ? updatedSession : s);
                } else {
                    return [updatedSession, ...prev];
                }
            });

            setShowModal(false);
        } catch (err) {
            alert("No se pudo guardar la observación: " + err.message);
        }
    };


    if (loading) return <div className="historial-container"><p>Cargando Historial Clínico...</p></div>;
    if (error) return <div className="historial-container"><p className="error-message">Error: {error}</p></div>;
    if (!patientData) return <div className="historial-container"><p className="error-message">No se pudieron cargar los datos del paciente.</p></div>;

    return (
        <div className="historial-container">
            <h2 className="historial-title">
                Historial Clínico de {patientData.name} {patientData.lastname}
            </h2>
            <div className="patient-info-box">
                <p><strong>DNI:</strong> {patientData.id}</p>
                <p><strong>Email:</strong> {patientData.email}</p>
                <p><strong>Teléfono:</strong> {patientData.tel}</p>
            </div>

            <div className="sessions-section">
                <ListaSesiones
                    sesiones={sesiones}
                    onObservacionGuardada={(updatedSession) => {
                        setSesiones(prev =>
                            prev.map(s => (s.id === updatedSession.id ? updatedSession : s))
                        );
                    }}
                />
            </div>

            <button onClick={openModalGeneral} className="btn-back">Observaciones</button>

            <button onClick={() => navigate(-1)} className="btn-back">
                Volver a la Agenda
            </button>

            {showModal && selectedSession && (
                <ObservacionModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    session={selectedSession}
                    onGuardar={handleGuardarObservacion}
                    sesiones={sesiones}
                    setSession={setSelectedSession}
                />
            )}
        </div>
    );
};

export default HistorialClinico;
