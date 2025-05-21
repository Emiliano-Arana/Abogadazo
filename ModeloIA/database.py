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
        cursor.execute("SELECT placa, nombre FROM agentes_facultados WHERE placa = %s", (placa,))    
        agent = cursor.fetchone()
        return agent if agent else None
    finally:
        cursor.close()
        conn.close()

#submit_agents("agentes_procesados.csv")

