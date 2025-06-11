from flask import Flask, request, jsonify
from flask_cors import CORS 
from model import AsistenteLegal
from datetime import datetime
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
    id_usuario = request.args.get('id', '') # El front debe enviar el id de usuario tambien
    placa = request.args.get('placa', '').strip().upper()
    
    if not placa:
        return jsonify({
            'error': 'Número de placa requerido',
            'status_code': 400
        }), 400
    if not id_usuario or not id_usuario.isdigit():
        return jsonify({
            'error': 'Usuario no válido',
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
        
        fecha_consulta = datetime.now().date()  # Obtenemos la fecha actual
        registro_exitoso = database.register_agent_search(
            id_usuario=int(id_usuario),
            id_agente=agente['id'],
            fecha=fecha_consulta
        )

        if not registro_exitoso:
            app.logger.warning(f"No se pudo registrar la consulta del agente {placa} por usuario {id_usuario}")
        
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
    id_usuario = data.get('id_usuario')  # El front debe enviar el id de usuario tambien
    pregunta = data.get('pregunta', '').strip()
    
    if not pregunta:
        return jsonify({'error': 'La pregunta es requerida'}), 400
    
    try:
       # Consulta al asistente legal
        resultado = legal_ai.consultar(pregunta)

        # Registrar la consulta en la base de datos
        fecha_actual = datetime.now().date()
        consulta_id = database.register_consultation(
            id_usuario=int(id_usuario),
            fecha=fecha_actual,
            texto=pregunta
        )
        if not consulta_id:
            app.logger.error("No se pudo registrar la consulta en la base de datos")

        # Registrar la respuesta en la base de datos
        if consulta_id and "respuesta" in resultado:
            respuesta_id = database.register_response(
                texto=resultado["respuesta"],
                tipo=resultado.get("categoria", "general"),  # Usamos la categoría como tipo
                id_consulta=consulta_id
            )
            
            if not respuesta_id:
                app.logger.error("No se pudo registrar la respuesta en la base de datos")

        
        return jsonify({
            'success': True,
            'respuesta': resultado["respuesta"],
            'fuentes': resultado["fuentes"],
            'id_respuesta': respuesta_id if 'respuesta_id' in locals() else None
        })
    except Exception as e:
        return jsonify({
            'error': 'Error al procesar la consulta',
            'details': str(e)
        }), 500

# ==============================================
# RUTAS ADICIONALES
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