from flask import Flask, request, jsonify
from flask_cors import CORS 
from model import AsistenteLegal
import database

app = Flask(__name__)
CORS(app)  # Habilita CORS

legal_ai = AsistenteLegal()

# ==============================================
# RUTAS RELACIONADAS CON AGENTES
# ==============================================

@app.route('/api/agentes/consulta', methods=['GET'])
def consulta_agente():
    # Obtener y validar el parámetro de la placa
    placa = request.args.get('placa', '').strip().upper()
    
    if not placa:
        return jsonify({
            'error': 'Número de placa requerido',
            'status_code': 400
        }), 400
    
    try:
        # Consultar la base de datos
        agente = database.agent_by_platenumber(placa)
        
        if not agente:
            return jsonify({
                'error': f'Agente con placa {placa} no encontrado',
                'suggestions': [],
                'status_code': 404
            }), 404
        
        return jsonify({
            'success': True,
            'agente': agente,
            'status_code': 200
        })
        
    except Exception as e:
        # Capturar errores de base de datos
        app.logger.error(f"Error en consulta_agente: {str(e)}")
        return jsonify({
            'error': 'Error interno del servidor al consultar agente',
            'details': str(e),
            'status_code': 500
        }), 500

# ==============================================
# RUTAS RELACIONADAS CON EL CHAT LEGAL (IA)
# ==============================================

@app.route('/api/chat-legal/consulta', methods=['POST'])
def consulta_legal():
    data = request.get_json()
    pregunta = data.get('pregunta', '').strip()
    
    if not pregunta:
        return jsonify({'error': 'La pregunta es requerida'}), 400
    
    try:
        resultado = legal_ai.consultar(pregunta)
        return jsonify({
            'success': True,
            'respuesta': resultado["respuesta"],
            'fuentes': resultado["fuentes"]
        })
    except Exception as e:
        return jsonify({
            'error': 'Error al procesar la consulta',
            'details': str(e)
        }), 500

# ==============================================
# RUTAS ADICIONALES (EJEMPLO)
# ==============================================

@app.route('/api/status', methods=['GET'])
def status_check():
    """Ruta para verificar que el servidor está funcionando"""
    return jsonify({
        'status': 'active',
        'services': {
            'agentes': True,
            'chat-legal': True
        }
    })


#Inicio de la aplicacion
if __name__ == '__main__':
    app.run(debug=True, port=5000)