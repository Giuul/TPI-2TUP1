import React from "react";
import TurnoItem from "../TurnoItem/TurnoItem"; 

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
    
    const isGestorView = currentUserRole === "admin" || currentUserRole === "superadmin" || currentUserRole === "profesional";
    const showAsistenciaColumn = isGestorView; 
    const isAdminOrSuperAdmin = currentUserRole === "admin" || currentUserRole === "superadmin";

    if (loading) return <p>Cargando turnos...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <>
            <div className="calendar-controls" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label htmlFor="date-selector" style={{ fontWeight: 'bold' }}>📅 Seleccionar Día:</label>
                <input
                    type="date"
                    id="date-selector"
                    value={selectedDate}
                    onChange={(e) => onDateChange(e.target.value)}
                    className="date-input"
                    style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
            </div>

            {turnos.length === 0 ? (
                <p>No hay turnos programados para el día {selectedDate}.</p>
            ) : (
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
                                isProfesionalView={currentUserRole === "profesional"}
                                isUserView={false}
                                onVerHistorial={handleVerHistorial}
                                onAbrirObservaciones={openObservacionesModal}
                            />
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );
};

export default TurnosCalendarView;