import { useState } from "react";
import { useAuth } from "../../context/auth_context";
import { useNavigate } from "react-router-dom";
import { login_consulta } from "../../servicios/login_servicios";
import InputField from "../../componentes/login/input_component.jsx";

export default function Login() {
  const [username, set_username] = useState("");
  const [password, set_password] = useState("");
  const [loading, set_loading] = useState(false);
  const [error_msg, set_error_msg] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handle_submit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      set_error_msg("Por favor, completa todos los campos.");
      return;
    }

    set_error_msg("");
    set_loading(true);

    try {
      const res = await login_consulta(username, password);

      if (!res.ok) {
        const err = await res.json();
        set_error_msg(err.message || "Error en el inicio de sesión");
        return;
      }

      const data = await res.json();
      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      console.error("Error de conexión:", err);
      set_error_msg("No se pudo conectar al servidor");
    } finally {
      set_loading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('./bunnies.png')" }}
    >
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <img src="./logo.png" alt="Logo" className="w-28 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-800">Inicio de Sesión</h3>
        </div>

        <form onSubmit={handle_submit} noValidate>
          <InputField
            icon="user"
            type="text"
            placeholder="Usuario"
            value={username}
            on_change={(e) => set_username(e.target.value)}
            disabled={loading}
          />

          <InputField
            icon="lock"
            type="password"
            placeholder="Contraseña"
            value={password}
            on_change={(e) => set_password(e.target.value)}
            disabled={loading}
            auto_complete="current-password"
          />

          {/* Mensaje de error */}
          {error_msg && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 text-sm">
              {error_msg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white font-semibold py-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Cargando...
              </>
            ) : (
              "Ingresar"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}