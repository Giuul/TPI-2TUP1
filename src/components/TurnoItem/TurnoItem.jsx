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
    onVerHistorial,
    onToggleAsistencia,
    isAdminView,
    isProfesionalView,
    isUserView, 
}) => {
    let fechaFormateada = fecha
        ? new Date(fecha + "T00:00:00").toLocaleDateString("es-AR")
        : "Fecha no disponible";

    const isGestorView = isAdminView || isProfesionalView;
    const canEliminar = isAdminView || isUserView; 

    return (
        <tr>
            {isGestorView && <td>{usuarioDisplay}</td>}
            {isGestorView && <td>{profesionalDisplay}</td>}

            <td>{servicios}</td>
            <td>{fechaFormateada}</td>
            <td>{hora}</td>
            <td>{duracion}</td>

            {/* Columna de Asistencia (Solo para Gestores) */}
            {isGestorView && (
                <td>
                    <button 
                        className={asistio ? "btn-asistio" : "btn-no-asistio"}
                        onClick={() => onToggleAsistencia(id, asistio)}
                    >
                        {asistio ? "ASISTIÓ" : "NO ASISTIÓ"}
                    </button>
                </td>
            )}

            {/* Columna de Acciones - USANDO .actions-cell PARA APILAMIENTO */}
            <td>
                {/* Botón de Historial (Solo para Gestores) */}
                {isGestorView && dniusuario && onVerHistorial && (
                    <button
                        className="btn-secundario btn-historial"
                        onClick={() => onVerHistorial(dniusuario)}
                        title="Ver Historial Clínico del paciente"
                    >
                        Historial
                    </button>
                )}
                
                {/* Botón de Eliminar (Admin y Usuario) */}
                {canEliminar && (
                    <button className="btn-eliminar" onClick={() => onEliminar(id)}>
                        Eliminar
                    </button>
                )}
            </td>
        </tr>
    );
};

export default TurnoItem;