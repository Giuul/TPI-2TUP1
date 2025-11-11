import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TurnoItem from "../TurnoItem/TurnoItem";
import "./TurnosCalendarView.css";

const TurnosCalendarView = ({
    turnos,
    loading,
    error,
    currentUserRole,
    onDateChange,
    selectedDate,
    openTurnoDeleteModal,
    toggleAsistencia,
    handleVerHistorial,
    openObservacionesModal
}) => {

    const isGestorView =
        currentUserRole === "admin" ||
        currentUserRole === "superadmin" ||
        currentUserRole === "profesional";

    const showAsistenciaColumn = isGestorView;
    const isAdminOrSuperAdmin =
        currentUserRole === "admin" || currentUserRole === "superadmin";

    if (loading) return <p className="estado-carga">Cargando turnos...</p>;
    if (error) return <p className="estado-error">{error}</p>;

    const selectedDateObj = selectedDate
        ? (() => {
            const [year, month, day] = selectedDate.split("-").map(Number);
            return new Date(year, month - 1, day);
        })()
        : null;

    return (
        <div className="agenda-container">
            <div className="calendar-controls">
                <label htmlFor="date-selector" className="calendar-label">
                    📅 Seleccionar Día:
                </label>

                <DatePicker
                    id="date-selector"
                    selected={selectedDateObj}
                    onChange={(date) => {
                        if (date) {
                            const localDate = new Date(
                                date.getFullYear(),
                                date.getMonth(),
                                date.getDate()
                            );
                            const formattedDate = localDate.toISOString().split("T")[0];
                            onDateChange(formattedDate);
                        }
                    }}
                    dateFormat="dd/MM/yyyy"
                    className="date-input"
                    placeholderText="Elegí una fecha"
                    calendarStartDay={1}
                />
            </div>

            {turnos.length === 0 ? (
                <p className="sin-turnos">
                    No hay turnos programados para el día {selectedDate}.
                </p>
            ) : (
                <div className="tabla-turnos-container">
                    <table className="turnos-table">
                        <thead>
                            <tr>
                                {isGestorView && <th>Usuario</th>}
                                {isGestorView && <th>Profesional</th>}
                                <th>Servicio</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Duración</th>
                                {showAsistenciaColumn && <th>Asistencia</th>}
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {turnos.map((turno) => (
                                <TurnoItem
                                    key={turno.id}
                                    {...turno}
                                    onEliminar={openTurnoDeleteModal}
                                    onToggleAsistencia={toggleAsistencia}
                                    isAdminView={isAdminOrSuperAdmin}
                                    isProfesionalView={
                                        currentUserRole === "profesional"
                                    }
                                    isUserView={false}
                                    onVerHistorial={handleVerHistorial}
                                    onAbrirObservaciones={openObservacionesModal}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TurnosCalendarView;