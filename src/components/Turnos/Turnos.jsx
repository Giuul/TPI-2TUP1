import React, { useState, useEffect } from 'react';
import TurnoItem from '../TurnoItem/TurnoItem';
import { jwtDecode } from 'jwt-decode'; 
import "./turnos.css";

const Turnos = ({ onTurnoEliminado }) => {
  const [listaDeTurnos, setListaDeTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState('user'); 

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

  const handleEliminarTurno = async (id) => {
   
    try {
      const token = localStorage.getItem('authtoken');
      if (!token) {
        alert('Sesión expirada. Por favor, inicia sesión de nuevo.');
        return;
      }
      const response = await fetch(`http://localhost:3000/misturnos/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error al eliminar el turno' }));
        throw new Error(errorData.message || 'Error al eliminar el turno');
      }

      const nuevaListaDeTurnos = listaDeTurnos.filter(turno => turno.id !== id);
      setListaDeTurnos(nuevaListaDeTurnos);
      if (onTurnoEliminado) {
        onTurnoEliminado(id);
      }
    } catch (error) {
      console.error('Error al eliminar el turno:', error.message);
      alert(`No se pudo eliminar el turno: ${error.message}`);
    }
  };

  if (loading) {
    return <p>Cargando turnos...</p>;
  }

  if (error) {
    return <p>Error al cargar los turnos: {error}</p>;
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
                onEliminar={handleEliminarTurno}
                isAdminView={currentUserRole === 'admin' || currentUserRole === 'superadmin'}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Turnos;