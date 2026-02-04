const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

function obtener_token() {
    return localStorage.getItem('token');
}

/**
 * Registra una nueva desparasitación para un conejo
 * @param {Object} datos - {conejo_id, desparasitacion_tipo, desparasitacion_fecha}
 */
async function registrar_desparasitacion_conejo(datos) {
    const token = obtener_token();
    const res = await fetch(`${baseUrl}/desparasitacion/new`, {
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
    registrar_desparasitacion_conejo
};
