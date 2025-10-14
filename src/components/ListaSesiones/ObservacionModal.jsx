import React from 'react';

const ObservacionModal = ({ show, onClose, session }) => {
    if (!show || !session) {
        return null;
    }

    const formatSessionDate = (timestamp) => {
        if (!timestamp) return 'Fecha no disponible';
        const date = new Date(timestamp);
        return date.toLocaleDateString('es-AR') + ' a las ' + 
               date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="modal-overlay"> 
            <div className="modal-content observacion-modal"> 
                <h3 className="modal-title">Observaciones de la Sesión</h3>
                
                <div className="session-details">
                    <p><strong>Profesional:</strong> {session.profesional?.name || 'N/A'}</p>
                    <p><strong>Fecha:</strong> {formatSessionDate(session.createdAt)}</p>
                </div>
                
                <div className="observacion-box">
                    <p>{session.observacion || "No se registraron observaciones para esta sesión."}</p>
                </div>

                <div className="modal-actions">
                    <button onClick={onClose} className="modal-confirm-button">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ObservacionModal;