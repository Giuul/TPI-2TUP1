import React, { useEffect, useState } from "react";
import './AdminServices.css';
import axios from "axios";

const AdminServices = () => {
    const [services, setServices] = useState([]);
    const [form, setForm] = useState({ nombre: "", descripcion: "", duracion: "", imagen: "" });
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const fetchServices = async () => {
        try {
            const res = await axios.get("http://localhost:3000/service");
            setServices(res.data);
        } catch (err) {
            setMessage("Error al cargar servicios");
            setIsMessageModalOpen(true);
        }
    };

    const closeModal = (setModalOpen) => {
        const overlay = document.querySelector('.modal-overlay.show');
        const modal = document.querySelector('.modal.show');
        if (modal && overlay) {
            modal.classList.add('hide');
            overlay.classList.add('hide');
            setTimeout(() => {
                setModalOpen(false);
                modal.classList.remove('hide');
                overlay.classList.remove('hide');
            }, 400);
        } else {
            setModalOpen(false);
        }
    };


    useEffect(() => {
        fetchServices();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`http://localhost:3000/service/${editingId}`, form);
                setMessage("Servicio editado correctamente");
            } else {
                await axios.post("http://localhost:3000/service", form);
                setMessage("Servicio creado correctamente");
            }
            setForm({ nombre: "", descripcion: "", duracion: "", imagen: "" });
            setEditingId(null);
            setIsFormModalOpen(false);
            setIsMessageModalOpen(true);
            fetchServices();
        } catch (err) {
            setMessage(err.response?.data?.message || "Error al guardar el servicio");
            setIsMessageModalOpen(true);
        }
    };

    const handleEdit = (service) => {
        setForm({ nombre: service.nombre, descripcion: service.descripcion, duracion: service.duracion, imagen: service.imagen });
        setEditingId(service.id);
        setIsFormModalOpen(true);
        setMessage("");
    };

    const openDeleteModal = (id) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:3000/service/${deleteId}`);
            setMessage("Servicio eliminado correctamente");
            setIsDeleteModalOpen(false);
            setIsMessageModalOpen(true);
            fetchServices();
        } catch (err) {
            setMessage(err.response?.data?.message || "Error al eliminar el servicio");
            setIsMessageModalOpen(true);
        }
    };

    return (
        <div className="admin-services">
            <h2>Administrar Servicios</h2>

            <button className="create-btn" onClick={() => {
                setEditingId(null);
                setForm({ nombre: "", descripcion: "", duracion: "", imagen: "" });
                setIsFormModalOpen(true);
            }}>
                Crear Servicio
            </button>

            {isFormModalOpen && (
                <div className="modal-overlay show">
                    <div className="modal show">
                        <h3>{editingId ? "Editar Servicio" : "Crear Servicio"}</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                placeholder="Nombre"
                                value={form.nombre}
                                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Descripción"
                                value={form.descripcion}
                                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                                required
                            />
                            <input
                                type="number"
                                placeholder="Duración (min)"
                                value={form.duracion}
                                onChange={(e) => setForm({ ...form, duracion: e.target.value })}
                            />
                            <input
                                placeholder="URL Imagen"
                                value={form.imagen}
                                onChange={(e) => setForm({ ...form, imagen: e.target.value })}
                            />
                            <div className="modal-actions">
                                <button type="submit">{editingId ? "Guardar cambios" : "Crear"}</button>
                                <button type="button" className="close-btn" onClick={() => closeModal(setIsFormModalOpen)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isMessageModalOpen && (
                <div className="modal-overlay show">
                    <div className="modal message-modal show">
                        <h3>¡Éxito!</h3>
                        <p>{message}</p>
                        <button className="close-btn" onClick={() => closeModal(setIsMessageModalOpen)}>Cerrar</button>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="modal-overlay show">
                    <div className="modal delete-modal show">
                        <h3>Eliminar Servicio</h3>
                        <p>¿Estás seguro que quieres eliminar este servicio?</p>
                        <div className="modal-actions">
                            <button onClick={confirmDelete}>Sí, eliminar</button>
                            <button className="close-btn" onClick={() => closeModal(setIsDeleteModalOpen)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            <ul className="services-list">
                {services.map((s) => (
                    <li key={s.id}>
                        <div className="service-info">
                            {s.imagen && <img src={s.imagen} alt={s.nombre} />}
                            <div className="col"><strong>{s.nombre}</strong></div>
                            <div className="col">{s.descripcion}</div>
                            <div className="col">{s.duracion} min</div>
                        </div>
                        <div className="service-actions">
                            <button onClick={() => handleEdit(s)}>✏️ Editar</button>
                            <button onClick={() => openDeleteModal(s.id)} className="delete-btn">🗑️ Eliminar</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminServices;
