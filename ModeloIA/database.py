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

def register_feedback(id_respuesta, estrellas):
    """Registra o actualiza retroalimentación para una respuesta"""
    conn = get_connection()
    if conn is None:
        return False
        
    cursor = conn.cursor()
    try:
        # Primero verificamos si ya existe feedback para esta respuesta
        cursor.execute(
            "SELECT id FROM retroalimentacion WHERE id_respuesta = %s",
            (id_respuesta,)
        )
        existing_feedback = cursor.fetchone()
        
        if existing_feedback:
            # Si existe, actualizamos
            cursor.execute(
                "UPDATE retroalimentacion SET estrellas = %s WHERE id_respuesta = %s",
                (estrellas, id_respuesta)
            )
        else:
            # Si no existe, insertamos nuevo
            cursor.execute(
                "INSERT INTO retroalimentacion (estrellas, id_respuesta) VALUES (%s, %s)",
                (estrellas, id_respuesta)
            )
        
        conn.commit()
        return True
        
    except Error as e:
        print(f"Error al registrar/actualizar retroalimentación: {e}")
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

#
# A partir de aqui son funciones de admin, provisional
#

from datetime import date, timedelta

def get_consultas_por_fecha(fecha: date) -> int:
    """Obtiene el número de consultas para una fecha específica"""
    conn = get_connection()
    if conn is None:
        return 0
        
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT COUNT(*) FROM consulta WHERE fecha = %s",
            (fecha,)
        )
        return cursor.fetchone()[0]
    except Error as e:
        print(f"Error al obtener consultas por fecha: {e}")
        return 0
    finally:
        cursor.close()
        conn.close()

def get_consultas_por_rango_fechas(inicio: date, fin: date) -> list:
    """Obtiene el número de consultas por día en un rango de fechas"""
    conn = get_connection()
    if conn is None:
        return []
        
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            """SELECT fecha, COUNT(*) as consultas 
               FROM consulta 
               WHERE fecha BETWEEN %s AND %s
               GROUP BY fecha
               ORDER BY fecha""",
            (inicio, fin)
        )
        
        # Convertir a formato esperado por el frontend
        resultados = cursor.fetchall()
        
        # Crear un diccionario con todos los días del mes
        delta = fin - inicio
        consultas_por_dia = {}
        
        for i in range(delta.days + 1):
            dia = inicio + timedelta(days=i)
            consultas_por_dia[dia.day] = 0
        
        # Llenar con los datos reales
        for fila in resultados:
            dia = fila['fecha'].day
            consultas_por_dia[dia] = fila['consultas']
        
        # Convertir a formato de lista
        return [{'dia': dia, 'consultas': count} for dia, count in consultas_por_dia.items()]
        
    except Error as e:
        print(f"Error al obtener consultas por rango: {e}")
        return []
    finally:
        cursor.close()
        conn.close()
        
        
def get_consultas_agentes_por_rango_fechas(inicio: date, fin: date) -> list:
    """Obtiene el número de consultas por día en un rango de fechas"""
    conn = get_connection()
    if conn is None:
        return []
        
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            """SELECT fecha, COUNT(*) as consultas 
               FROM consulta_agentes 
               WHERE fecha BETWEEN %s AND %s
               GROUP BY fecha
               ORDER BY fecha""",
            (inicio, fin)
        )
        
        # Convertir a formato esperado por el frontend
        resultados = cursor.fetchall()
        
        # Crear un diccionario con todos los días del mes
        delta = fin - inicio
        consultas_por_dia = {}
        
        for i in range(delta.days + 1):
            dia = inicio + timedelta(days=i)
            consultas_por_dia[dia.day] = 0
        
        # Llenar con los datos reales
        for fila in resultados:
            dia = fila['fecha'].day
            consultas_por_dia[dia] = fila['consultas']
        
        # Convertir a formato de lista
        return [{'dia': dia, 'consultas': count} for dia, count in consultas_por_dia.items()]
        
    except Error as e:
        print(f"Error al obtener consultas por rango: {e}")
        return []
    finally:
        cursor.close()
        conn.close()

def get_tipos_consulta() -> list:
    """Obtiene la distribución de tipos de consulta"""
    conn = get_connection()
    if conn is None:
        return []
        
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            """SELECT r.tipo as name, COUNT(*) as value 
               FROM respuesta r
               JOIN consulta c ON r.id_consulta = c.id
               WHERE c.fecha BETWEEN DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND CURDATE()
               GROUP BY r.tipo
               ORDER BY value DESC"""
        )
        
        resultados = cursor.fetchall()
        
        # Mapear a los nombres que usa el frontend
        mapeo_tipos = {
            'multas': 'Multas',
            'procedimientos': 'Procedimientos',
            'reglamentacion': 'Reglamentación',
            'general': 'Otras'
        }
        
        return [
            {
                'name': mapeo_tipos.get(row['name'], row['name']),
                'value': row['value']
            }
            for row in resultados
        ]
        
    except Error as e:
        print(f"Error al obtener tipos de consulta: {e}")
        return []
    finally:
        cursor.close()
        conn.close()

def get_estadisticas_feedback() -> dict:
    """Obtiene estadísticas de retroalimentación"""
    conn = get_connection()
    if conn is None:
        return {}
        
    cursor = conn.cursor()
    try:
        # Promedio de estrellas
        cursor.execute(
            "SELECT AVG(estrellas) FROM retroalimentacion"
        )
        promedio = cursor.fetchone()[0] or 0
        
        # Total de feedbacks
        cursor.execute(
            "SELECT COUNT(*) FROM retroalimentacion"
        )
        total = cursor.fetchone()[0]
        
        # Crecimiento mensual (consultas este mes vs mes pasado)
        hoy = date.today()
        primer_dia_mes_actual = hoy.replace(day=1)
        primer_dia_mes_pasado = (primer_dia_mes_actual - timedelta(days=1)).replace(day=1)
        ultimo_dia_mes_pasado = primer_dia_mes_actual - timedelta(days=1)
        
        cursor.execute(
            "SELECT COUNT(*) FROM consulta WHERE fecha BETWEEN %s AND %s",
            (primer_dia_mes_actual, hoy)
        )
        consultas_mes_actual = cursor.fetchone()[0]
        
        cursor.execute(
            "SELECT COUNT(*) FROM consulta WHERE fecha BETWEEN %s AND %s",
            (primer_dia_mes_pasado, ultimo_dia_mes_pasado)
        )
        consultas_mes_pasado = cursor.fetchone()[0] or 1  # Evitar división por cero
        
        crecimiento = ((consultas_mes_actual - consultas_mes_pasado) / consultas_mes_pasado) * 100
        
        return {
            'promedio_feedback': round(float(promedio), 1),
            'total_feedbacks': total,
            'crecimiento_mensual': round(crecimiento, 1)
        }
        
    except Error as e:
        print(f"Error al obtener estadísticas de feedback: {e}")
        return {}
    finally:
        cursor.close()
        conn.close()