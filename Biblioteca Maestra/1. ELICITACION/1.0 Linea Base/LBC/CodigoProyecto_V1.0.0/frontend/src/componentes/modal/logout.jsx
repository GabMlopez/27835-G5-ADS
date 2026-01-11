import { useEffect, useRef, useCallback, useState } from "react";
import { useAuth } from "../../context/auth_context";
import { useNavigate } from "react-router-dom";

const INACTIVITY_TIMEOUT = 1800000; 

export default function logout_modal() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const inactivityRef = useRef(null);

  const resetInactivityTimer = useCallback(() => {
    if (!token) return;

    if (inactivityRef.current) clearTimeout(inactivityRef.current);

    inactivityRef.current = setTimeout(() => {
      setShowModal(true);
    }, INACTIVITY_TIMEOUT);
  }, [token]);

  const handleLogout = () => {
    logout();
    setShowModal(false);
    navigate("/login"); 
  };

  const handleStay = () => {
    setShowModal(false);
    resetInactivityTimer();
  };

  useEffect(() => {
    if (!token) return;

    resetInactivityTimer();

    const events = ["mousemove", "keydown", "click", "scroll"];
    const handler = () => resetInactivityTimer();

    events.forEach((event) => window.addEventListener(event, handler));

    return () => {
      events.forEach((event) => window.removeEventListener(event, handler));
      if (inactivityRef.current) clearTimeout(inactivityRef.current);
    };
  }, [resetInactivityTimer, token]);

  if (!token || !showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Sesión por expirar
        </h2>
        <p className="text-gray-600 mb-6">
          Has estado inactivo. ¿Deseas continuar en la sesión?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Cerrar sesión
          </button>
          <button
            onClick={handleStay}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}