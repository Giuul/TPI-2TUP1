import React, { useState, useEffect } from 'react';
import './listasesiones.css';

const ObservacionModal = ({ show, onClose, session, onGuardar, sesiones, setSession }) => {
    const [observacion, setObservacion] = useState("");

    useEffect(() => {
        if (session) setObservacion(session.observaciones || "");
    }, [session]);

    if (!show || !session) return null;

    const handleSave = () => {
        if (!observacion.trim()) {
            alert("La observación no puede estar vacía.");
            return;
        }
        onGuardar(session.id, observacion);
    };

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

                {sesiones && sesiones.length > 1 && (
                    <div style={{ marginBottom: "10px" }}>
                        <label>Seleccionar sesión: </label>
                        <select
                            value={session.id}
                            onChange={(e) => {
                                const nuevaSesion = sesiones.find(s => s.id.toString() === e.target.value);
                                setSession(nuevaSesion);
                            }}
                        >
                            {sesiones.map(s => (
                                <option key={s.id} value={s.id}>
                                    {new Date(s.createdAt).toLocaleDateString('es-AR')} | {s.profesional?.name || 'N/A'}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="session-details">
                    <p><strong>Profesional:</strong> {session.profesional?.name || 'N/A'}</p>
                    <p><strong>Fecha:</strong> {formatSessionDate(session.createdAt)}</p>
                </div>

                <textarea
                    value={observacion}
                    onChange={(e) => setObservacion(e.target.value)}
                    placeholder="Escribe aquí las observaciones..."
                />

                <div className="modal-actions">
                    <button onClick={onClose} className="modal-cancel-button">Cancelar</button>
                    <button onClick={handleSave} className="modal-confirm-button">Guardar</button>
                </div>
            </div>
        </div>
    );
};

export default ObservacionModal;
