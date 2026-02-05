const API= import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
function obtener_token() {
    return localStorage.getItem('token');
}

export const generar_reporte_alimentacion = () => {
    const token = obtener_token();
    return fetch(`${API}/reportes/alimentacion`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
};

export const generar_reporte_montas = () => {
    const token = obtener_token();
    return fetch(`${API}/reportes/montas`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
};

export const generar_reporte_medico = () => {
    const token = obtener_token();
    return fetch(`${API}/reportes/vacunaciones-mes`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
};
