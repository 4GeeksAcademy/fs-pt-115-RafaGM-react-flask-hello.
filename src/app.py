import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from api.models import db
from api.routes import api
from dotenv import load_dotenv

def create_app():
    load_dotenv()
    app = Flask(__name__)

    db_url = os.getenv("DATABASE_URL", "sqlite:///app.db").strip()
    if db_url.startswith("http://") or db_url.startswith("https://"):
        db_url = "sqlite:///app.db"
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
    app.config["SQLALCHEMY_DATABASE_URI"] = db_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "cambia-esto")

    # 👇 CORS abierto y permitiendo Authorization
    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=False,
        allow_headers=["Content-Type", "Authorization"],
        expose_headers=["Authorization"],
    )

    # 👇 JWT explícito (evita 422 por encabezado inesperado)
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]
    app.config["JWT_HEADER_NAME"] = "Authorization"
    app.config["JWT_HEADER_TYPE"] = "Bearer"

    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)

    app.register_blueprint(api, url_prefix="/api")

    @app.route("/")
    def root():
        return jsonify({"ok": True, "routes": ["/api/signup", "/api/token", "/api/private"]})

    return app

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 3001)), debug=True)
