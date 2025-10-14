import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ListaSesiones from '../components/ListaSesiones/Listasesiones'; 


const HistorialClinico = () => {
    const { dni } = useParams();
    const navigate = useNavigate();

    const [patientData, setPatientData] = useState(null);
    const [sesiones, setSesiones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistorial = async () => {
            if (!dni) {
                setError("DNI del paciente no especificado.");
                setLoading(false);
                return;
            }

            const token = localStorage.getItem('authtoken');
            if (!token) {
                navigate('/login'); 
                return;
            }
            
            try {
                const decodedToken = jwtDecode(token);
                const role = decodedToken.role;
                console.log("Rol decodificado:", role);
                if (role !== 'profesional' && role !== 'admin' && role !== 'superadmin') {
        setError("Acceso denegado. Solo personal autorizado puede ver historiales."); 
        setLoading(false);
        return;
    }
            } catch (e) {
                setError("Error de autenticación. Por favor, vuelve a iniciar sesión.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            const url = `http://localhost:3000/patients/${dni}/sessions`; 

            try {
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 404) {
                    throw new Error(`Paciente con DNI ${dni} no encontrado.`);
                }
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: 'Error desconocido del servidor' }));
                    throw new Error(errorData.message || `Error al cargar el historial (Status: ${response.status})`);
                }

                const data = await response.json();
                
                setPatientData(data.patient);
                setSesiones(data.sessions);

            } catch (err) {
                console.error("Error al obtener historial:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHistorial();
    }, [dni, navigate]);


    if (loading) {
        return <div className="historial-container"><p>Cargando Historial Clínico...</p></div>;
    }

    if (error) {
        return <div className="historial-container"><p className="error-message">Error: {error}</p></div>;
    }
    
    if (!patientData) {
         return <div className="historial-container"><p className="error-message">No se pudieron cargar los datos del paciente.</p></div>;
    }

    return (
        <div className="historial-container">
            <h2 className="historial-title">
                Historial Clínico de {patientData.name} {patientData.lastname}
            </h2>
            <div className="patient-info-box">
                <p><strong>DNI:</strong> {patientData.id}</p>
                <p><strong>Email:</strong> {patientData.email}</p>
                <p><strong>Teléfono:</strong> {patientData.phone || 'No registrado'}</p>
            </div>

            <div className="sessions-section">
                <ListaSesiones sesiones={sesiones} /> 
            </div>
            
            <button onClick={() => navigate(-1)} className="btn-back">
                Volver a la Agenda
            </button>
        </div>
    );
};

export default HistorialClinico;