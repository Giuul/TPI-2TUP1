import React, { useState, useEffect } from "react";
import TurnoItem from "../TurnoItem/TurnoItem";
import TurnosCalendarView from "../TurnosCalendario/TurnosCalendario";
import ObservacionesModal from "../ListaSesiones/ObservacionModal";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import ModalPortal from "../Turnos/ModalPortal";
import './turnos.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Turnos = () => {
    const [listaDeTurnos, setListaDeTurnos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUserRole, setCurrentUserRole] = useState("user");
    
    // NUEVO ESTADO: Almacena el nombre del usuario logueado
    const [currentUserName, setCurrentUserName] = useState(null); 

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

    const [showEditModal, setShowEditModal] = useState(false);
    const [turnoToEdit, setTurnoToEdit] = useState(null);

    const [showTurnoDeleteModal, setShowTurnoDeleteModal] = useState(false);
    const [turnoToDeleteId, setTurnoToDeleteId] = useState(null);

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [showObservacionesModal, setShowObservacionesModal] = useState(false);
    const [turnoObservaciones, setTurnoObservaciones] = useState(null);
    const [loadingObservaciones, setLoadingObservaciones] = useState(false);
    const [errorObservaciones, setErrorObservaciones] = useState(null);

    const navigate = useNavigate();

    const handleVerHistorial = (dniPaciente) => {
        if (dniPaciente) {
            navigate(`/historial/${dniPaciente}`);
        } else {
            setError("No se pudo obtener el DNI del paciente para el historial.");
        }
    };

    const fetchTurnos = async (dateToFetch = selectedDate) => {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("authtoken");
        let userRole = "user";
        let userName = null; // Variable local para el nombre

        if (!token) {
            setError("No estás autenticado.");
            setLoading(false);
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            userRole = decodedToken.role || "user";
            // Obtener el nombre para el filtrado si es profesional
            if (userRole === "profesional" && decodedToken.name && decodedToken.lastname) {
                userName = `${decodedToken.name} ${decodedToken.lastname}`;
            }
        } catch {
            setError("Error al verificar la sesión.");
            setLoading(false);
            return;
        }

        setCurrentUserRole(userRole);
        setCurrentUserName(userName); // Actualizar el estado con el nombre del profesional

        const isGestor = userRole === "admin" || userRole === "superadmin" || userRole === "profesional";
        const url = isGestor
            ? `http://localhost:3000/admin/turnos?dia=${dateToFetch}`
            : "http://localhost:3000/misturnos";

        try {
            const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) throw new Error("Error al obtener los turnos");

            const data = await res.json();
            let turnosFinales = data;

            if (!isGestor) {
                // Lógica de filtrado para Usuario (mantiene solo turnos futuros)
                const today = new Date().toISOString().split("T")[0];
                const now = new Date();
                const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

                turnosFinales = data.filter(turno => {
                    if (!turno.dia) return false;
                    if (turno.dia > today) return true;
                    if (turno.dia === today) return turno.hora >= currentTime;
                    return false;
                });
            }

            const turnosTransformados = turnosFinales.map(turno => {
                const base = {
                    id: turno.id,
                    dniusuario: turno.dniusuario,
                    servicios: turno.servicio?.nombre || "Servicio no especificado",
                    fecha: turno.dia,
                    hora: turno.hora,
                    duracion: turno.servicio?.duracion ? `${turno.servicio.duracion} minutos` : "N/A",
                    profesionalDisplay: turno.profesional ? `${turno.profesional.name} ${turno.profesional.lastname}` : "Sin asignar",
                    asistio: turno.asistio,
                    observaciones: turno.observaciones,
                    createdAt: turno.createdAt,
                };

                if (isGestor) {
                    const usuarioInfo = turno.usuario
                        ? `${turno.usuario.name} ${turno.usuario.lastname} (DNI: ${turno.usuario.id})`
                        : `DNI: ${turno.dniusuario}`;
                    return { ...base, usuarioDisplay: usuarioInfo };
                }

                return base;
            });

            // FILTRADO ADICIONAL PARA PROFESIONALES:
            let turnosFiltrados = turnosTransformados;
            if (userRole === "profesional" && userName) {
                turnosFiltrados = turnosTransformados.filter(turno => 
                    turno.profesionalDisplay === userName
                );
            }

            setListaDeTurnos(turnosFiltrados);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
        fetchTurnos(newDate);
    };

    useEffect(() => { fetchTurnos(selectedDate); }, []);

    const [serviciosDisponibles, setServiciosDisponibles] = useState([]);

    useEffect(() => {
        const fetchServicios = async () => {
            try {
                const token = localStorage.getItem("authtoken"); // Usar 'authtoken' como en fetchTurnos
                const res = await fetch("http://localhost:3000/servicios", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                setServiciosDisponibles(data);
            } catch (error) {
                console.error("Error al cargar servicios:", error);
            }
        };

        fetchServicios();
    }, []);


    const openTurnoDeleteModal = (id) => {
        setTurnoToDeleteId(id);
        setShowTurnoDeleteModal(true);
    };

    const closeTurnoDeleteModal = () => {
        setShowTurnoDeleteModal(false);
        setTurnoToDeleteId(null);
    };

    const toggleAsistencia = async (id, currentStatus) => {
        // ... (Lógica de toggleAsistencia sin cambios)
        const newStatus = !currentStatus;
        const token = localStorage.getItem("authtoken");

        try {
            const res = await fetch(`http://localhost:3000/admin/turnos/${id}/asistencia`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ asistio: newStatus }),
            });
            if (!res.ok) throw new Error("Error al actualizar la asistencia");

            setListaDeTurnos(prev => prev.map(t => t.id === id ? { ...t, asistio: newStatus } : t));
            setSuccessMessage(`Asistencia actualizada a ${newStatus ? 'ASISTIO' : 'NO ASISTIO'}.`);
            setShowSuccessModal(true);
        } catch (err) {
            setError(err.message);
        }
    };

    const openEditModal = (turno) => {
        // Si el rol es profesional, no se debe abrir el modal de edición
        if (currentUserRole === "profesional") return; 

        const servicioEncontrado = serviciosDisponibles.find(
            (s) => s.nombre.toLowerCase() === turno.servicios.toLowerCase()
        );

        setTurnoToEdit({
            ...turno,
            servicioId: servicioEncontrado ? servicioEncontrado.id : "",
        });

        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setTurnoToEdit(null);
    };

    const handleSaveEdit = async (editedTurno) => {
        // ... (Lógica de handleSaveEdit sin cambios)
        try {
            const token = localStorage.getItem("authtoken"); // Usar 'authtoken' aquí
            
            const res = await fetch(`http://localhost:3000/admin/turnos/${editedTurno.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    dia: editedTurno.fecha,
                    hora: editedTurno.hora,
                    idservicio: Number(editedTurno.servicioId),
                }),
            });

            const data = await res.json();
            console.log("Respuesta backend:", data);

            if (!res.ok) {
                throw new Error(data.mensaje || "Error al guardar los cambios del turno");
            }

            await fetchTurnos(selectedDate);

            setShowEditModal(false);
        } catch (error) {
            console.error("Error al editar turno:", error);
            alert("No se pudo guardar el turno. " + error.message);
        }
    };

    const confirmDeleteTurno = async () => {
        // ... (Lógica de confirmDeleteTurno sin cambios)
        if (!turnoToDeleteId) return;
        setLoading(true);
        try {
            const token = localStorage.getItem("authtoken");
            const res = await fetch(`http://localhost:3000/misturnos/${turnoToDeleteId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) throw new Error("Error al eliminar el turno");
            setListaDeTurnos(prev => prev.filter(t => t.id !== turnoToDeleteId));
            setSuccessMessage("Turno eliminado exitosamente.");
            setShowSuccessModal(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            closeTurnoDeleteModal();
        }
    };

    const openObservacionesModal = (turno) => {
        setTurnoObservaciones(turno);
        setShowObservacionesModal(true);
        setErrorObservaciones(null);
    };

    const closeObservacionesModal = () => {
        setShowObservacionesModal(false);
        setTurnoObservaciones(null);
    };

    const handleSaveObservaciones = async (id, texto) => {
        // ... (Lógica de handleSaveObservaciones sin cambios)
        setLoadingObservaciones(true);
        const token = localStorage.getItem("authtoken");
        try {
            const res = await fetch(`http://localhost:3000/admin/turnos/${id}/observaciones`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ observaciones: texto }),
            });
            if (!res.ok) throw new Error("Error al guardar las observaciones");
            setListaDeTurnos(prev => prev.map(t => t.id === id ? { ...t, observaciones: texto } : t));
            setSuccessMessage("Observaciones guardadas exitosamente.");
            setShowSuccessModal(true);
            closeObservacionesModal();
        } catch (err) {
            setErrorObservaciones(err.message);
        } finally {
            setLoadingObservaciones(false);
        }
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
        setSuccessMessage("");
    };

    const isGestorView = currentUserRole === "admin" || currentUserRole === "superadmin" || currentUserRole === "profesional";
    const isAdminView = currentUserRole === "admin" || currentUserRole === "superadmin"; // Variable para los botones de admin
    const isProfesionalView = currentUserRole === "profesional"; // Nueva variable para profesional
    const isUserView = currentUserRole === "user";

    if (loading) return <p>Cargando turnos...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className="turnos-container">
            <h2 className="turnos-title">{isGestorView ? "GESTIÓN DE TURNOS" : "MIS TURNOS"}</h2>

            {isAdminView && ( // Usamos isAdminView para el botón PROGRAMAR TURNO
                <div className="botones-turnos">
                    <button className="btn-principal" onClick={() => navigate("/programar-turnos-admin")}>
                        PROGRAMAR TURNO
                    </button>
                </div>
            )}

            {isGestorView ? (
                <TurnosCalendarView
                    turnos={listaDeTurnos}
                    loading={loading}
                    error={error}
                    currentUserRole={currentUserRole}
                    onDateChange={handleDateChange}
                    selectedDate={selectedDate}
                    openTurnoDeleteModal={openTurnoDeleteModal}
                    toggleAsistencia={toggleAsistencia}
                    handleVerHistorial={handleVerHistorial}
                    openObservacionesModal={openObservacionesModal}
                    openEditModal={openEditModal}
                />
            ) : (
                listaDeTurnos.length === 0 ? (
                    <p>No hay turnos programados.</p>
                ) : (
                    <table className="turnos-table">
                        <thead>
                            <tr>
                                <th>Servicio</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Duración</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listaDeTurnos.map(turno => (
                                <TurnoItem
                                    key={turno.id}
                                    {...turno}
                                    onEliminar={openTurnoDeleteModal}
                                    onEditarTurno={openEditModal}
                                    isUserView={isUserView}
                                />
                            ))}
                        </tbody>
                    </table>
                )
            )}

            {/* Modals (sin cambios) */}

            <ModalPortal
                isOpen={showTurnoDeleteModal}
                onClose={closeTurnoDeleteModal}
                title="Confirmar eliminación"
                actions={
                    <>
                        <button className="modal-cancel-button" onClick={closeTurnoDeleteModal}>Cancelar</button>
                        <button className="modal-confirm-button" onClick={confirmDeleteTurno}>Eliminar</button>
                    </>
                }
            >
                <p>¿Estás seguro que quieres eliminar este turno? Esta acción es irreversible.</p>
            </ModalPortal>

            <ModalPortal
                isOpen={showSuccessModal}
                onClose={closeSuccessModal}
                title={successMessage}
                actions={<button className="modal-confirm-button" onClick={closeSuccessModal}>Aceptar</button>}
            />

            <ModalPortal
                isOpen={showEditModal}
                onClose={closeEditModal}
                title="Editar Turno"
                className="modal-edit"
                actions={
                    <>
                        <button className="modal-cancel-button" onClick={closeEditModal}>Cancelar</button>
                        <button
                            className="modal-confirm-button"
                            onClick={() => handleSaveEdit(turnoToEdit)}
                            disabled={!turnoToEdit?.hora || !turnoToEdit?.fecha}
                        >
                            Guardar
                        </button>
                    </>
                }
            >
                <div className="modal-body">
                    <p className="modal-info">
                        Solo se puede modificar la <strong>fecha</strong> y la <strong>hora</strong> del turno.
                    </p>

                    <label>Servicio</label>
                    <input
                        type="text"
                        value={turnoToEdit?.servicios || ""}
                        disabled
                        className="input-disabled"
                    />

                    <label>Fecha</label>
                    <DatePicker
                        selected={
                            turnoToEdit?.fecha
                                ? new Date(turnoToEdit.fecha + "T00:00:00")
                                : null
                        }
                        onChange={(date) => {
                            if (!date) return;
                            const localDate = new Date(
                                date.getFullYear(),
                                date.getMonth(),
                                date.getDate()
                            );
                            const formattedDate = localDate.toISOString().split("T")[0];
                            setTurnoToEdit({ ...turnoToEdit, fecha: formattedDate, hora: "" });
                        }}
                        dateFormat="dd/MM/yyyy"
                        className="date-input"
                        placeholderText="Seleccionar fecha"
                        minDate={new Date()}
                        filterDate={(date) => {
                            const day = date.getDay();
                            return day !== 0 && day !== 6;
                        }}
                    />

                    <label>Hora</label>
                    <select
                        value={turnoToEdit?.hora || ""}
                        onChange={(e) => {
                            const horaSeleccionada = e.target.value;
                            const turnoExistente = listaDeTurnos.some(
                                t => t.fecha === turnoToEdit.fecha && t.hora === horaSeleccionada && t.id !== turnoToEdit.id
                            );

                            if (turnoExistente) {
                                alert("Este horario ya está ocupado para el día seleccionado.");
                            } else {
                                setTurnoToEdit({ ...turnoToEdit, hora: horaSeleccionada });
                            }
                        }}
                    >
                        <option value="">Seleccionar horario</option>
                        {[
                            "13:00", "13:30", "14:00", "14:30",
                            "15:00", "15:30", "16:00", "16:30",
                            "17:00", "17:30", "18:00", "18:30"
                        ].map((hora) => {
                            const ocupado = listaDeTurnos.some(
                                (t) => t.fecha === turnoToEdit?.fecha && t.hora === hora && t.id !== turnoToEdit?.id
                            );

                            return (
                                <option key={hora} value={hora} disabled={ocupado}>
                                    {hora}{ocupado ? " (Ocupado)" : ""}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </ModalPortal>


            <ObservacionesModal
                show={showObservacionesModal}
                onClose={closeObservacionesModal}
                turno={turnoObservaciones}
                onGuardar={handleSaveObservaciones}
                loading={loadingObservaciones}
                error={errorObservaciones}
            />
        </div>
    );
};

export default Turnos;