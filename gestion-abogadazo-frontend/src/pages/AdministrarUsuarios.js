import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaTrash, FaUser, FaEnvelope, FaSearch } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const initialUsers = [
  { id: 1, nombre: "Juan", apellido: "Pérez", correo: "juan@gmail.com", consultas: 10 },
  { id: 2, nombre: "María", apellido: "López", correo: "maria@gmail.com", consultas: 5 },
  { id: 3, nombre: "Carlos", apellido: "Ramírez", correo: "carlos@gmail.com", consultas: 7 },
];

const AdministrarUsuarios = () => {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);

  const filteredUsers = users.filter((u) =>
    `${u.nombre} ${u.apellido}`.toLowerCase().includes(search.toLowerCase()) ||
    u.correo.toLowerCase().includes(search.toLowerCase())
  );

  const eliminarUsuario = () => {
    if (userToDelete) {
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      setUserToDelete(null);
    }
  };

  return (
    <div className="container py-5">
      <motion.h1
        className="text-center fw-bold mb-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Administrar Usuarios
      </motion.h1>

      <motion.div
        className="d-flex justify-content-between align-items-center mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="input-group" style={{ maxWidth: "350px" }}>
          <span className="input-group-text">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar usuario"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="text-muted">{filteredUsers.length} usuario(s)</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="table-responsive shadow rounded">
          <table className="table table-striped align-middle">
            <thead className="table-primary">
              <tr>
                <th><FaUser /> Nombre</th>
                <th>Apellido</th>
                <th><FaEnvelope /> Correo</th>
                <th>Consultas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.nombre}</td>
                  <td>{user.apellido}</td>
                  <td>{user.correo}</td>
                  <td>{user.consultas}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => setUserToDelete(user)}
                    >
                      <FaTrash /> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal de confirmación */}
      {userToDelete && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Confirmar eliminación</h5>
                <button type="button" className="btn-close" onClick={() => setUserToDelete(null)}></button>
              </div>
              <div className="modal-body">
                ¿Estás seguro de que deseas eliminar al usuario <strong>{userToDelete.nombre} {userToDelete.apellido}</strong>?
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setUserToDelete(null)}>Cancelar</button>
                <button className="btn btn-danger" onClick={eliminarUsuario}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdministrarUsuarios;
