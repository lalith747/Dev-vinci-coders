from sqlalchemy import create_engine, text

engine = create_engine('mysql+pymysql://odoo_user:test123@localhost:3306/odoo', echo=True)

try:
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))  # wrap in text()
        print("✅ Connection successful! Result:", result.scalar())
except Exception as e:
    print("❌ Connection failed:", e)
