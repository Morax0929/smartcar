
import sqlite3
import os

db_path = "backend/smartcar.db"

if not os.path.exists(db_path):
    print(f"Baza topilmadi: {db_path}")
else:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    tables = ["users", "cars", "bookings", "documents", "reviews"]
    print("Baza holati:")
    for table in tables:
        try:
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            count = cursor.fetchone()[0]
            print(f"- {table}: {count} ta yozuv")
        except sqlite3.OperationalError:
            print(f"- {table}: Jadval topilmadi")
    
    conn.close()
