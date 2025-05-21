export async function consultarAgente(placa) {
  try {
    const response = await fetch(`http://localhost:5000/api/agentes/consulta?placa=${placa}`);
    if (!response.ok) {
      throw new Error('Número de placa no encontrado');
    }
    return await response.json();
  } catch (error) {
    console.error("Error al consultar agente:", error);
    throw error;
  }
}