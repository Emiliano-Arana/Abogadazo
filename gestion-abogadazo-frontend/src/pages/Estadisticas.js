// src/pages/AdminStats.jsx

import React from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from "recharts";
import { FaStar, FaChartPie, FaChartLine, FaUsers, FaSearch } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Estadisticas = () => {
  // Datos ficticios para ejemplo
  const consultasDia = 42;
  const promedioFeedback = 4.6;
  const usuariosActivos = 123;
  const crecimientoMensual = 12; // %
  const consultasMes = [
    { dia: "1", consultas: 10 },
    { dia: "2", consultas: 20 },
    { dia: "3", consultas: 5 },
    { dia: "4", consultas: 15 },
    { dia: "5", consultas: 30 },
    { dia: "6", consultas: 8 },
    { dia: "7", consultas: 18 },
    // ... puedes completar los 30 días
  ];

  const tiposConsultas = [
    { name: "Choques", value: 45 },
    { name: "Atropellamientos", value: 25 },
    { name: "Conducción bajo efectos del alcohol", value: 20 },
    { name: "Otras", value: 10 }
  ];

  const topConsultas = [
    "¿Qué hacer si me detiene un policía?",
    "¿Cómo tramitar un divorcio exprés?",
    "¿Me pueden remolcar sin estar presente?",
    "¿Cuáles son mis derechos en un accidente?",
    "¿Cómo validar si un contrato es legal?"
  ];

  const pieColors = ["#007bff", "#28a745", "#ffc107", "#dc3545"];

  return (
    <div className="container py-5">
      <motion.h1
        className="text-center fw-bold mb-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Estadísticas del Sistema
      </motion.h1>

      {/* Métricas rápidas */}
      <div className="row text-center mb-5">
        <div className="col-md-3">
          <motion.div
            className="card shadow p-4"
            whileHover={{ scale: 1.05 }}
          >
            <FaSearch size={30} className="mb-2 text-primary" />
            <h5>Consultas hoy</h5>
            <p className="display-6 fw-bold">{consultasDia}</p>
          </motion.div>
        </div>
        <div className="col-md-3">
          <motion.div
            className="card shadow p-4"
            whileHover={{ scale: 1.05 }}
          >
            <FaStar size={30} className="mb-2 text-warning" />
            <h5>Promedio de feedback</h5>
            <p className="display-6 fw-bold">{promedioFeedback.toFixed(1)} ⭐</p>
          </motion.div>
        </div>
        <div className="col-md-3">
          <motion.div
            className="card shadow p-4"
            whileHover={{ scale: 1.05 }}
          >
            <FaUsers size={30} className="mb-2 text-success" />
            <h5>Usuarios activos</h5>
            <p className="display-6 fw-bold">{usuariosActivos}</p>
          </motion.div>
        </div>
        <div className="col-md-3">
          <motion.div
            className="card shadow p-4"
            whileHover={{ scale: 1.05 }}
          >
            <FaChartLine size={30} className="mb-2 text-info" />
            <h5>Crecimiento mensual</h5>
            <p className="display-6 fw-bold">{crecimientoMensual}%</p>
          </motion.div>
        </div>
      </div>

      {/* Gráfica de barras */}
      <div className="mb-5">
        <h4 className="mb-3">Consultas en el mes</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={consultasMes}>
            <XAxis dataKey="dia" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="consultas" fill="#007bff" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de pastel */}
      <div className="mb-5">
        <h4 className="mb-3">Tipos de consultas</h4>
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
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Top consultas */}
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
  );
};

export default Estadisticas;
