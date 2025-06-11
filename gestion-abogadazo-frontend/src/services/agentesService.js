export async function consultarAgente(placa,id_usuario) {
  try {
    const response = await fetch(`http://localhost:5000/api/agentes/consulta?placa=${placa}&id=${id_usuario}`);
    if (!response.ok) {
      throw new Error('El agente no está registrado en la Gaceta Oficial, puedes impugnar la multa ante el Tribunal de Justicia Administrativa de la CDMX.');
    }
    return await response.json();
  } catch (error) {
    console.error("Error al consultar agente:", error);
    throw error;
  }
}