import mysql.connector
from mysql.connector import Error
import csv

# Configuración de la base de datos MySQL
DB_CONFIG = {
    'host': 'localhost',
    'database': 'abogadazo',
    'user': 'root',
    'password': '3927',
    'port': 3306
}

def submit_agents(route):
    conn = get_connection()
    if conn is None:
        return None

    cursor = conn.cursor()
    # Contadores para estadísticas
    total = 0
    insertados = 0
    duplicados = 0
    try:
        with open(route, mode='r', encoding='utf-8') as csv_file:
            csv_reader = csv.DictReader(csv_file)
            
            for row in csv_reader:
                total += 1
                placa = row['placa']
                nombre = row['nombre_completo']
                
                # Verificar si la placa ya existe
                cursor.execute("SELECT id FROM agentes_facultados WHERE placa = %s", (placa,))
                if cursor.fetchone() is None:
                    # Insertar nuevo agente
                    cursor.execute(
                        "INSERT INTO agentes_facultados (placa, nombre) VALUES (%s, %s)",
                        (placa, nombre)
                    )
                    insertados += 1
                else:
                    duplicados += 1
                
                # Hacer commit cada 100 registros
                if total % 100 == 0:
                    conn.commit()
            
            # Commit final por si quedaron registros pendientes
            conn.commit()
                
            print(f"\nResumen de carga:")
            print(f"Total de registros en CSV: {total}")
            print(f"Registros insertados: {insertados}")
            print(f"Registros duplicados (no insertados): {duplicados}")
        
    except Error as e:
        print(f"Error al conectar o insertar en MySQL: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()
        print("Conexión a MySQL cerrada")

def get_connection():
    """Establece conexión con la base de datos MySQL"""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        return conn
    except Error as e:
        print(f"Error al conectar a MySQL: {e}")
        return None

def agent_by_platenumber(placa):
    conn = get_connection()
    if conn is None:
        return None
        
    cursor = conn.cursor(dictionary=True)  # Usamos dictionary=True para obtener resultados como diccionarios
    
    try:
        cursor.execute("SELECT id, placa, nombre FROM agentes_facultados WHERE placa = %s", (placa,))    
        agent = cursor.fetchone()
        return agent if agent else None
    finally:
        cursor.close()
        conn.close()

def register_agent_search(id_usuario, id_agente, fecha):
    """Registra una consulta de agente facultado en la base de datos"""
    conn = get_connection()
    if conn is None:
        return False
        
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO consulta_agentes (fecha, id_usuario, id_agente) VALUES (%s, %s, %s)",
            (fecha, id_usuario, id_agente)
        )
        conn.commit()
        return True
    except Error as e:
        print(f"Error al registrar consulta de agente: {e}")
        conn.rollback()
        return False
    finally:
        cursor.close()
        conn.close()

def register_consultation(id_usuario, fecha, texto):
    """Registra una nueva consulta en la base de datos"""
    conn = get_connection()
    if conn is None:
        return None
        
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO consulta (fecha, texto, id_usuario) VALUES (%s, %s, %s)",
            (fecha, texto, id_usuario)
        )
        conn.commit()
        return cursor.lastrowid  # Retorna el ID de la consulta insertada
    except Error as e:
        print(f"Error al registrar consulta: {e}")
        conn.rollback()
        return None
    finally:
        cursor.close()
        conn.close()

def register_response(id_consulta, texto, tipo):
    """Registra una respuesta a una consulta"""
    conn = get_connection()
    if conn is None:
        return None
        
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO respuesta (texto, tipo, id_consulta) VALUES (%s, %s, %s)",
            (texto, tipo, id_consulta)
        )
        conn.commit()
        return cursor.lastrowid  # Retorna el ID de la respuesta insertada
    except Error as e:
        print(f"Error al registrar respuesta: {e}")
        conn.rollback()
        return None
    finally:
        cursor.close()
        conn.close()

def register_feedback(id_respuesta, estrellas, comentarios=None):
    """Registra retroalimentación para una respuesta"""
    conn = get_connection()
    if conn is None:
        return False
        
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO retroalimentacion (estrellas, comentarios, id_respuesta) VALUES (%s, %s, %s)",
            (estrellas, comentarios, id_respuesta)
        )
        conn.commit()
        return True
    except Error as e:
        print(f"Error al registrar retroalimentación: {e}")
        conn.rollback()
        return False
    finally:
        cursor.close()
        conn.close()

def get_consultation_by_user(id_usuario):
    """Obtiene todas las consultas de un usuario"""
    conn = get_connection()
    if conn is None:
        return None
        
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            "SELECT id, fecha, texto FROM consulta WHERE id_usuario = %s ORDER BY fecha DESC",
            (id_usuario,)
        )
        return cursor.fetchall()
    except Error as e:
        print(f"Error al obtener consultas: {e}")
        return None
    finally:
        cursor.close()
        conn.close()

def get_responses_for_consultation(id_consulta):
    """Obtiene todas las respuestas para una consulta específica"""
    conn = get_connection()
    if conn is None:
        return None
        
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            "SELECT id, texto, tipo FROM respuesta WHERE id_consulta = %s ORDER BY id",
            (id_consulta,)
        )
        return cursor.fetchall()
    except Error as e:
        print(f"Error al obtener respuestas: {e}")
        return None
    finally:
        cursor.close()
        conn.close()

def get_feedback_for_response(id_respuesta):
    """Obtiene la retroalimentación para una respuesta específica"""
    conn = get_connection()
    if conn is None:
        return None
        
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            "SELECT id, estrellas, comentarios FROM retroalimentacion WHERE id_respuesta = %s",
            (id_respuesta,)
        )
        return cursor.fetchone()  # Asumimos que hay solo una retroalimentación por respuesta
    except Error as e:
        print(f"Error al obtener retroalimentación: {e}")
        return None
    finally:
        cursor.close()
        conn.close()