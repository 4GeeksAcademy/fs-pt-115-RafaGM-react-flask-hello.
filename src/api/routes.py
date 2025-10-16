from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from api.models import db, User
from api.utils import APIException
from flask_jwt_extended.exceptions import NoAuthorizationError, InvalidHeaderError
from api.utils import APIException

def handle_no_auth(e):
    return jsonify({"message": "Falta token o formato incorrecto"}), 401

def handle_invalid_header(e):
    return jsonify({"message": "Encabezado Authorization inválido"}), 401

api = Blueprint("api", __name__)

@api.app_errorhandler(APIException)
def handle_api_error(err):
    return jsonify(err.to_dict()), err.status_code

# Registro
@api.route("/signup", methods=["POST"])
def signup():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    if not email or not password:
        raise APIException("Email y contraseña son obligatorios", 400)
    if User.query.filter_by(email=email).first():
        raise APIException("Ese email ya existe", 409)

    user = User(email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    # El FRONT redirige a /login
    return jsonify({"msg": "Usuario creado"}), 201


@api.route("/token", methods=["POST"])
def token():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    if not email or not password:
        raise APIException("Email y contraseña son obligatorios", 400)

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        raise APIException("Credenciales inválidas", 401)
    
    access_token = create_access_token(identity=str(user.id))
    return jsonify({"access_token": access_token, "user": user.serialize()}), 200


@api.route("/private", methods=["GET"])
@jwt_required()
def private():
    uid = get_jwt_identity()
    user = db.session.get(User, uid)
    return jsonify({"msg": "Zona privada", "email": user.email}), 200
