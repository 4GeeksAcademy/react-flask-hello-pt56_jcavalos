"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import APIException, generate_token, verify_token
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

@api.route('/signup', methods=['POST'])
def signup():
    """Registro de nuevos usuarios"""
    try:
        body = request.get_json(silent=True)
        
        if body is None:
            return jsonify({"msg": "El cuerpo de la solicitud está vacío o no es JSON válido"}), 400
        
        if 'email' not in body:
            return jsonify({"msg": "El campo email es requerido"}), 400
        
        if 'password' not in body:
            return jsonify({"msg": "El campo password es requerido"}), 400
        
        # Verificar si el email ya está registrado
        existing_user = User.query.filter_by(email=body['email']).first()
        if existing_user:
            return jsonify({"msg": "El email ya está registrado"}), 400
        
        # Validar longitud de contraseña
        if len(body['password']) < 6:
            return jsonify({"msg": "La contraseña debe tener al menos 6 caracteres"}), 400
        
        # Crear nuevo usuario
        new_user = User()
        new_user.email = body['email']
        new_user.set_password(body['password'])
        new_user.is_active = True
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            "msg": "Usuario creado exitosamente",
            "user": new_user.serialize()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error al crear usuario: {str(e)}"}), 500

@api.route('/login', methods=['POST'])
def login():
    """Inicio de sesión y generación de token JWT"""
    try:
        body = request.get_json(silent=True)
        
        if body is None:
            return jsonify({"msg": "El cuerpo de la solicitud está vacío"}), 400
        
        if 'email' not in body:
            return jsonify({"msg": "El campo email es requerido"}), 400
        
        if 'password' not in body:
            return jsonify({"msg": "El campo password es requerido"}), 400
        
        # Buscar usuario
        user = User.query.filter_by(email=body['email']).first()
        
        if user is None:
            return jsonify({"msg": "Email o contraseña incorrectos"}), 401
        
        # Verificar contraseña
        if not user.check_password(body['password']):
            return jsonify({"msg": "Email o contraseña incorrectos"}), 401
        
        if not user.is_active:
            return jsonify({"msg": "Usuario inactivo"}), 401
        
        # Generar token JWT
        token = generate_token(user)
        
        return jsonify({
            "msg": "Login exitoso",
            "token": token,
            "user": user.serialize()
        }), 200
        
    except Exception as e:
        return jsonify({"msg": f"Error en login: {str(e)}"}), 500

@api.route('/private', methods=['GET'])
def private():
    """Ruta privada que requiere autenticación"""
    try:
        # Obtener el token del header Authorization
        auth_header = request.headers.get('Authorization', None)
        
        if not auth_header:
            return jsonify({"msg": "Token de autenticación no proporcionado"}), 401
        
        # El formato esperado es "Bearer <token>"
        parts = auth_header.split()
        
        if parts[0].lower() != 'bearer':
            return jsonify({"msg": "Formato de token inválido"}), 401
        elif len(parts) == 1:
            return jsonify({"msg": "Token no encontrado"}), 401
        elif len(parts) > 2:
            return jsonify({"msg": "Formato de token inválido"}), 401
        
        token = parts[1]
        
        # Verificar el token
        user_data = verify_token(token)
        
        if user_data is None:
            return jsonify({"msg": "Token inválido o expirado"}), 401
        
        # Verificar que el usuario aún existe y está activo
        user = User.query.get(user_data['user_id'])
        
        if user is None:
            return jsonify({"msg": "Usuario no encontrado"}), 401
        
        if not user.is_active:
            return jsonify({"msg": "Usuario inactivo"}), 401
        
        return jsonify({
            "msg": "Acceso autorizado a contenido privado",
            "user": user.serialize()
        }), 200
        
    except Exception as e:
        return jsonify({"msg": f"Error en validación: {str(e)}"}), 500

@api.route('/validate-token', methods=['GET'])
def validate_token():
    """Valida si un token es válido"""
    try:
        auth_header = request.headers.get('Authorization', None)
        
        if not auth_header:
            return jsonify({"msg": "Token no proporcionado", "valid": False}), 401
        
        parts = auth_header.split()
        
        if parts[0].lower() != 'bearer' or len(parts) != 2:
            return jsonify({"msg": "Formato inválido", "valid": False}), 401
        
        token = parts[1]
        user_data = verify_token(token)
        
        if user_data is None:
            return jsonify({"msg": "Token inválido", "valid": False}), 401
        
        user = User.query.get(user_data['user_id'])
        
        if user is None or not user.is_active:
            return jsonify({"msg": "Usuario inválido", "valid": False}), 401
        
        return jsonify({
            "valid": True,
            "user": user.serialize()
        }), 200
        
    except Exception as e:
        return jsonify({"msg": str(e), "valid": False}), 500