export const getDailyStats = async () => {
  const response = await fetch('http://localhost:5000/api/admin/stats/daily');
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener estadísticas diarias');
  }
  
  return data;
};

export const getMonthlyStats = async () => {
  const response = await fetch('http://localhost:5000/api/admin/stats/monthly');
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener estadísticas mensuales');
  }
  
  return data;
};

export const getConsultationTypes = async () => {
  const response = await fetch('http://localhost:5000/api/admin/stats/types');
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener tipos de consulta');
  }
  
  return data;
};

export const getFeedbackStats = async () => {
  const response = await fetch('http://localhost:5000/api/admin/stats/feedback');
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener estadísticas de feedback');
  }
  
  return data;
};