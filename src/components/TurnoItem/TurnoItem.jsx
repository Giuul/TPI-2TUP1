import React from "react";
import "./turnoItem.css";

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
    onEliminar,
    onEditar,
    onVerHistorial, 
    onToggleAsistencia,
    isAdminView,
    isProfesionalView,
}) => {
    let fechaFormateada = fecha
        ? new Date(fecha + "T00:00:00").toLocaleDateString("es-AR")
        : "Fecha no disponible";

    
    const isGestorView = isAdminView || isProfesionalView;
    const showAsistenciaCheckbox = isAdminView; 

    const turnoParaEditar = { id, fecha, hora, dniusuario }; 

    return (
        <tr>
            {isGestorView && <td>{usuarioDisplay}</td>}
            {isGestorView && <td>{profesionalDisplay}</td>}

            <td>{servicios}</td>
            <td>{fechaFormateada}</td>
            <td>{hora}</td>
            <td>{duracion}</td>

            {showAsistenciaCheckbox && (
                <td>
                    <input
                        type="checkbox"
                        checked={asistio}
                        onChange={() => onToggleAsistencia(id, asistio)}
                        title={asistio ? "Marcar como Faltó" : "Marcar como Asistió"}
                    />
                </td>
            )}

            <td className="actions-cell">
                {isProfesionalView && dniusuario && onVerHistorial && (
                    <button
                        className="btn-historial"
                        onClick={() => onVerHistorial(dniusuario)} 
                        title="Ver Historial Clínico del paciente"
                    >
                        <i className="bi bi-file-earmark-medical"></i> Ver Historial
                    </button>
                )}

                {(isAdminView || isProfesionalView) && ( 
                    <button
                        className="btn-editar"
                        onClick={() => onEditar(turnoParaEditar)}
                    >
                        <i className="bi bi-pencil-square"></i> Editar
                    </button>
                )}
                
                {(isAdminView || isProfesionalView) && (
                    <button className="btn-eliminar" onClick={() => onEliminar(id)}>
                        <i className="bi bi-trash"></i> Eliminar
                    </button>
                )}
                
                {!(isAdminView || isProfesionalView) && ( 
                    <>
                        <button
                            className="btn-editar"
                            onClick={() => onEditar(turnoParaEditar)}
                        >
                            <i className="bi bi-pencil-square"></i> Editar
                        </button>
                        <button className="btn-eliminar" onClick={() => onEliminar(id)}>
                            <i className="bi bi-trash"></i> Eliminar
                        </button>
                    </>
                )}
            </td>
        </tr>
    );
};

export default TurnoItem;