import React, { useState, useEffect } from 'react';
import TurnoItem from '../TurnoItem/TurnoItem';
import "./turnos.css";

const Turnos = ({ onTurnoEliminado }) => {
  const [listaDeTurnos, setListaDeTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDuration = (duracion) => `${duracion} minutos`;

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const response = await fetch('http://localhost:3000/misturnos', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authtoken')}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener los turnos');
        }

        const data = await response.json();

        const turnosTransformados = data.map((turno) => ({
          id: turno.id,
          servicios: turno.servicio?.nombre || 'Sin servicio',
          fecha: turno.dia,
          hora: turno.hora,
          duracion: turno.servicio?.duracion !== undefined ? formatDuration(turno.servicio.duracion) : 'Duración no especificada',
        }));

        setListaDeTurnos(turnosTransformados);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTurnos();
  }, []);

  const handleEliminarTurno = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/misturnos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authtoken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el turno');
      }

      const nuevaListaDeTurnos = listaDeTurnos.filter(turno => turno.id !== id);
      setListaDeTurnos(nuevaListaDeTurnos);
      if (onTurnoEliminado) {
        onTurnoEliminado(id);
      }
    } catch (error) {
      console.error('Error al eliminar el turno:', error.message);
      alert('No se pudo eliminar el turno. Intentalo de nuevo.');
    }
  };


  if (loading) {
    return <p>Cargando tus turnos...</p>;
  }

  if (error) {
    return <p>Error al cargar los turnos: {error}</p>;
  }

  return (
    <div className="turnos-container">
      <h2 className="turnos-title">MIS TURNOS</h2>
      {listaDeTurnos.length === 0 ? (
        <p>No tienes turnos programados.</p>
      ) : (
        <table className="turnos-table">
          <thead>
            <tr>
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
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

}

export default Turnos;