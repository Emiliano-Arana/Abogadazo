const API_URL = 'http://localhost:5000/api/chat-legal/consulta';
const FEEDBACK_URL = 'http://localhost:5000/api/chat-legal/feedback';

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

export const enviarFeedbackLegal = async ({ userId, pregunta, respuesta, rating }) => {
  try {
    const response = await fetch(FEEDBACK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, pregunta, respuesta, rating })
    });

    if (!response.ok) {
      throw new Error('Error al enviar feedback');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al enviar calificación:', error);
    throw error;
  }
};

