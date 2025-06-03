import React, { useState, useEffect } from 'react';
import TurnoItem from '../TurnoItem/TurnoItem';
import "./turnos.css";

const Turnos = ({ onTurnoEliminado }) => {
  const [listaDeTurnos, setListaDeTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const response = await fetch('http://localhost:3000/turnos');
        if (!response.ok) {
          throw new Error('Error al obtener los turnos');
        }

        const data = await response.json();

        const turnosTransformados = data.map((turno) => ({
          id: turno.id,
          servicios: turno.servicio?.nombre || 'Sin servicio',
          fecha: turno.dia,
          hora: turno.hora,
          duracion:  turno.servicio?.duracion !== undefined  ? formatDuration(turno.servicio.duracion) : 'Duración no especificada',
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

  const handleEliminarTurno = (id) => {
    const nuevaListaDeTurnos = listaDeTurnos.filter(turno => turno.id !== id);
    setListaDeTurnos(nuevaListaDeTurnos);
    if (onTurnoEliminado) {
      onTurnoEliminado(id);
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
      {listaDeTurnos.map(turno => (
        <TurnoItem
          key={turno.id}
          {...turno}
          onEliminar={handleEliminarTurno}
        />
      ))}
      {listaDeTurnos.length === 0 && <p>No tienes turnos programados.</p>}
    </div>
  );
}

export default Turnos;