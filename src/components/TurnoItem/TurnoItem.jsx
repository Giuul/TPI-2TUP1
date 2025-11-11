import React from "react";

const TurnoItem = ({
    id,
    servicios,
    fecha,
    hora,
    duracion,
    usuarioDisplay,
    profesionalDisplay,
    dniusuario,
    asistio,
    observaciones,
    onEliminar,
    onVerHistorial,
    onToggleAsistencia,
    onAbrirObservaciones,
    isAdminView,
    isProfesionalView, 
    isUserView, 
}) => {
    let fechaFormateada = fecha
        ? new Date(fecha + "T00:00:00").toLocaleDateString("es-AR")
        : "Fecha no disponible";

    const isGestorView = isAdminView || isProfesionalView;
    const canEliminar = isAdminView || isUserView; 
    const showAsistenciaColumn = isGestorView; 
    const canToggleAsistencia = isAdminView; 
    const canAddObservaciones = isGestorView; 


    return (
        <tr>
            {isGestorView && <td>{usuarioDisplay}</td>}
            {isGestorView && <td>{profesionalDisplay}</td>}

            <td>{servicios}</td>
            <td>{fechaFormateada}</td>
            <td>{hora}</td>
            <td>{duracion}</td>

            {showAsistenciaColumn && (
                <td className="asistencia-cell">
                    {!isProfesionalView ? (
                        <>
                            <input
                                type="checkbox" 
                                checked={asistio}
                                onChange={() => onToggleAsistencia(id, asistio)}
                                id={`asistio-${id}`}
                                className="asistencia-checkbox"
                                disabled={!canToggleAsistencia} 
                                title={asistio ? "Marcar como NO ASISTIÓ" : "Marcar como ASISTIÓ"}
                            />
                            <label 
                                htmlFor={`asistio-${id}`} 
                                className="asistencia-label" 
                                style={{ cursor: canToggleAsistencia ? 'pointer' : 'default' }}
                            >
                                {asistio ? "Asistió" : "Pendiente"}
                            </label>
                        </>
                    ) : (
                        
                        <span>{asistio ? "Asistió" : "Pendiente"}</span>
                    )}
                </td>
            )}

            <td>
                <div className="actions-cell">
                    {isGestorView && dniusuario && onVerHistorial && (
                        <button
                            className="btn-secundario btn-historial"
                            onClick={() => onVerHistorial(dniusuario)}
                            title="Ver Historial Clínico del paciente"
                        >
                            Historial
                        </button>
                    )}
                    
                    {canAddObservaciones && onAbrirObservaciones && (
                        <button
                            className="btn-principal btn-observaciones" 
                            onClick={() => onAbrirObservaciones({ id, observaciones, fecha, hora, usuarioDisplay, profesionalDisplay })}
                            title="Agregar o editar observaciones del turno"
                        >
                            {observaciones ? "Observaciones" : "Observaciones"}
                        </button>
                    )}
                    
                    {canEliminar && (
                        <button className="btn-eliminar" onClick={() => onEliminar(id)}>
                            Eliminar
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default TurnoItem;