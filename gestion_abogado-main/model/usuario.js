module.exports = {
    obtener: function(conexion, callback) {
        conexion.query("SELECT * FROM usuario", (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },

    //CREAR UN USUARIO CLIENTE/ADMINISTRADOR
        // Verificar si usuario existe
        existeUsuario: function(conexion, usuario, email, callback) {
            const query = "SELECT * FROM usuario WHERE usuario = ? OR email = ?";
            conexion.query(query, [usuario, email], (err, resultados) => {
                if (err) return callback(err);
                callback(null, resultados.length > 0);
            });
        },
        // Crear nuevo usuario
        crearUsuario: function(conexion, datosUsuario, callback) {
            const query = "INSERT INTO usuario SET ?";
            conexion.query(query, datosUsuario, (err, resultados) => {
                if (err) return callback(err);
                callback(null, resultados);
            });
        },
    //EDITAR USUARIO
        // Obtener usuario por nombre de usuario
        obtenerPorUsuario: function(conexion, usuarioParam, callback) {
            const query = "SELECT * FROM usuario WHERE usuario = ?";
            conexion.query(query, [usuarioParam], (err, resultados) => {
                if (err) return callback(err);
                callback(null, resultados[0]); // Devuelve el primer resultado
            });
        },

        // Verificar si otro usuario tiene el mismo nombre o email (excluyendo el usuario actual)
        existeOtroUsuario: function(conexion, usuarioActual, nuevoUsuario, nuevoEmail, callback) {
            const query = "SELECT * FROM usuario WHERE (usuario = ? OR email = ?) AND usuario != ?";
            conexion.query(query, [nuevoUsuario, nuevoEmail, usuarioActual], (err, resultados) => {
                if (err) return callback(err);
                callback(null, resultados.length > 0);
            });
        },

        // Actualizar usuario por nombre de usuario
        actualizarUsuarioPorUsuario: function(conexion, usuarioActual, datosUsuario, callback) {
            const query = "UPDATE usuario SET ? WHERE usuario = ?";
            conexion.query(query, [datosUsuario, usuarioActual], (err, resultados) => {
                if (err) return callback(err);
                callback(null, resultados);
            });
        },
    //INICIO SESION
        autenticarUsuario: function(conexion, usuario, password, callback) {
            const query = "SELECT id, usuario, nombre, apellido, rol, email FROM usuario WHERE usuario = ? AND password = ?";
            conexion.query(query, [usuario, password], (err, resultados) => {
                if (err) return callback(err);
                callback(null, resultados[0]); // Devuelve el primer resultado sin la contraseña
            });
        },
    //OBTENER DATOS USUARIO ESPECIFICO
        // Obtener datos de usuario por nombre de usuario (sin contraseña)
        obtenerPorUsuario: function(conexion, usuarioParam, callback) {
            const query = "SELECT id, usuario, nombre, apellido, rol, email FROM usuario WHERE usuario = ?";
            conexion.query(query, [usuarioParam], (err, resultados) => {
                if (err) return callback(err);
                callback(null, resultados[0]); // Devuelve solo el primer resultado
            });
        },
    //OBTENER USUARIOS CLIENTE/ADMINISTRADOR
        // Obtener todos los administradores
        obtenerAdministradores: function(conexion, callback) {
            const query = "SELECT id, usuario, nombre, apellido, rol, email FROM usuario WHERE rol = 'admin' OR rol = 'administrador'";
            conexion.query(query, (err, resultados) => {
                if (err) return callback(err);
                callback(null, resultados);
            });
        },

        // Obtener todos los clientes
        obtenerClientes: function(conexion, callback) {
            const query = "SELECT id, usuario, nombre, apellido, rol, email FROM usuario WHERE rol = 'cliente' OR rol = 'client'";
            conexion.query(query, (err, resultados) => {
                if (err) return callback(err);
                callback(null, resultados);
            });
        },
    //ELIMINAR USUARIO
        // Eliminar usuario solo por nombre de usuario
        eliminarPorUsuario: function(conexion, usuarioParam, callback) {
            const query = "DELETE FROM usuario WHERE usuario = ?";
            conexion.query(query, [usuarioParam], (err, resultados) => {
                if (err) return callback(err);
                callback(null, resultados.affectedRows);
            });
        },

        // Eliminar usuario con validación de usuario y contraseña
        eliminarPorUsuarioYPassword: function(conexion, usuarioParam, password, callback) {
            // Primero verificar que coincidan usuario y contraseña
            const queryVerificar = "SELECT id FROM usuario WHERE usuario = ? AND password = ?";
            conexion.query(queryVerificar, [usuarioParam, password], (err, resultados) => {
                if (err) return callback(err);
                
                if (resultados.length === 0) {
                    return callback(null, 0); // No se encontró coincidencia
                }

                // Si las credenciales son correctas, proceder a eliminar
                const queryEliminar = "DELETE FROM usuario WHERE usuario = ?";
                conexion.query(queryEliminar, [usuarioParam], (err, resultados) => {
                    if (err) return callback(err);
                    callback(null, resultados.affectedRows);
                });
            });
        }
}