const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
import {add} from 'date-fns';
function obtener_token() {
    return localStorage.getItem('token');
}

/**
 * Registra una nueva monta
 * @param {Object} datos - {macho_id, hembra_id, monta_fecha_monta}
 */
async function registrar_monta(datos) {
    const token = obtener_token();
    const res = await fetch(`${baseUrl}/monta/new`, {
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
 * Obtiene historial de montas de un conejo
 */
async function obtener_montas_conejo(conejo_id) {
    const token = obtener_token();
    const res = await fetch(`${baseUrl}/monta/find/${conejo_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return res;
}

function definir_fecha_parto(){
    const curr_date = new Date();
    const birth_date = add(curr_date, { days: 30 });
    const date_string = birth_date.toISOString().split('T')[0];
    return date_string;
}

export {
    registrar_monta,
    obtener_montas_conejo,
    definir_fecha_parto
};
