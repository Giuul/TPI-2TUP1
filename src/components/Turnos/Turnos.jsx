import React, { useState, useEffect } from "react";
import TurnoItem from "../TurnoItem/TurnoItem";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import ModalPortal from "../Turnos/ModalPortal";
import "./turnos.css";

const Turnos = () => {
    const [listaDeTurnos, setListaDeTurnos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUserRole, setCurrentUserRole] = useState("user");

    const [showTurnoDeleteModal, setShowTurnoDeleteModal] = useState(false);
    const [turnoToDeleteId, setTurnoToDeleteId] = useState(null);

    const [showEditModal, setShowEditModal] = useState(false);
    const [turnoToEdit, setTurnoToEdit] = useState(null);
    const [editFecha, setEditFecha] = useState("");
    const [editHora, setEditHora] = useState("");

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [editError, setEditError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchTurnos = async () => {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("authtoken");
            let userRole = "user";

            if (!token) {
                setError("No estás autenticado.");
                setLoading(false);
                return;
            }

            try {
                const decodedToken = jwtDecode(token);
                userRole = decodedToken.role || "user";
            } catch {
                setError("Error al verificar la sesión.");
                setLoading(false);
                return;
            }

            setCurrentUserRole(userRole);

            const url =
                userRole === "admin" || userRole === "superadmin"
                    ? "http://localhost:3000/admin/turnos"
                    : "http://localhost:3000/misturnos";

            try {
                const res = await fetch(url, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Error al obtener los turnos");

                const data = await res.json();

                const turnosTransformados = data.map((turno) => {
                    const base = {
                        id: turno.id,
                        dniusuario: turno.dniusuario,
                        servicios: turno.servicio?.nombre || "Servicio no especificado",
                        fecha: turno.dia,
                        hora: turno.hora,
                        duracion: turno.servicio?.duracion
                            ? `${turno.servicio.duracion} minutos`
                            : "N/A",
                        profesionalDisplay: "N/A",
                    };

                    if (userRole === "admin" || userRole === "superadmin") {
                        const usuarioInfo = turno.usuario
                            ? `${turno.usuario.name} ${turno.usuario.lastname} (DNI: ${turno.usuario.id})`
                            : `DNI: ${turno.dniusuario}`;
                        const profesionalInfo = turno.profesional
                            ? `${turno.profesional.name} ${turno.profesional.lastname}`
                            : "Sin asignar";

                        return { ...base, usuarioDisplay: usuarioInfo, profesionalDisplay: profesionalInfo };
                    }

                    return base;
                });

                setListaDeTurnos(turnosTransformados);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTurnos();
    }, []);

    const openTurnoDeleteModal = (id) => {
        setTurnoToDeleteId(id);
        setShowTurnoDeleteModal(true);
    };

    const closeTurnoDeleteModal = () => {
        setShowTurnoDeleteModal(false);
        setTurnoToDeleteId(null);
    };

    const confirmDeleteTurno = async () => {
        if (!turnoToDeleteId) return;
        setLoading(true);

        try {
            const token = localStorage.getItem("authtoken");
            const res = await fetch(`http://localhost:3000/misturnos/${turnoToDeleteId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Error al eliminar el turno");

            setListaDeTurnos((prev) => prev.filter((t) => t.id !== turnoToDeleteId));
            setSuccessMessage("Turno eliminado exitosamente.");
            setShowSuccessModal(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            closeTurnoDeleteModal();
        }
    };

    const openEditModal = (turno) => {
        setTurnoToEdit(turno);
        setEditFecha(turno.fecha);
        setEditHora(turno.hora);
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setTurnoToEdit(null);
        setEditFecha("");
        setEditHora("");
    };

    const confirmEditTurno = async () => {
        const today = new Date().toISOString().split("T")[0];
        const horaMin = "15:00";
        const horaMax = "18:30";

        if (!editFecha) {
            setEditError("Debes seleccionar una fecha.");
            return;
        }

        if (editFecha < today) {
            setEditError("La fecha no puede ser anterior al día de hoy.");
            return;
        }

        if (!editHora) {
            setEditError("Debes seleccionar una hora.");
            return;
        }

        if (editHora < horaMin || editHora > horaMax) {
            setEditError(`La hora debe estar entre ${horaMin} y ${horaMax}.`);
            return;
        }

        setEditError("");
        setLoading(true);

        try {
            const token = localStorage.getItem("authtoken");
            const endpoint =
                currentUserRole === "admin" || currentUserRole === "superadmin"
                    ? `http://localhost:3000/admin/turnos/${turnoToEdit.id}`
                    : `http://localhost:3000/misturnos/${turnoToEdit.id}`;

            const res = await fetch(endpoint, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ dia: editFecha, hora: editHora }),
            });

            if (!res.ok) throw new Error("Error al actualizar el turno");

            setListaDeTurnos(prev =>
                prev.map(t => t.id === turnoToEdit.id ? { ...t, fecha: editFecha, hora: editHora } : t)
            );

            setSuccessMessage("Turno actualizado correctamente.");
            setShowSuccessModal(true);
            closeEditModal();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };



    const closeSuccessModal = () => {
        setShowSuccessModal(false);
        setSuccessMessage("");
    };

    if (loading) return <p>Cargando turnos...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className="turnos-container">
            <h2 className="turnos-title">
                {currentUserRole === "admin" || currentUserRole === "superadmin"
                    ? "GESTIÓN DE TURNOS"
                    : "MIS TURNOS"}
            </h2>

            {listaDeTurnos.length === 0 ? (
                <p>No hay turnos programados.</p>
            ) : (
                <table className="turnos-table">
                    <thead>
                        <tr>
                            {(currentUserRole === "admin" || currentUserRole === "superadmin") && <th>Usuario</th>}
                            {(currentUserRole === "admin" || currentUserRole === "superadmin") && <th>Profesional</th>}
                            <th>Servicio</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Duración</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaDeTurnos.map((turno) => (
                            <TurnoItem
                                key={turno.id}
                                {...turno}
                                onEliminar={openTurnoDeleteModal}
                                onEditar={openEditModal}
                                isAdminView={currentUserRole === "admin" || currentUserRole === "superadmin"}
                            />
                        ))}
                    </tbody>
                </table>
            )}

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
                isOpen={showEditModal}
                onClose={closeEditModal}
                title="Editar turno"
                actions={
                    <>
                        <button className="modal-cancel-button" onClick={closeEditModal}>Cancelar</button>
                        <button className="modal-confirm-button" onClick={confirmEditTurno}>Guardar</button>
                    </>
                }
            >
                <label>Fecha:</label>
                <input type="date" value={editFecha} onChange={(e) => setEditFecha(e.target.value)} min={new Date().toISOString().split("T")[0]} />

                <label>Hora:</label>
                <input type="time" value={editHora} onChange={(e) => setEditHora(e.target.value)} min="15:00" max="18:30" />

                {editError && <p className="modal-error">{editError}</p>}
            </ModalPortal>


            <ModalPortal
                isOpen={showSuccessModal}
                onClose={closeSuccessModal}
                title={successMessage}
                actions={<button className="modal-confirm-button" onClick={closeSuccessModal}>Aceptar</button>}
            />
        </div>
    );
};

export default Turnos;
