import React from "react";
import "./TurnoItem.css";

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
    onEditarTurno,
    isAdminView,
    isProfesionalView,
    isUserView,
}) => {
    
    const now = new Date();
    const turnoDateTime = new Date(`${fecha}T${hora}`);

    const todayISO = now.toISOString().split("T")[0];
    const turnoDateISO = fecha;

    const esTurnoDeHoy = turnoDateISO === todayISO;
    const esTurnoPasado = turnoDateTime < now;

    
    const fechaFormateada = fecha
        ? new Date(fecha + "T00:00:00").toLocaleDateString("es-AR")
        : "Fecha no disponible";

    const isGestorView = isAdminView || isProfesionalView;
    const canEliminar = isAdminView || isUserView;
    const showAsistenciaColumn = isGestorView;
    const canToggleAssistancePermission = isAdminView; 
    const canAddObservaciones = isGestorView;


    return (
        <tr className="turno-row">
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
                            {esTurnoDeHoy || esTurnoPasado ? (
                                <>
                                    <input
                                        type="checkbox"
                                        checked={asistio}
                                        onChange={() => onToggleAsistencia(id, asistio)}
                                        id={`asistio-${id}`}
                                        className="asistencia-checkbox"
                                        disabled={!esTurnoDeHoy || !canToggleAssistancePermission}
                                        title={esTurnoDeHoy ? (asistio ? "Marcar como NO ASISTIÓ" : "Marcar como ASISTIÓ") : "Solo se puede editar la asistencia hoy"}
                                    />
                                    <label
                                        htmlFor={`asistio-${id}`}
                                        className="asistencia-label"
                                    >
                                        {asistio ? "Asistió" : "Pendiente"}
                                    </label>
                                </>
                            ) : (
                                <span className="pendiente-futuro">Pendiente</span>
                            )}
                        </>
                    ) : (
                        <span>{asistio ? "Asistió" : (esTurnoPasado ? "No Asistió" : "Pendiente")}</span>
                    )}
                </td>
            )}


            <td>
                <div className="actions-cell">
                    {isGestorView && dniusuario && (
                        <button
                            className="btn-secundario btn-historial"
                            onClick={() => onVerHistorial(dniusuario)}
                        >
                            Historial
                        </button>
                    )}

                    {canAddObservaciones && (
                        <button
                            className="btn-principal btn-observaciones"
                            onClick={() =>
                                onAbrirObservaciones({
                                    id,
                                    observaciones,
                                    fecha,
                                    hora,
                                    usuarioDisplay,
                                    profesionalDisplay,
                                })
                            }
                        >
                            Observaciones
                        </button>
                    )}

                    {isGestorView && (
                        <button
                            className="btn-editar"
                            onClick={() =>
                                onEditarTurno({
                                    id,
                                    servicios,
                                    fecha,
                                    hora,
                                    duracion,
                                    usuarioDisplay,
                                    profesionalDisplay,
                                    observaciones,
                                })
                            }
                            
                            disabled={(!esTurnoDeHoy && esTurnoPasado) || asistio}
                            title={(!esTurnoDeHoy && esTurnoPasado) ? "No se puede editar un turno anterior a hoy" : (asistio ? "No se puede editar un turno que ya asistió" : "")}
                        >
                            Editar
                        </button>
                    )}

                    {canEliminar && (
                        <button
                            className="btn-eliminar"
                            onClick={() => onEliminar(id)}
                            disabled={!esTurnoDeHoy}
                            title={!esTurnoDeHoy ? "Solo se pueden eliminar turnos de hoy" : ""}
                        >
                            Eliminar
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default TurnoItem;