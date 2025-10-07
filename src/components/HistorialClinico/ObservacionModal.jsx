import React from 'react';

const ObservacionModal = ({ show, onClose, session }) => {
    if (!show || !session) {
        return null;
    }

    const formattedDate = new Date(session.createdAt).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const formattedTime = new Date(session.createdAt).toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="modal-overlay">
            <div className="modal-content large-modal">
                <h3>Detalle de la Sesión</h3>
                <p><strong>Fecha y Hora:</strong> {formattedDate} a las {formattedTime}</p>
                <p><strong>Profesional:</strong> {session.profesional?.name || 'N/A'}</p>
                
                <div className="session-full-description">
                    <h4>Observaciones:</h4>
                    <p>{session.observaciones}</p>
                </div>

                <div className="modal-actions">
                    <button onClick={onClose} className="modal-confirm-button">Cerrar</button>
                </div>
            </div>
        </div>
    );
};

export default ObservacionModal;