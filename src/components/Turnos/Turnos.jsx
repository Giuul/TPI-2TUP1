import React, { useState, useEffect } from 'react';
import TurnoItem from '../TurnoItem/TurnoItem';
import { jwtDecode } from 'jwt-decode';
import "./turnos.css";

const ConfirmationModal = ({ show, message, onConfirm, onCancel, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-actions">
          {onConfirm && onCancel ? (
            <>
              <button onClick={onConfirm} className="modal-confirm-button">Sí</button>
              <button onClick={onCancel} className="modal-cancel-button">No</button>
            </>
          ) : (
            <button onClick={onClose} className="modal-confirm-button">Aceptar</button>
          )}
        </div>
      </div>
    </div>
  );
};

const Turnos = ({ onTurnoEliminado }) => {
  const [listaDeTurnos, setListaDeTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState('user');

  const [showTurnoDeleteModal, setShowTurnoDeleteModal] = useState(false);
  const [turnoToDeleteId, setTurnoToDeleteId] = useState(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const formatDuration = (duracion) => `${duracion} minutos`;

  useEffect(() => {
    const fetchTurnosYDeterminarRol = async () => {
      setLoading(true);
      setError(null);

      let userRole = 'user';
      const token = localStorage.getItem('authtoken');

      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          userRole = decodedToken.role || 'user';
        } catch (e) {
          console.error("Error al decodificar el token:", e);

          setError("Error al verificar la sesión. Intenta iniciar sesión de nuevo.");
          setLoading(false);
          return;
        }
      } else {

        setError("No estás autenticado. Por favor, inicia sesión.");
        setLoading(false);

        return;
      }
      setCurrentUserRole(userRole);

      let url;
      if (userRole === 'admin' || userRole === 'superadmin') {

        url = 'http://localhost:3000/admin/turnos';
      } else {
        url = 'http://localhost:3000/misturnos';
      }

      try {
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Error desconocido del servidor' }));
          throw new Error(errorData.message || `Error al obtener los turnos (Status: ${response.status})`);
        }

        const data = await response.json();

        const turnosTransformados = data.map((turno) => {
          const baseTurnoData = {
            id: turno.id,
            servicios: turno.servicio?.nombre || 'Servicio no especificado',
            fecha: turno.dia,
            hora: turno.hora,
            duracion: turno.servicio?.duracion !== undefined ? formatDuration(turno.servicio.duracion) : 'N/A',
          };

          if (userRole === 'admin' || userRole === 'superadmin') {
            let usuarioInfo = 'Usuario no disponible';
            if (turno.User) {
              usuarioInfo = `${turno.User.name || ''} ${turno.User.lastname || ''} (DNI: ${turno.User.id || 'N/A'})`.trim();
              if (usuarioInfo === "(DNI: N/A)") usuarioInfo = `DNI: ${turno.User.id || 'N/A'}`;
            } else if (turno.dniusuario) {
              usuarioInfo = `DNI: ${turno.dniusuario}`;

            }
            return { ...baseTurnoData, usuarioDisplay: usuarioInfo };
          }
          return baseTurnoData;
        });

        setListaDeTurnos(turnosTransformados);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTurnosYDeterminarRol();
  }, []);

  const openTurnoDeleteModal = (id) => {
    setTurnoToDeleteId(id);
    setShowTurnoDeleteModal(true);
  };

  const closeTurnoDeleteModal = () => {
    setShowTurnoDeleteModal(false);
    setTurnoToDeleteId(null);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setSuccessMessage('');
  };

  const confirmDeleteTurno = async () => {
    if (!turnoToDeleteId) return;

    setLoading(true);
    closeTurnoDeleteModal();

    try {
      const token = localStorage.getItem('authtoken');
      if (!token) {
        alert('Sesión expirada. Por favor, inicia sesión de nuevo.');
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:3000/misturnos/${turnoToDeleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error al eliminar el turno' }));
        throw new Error(errorData.message || 'Error al eliminar el turno');
      }

      const nuevaListaDeTurnos = listaDeTurnos.filter(turno => turno.id !== turnoToDeleteId);
      setListaDeTurnos(nuevaListaDeTurnos);

      setSuccessMessage("Turno eliminado exitosamente.");
      setShowSuccessModal(true);

      if (onTurnoEliminado) {
        onTurnoEliminado(turnoToDeleteId);
      }
    } catch (error) {
      console.error('Error al eliminar el turno:', error.message);
      setError(`No se pudo eliminar el turno: ${error.message}`);
    } finally {
      setLoading(false);
      setTurnoToDeleteId(null);
    }
  };

  if (loading) {
    return <p>Cargando turnos...</p>;
  }

  if (error) {
    return (
      <ConfirmationModal
        show={true}
        message={error}
        onClose={() => setError(null)}
      />
    );
  }

  return (
    <div className="turnos-container">
      <h2 className="turnos-title">
        {(currentUserRole === 'admin' || currentUserRole === 'superadmin') ? 'GESTIÓN DE TURNOS' : 'MIS TURNOS'}
      </h2>
      {listaDeTurnos.length === 0 ? (
        <p>No hay turnos programados.</p>
      ) : (
        <table className="turnos-table">
          <thead>
            <tr>
              {(currentUserRole === 'admin' || currentUserRole === 'superadmin') && <th>Usuario</th>}
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
                isAdminView={currentUserRole === 'admin' || currentUserRole === 'superadmin'}
              />
            ))}
          </tbody>
        </table>
      )}
      <ConfirmationModal
        show={showTurnoDeleteModal}
        message="¿Estás seguro que quieres eliminar este turno? Esta acción es irreversible."
        onConfirm={confirmDeleteTurno}
        onCancel={closeTurnoDeleteModal}
      />
      <ConfirmationModal
        show={showSuccessModal}
        message={successMessage}
        onClose={closeSuccessModal}
      />
    </div>
  );
}

export default Turnos;