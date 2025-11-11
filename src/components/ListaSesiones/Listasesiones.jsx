import React, { useState } from 'react';
import ObservacionModal from './ObservacionModal';
import './listasesiones.css';

const ListaSesiones = ({ sesiones, onObservacionGuardada }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);

    const openModal = (session) => {
        setSelectedSession(session);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedSession(null);
    };

    const handleGuardarObservacion = async (sessionId, observaciones) => {
        const token = localStorage.getItem("authtoken");
        try {
            let response, updatedSession;

            if (sessionId === 'temp') {
                alert("Para crear nuevas sesiones desde esta lista, usa el botón Observaciones general.");
                closeModal();
                return;
            }

            response = await fetch(`http://localhost:3000/sessions/${sessionId}/observacion`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ observaciones })
            });

            if (!response.ok) throw new Error("Error al guardar observación");

            updatedSession = await response.json();
            if (onObservacionGuardada) onObservacionGuardada(updatedSession);

            closeModal();
        } catch (err) {
            alert("No se pudo guardar la observación: " + err.message);
        }
    };

    if (!sesiones || sesiones.length === 0) {
        return <p className="no-sessions">No hay observaciones registradas.</p>;
    }

    const getFormattedDateTime = (timestamp) => {
        const date = new Date(timestamp);
        const fecha = date.toLocaleDateString('es-AR');
        const hora = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
        return { fecha, hora };
    };

    return (
        <div className="lista-sesiones-container">
            <h4>Historial de Sesiones</h4>
            {sesiones.map((session) => {
                const { fecha, hora } = getFormattedDateTime(session.createdAt);

                return (
                    <div key={session.id} className="session-item-design">
                        <div className="session-header">
                            <span className="session-date-time">
                                <strong>{fecha}</strong> | {hora}
                            </span>
                            <span className="session-professional">
                                Profesional: {session.profesional?.name || 'N/A'}
                            </span>
                        </div>

                        <div className="session-observacion">
                            <strong>Observación:</strong> {session.observaciones || "Sin registrar"}
                        </div>

                        <div className="session-action">
                            <button
                                onClick={() => openModal(session)}
                                className="btn-observaciones"
                            >
                                {session.observaciones ? "Editar observación" : "Agregar observación"}
                            </button>
                        </div>
                    </div>
                );
            })}

            {showModal && selectedSession && (
                <ObservacionModal
                    show={showModal}
                    onClose={closeModal}
                    session={selectedSession}
                    onGuardar={handleGuardarObservacion}
                    sesiones={sesiones}
                    setSession={setSelectedSession}
                />
            )}
        </div>
    );
};

export default ListaSesiones;
