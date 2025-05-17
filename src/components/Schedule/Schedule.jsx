import React, { useState } from 'react';
import './schedule.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Schedule = () => {
    const [dniBusqueda, setDniBusqueda] = useState('');
    const [datos, setDatos] = useState([
        {
            dni: '37598663',
            nombre: 'MELISA URQUIZA',
            fecha: '24 DE ABRIL DE 2025',
            hora: '03 PM',
        },
        {
            dni: '45831677',
            nombre: 'VALERIA MENDEZ',
            fecha: '28 DE ABRIL DE 2025',
            hora: '07 PM',
        },
        {
            dni: '30255846',
            nombre: 'IVANA DIAZ',
            fecha: '03 DE MAYO DE 2025',
            hora: '11 AM',
        },
    ]);

    const [editarIndex, setEditarIndex] = useState(null);
    const [formData, setFormData] = useState({ dni: '', nombre: '', fecha: '', hora: '' });


    const datosFiltrados = datos.filter(dato =>
        dato.dni.includes(dniBusqueda)
    );

    const eliminarTurno = (index) => {
        const nuevosDatos = [...datos];
        nuevosDatos.splice(index, 1);
        setDatos(nuevosDatos);
    };

    const abrirEditor = (dato, index) => {
        setEditarIndex(index);
        setFormData({ ...dato });
    };

    const guardarCambios = () => {
        const nuevosDatos = [...datos];
        nuevosDatos[editarIndex] = { ...formData };
        setDatos(nuevosDatos);
        cerrarEditor();
    };

    const cerrarEditor = () => {
        setEditarIndex(null);
        setFormData({ dni: '', nombre: '', fecha: '', hora: '' });
    };

    return (
        <div className="schedule-page">
            <h1>AGENDA</h1>

            <div className="botones">
                <button className="btn-principal">CREAR USUARIO</button>
                <button className="btn-principal">PROGRAMAR TURNO</button>

                <div className="buscar">
                    <label>BUSCAR POR DNI</label>
                    <input
                        type="text"
                        placeholder="..."
                        value={dniBusqueda}
                        onChange={(e) => setDniBusqueda(e.target.value)}
                    />
                </div>
            </div>

            <div className="schedule-lista">
                {datosFiltrados.length > 0 ? (
                    datosFiltrados.map((dato, index) => (
                        <div key={index} className="fila-schedule">
                            <span>{dato.dni}</span>
                            <span>{dato.nombre}</span>
                            <span>{dato.fecha}</span>
                            <span>{dato.hora}</span>
                            <span>
                                <button className="btn-editar" onClick={() => abrirEditor(dato, index)}>
                                    <i className="bi bi-pencil"></i> Editar
                                </button>
                                <button className="btn-eliminar" onClick={() => eliminarTurno(index)}>
                                    <i className="bi bi-trash"></i> Eliminar
                                </button>
                            </span>
                        </div>
                    ))
                ) : (
                    <p>No se encontraron resultados.</p>
                )}
            </div>

            {editarIndex !== null && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Editar Turno</h3>
                        <label>DNI</label>
                        <input
                            value={formData.dni}
                            onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                        />
                        <label>Nombre</label>
                        <input
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        />
                        <label>Fecha</label>
                        <input
                            value={formData.fecha}
                            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                        />
                        <label>Hora</label>
                        <input
                            value={formData.hora}
                            onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                        />

                        <div className="modal-buttons">
                            <button onClick={guardarCambios} className="btn-principal">Guardar</button>
                            <button onClick={cerrarEditor} className="btn-cancelar">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Schedule;