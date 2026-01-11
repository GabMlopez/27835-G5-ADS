import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth_context";
import logout_modal from "../modal/logout";

export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token, logout } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  if (!token) return null;

  return (
    <>
      <header className="bg-purple-500 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Logo" className="h-12 hidden md:block" />
            <h1 className="text-2xl font-bold">Hoptolt</h1>
          </div>


          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 hover:bg-gray-700 px-3 py-2 rounded transition"
            >
              <span className="hidden sm:inline">
                {user ? `${user.usuario}` : ""}
              </span>
              <i className="text-2xl"></i>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={() => {
                    navigate("/perfi");
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Mi Perfil
                </button>
                <hr className="my-1" />
                <button
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <nav className="bg-purple-400 text-white sticky top-0 shadow-md z-40">
        <div className="container mx-auto px-4">
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 text-center">
            <li
              className={`py-3 rounded-lg transition ${isActive("/jaulas") ? "bg-blue-600" : "hover:bg-gray-700"
                }`}
            >
              <button
                onClick={() => navigate("/jaulas")}
                className="w-full flex items-center justify-center gap-2 text-lg font-semibold"
              >
                <i className="text-xl"></i>Jaulas
              </button>
            </li>

            <li
              className={`py-3 rounded-lg transition ${location.pathname.startsWith("/reportes")
                ? "bg-blue-600"
                : "hover:bg-gray-700"
                }`}
            >
              <button
                onClick={() => navigate("/reportes")}
                className="w-full flex items-center justify-center gap-2 text-lg font-semibold"
              >
                <i className="text-xl"></i> Reportes
              </button>
            </li>

            <li
              className={`py-3 rounded-lg transition ${location.pathname.startsWith("/cuidados")
                ? "bg-blue-600"
                : "hover:bg-gray-700"
                }`}
            >
              <button
                onClick={() => navigate("/cuidados")}
                className="w-full flex items-center justify-center gap-2 text-lg font-semibold"
              >
                <i className="text-xl"></i> Manejo de cuidados
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <logout_modal />
    </>
  );
}
