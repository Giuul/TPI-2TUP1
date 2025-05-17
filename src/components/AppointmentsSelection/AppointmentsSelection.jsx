import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './AppointmentsSelection.css';
import { useNavigate } from 'react-router-dom';

const horarios = [
  '3:00 p. m.', '3:30 p. m.', '4:00 p. m.', '4:30 p. m.',
  '5:00 p. m.', '5:30 p. m.', '6:00 p. m.', '6:30 p. m.'
];

const AppointmentsSelection = () => {
  const [fecha, setFecha] = useState(new Date());
  const [horario, setHorario] = useState('');
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState('');
  const navigate = useNavigate();
  const mañana = new Date();
  mañana.setDate(mañana.getDate()+1);

  const confirmarTurno = () => {
    if (!horario) return;
     const mensaje = `Turno confirmado para el ${fecha.toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })} a las ${horario}`;
      setMensajeConfirmacion(mensaje);
      setTimeout(() => {setMensajeConfirmacion('');
                        navigate('/');}, 2000);
  };

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
      <div className="turno-content">
        <div className="calendar-section">
          <Calendar onChange={setFecha} value={fecha} locale="es-AR" minDate={mañana}/>
        </div>
        <div className="time-slots-section">
          {horarios.map((horaTurno, index) => (
            <button
              key={index}
              className={`time-slot-btn ${horario === horaTurno ? 'selected' : ''}`}
              onClick={() => setHorario(horaTurno)}
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
          <p className="value">{horario}</p>
          {!horario && (<p style={{ color: '#bb8c68', marginTop: '10px' }}>Seleccioná un horario para poder confirmar tu turno. </p>)}
          <button
            className="confirm-btn"
            onClick={confirmarTurno}
            disabled={!horario}
          >
            CONFIRMAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsSelection;