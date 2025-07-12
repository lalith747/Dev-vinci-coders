import os
from dotenv import load_dotenv
load_dotenv()

DB_URL = os.getenv("DB_URL", "mysql+pymysql://root:root@localhost:3306/odoo")
SECRET_KEY = os.getenv("SECRET_KEY", "5509f3b8-4c1e-4d2a-9c5f-6b7e8f3b8c1e")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
