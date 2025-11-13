import React, { useEffect, useState } from "react";
import "./AdminServices.css";
import axios from "axios";

const AdminServices = () => {
    const [services, setServices] = useState([]);
    const [form, setForm] = useState({ nombre: "", descripcion: "", duracion: "", imagen: "" });
    const [preview, setPreview] = useState(null);
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

    useEffect(() => {
        fetchServices();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                const servicioActual = services.find(s => s.id === editingId);
                const formConImagen = {
                    ...form,
                    imagen: form.imagen.trim() || servicioActual?.imagen || ""
                };

                await axios.put(`http://localhost:3000/service/${editingId}`, formConImagen);
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
        setForm({
            nombre: service.nombre,
            descripcion: service.descripcion,
            duracion: service.duracion,
            imagen: service.imagen || ""
        });
        setEditingId(service.id);
        setIsFormModalOpen(true);
    };

    const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
        setForm({ ...form, imagen: reader.result });
        setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    }
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

    const closeAllModals = () => {
        setIsFormModalOpen(false);
        setIsMessageModalOpen(false);
        setIsDeleteModalOpen(false);
        setEditingId(null);
        setForm({ nombre: "", descripcion: "", duracion: "", imagen: "" });
        setPreview(null);
    };

    return (
        <div className="admin-services">
            <h2>Administrar Servicios</h2>

            <button
                className="create-btn"
                onClick={() => {
                    setEditingId(null);
                    setForm({ nombre: "", descripcion: "", duracion: "", imagen: "" });
                    setIsFormModalOpen(true);
                }}
            >
                Crear Servicio
            </button>

            {isFormModalOpen && (
                <div className="modal-overlay">
                    <div className="service-form">
                        <h3>{editingId ? "Editar Servicio" : "Crear Servicio"}</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                placeholder="Nombre del servicio"
                                value={form.nombre}
                                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                required
                            />
                            <textarea
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
                            <div className="image-upload">
                                <label htmlFor="imagen" className="image-label">
                                    {preview ? "Cambiar imagen" : "Seleccionar imagen"}
                                </label>
                                <input
                                    id="imagen"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: "none" }}
                                />
                                </div>
                                {preview && (
                                <img
                                    src={preview}
                                    alt="Vista previa"
                                    className="preview-img"
                                />
                                )}
                            <div className="form-buttons">
                                <button type="submit" className="create-btn">
                                    {editingId ? "Guardar Cambios" : "Crear Servicio"}
                                </button>
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={closeAllModals}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isMessageModalOpen && (
                <div className="modal-overlay">
                    <div className="service-form">
                        <p>{message}</p>
                        <div className="form-buttons">
                            <button className="create-btn" onClick={closeAllModals}>
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="modal-overlay">
                    <div className="service-form">
                        <h3>Confirmar Eliminación</h3>
                        <p>¿Estás seguro de que querés eliminar este servicio?</p>
                        <div className="form-buttons">
                            <button className="create-btn" onClick={confirmDelete}>
                                Sí, eliminar
                            </button>
                            <button
                                className="cancel-btn"
                                onClick={closeAllModals}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ul className="services-list">
                {services.map((s) => (
                    <li key={s.id}>
                        <div className="service-info">
                            {s.imagen && (
                                <img
                                    src={
                                    s.imagen.startsWith("data:image")
                                        ? s.imagen
                                        : `data:image/jpeg;base64,${s.imagen}`
                                    }
                                    alt={s.nombre}
                                />
                                )}
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
