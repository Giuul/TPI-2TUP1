import React, { useEffect, useState } from "react";
import './AdminServices.css';
import axios from "axios";

const AdminServices = () => {
    const [services, setServices] = useState([]);
    const [form, setForm] = useState({ nombre: "", descripcion: "", duracion: "", imagen: "" });
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");

    const fetchServices = async () => {
        try {
            const res = await axios.get("http://localhost:3000/service");
            setServices(res.data);
        } catch (err) {
            setMessage("Error al cargar servicios");
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
            fetchServices();
        } catch (err) {
            setMessage(err.response?.data?.message || "Error al guardar el servicio");
        }
    };

    const handleEdit = (service) => {
        setForm({ nombre: service.nombre, descripcion: service.descripcion, duracion: service.duracion, imagen: service.imagen });
        setEditingId(service.id);
        setMessage("");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar este servicio?")) return;
        try {
            await axios.delete(`http://localhost:3000/service/${id}`);
            setMessage("Servicio eliminado correctamente");
            fetchServices();
        } catch (err) {
            setMessage(err.response?.data?.message || "Error al eliminar el servicio");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Administrar Servicios</h2>
            {message && <div style={{ margin: "10px 0", color: "red" }}>{message}</div>}

            <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
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
                <button type="submit" style={{ marginLeft: "10px" }}>
                    {editingId ? "Editar" : "Crear"}
                </button>
            </form>

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
                            <button onClick={() => handleDelete(s.id)} className="delete-btn">🗑️ Eliminar</button>
                        </div>
                    </li>
                ))}
            </ul>

        </div>
    );
};

export default AdminServices;
