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

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const navigate = useNavigate();

    const handleVerHistorial = (dniPaciente) => {
        if (dniPaciente) {
            navigate(`/historial/${dniPaciente}`); 
        } else {
            setError("No se pudo obtener el DNI del paciente para el historial.");
        }
    };

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

        let url = "";

        if (userRole === "admin" || userRole === "superadmin" || userRole === "profesional") {
            url = "http://localhost:3000/admin/turnos";
        } else { 
            url = "http://localhost:3000/misturnos";
        }

        try {
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Error al obtener los turnos");

            const data = await res.json();
            
            const now = new Date();
            const today = now.toISOString().split("T")[0]; 
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const currentTime = `${hours}:${minutes}`; 
            
            const turnosFiltrados = data.filter(turno => {
                if (!turno.dia) return false; 
                
                if (turno.dia > today) {
                    return true;
                }
                
                if (turno.dia === today) {
                    return turno.hora >= currentTime;
                }

                return false;
            });
            
            const turnosTransformados = turnosFiltrados.map((turno) => {
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
                    asistio: turno.asistio, 
                };

                if (userRole === "admin" || userRole === "superadmin" || userRole === "profesional") {
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


    useEffect(() => {
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

    const toggleAsistencia = async (id, currentStatus) => {
        const newStatus = !currentStatus;
        const token = localStorage.getItem("authtoken");

        try {
            const res = await fetch(`http://localhost:3000/admin/turnos/${id}/asistencia`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ asistio: newStatus }),
            });

            if (!res.ok) throw new Error("Error al actualizar la asistencia");

            if (currentUserRole === "profesional" && newStatus === false) {
                 setListaDeTurnos((prev) => prev.filter((t) => t.id !== id));
            } else {
                 setListaDeTurnos((prev) =>
                     prev.map((t) => (t.id === id ? { ...t, asistio: newStatus } : t))
                 );
            }
            
            const turnoActualizado = listaDeTurnos.find(t => t.id === id);
            let nombreAmostrar = `Turno #${id}`;
            if (turnoActualizado && turnoActualizado.usuarioDisplay) {
                const match = turnoActualizado.usuarioDisplay.match(/(.*) \(DNI:/);
                nombreAmostrar = match ? match[1].trim() : `Turno #${id}`;
            }

            setSuccessMessage(`Asistencia de ${nombreAmostrar} actualizada a ${newStatus ? 'ASISTIO' : 'NO ASISTIO'}.`);
            setShowSuccessModal(true);

        } catch (err) {
            setError(err.message);
        }
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

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
        setSuccessMessage("");
    };

    const isGestorView = currentUserRole === "admin" || currentUserRole === "superadmin" || currentUserRole === "profesional";
    const isUserView = currentUserRole === "user";

    if (loading) return <p>Cargando turnos...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className="turnos-container">
            <h2 className="turnos-title">
                {isGestorView ? "GESTIÓN DE TURNOS" : "MIS TURNOS"}
            </h2>

            {(currentUserRole === "admin" || currentUserRole === "superadmin") && (
                <div className="botones-turnos">
                    <button
                        className="btn-principal"
                        onClick={() => navigate("/programar-turnos-admin")}
                    >
                        PROGRAMAR TURNO
                    </button>
                </div>
            )}


            {listaDeTurnos.length === 0 ? (
                <p>No hay turnos programados.</p>
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
                            {isGestorView && <th>Asistencia</th>} 
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaDeTurnos.map((turno) => (
                            <TurnoItem
                                key={turno.id}
                                {...turno}
                                onEliminar={openTurnoDeleteModal}
                                onToggleAsistencia={toggleAsistencia} 
                                isAdminView={currentUserRole === "admin" || currentUserRole === "superadmin"}
                                isProfesionalView={currentUserRole === "profesional"}
                                isUserView={isUserView}
                                onVerHistorial={handleVerHistorial}
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
                isOpen={showSuccessModal}
                onClose={closeSuccessModal}
                title={successMessage}
                actions={<button className="modal-confirm-button" onClick={closeSuccessModal}>Aceptar</button>}
            />
        </div>
    );
};

export default Turnos;