import React, { useState } from 'react';
import ObservacionModal from './ObservacionModal'; 

const ListaSesiones = ({ sesiones }) => {
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

    if (!sesiones || sesiones.length === 0) {
        return <p className="no-sessions">No hay sesiones registradas en el historial.</p>;
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
                        <div className="session-action">
                            <button 
                                onClick={() => openModal(session)} 
                                className="btn-observaciones"
                            >
                                Observaciones
                            </button>
                        </div>
                    </div>
                );
            })}
            
            <ObservacionModal 
                show={showModal}
                onClose={closeModal}
                session={selectedSession}
            />
        </div>
    );
};

export default ListaSesiones;