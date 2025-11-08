import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const token = sessionStorage.getItem("token");
    const isAuthenticated = !!token;

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <i className="fas fa-lock me-2"></i>
                    Auth JWT App
                </Link>
                
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link 
                                className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
                                to="/"
                            >
                                <i className="fas fa-home me-1"></i>
                                Inicio
                            </Link>
                        </li>
                        
                        {isAuthenticated && (
                            <li className="nav-item">
                                <Link 
                                    className={`nav-link ${location.pathname === "/private" ? "active" : ""}`}
                                    to="/private"
                                >
                                    <i className="fas fa-user-lock me-1"></i>
                                    Área Privada
                                </Link>
                            </li>
                        )}
                    </ul>
                    
                    <ul className="navbar-nav">
                        {!isAuthenticated ? (
                            <>
                                <li className="nav-item">
                                    <Link 
                                        className={`nav-link ${location.pathname === "/login" ? "active" : ""}`}
                                        to="/login"
                                    >
                                        <i className="fas fa-sign-in-alt me-1"></i>
                                        Login
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link 
                                        className={`nav-link ${location.pathname === "/signup" ? "active" : ""}`}
                                        to="/signup"
                                    >
                                        <i className="fas fa-user-plus me-1"></i>
                                        Registro
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <button 
                                    className="btn btn-outline-light btn-sm"
                                    onClick={handleLogout}
                                >
                                    <i className="fas fa-sign-out-alt me-1"></i>
                                    Cerrar Sesión
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};