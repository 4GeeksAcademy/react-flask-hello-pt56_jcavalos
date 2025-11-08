import React from "react";
import { Link } from "react-router-dom";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";

export const Home = () => {
    const token = sessionStorage.getItem("token");
    const isAuthenticated = !!token;

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="text-center mb-5">
                        <img src={rigoImageUrl} alt="Rigo Baby" style={{maxWidth: "120px"}} className="mb-3" />
                        <h1 className="display-3 mb-3">
                            <i className="fas fa-shield-alt me-3"></i>
                            Sistema de Autenticación JWT
                        </h1>
                        <p className="lead text-muted">
                            Aplicación web con autenticación completa usando Flask y React
                        </p>
                    </div>

                    <div className="row g-4 mb-5">
                        <div className="col-md-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body text-center">
                                    <i className="fas fa-user-plus fa-3x text-primary mb-3"></i>
                                    <h5 className="card-title">Registro</h5>
                                    <p className="card-text">
                                        Crea una cuenta nueva de forma rápida y segura
                                    </p>
                                    {!isAuthenticated && (
                                        <Link to="/signup" className="btn btn-primary">
                                            Registrarse
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body text-center">
                                    <i className="fas fa-sign-in-alt fa-3x text-success mb-3"></i>
                                    <h5 className="card-title">Inicio de Sesión</h5>
                                    <p className="card-text">
                                        Accede con tu email y contraseña
                                    </p>
                                    {!isAuthenticated ? (
                                        <Link to="/login" className="btn btn-success">
                                            Iniciar Sesión
                                        </Link>
                                    ) : (
                                        <Link to="/private" className="btn btn-success">
                                            Ir al Área Privada
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body text-center">
                                    <i className="fas fa-lock fa-3x text-warning mb-3"></i>
                                    <h5 className="card-title">Área Privada</h5>
                                    <p className="card-text">
                                        Contenido protegido solo para usuarios autenticados
                                    </p>
                                    {isAuthenticated ? (
                                        <Link to="/private" className="btn btn-warning">
                                            Acceder
                                        </Link>
                                    ) : (
                                        <button className="btn btn-secondary" disabled>
                                            Requiere Login
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow">
                        <div className="card-header bg-info text-white">
                            <h4 className="mb-0">
                                <i className="fas fa-info-circle me-2"></i>
                                Características del Sistema
                            </h4>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <h5><i className="fab fa-python me-2"></i>Backend (Flask)</h5>
                                    <ul>
                                        <li>API RESTful con Flask</li>
                                        <li>Autenticación JWT</li>
                                        <li>Encriptación de contraseñas</li>
                                        <li>SQLAlchemy ORM</li>
                                        <li>Validación de tokens</li>
                                    </ul>
                                </div>
                                <div className="col-md-6">
                                    <h5><i className="fab fa-react me-2"></i>Frontend (React)</h5>
                                    <ul>
                                        <li>React Router v6</li>
                                        <li>SessionStorage para tokens</li>
                                        <li>Validación de formularios</li>
                                        <li>Rutas protegidas</li>
                                        <li>Interfaz responsive</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {isAuthenticated && (
                        <div className="alert alert-success mt-4" role="alert">
                            <i className="fas fa-check-circle me-2"></i>
                            <strong>¡Sesión activa!</strong> Ya estás autenticado en el sistema.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};