import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Private = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const validateToken = async () => {
            const token = sessionStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const response = await fetch(backendUrl + "/api/validate-token", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (response.ok && data.valid) {
                    setUser(data.user);
                } else {
                    sessionStorage.removeItem("token");
                    sessionStorage.removeItem("user");
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error al validar token:", error);
                setError("Error de conexión");
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("user");
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        validateToken();
    }, [navigate]);

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-3">Validando autenticación...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow">
                        <div className="card-header bg-success text-white">
                            <h3 className="mb-0">
                                <i className="fas fa-lock me-2"></i>
                                Área Privada
                            </h3>
                        </div>
                        <div className="card-body p-5">
                            <div className="alert alert-success mb-4">
                                <h4 className="alert-heading">
                                    <i className="fas fa-check-circle me-2"></i>
                                    ¡Autenticación Exitosa!
                                </h4>
                                <p className="mb-0">
                                    Has accedido correctamente al área privada.
                                </p>
                            </div>

                            {user && (
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <h5 className="mb-0">Información del Usuario</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <strong>ID:</strong>
                                                <p className="text-muted mb-0">{user.id}</p>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <strong>Email:</strong>
                                                <p className="text-muted mb-0">{user.email}</p>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <strong>Estado:</strong>
                                                <p className="mb-0">
                                                    <span className="badge bg-success">
                                                        {user.is_active ? "Activo" : "Inactivo"}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <strong>Fecha de registro:</strong>
                                                <p className="text-muted mb-0">
                                                    {user.created_at
                                                        ? new Date(user.created_at).toLocaleDateString("es-ES")
                                                        : "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="card bg-light">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        <i className="fas fa-info-circle me-2"></i>
                                        Sobre esta página
                                    </h5>
                                    <p className="card-text">
                                        Esta es una página protegida que solo puede ser accedida por
                                        usuarios autenticados. El sistema verifica tu token JWT antes
                                        de mostrar este contenido.
                                    </p>
                                    <ul className="mb-0">
                                        <li>Tu sesión está protegida con JWT</li>
                                        <li>El token se valida en cada acceso</li>
                                        <li>Si cierras sesión, serás redirigido automáticamente</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};