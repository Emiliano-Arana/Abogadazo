const API_URL = 'http://localhost:5000/api/chat-legal/consulta';

export const consultarChatLegal = async (pregunta,id_usuario) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pregunta,id_usuario })
    });
    
    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Error en la consulta legal');
    }
    
    return data;
  } catch (error) {
    console.error('Error al consultar el chat legal:', error);
    throw error;
  }
};