import { useState } from "react";
import { useAuth } from "../../context/auth_context";
import { useNavigate } from "react-router-dom";
import { login_consulta  }  from "../../servicios/login_servicios";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg("Por favor, completa todos los campos.");
      return;
    }
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await login_consulta(username, password);
      const data = await res.json();
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      console.error(err);
      setErrorMsg("Error de conexión al servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-cover bg-center bg-no-repeat h-96 min-h-screen flex items-center justify-center bg-gray-100" style={{ backgroundImage: `url('./bunnies.png')` }}>
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
          <div className="text-center mb-6">
            <img
              src="./logo.png"
              alt="Logo"
              className="w-28 mx-auto mb-3"
            />
            <h3 className="text-2xl font-semibold text-gray-800">Inicio de Sesión</h3>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="flex items-center mb-4 border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-green-500">
              <span className="px-3 py-3 bg-green-600 text-white">
                <i className="bi bi-person-fill text-xl"></i>
              </span>
              <input
                type="text"
                className="w-full px-4 py-3 outline-none disabled:bg-gray-100"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="flex items-center mb-6 border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-green-500">
              <span className="px-3 py-3 bg-green-600 text-white">
                <i className="bi bi-lock-fill text-xl"></i>
              </span>
              <input
                type="password"
                className="w-full px-4 py-3 outline-none disabled:bg-gray-100"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {errorMsg && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-green-600 text-white font-semibold py-3 rounded-md hover:bg-green-700 transition flex items-center justify-center disabled:opacity-70"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cargando…
                </>
              ) : (
                "Ingresar"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}