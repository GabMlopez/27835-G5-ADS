import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, set_token] = useState(null);
  const [user, set_user] = useState(null);
  const [loading, set_loading] = useState(true); 

  useEffect(() => {
    const saved_token = localStorage.getItem("token");
    const saved_user = localStorage.getItem("user");

    if (saved_token && saved_user) {
      set_token(saved_token);
      try {
        set_user(JSON.parse(saved_user));
      } catch (error) {
        console.error("Error parsing user from localStorage", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    set_loading(false); 
  }, []);

  const login = (new_token, new_user) => {
    set_token(new_token);
    set_user(new_user);

    localStorage.setItem("token", new_token);
    localStorage.setItem("user", JSON.stringify(new_user));
  };

  const logout = () => {
    set_token(null);
    set_user(null);

    // Mejor borrar solo lo relacionado con auth
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}