import React from 'react';
import './turnoItem.css';
import "../Turnos/modalTurno.css";

const TurnoItem = ({ id, servicios, fecha, hora, duracion, usuarioDisplay, onEliminar, isAdminView }) => {
    let fechaFormateada = 'Fecha no disponible';
    if (fecha) {

        const parsedDate = new Date(fecha + 'T00:00:00');
        if (!isNaN(parsedDate.getTime())) {
            fechaFormateada = parsedDate.toLocaleDateString('es-AR');
        } else {

            console.error("Error: Fecha inválida recibida en TurnoItem:", fecha);
            fechaFormateada = 'Fecha inválida';
        }

    }

    return (
        <tr>
            {usuarioDisplay && <td>{usuarioDisplay}</td>}
            <td>{servicios}</td>
            <td>{fechaFormateada}</td>
            <td>{hora}</td>
            <td>{duracion}</td>
            <td className="actions-cell">
                <button
                    className="btn-eliminar"
                    onClick={() => onEliminar(id)}
                >
                    <i className="bi bi-trash"></i>
                    Eliminar
                </button>
            </td>
        </tr>
    );
};

export default TurnoItem;