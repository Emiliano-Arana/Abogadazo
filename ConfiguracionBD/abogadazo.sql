-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 04, 2025 at 11:23 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `abogadazo`
--

-- --------------------------------------------------------

--
-- Table structure for table `usuario`
--

CREATE TABLE IF NOT EXISTS usuario (
  id int AUTO_INCREMENT PRIMARY KEY,
  usuario varchar(100) NOT NULL unique,
  nombre varchar(100) NOT NULL,
  apellido varchar(100) NOT NULL,
  rol varchar(100) NOT NULL,
  email varchar(100) NOT NULL unique,
  password varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS agentes_facultados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  placa VARCHAR(50) NOT NULL,
  nombre VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS consulta_agentes (
  id int AUTO_INCREMENT PRIMARY KEY,
  fecha date NOT NULL,
  id_usuario int,
  id_agente int,
  CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_agente FOREIGN KEY (id_agente) REFERENCES agentes_facultados(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS consulta (
  id int AUTO_INCREMENT PRIMARY KEY,
  fecha date NOT NULL,
  texto text NOT NULL,
  id_usuario int,
  CONSTRAINT fk_consulta_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS respuesta (
  id int AUTO_INCREMENT PRIMARY KEY,
  texto text NOT NULL,
  tipo varchar(50) NOT NULL,
  id_consulta int,
  CONSTRAINT fk_respuesta_consulta FOREIGN KEY (id_consulta) REFERENCES consulta(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS retroalimentacion (
  id int AUTO_INCREMENT PRIMARY KEY,
  estrellas int NOT NULL CHECK (estrellas BETWEEN 1 AND 5),
  comentarios text,
  id_respuesta int,
  CONSTRAINT fk_retroalimentacion_respuesta FOREIGN KEY (id_respuesta) REFERENCES respuesta(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
