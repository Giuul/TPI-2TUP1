import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../AppointmentsSelection/AppointmentsSelection.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const horarios = [
    '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30'
];

const formatTimeToBackend = (timeString) => timeString;

const AppointmentsSelection = () => {
    const navigate = useNavigate();
    const [fecha, setFecha] = useState(new Date());
    const [horarioSeleccionado, setHorarioSeleccionado] = useState('');
    const [mensajeConfirmacion, setMensajeConfirmacion] = useState('');
    const [errorMensaje, setErrorMensaje] = useState('');
    const [servicioSeleccionado, setServicioSeleccionado] = useState('');
    const [turnosOcupados, setTurnosOcupados] = useState([]);

    const [dniUsuarioAgenda, setDniUsuarioAgenda] = useState('');
    const [currentUserRole, setCurrentUserRole] = useState('');
    const [currentUserId, setCurrentUserId] = useState('');

    const [professionals, setProfessionals] = useState([]);
    const [profesionalSeleccionado, setProfesionalSeleccionado] = useState('');
    const [services, setServices] = useState([]); 

    const mañana = new Date();
    mañana.setDate(mañana.getDate() + 1);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            let decodedToken = {};
            try {
                decodedToken = jwtDecode(token);
                setCurrentUserRole(decodedToken.role);
                setCurrentUserId(decodedToken.id);
            } catch (e) {
                console.error("Error al decodificar el token:", e);
                return;
            }

            const fetchProfessionals = async () => {
                if (decodedToken.role === 'admin' || decodedToken.role === 'superadmin') {
                    try {
                        const response = await axios.get('http://localhost:3000/professionals', {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        setProfessionals(response.data);
                    } catch (err) {
                        console.error("Error al cargar profesionales:", err);
                        setErrorMensaje('Error al cargar la lista de profesionales.');
                    }
                }
            };

            const fetchServices = async () => { 
                try {
                    const response = await axios.get('http://localhost:3000/service');
                    setServices(response.data);
                } catch (err) {
                    console.error("Error al cargar servicios:", err);
                    setErrorMensaje('Error al cargar la lista de servicios.');
                }
            }

            fetchProfessionals();
            fetchServices();

        }
    }, []);

    const confirmarTurno = async () => {

        if (!horarioSeleccionado) {
            setErrorMensaje('Por favor, seleccioná un horario para confirmar tu turno.');
            return;
        }

        if (!servicioSeleccionado) {
            setErrorMensaje('Por favor, seleccioná un servicio.');
            return;
        }

        setErrorMensaje('');

        const diaFormatted = fecha.toISOString().split('T')[0];
        const horaFormatted = formatTimeToBackend(horarioSeleccionado);
        const authToken = localStorage.getItem('token');

        if (!authToken) {
            setErrorMensaje('No estás autenticado. Por favor, inicia sesión para agendar un turno.');
            navigate('/login');
            return;
        }

        const idservicio = parseInt(servicioSeleccionado);

        let userIdToAssign = currentUserId;
        let professionalIdToAssign = profesionalSeleccionado || null;

        if (currentUserRole === 'admin' || currentUserRole === 'superadmin') {
            if (!dniUsuarioAgenda) {
                setErrorMensaje('Si sos administrador, debés ingresar el DNI del usuario para el turno.');
                return;
            }
            if (!profesionalSeleccionado) {
                setErrorMensaje('Si sos administrador, debés seleccionar un profesional.');
                return;
            }
            userIdToAssign = dniUsuarioAgenda;
            professionalIdToAssign = profesionalSeleccionado;
        }

        try {
            const response = await fetch('http://localhost:3000/misturnos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    dia: diaFormatted,
                    hora: horaFormatted,
                    idservicio: idservicio,
                    userId: userIdToAssign,
                    profesionalId: professionalIdToAssign
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error de respuesta del servidor:", response.status, errorData);
                setErrorMensaje(errorData.mensaje || 'Error desconocido al agendar el turno. Por favor, intenta de nuevo.');

                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
                return;
            }

            const turnoCreado = await response.json();
            console.log('Turno creado con éxito:', turnoCreado);

            setMensajeConfirmacion('¡Turno agendado con éxito!');
            setHorarioSeleccionado('');
            setServicioSeleccionado('');
            setDniUsuarioAgenda('');
            setProfesionalSeleccionado('');
            setTimeout(() => navigate('/misturnos'), 2000);

        } catch (error) {
            console.error("Error CATCHED (problema de red/fetch) al confirmar turno:", error);
            setErrorMensaje(`No se pudo agendar el turno: ${error.message || 'Error de conexión.'}`);
        }
    };


    const esAdmin = currentUserRole === 'admin' || currentUserRole === 'superadmin';

    return (
        <div className="turno-container">
            <h1 className="turno-title">PROGRAMAR TURNO</h1>
            {mensajeConfirmacion && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p>{mensajeConfirmacion}</p>
                        <button className="modal-close" onClick={() => setMensajeConfirmacion('')}>
                            CERRAR
                        </button>
                    </div>
                </div>
            )}
            {errorMensaje && (
                <div className="error-message">
                    <p>{errorMensaje}</p>
                    <button className="modal-close" onClick={() => setErrorMensaje('')}>
                        CERRAR
                    </button>
                </div>
            )}

            {esAdmin && (
                <>
                    <div className="dni-input-container">
                        <label className="label" htmlFor="dniUsuarioAgenda">DNI DEL USUARIO PARA EL TURNO </label>
                        <input
                            type="text"
                            id="dniUsuarioAgenda"
                            placeholder="-- DNI USUARIO --"
                            value={dniUsuarioAgenda}
                            onChange={(e) => setDniUsuarioAgenda(e.target.value)}
                            className="dni-input"
                        />
                    </div>

                    <div className="professional-container">
                        <label className="label">ASIGNAR PROFESIONAL</label>
                        <select
                            className='service-selection'
                            value={profesionalSeleccionado}
                            onChange={(e) => setProfesionalSeleccionado(e.target.value)}
                        >
                            <option value="">-- Seleccione un profesional --</option>
                            {professionals.map(prof => (
                                <option key={prof.id} value={prof.id}>
                                    {prof.name} {prof.lastname}
                                </option>
                            ))}
                        </select>
                    </div>
                </>
            )}

            <div className="service-container">
                <label className="label">SELECCIONÁ UN SERVICIO</label>
                <select className='service-selection'
                    value={servicioSeleccionado}
                    onChange={(e) => setServicioSeleccionado(e.target.value)}
                >
                    <option value="">-- Elegí un servicio --</option>
                    {services.map(service => (
                        <option key={service.id} value={service.id}>
                            {service.nombre}
                        </option>
                    ))}
                </select>
            </div>
            <div className="turno-content">
                <div className="calendar-section">
                    <Calendar onChange={setFecha} value={fecha} locale="es-AR" minDate={mañana} />
                </div>
                <div className="time-slots-section">
                    {horarios.map((horaTurno, index) => {
                        const estaOcupada = turnosOcupados.some(hora => hora.slice(0,5) === horaTurno);

                        return (
                            <button
                                key={index}
                                className={`time-slot-btn ${horarioSeleccionado === horaTurno ? 'selected' : ''} ${estaOcupada ? 'ocupado' : ''}`}
                                onClick={() => !estaOcupada && setHorarioSeleccionado(horaTurno)}
                                disabled={estaOcupada}
                            >
                                {horaTurno} {estaOcupada ? '(ocupado)' : ''}
                            </button>
                        );
                    })}
                </div>
                <div className="details-section">
                    <p className="label">DETALLES DEL TURNO</p>
                    <p className="value">
                        {fecha.toLocaleDateString('es-AR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </p>
                    <p className="value">
                        {
                            services.find(servicie => servicie.id === parseInt(servicioSeleccionado))?.nombre
                        }
                    </p>
                    <p className="value">{horarioSeleccionado}</p>

                    {esAdmin && dniUsuarioAgenda && (
                        <p className="value">Para DNI: {dniUsuarioAgenda}</p>
                    )}

                    {esAdmin && profesionalSeleccionado && (
                        <p className="value">
                            Profesional: {professionals.find(p => p.id === profesionalSeleccionado)?.name}
                        </p>
                    )}

                    {(!horarioSeleccionado || !servicioSeleccionado || (esAdmin && (!dniUsuarioAgenda || !profesionalSeleccionado))) && (
                        <p style={{ color: '#635845', marginTop: '10px' }}>
                            {esAdmin
                                ? 'Seleccioná servicio, horario, DNI de usuario y Profesional.'
                                : 'Seleccioná un servicio y un horario para poder confirmar tu turno.'
                            }
                        </p>
                    )}

                    <button
                        className="confirm-btn"
                        onClick={confirmarTurno}
                        disabled={
                            !horarioSeleccionado ||
                            !servicioSeleccionado ||
                            (esAdmin && (!dniUsuarioAgenda || !profesionalSeleccionado))
                        }
                    >
                        CONFIRMAR
                    </button>

                </div>
            </div>
        </div>
    );
};

export default AppointmentsSelection;