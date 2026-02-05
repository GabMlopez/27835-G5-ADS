const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

function obtener_token() {
    return localStorage.getItem('token');
}

/**
 * Registra una nueva alimentación
 * @param {Object} datos - {conejo_id, cantidad_heno_seco, cantidad_hierba_humeda, cantidad_balanceado}
 */
async function registrar_alimentacion(datos) {
    const token = obtener_token();
    const res = await fetch(`${baseUrl}/alimentacion/new`, {
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
 * Obtiene el historial de alimentación de un conejo
 */
async function obtener_alimentacion_conejo(conejo_id) {
    const token = obtener_token();
    const res = await fetch(`${baseUrl}/alimentacion/conejo/${conejo_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return res;
}

export {
    registrar_alimentacion,
    obtener_alimentacion_conejo
};
