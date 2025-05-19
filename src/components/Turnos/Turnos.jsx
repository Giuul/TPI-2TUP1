import React, { useState, useEffect } from 'react';
import TurnoItem from '../TurnoItem/TurnoItem'; 

const Turnos = ({ onTurnoEliminado }) => { 
  const [listaDeTurnos, setListaDeTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const data = [
          { id: 1, servicios: 'Depilación Láser Piernas', fecha: '2025-05-20', hora: '15:00', duracion: '60 minutos' },
          { id: 2, servicios: 'Limpieza Facial Profunda', fecha: '2025-05-25', hora: '10:30', duracion: '90 minutos' },
          { id: 3, servicios: 'Depilación Láser Brazos', fecha: '2025-05-30', hora: '17:00', duracion: '45 minutos' },
        ];
        setListaDeTurnos(data);
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
    <div>
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
};

export default Turnos;