// Servicio para la gestión de razas - Comunicación con el backend
const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

/**
 * Obtiene el token de autenticación desde localStorage
 * @returns {string|null} Token JWT
 */
function obtener_token() {
    return localStorage.getItem('token');
}

/**
 * Obtiene todas las razas
 * @returns {Promise<Response>}
 */
async function obtener_razas() {
    const token = obtener_token();
    const res = await fetch(`${baseUrl}/raza/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return res;
}

/**
 * Obtiene una raza por su ID
 * @param {string} id - ID de la raza
 * @returns {Promise<Response>}
 */
async function obtener_raza_por_id(id) {
    const token = obtener_token();
    const res = await fetch(`${baseUrl}/raza/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return res;
}

/**
 * Crea una nueva raza
 * @param {Object} datos - Datos de la raza {raza_nombre, raza_descripcion}
 * @returns {Promise<Response>}
 */
async function crear_raza(datos) {
    const token = obtener_token();
    const res = await fetch(`${baseUrl}/raza/new`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datos)
    });
    return res;
}

export {
    obtener_razas,
    obtener_raza_por_id,
    crear_raza
};
