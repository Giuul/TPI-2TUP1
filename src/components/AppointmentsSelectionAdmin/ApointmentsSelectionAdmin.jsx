import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../AppointmentsSelection/AppointmentsSelection.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
const formatTimeToBackend = (timeString) => {
    const [time, period] = timeString.split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours);

    if (period && period.toLowerCase() === 'p.m.' && hours < 12) {
        hours += 12;
    } else if (period && period.toLowerCase() === 'a.m.' && hours === 12) {
        hours = 0;
    }
    return `${String(hours).padStart(2, '0')}:${minutes}`;
};

const horarios = [
    '3:00 p. m.', '3:30 p. m.', '4:00 p. m.', '4:30 p. m.',
    '5:00 p. m.', '5:30 p. m.', '6:00 p. m.', '6:30 p. m.'
];

const AppointmentsSelection = () => {
    const navigate = useNavigate();
    const [fecha, setFecha] = useState(new Date());
    const [horarioSeleccionado, setHorarioSeleccionado] = useState('');
    const [mensajeConfirmacion, setMensajeConfirmacion] = useState('');
    const [errorMensaje, setErrorMensaje] = useState('');
    const [servicioSeleccionado, setServicioSeleccionado] = useState('');
    
    const [dniUsuarioAgenda, setDniUsuarioAgenda] = useState('');
    
    const [currentUserRole, setCurrentUserRole] = useState('');
    const [currentUserId, setCurrentUserId] = useState(''); 
    
   
    const mañana = new Date();
    mañana.setDate(mañana.getDate() + 1);

    useEffect(() => {
        const token = localStorage.getItem('token'); 
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setCurrentUserRole(decodedToken.role);
                setCurrentUserId(decodedToken.id); 
            } catch (e) {
                console.error("Error al decodificar el token:", e);
                
            }
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
        if (currentUserRole === 'admin' || currentUserRole === 'superadmin') {
            if (!dniUsuarioAgenda) {
                setErrorMensaje('Si sos administrador, debés ingresar el DNI del usuario para el turno.');
                return;
            }
            userIdToAssign = dniUsuarioAgenda; 
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
                    userId: userIdToAssign 
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error de respuesta del servidor:", response.status, errorData);
                setErrorMensaje(errorData.mensaje || 'Error desconocido al agendar el turno. Por favor, intenta de nuevo.');

                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('token'); 
                    localStorage.removeItem('username');
                    localStorage.removeItem('role');
                    localStorage.removeItem('userId');
                    localStorage.removeItem('isLoggedIn');
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
            setTimeout(() => navigate('/misturnos'), 2000); 
            
        } catch (error) {
            console.error("Error CATCHED (problema de red/fetch) al confirmar turno:", error);
            setErrorMensaje(`No se pudo agendar el turno: ${error.message || 'Error de conexión.'}`);
        }
    };

    const servicios = [
        { id: 1, nombre: 'Piernas' },
        { id: 2, nombre: 'Facial' },
        { id: 3, nombre: 'Brazos' }
    ];

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
            
            {(currentUserRole === 'admin' || currentUserRole === 'superadmin') && (
                <div className="dni-input-container">
                    <label className="label" htmlFor="dniUsuarioAgenda">DNI del Usuario para el Turno:</label>
                    <input
                        type="text" 
                        id="dniUsuarioAgenda"
                        placeholder="Ingresá el DNI del usuario"
                        value={dniUsuarioAgenda}
                        onChange={(e) => setDniUsuarioAgenda(e.target.value)}
                        className="dni-input"
                    />
                </div>
            )}

            <div className="service-container">
                <label className="label">SELECCIONÁ UN SERVICIO</label>
                <select className='service-selection'
                    value={servicioSeleccionado}
                    onChange={(e) => setServicioSeleccionado(e.target.value)}
                >
                    <option value="">-- Elegí un servicio --</option>
                    {servicios.map(servicio => (
                        <option key={servicio.id} value={servicio.id}>
                            {servicio.nombre}
                        </option>
                    ))}
                </select>
            </div>
            <div className="turno-content">
                <div className="calendar-section">
                    <Calendar onChange={setFecha} value={fecha} locale="es-AR" minDate={mañana} />
                </div>
                <div className="time-slots-section">
                    {horarios.map((horaTurno, index) => (
                        <button
                            key={index}
                            className={`time-slot-btn ${horarioSeleccionado === horaTurno ? 'selected' : ''}`}
                            onClick={() => setHorarioSeleccionado(horaTurno)}
                        >
                            {horaTurno}
                        </button>
                    ))}
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
                            servicios.find(servicio => servicio.id === parseInt(servicioSeleccionado))?.nombre
                        }
                    </p>
                    <p className="value">{horarioSeleccionado}</p>
                    
                    {(currentUserRole === 'admin' || currentUserRole === 'superadmin') && dniUsuarioAgenda && (
                        <p className="value">Para DNI: {dniUsuarioAgenda}</p>
                    )}

                    {(!horarioSeleccionado || !servicioSeleccionado) && (
                        <p style={{ color: '#bb8c68', marginTop: '10px' }}>
                            Seleccioná un servicio y un horario para poder confirmar tu turno.
                        </p>
                    )}

                    <button
                        className="confirm-btn"
                        onClick={confirmarTurno}
                        disabled={!horarioSeleccionado || !servicioSeleccionado || ((currentUserRole === 'admin' || currentUserRole === 'superadmin') && !dniUsuarioAgenda)}
                    >
                        CONFIRMAR
                    </button>

                </div>
            </div>
        </div>
    );
};

export default AppointmentsSelection;