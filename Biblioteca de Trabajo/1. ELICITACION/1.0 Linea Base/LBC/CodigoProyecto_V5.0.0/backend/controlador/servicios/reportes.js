const API_URL = 'http://localhost:3001/reportes';

/* =========================
   TOTAL DE CONEJOS
========================= */
export const obtenerTotalConejos = async () => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/total-conejos`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Error al obtener reporte');
  }

  return response.json();
};

/* =========================
   CONEJOS POR JAULA
========================= */
export const obtenerConejosPorJaula = async () => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/conejos-jaula`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return response.json();
};

/* =========================
   VACUNACIONES POR MES
========================= */
export const obtenerVacunacionesPorMes = async () => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/vacunaciones-mes`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return response.json();
};

/* =========================
   TOTAL USUARIOS
========================= */
export const obtenerTotalUsuarios = async () => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/total-usuarios`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return response.json();
};
