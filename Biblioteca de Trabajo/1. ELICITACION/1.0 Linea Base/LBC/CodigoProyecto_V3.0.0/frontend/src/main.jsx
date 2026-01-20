import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/auth_context.jsx";
import Login from "./paginas/login_router/login.jsx";
import { App } from "./App.jsx";


function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <div>Cargando...</div>; 
  return token ? children : <Navigate to="/login" replace />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);