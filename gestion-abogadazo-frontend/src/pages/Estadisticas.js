// src/pages/AdminStats.jsx
import React from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import NavBarAdmin from "../components/NavBarAdmin";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { FaStar, FaChartLine, FaUsers, FaSearch } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Estadisticas = () => {
  const consultasDia = 42;
  const promedioFeedback = 4.6;
  const usuariosActivos = 123;
  const crecimientoMensual = 12;

  const consultasMes = [
    { dia: 1, consultas: 10 }, { dia: 2, consultas: 20 }, { dia: 3, consultas: 5 },
    { dia: 4, consultas: 15 }, { dia: 5, consultas: 30 }, { dia: 6, consultas: 8 },
    { dia: 7, consultas: 18 }, { dia: 8, consultas: 12 }, { dia: 9, consultas: 14 },
    { dia: 10, consultas: 22 }, { dia: 11, consultas: 6 }, { dia: 12, consultas: 10 },
    { dia: 13, consultas: 9 }, { dia: 14, consultas: 5 }, { dia: 15, consultas: 17 },
    { dia: 16, consultas: 8 }, { dia: 17, consultas: 20 }, { dia: 18, consultas: 13 },
    { dia: 19, consultas: 11 }, { dia: 20, consultas: 19 }, { dia: 21, consultas: 22 },
    { dia: 22, consultas: 8 }, { dia: 23, consultas: 16 }, { dia: 24, consultas: 7 },
    { dia: 25, consultas: 14 }, { dia: 26, consultas: 10 }, { dia: 27, consultas: 9 },
    { dia: 28, consultas: 13 }, { dia: 29, consultas: 11 }, { dia: 30, consultas: 12 }
  ];

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

  const consultasPorSemana = agruparConsultasPorSemana(consultasMes);

  const tiposConsultas = [
    { name: "Choques", value: 45 },
    { name: "Atropellamientos", value: 25 },
    { name: "Conducción bajo efectos del alcohol", value: 20 },
    { name: "Otras", value: 10 }
  ];

  const pieColors = ["#007bff", "#28a745", "#ffc107", "#dc3545"];

  const topConsultas = [
    "¿Qué hacer si me detiene un policía en estado de ebriedad?",
    "¿Qué hacer si atropellé a un peatón?",
    "¿Me pueden remolcar sin estar presente?",
    "¿Cuáles son mis derechos en un accidente sobre vía pública?",
    "¿Qué hacer si acabo de chocar?"
  ];

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
        <div className="row text-center mb-5" style={{ paddingTop: '5rem'}}>
          <div className="col-md-3">
            <motion.div className="card shadow p-4" whileHover={{ scale: 1.05 }}>
              <FaSearch size={30} className="mb-2 text-primary" />
              <h5>Consultas hoy</h5>
              <p className="display-6 fw-bold">{consultasDia}</p>
            </motion.div>
          </div>
          <div className="col-md-3">
            <motion.div className="card shadow p-4" whileHover={{ scale: 1.05 }}>
              <FaStar size={30} className="mb-2 text-warning" />
              <h5>Promedio de feedback</h5>
              <p className="display-6 fw-bold">{promedioFeedback.toFixed(1)} ⭐</p>
            </motion.div>
          </div>
          <div className="col-md-3">
            <motion.div className="card shadow p-4" whileHover={{ scale: 1.05 }}>
              <FaUsers size={30} className="mb-2 text-success" />
              <h5>Usuarios activos</h5>
              <p className="display-6 fw-bold">{usuariosActivos}</p>
            </motion.div>
          </div>
          <div className="col-md-3">
            <motion.div className="card shadow p-4" whileHover={{ scale: 1.05 }}>
              <FaChartLine size={30} className="mb-2 text-info" />
              <h5>Crecimiento mensual</h5>
              <p className="display-6 fw-bold">{crecimientoMensual}%</p>
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
                data={tiposConsultas}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {tiposConsultas.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Consultas más frecuentes */}
        <div>
          <h4 className="mb-3">Consultas más frecuentes</h4>
          <ul className="list-group">
            {topConsultas.map((consulta, index) => (
              <li key={index} className="list-group-item">
                {index + 1}. {consulta}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Estadisticas;
