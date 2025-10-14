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
    onEliminar,
    onEditar,
    isAdminView,
    isProfesionalView,
    onVerHistorial,
    dniusuario,
}) => {
    let fechaFormateada = fecha
        ? new Date(fecha + "T00:00:00").toLocaleDateString("es-AR")
        : "Fecha no disponible";

    return (
        <tr>
            {isAdminView && <td>{usuarioDisplay}</td>}
            {isAdminView && <td>{profesionalDisplay}</td>}

            <td>{servicios}</td>
            <td>{fechaFormateada}</td>
            <td>{hora}</td>
            <td>{duracion}</td>
            <td className="actions-cell">
                {isProfesionalView && dniusuario && (
                    <button
                        className="btn-historial"
                        onClick={() => onVerHistorial(dniusuario)}
                    >
                        <i className="bi bi-file-earmark-medical"></i> Ver Historial
                    </button>
                )}

                {isAdminView && (
                    <button
                        className="btn-editar"
                        onClick={() => onEditar({ id, fecha, hora })}
                    >
                        <i className="bi bi-pencil-square"></i> Editar
                    </button>
                )}

                <button className="btn-eliminar" onClick={() => onEliminar(id)}>
                    <i className="bi bi-trash"></i> Eliminar
                </button>
            </td>
        </tr>
    );
};

export default TurnoItem;
