// Servicio para gestión de jaulas - Comunicación con API backend
const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

/**
 * Obtiene el token de autenticación desde localStorage
 * @returns {string|null} Token JWT
 */
function obtener_token() {
    return localStorage.getItem('token');
}

/**
 * Obtiene todas las jaulas
 * @returns {Promise<Response>}
 */
async function obtener_jaulas() {
    const token = obtener_token();
    const res = await fetch(`${baseUrl}/jaula/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return res;
}

/**
 * Obtiene una jaula por su ID
 * @param {string} id - ID de la jaula
 * @returns {Promise<Response>}
 */
async function obtener_jaula_por_id(id) {
    const token = obtener_token();
    const res = await fetch(`${baseUrl}/jaula/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return res;
}

/**
 * Crea una nueva jaula
 * @param {Object} datos - Datos de la jaula {jaula_tipo, jaula_capacidad}
 * @returns {Promise<Response>}
 */
async function crear_jaula(datos) {
    const token = obtener_token();
    const res = await fetch(`${baseUrl}/jaula/new`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datos)
    });
    return res;
}

/**
 * Actualiza una jaula existente
 * @param {string} id - ID de la jaula
 * @param {Object} datos - Datos a actualizar {jaula_tipo, jaula_capacidad}
 * @returns {Promise<Response>}
 */
async function actualizar_jaula(id, datos) {
    const token = obtener_token();
    const res = await fetch(`${baseUrl}/jaula/update/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datos)
    });
    return res;
}

/**
 * Elimina una jaula
 * @param {string} id - ID de la jaula
 * @returns {Promise<Response>}
 */
async function eliminar_jaula(id) {
    const token = obtener_token();
    const res = await fetch(`${baseUrl}/jaula/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return res;
}

export {
    obtener_jaulas,
    obtener_jaula_por_id,
    crear_jaula,
    actualizar_jaula,
    eliminar_jaula
};
