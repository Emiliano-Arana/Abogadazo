// src/pages/AdminStats.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import NavBarAdmin from "../components/NavBarAdmin";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { FaStar, FaChartLine, FaSearch } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { 
  getDailyStats, 
  getMonthlyStats, 
  getConsultationTypes, 
  getFeedbackStats 
} from "../services/statsService";

const Estadisticas = () => {
  const [stats, setStats] = useState({
    consultasDia: 0,
    promedioFeedback: 0,
    crecimientoMensual: 0,
    consultasMes: [],
    tiposConsultas: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        const [daily, monthly, types, feedback] = await Promise.all([
          getDailyStats(),
          getMonthlyStats(),
          getConsultationTypes(),
          getFeedbackStats()
        ]);
        
        setStats({
          consultasDia: daily.consultas_hoy,
          promedioFeedback: feedback.promedio_feedback,
          crecimientoMensual: feedback.crecimiento_mensual,
          consultasMes: monthly.consultas_mes,
          tiposConsultas: types.tipos_consulta
        });
        
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const agruparConsultasPorSemana = (consultasMes) => {
    const semanas = [0, 0, 0, 0];
    consultasMes.forEach(({ dia, consultas }) => {
      const semanaIndex = Math.floor((dia - 1) / 8);
      semanas[semanaIndex] += consultas;
    });

    return semanas.map((consultas, i) => ({
      semana: `Semana ${i + 1}`,
      consultas
    }));
  };

  const consultasPorSemana = agruparConsultasPorSemana(stats.consultasMes);
  const pieColors = ["#007bff", "#28a745", "#ffc107", "#dc3545"];

  if (loading) {
    return <div className="text-center mt-5">Cargando estadísticas...</div>;
  }


  return (
    <>
      <NavBarAdmin />
      <div className="container" style={{ paddingTop: '10rem'}}>
        <motion.h1
          className="text-center mb-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Estadísticas del Sistema
        </motion.h1>

        {/* Métricas rápidas */}
        <div className="row text-center mb-5" style={{ paddingTop: '4rem'}}>
          <div className="col-md-4">
            <motion.div className="card shadow p-4" whileHover={{ scale: 1.05 }}>
              <FaSearch size={30} className="mb-2 text-primary" />
              <h5>Consultas hoy</h5>
              <p className="display-6 fw-bold">{stats.consultasDia}</p>
            </motion.div>
          </div>
          <div className="col-md-4">
            <motion.div className="card shadow p-4" whileHover={{ scale: 1.05 }}>
              <FaStar size={30} className="mb-2 text-warning" />
              <h5>Promedio de feedback</h5>
              <p className="display-6 fw-bold">
                {typeof stats.promedioFeedback === "number" ? stats.promedioFeedback.toFixed(1) : "N/A"} ⭐
              </p>
            </motion.div>
          </div>
          <div className="col-md-4">
            <motion.div className="card shadow p-4" whileHover={{ scale: 1.05 }}>
              <FaChartLine size={30} className="mb-2 text-info" />
              <h5>Crecimiento mensual</h5>
              <p className="display-6 fw-bold">
                {typeof stats.crecimientoMensual === "number" ? `${stats.crecimientoMensual}%` : "N/A"}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Gráfica de barras por semana */}
        <div className="mb-5" style={{ paddingTop: '5rem'}}>
          <h4 className="mb-3">Consultas en el mes por semana</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={consultasPorSemana}>
              <XAxis dataKey="semana" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="consultas" fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de pastel con leyenda */}
        <div className="mb-5">
          <h4 className="mb-3" style={{ paddingTop: '5rem'}}>Tipos de consultas</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.tiposConsultas}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {stats.tiposConsultas.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Estadisticas;
