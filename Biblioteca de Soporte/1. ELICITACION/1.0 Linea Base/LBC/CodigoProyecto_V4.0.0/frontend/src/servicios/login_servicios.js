async function login_consulta(username, password) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
    const res = await fetch(`${baseUrl}/usuario/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const err = await res.json();
        setErrorMsg(err.message || "Error en el login");
        return;
      }
      return res;
}

export {login_consulta};