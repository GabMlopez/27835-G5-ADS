// Servicio para la gestión de conejos - Comunicación con el backend
const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

/**
 * Obtiene el token de autenticación desde localStorage
 * @returns {string|null} Token JWT
 */
function obtener_token() {
    return localStorage.getItem('token');
}

/**
 * Obtiene todos los conejos
 * @returns {Promise<Response>}
 */
async function obtener_conejos() {
    const token = obtener_token();
    const res = await fetch(`${baseUrl}/conejos/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return res;
}

/**
 * Obtiene un conejo por su ID
 * @param {string} id - ID del conejo
 * @returns {Promise<Response>}
 */
async function obtener_conejo_por_id(id) {
    const token = obtener_token();
    const res = await fetch(`${baseUrl}/conejos/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return res;
}

/**
 * Crea un nuevo conejo
 * @param {Object} datos - Datos del conejo
 * @returns {Promise<Response>}
 */
async function crear_conejo(datos) {
    const token = obtener_token();
    const res = await fetch(`${baseUrl}/conejos/new`, {
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
 * Actualiza un conejo existente
 * @param {string} id - ID del conejo
 * @param {Object} datos - Datos a actualizar
 * @returns {Promise<Response>}
 */
async function actualizar_conejo(id, datos) {
    const token = obtener_token();
    const res = await fetch(`${baseUrl}/conejos/update/${id}`, {
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
 * Elimina un conejo
 * @param {string} id - ID del conejo
 * @returns {Promise<Response>}
 */
async function eliminar_conejo(id) {
    const token = obtener_token();
    const res = await fetch(`${baseUrl}/conejos/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return res;
}

export {
    obtener_conejos,
    obtener_conejo_por_id,
    crear_conejo,
    actualizar_conejo,
    eliminar_conejo
};
