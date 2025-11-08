import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Demo } from "./pages/Demo";
import { Single } from "./pages/Single";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Private } from "./pages/Private";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={<Layout />}
      errorElement={
        <div className="container mt-5 text-center">
          <h1>404 - Not found!</h1>
          <p>La página que buscas no existe.</p>
          <a href="/" className="btn btn-primary">Volver al Inicio</a>
        </div>
      }
    >
      <Route path="/" element={<Home />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/single/:theId" element={<Single />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/private" element={<Private />} />
    </Route>
  )
);