import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Avisolegal from "./pages/AvisoLegal"
import AcercaDe from "./pages/AcercaDe";
import Contacto from "./pages/Contacto";
import Login from "./pages/Login"
import Signin from "./pages/Singin"
import Bienvenida from "./pages/Bienvenida"
import GestionarPeril from "./pages/GestionarPerfil"
import AsesoriaIA from "./pages/AsesoriaIA";
import ScrollTop from "./components/ScrollTop"

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <main className="flex-grow-1">
        <ScrollTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Aviso-legal" element={<Avisolegal/>} />
            <Route path="/Acerca-de" element={<AcercaDe/>} />            
            <Route path="/Contacto" element={<Contacto/>} />
            <Route path="/Login" element={<Login/>} />      
            <Route path="/Sing-in" element={<Signin/>} />
            <Route path="/Bienvenida" element={<Bienvenida/>} />
            <Route path="/Gestionar-perfil" element={<GestionarPeril/>} />
            <Route path="/asesoria-ia" element={<AsesoriaIA />} />

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;