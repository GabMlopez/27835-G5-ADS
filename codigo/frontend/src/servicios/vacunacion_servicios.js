const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

function obtener_token() {
    return localStorage.getItem('token');
}

/**
 * Registra una nueva vacunación para un conejo
 * @param {Object} datos - {conejo_id, vacunacion_tipo, vacunacion_fecha}
 */
async function registrar_vacunacion_conejo(datos) {
    const token = obtener_token();
    const res = await fetch(`${baseUrl}/vacunacion/new/conejo`, {
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
    registrar_vacunacion_conejo
};
