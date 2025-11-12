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
    const fechaFormateada = fecha
        ? new Date(fecha + "T00:00:00").toLocaleDateString("es-AR")
        : "Fecha no disponible";

    const isGestorView = isAdminView || isProfesionalView;
    const canEliminar = isAdminView || isUserView;
    const showAsistenciaColumn = isGestorView;
    const canToggleAsistencia = isAdminView;
    const canAddObservaciones = isGestorView;

    const turnoDateTime = new Date(`${fecha}T${hora}`);
    const now = new Date();

    const esTurnoPasado = turnoDateTime < now;

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
                            {turnoDateTime > now ? (
                                <span className="pendiente-futuro">Pendiente</span>
                            ) : (
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
                                    >
                                        {asistio ? "Asistió" : "Pendiente"}
                                    </label>
                                </>
                            )}
                        </>
                    ) : (
                        <span>{asistio ? "Asistió" : "Pendiente"}</span>
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
                            disabled={esTurnoPasado || asistio}
                            title={esTurnoPasado ? "No se puede editar un turno pasado o de hoy" : ""}
                        >
                            Editar
                        </button>
                    )}

                    {canEliminar && (
                        <button
                            className="btn-eliminar"
                            onClick={() => onEliminar(id)}
                            disabled={esTurnoPasado}
                            title={esTurnoPasado ? "No se puede eliminar un turno pasado o de hoy" : ""}
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
