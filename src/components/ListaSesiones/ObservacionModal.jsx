import React, { useState, useEffect } from 'react';
import './listasesiones.css';

const ObservacionesModal = ({ 
    show, 
    onClose, 
    turno, 
    onGuardar, 
    loading,
    error
}) => {
    const [observacion, setObservacion] = useState(turno?.observaciones || "");

    
    useEffect(() => {
        if (turno) {
            setObservacion(turno.observaciones || ""); 
        }
    }, [turno]); 

    if (!show || !turno) return null;

    const handleSave = () => {
        onGuardar(turno.id, observacion);
    };
    
    const getTurnoDateTime = () => {
        if (turno.fecha && turno.hora) {
             return `${turno.fecha} ${turno.hora}`; 
        }
        if (turno.createdAt) {
             const date = new Date(turno.createdAt);
             return date.toLocaleDateString('es-AR') + ' a las ' +
                date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
        }
        return 'Fecha no disponible';
    };


    return (
        <div className="modal-overlay">
            <div className="modal-content observacion-modal">
                <h3 className="modal-title">Observaciones </h3>

                <div className="session-details">
                    <p><strong>Usuario:</strong> {turno.usuarioDisplay || 'N/A'}</p>
                    <p><strong>Profesional:</strong> {turno.profesionalDisplay || 'N/A'}</p>
                    <p><strong>Fecha/Hora:</strong> {getTurnoDateTime()}</p>
                </div>
                
                {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

                <textarea
                    value={observacion}
                    onChange={(e) => setObservacion(e.target.value)} 
                    placeholder="Escribe aquí las observaciones..."
                    rows="5"
                />

                <div className="modal-actions">
                    
                    <button onClick={onClose} className="modal-cancel-button" disabled={loading}>Cancelar</button>
                    <button onClick={handleSave} className="modal-confirm-button" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ObservacionesModal;