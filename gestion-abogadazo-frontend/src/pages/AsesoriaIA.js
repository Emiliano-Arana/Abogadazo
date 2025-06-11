import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NavBar2 from "../components/NavBar2";
import Footer from "../components/Footer";
import "../styles/AsesoriaIA.css";
import { FaPaperPlane } from "react-icons/fa";
import { consultarChatLegal } from "../services/legalService";
import authService from "../services/authService";


const AsesoriaIA = () => {
    const location = useLocation(); // Obtiene la ubicación de la ruta actual
    const storedUser = authService.getCurrentUser();
    const userId = storedUser?.id;

    useEffect(() => {
        window.scrollTo(0, 0); // Mueve el scroll a la parte superior
    }, [location]); // Este efecto se ejecuta cada vez que la ubicación cambia

    const [consulta, setConsulta] = useState("");
    const [historial, setHistorial] = useState([]);

    const manejarEnvio = async () => {
        if (consulta.trim() === "") return;

        const nuevaEntrada = {
            pregunta: consulta,
            respuesta: "Cargando...",
        };

        setHistorial([nuevaEntrada, ...historial]);
        setConsulta("");

        try {
            const data = await consultarChatLegal(consulta,userId);
            const nuevaRespuesta = {
            pregunta: consulta,
            respuesta: data.respuesta,
            fuentes: data.fuentes
            };
            setHistorial([nuevaRespuesta, ...historial]);
        } catch (error) {
            const errorRespuesta = {
            pregunta: consulta,
            respuesta: "Ocurrió un error al procesar tu consulta. Intenta nuevamente.",
            };
            setHistorial([errorRespuesta, ...historial]);
        }
    };

    return (
        <>
        <NavBar2 />
        <div className="page-container">
            <main className="content-wrap">
            <div className="asesoriaia-container container" style={{ paddingTop: '5rem' }}>
                <div className="main-content">
                <div className="text-center mb-5">
                    <h1 className="fw-bold display-5 text-dark">Asesoría Legal Inteligente</h1>
                    <p className="fw-light fs-5 text-muted">
                    Consulta a nuestro asistente legal inteligente sobre cualquier situación de tránsito.
                    </p>
                </div>

                {/* Sección del chat */}
                <div className="row">
                    <div className="col-lg-8 mb-4">
                    <div className="chat-box p-4 rounded-4 shadow-sm bg-light">
                        <div className="chat-historial overflow-auto mb-4" style={{ maxHeight: "400px" }}>
                        {historial.length === 0 ? (
                            <p className="text-muted fw-light">Aún no has realizado ninguna consulta.</p>
                        ) : (
                            historial.map((item, index) => (
                            <div key={index} className="mb-4">
                                <div className="text-end">
                                <p className="fw-bold text-primary mb-1">Tú:</p>
                                <div className="bubble-user">{item.pregunta}</div>
                                </div>
                                <div className="text-start mt-2">
                                <p className="fw-bold text-success mb-1">Abogadazo IA:</p>
                                <div className="bubble-ia">
                                    {item.respuesta.split('\n').map((linea, i) => (
                                        <React.Fragment key={i}>
                                        {linea}
                                        <br />
                                        </React.Fragment>
                                    ))}
                                </div>
                                </div>
                            </div>
                            ))
                        )}
                        </div>

                        {/* Input para nueva consulta */}
                        <div className="d-flex">
                        <input
                            type="text"
                            className="form-control me-2 shadow-sm"
                            placeholder="Escribe tu consulta legal aquí..."
                            value={consulta}
                            onChange={(e) => setConsulta(e.target.value)}
                        />
                        <button onClick={manejarEnvio} className="btn btn-dark d-flex align-items-center">
                            <FaPaperPlane className="me-2" />
                            Enviar
                        </button>
                        </div>
                    </div>
                    </div>

                    {/* Sección de historial */}
                    <div className="col-lg-4">
                    <div className="historial-box bg-white p-4 rounded-4 shadow-sm h-100">
                        <h5 className="fw-bold text-dark mb-3">Historial de consultas</h5>
                        {historial.length === 0 ? (
                        <p className="text-muted fw-light">Tu historial aparecerá aquí.</p>
                        ) : (
                        <ul className="list-group list-group-flush">
                            {historial.map((item, index) => (
                            <li key={index} className="list-group-item fw-light text-muted">
                                {item.pregunta.slice(0, 60)}...
                            </li>
                            ))}
                        </ul>
                        )}
                    </div>
                    </div>
                </div>
                </div>

                
            </div>
            </main>            
        </div>
        <Footer />
        </>
    );
};

export default AsesoriaIA;
