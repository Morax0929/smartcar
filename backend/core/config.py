import os

class Settings:
    PROJECT_NAME: str = "SmartCar AI Platform"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-diploma-ac2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 kunlik yaroqlilik
    
    # Ma'lumotlar bazasi URL'si (Hozircha SQLite, keyin Postgres qilsa bo'ladi)
    _db_url: str = os.getenv("DATABASE_URL", "sqlite:///./smartcar.db")
    
    @property
    def DATABASE_URL(self) -> str:
        # SQLAlchemy 1.4+ postgres:// o'rniga postgresql:// talab qiladi
        if self._db_url.startswith("postgres://"):
            return self._db_url.replace("postgres://", "postgresql://", 1)
        return self._db_url

settings = Settings()
