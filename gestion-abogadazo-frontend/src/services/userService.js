// services/userService.js
export const createUser = async (userData) => {
  const response = await fetch('http://localhost:3000/usuarios/crear_usuario', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Error al crear el usuario');
  }
  
  return data;
};

export const getUser = async (userId) => {
  const response = await fetch(`http://localhost:3000/usuarios/datos_usuario/${userId}`);
  return await response.json();
};

export const updateUser = async (userData) => {
  const response = await fetch(`http://localhost:3000/usuarios/editar_usuario/${userData.usuario}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return await response.json();
};

export const deleteUser = async (userId) => {
  const response = await fetch(`http://localhost:3000/usuarios/delete_usuario/${userId}`, {
    method: 'DELETE',
  });
  return await response.json();
};