import { useState, useEffect } from 'react';
import {
    obtener_conejos,
    crear_conejo,
    actualizar_conejo,
    eliminar_conejo
} from '../servicios/conejo_servicios';

/**
 * Hook personalizado para gestión de conejos
 * Maneja estado, carga y operaciones CRUD
 */
export default function useConejos() {
    const [conejos, set_conejos] = useState([]);
    const [loading, set_loading] = useState(false);
    const [error, set_error] = useState(null);

    /**
     * Carga todos los conejos desde el backend
     */
    const cargar_conejos = async () => {
        set_loading(true);
        set_error(null);
        try {
            const res = await obtener_conejos();
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Error al obtener conejos');
            }
            const data = await res.json();
            set_conejos(data);
        } catch (err) {
            set_error(err.message);
            console.error('Error al cargar conejos:', err);
        } finally {
            set_loading(false);
        }
    };

    /**
     * Crea un nuevo conejo
     * @param {Object} datos
     * @returns {Promise<{success: boolean, message: string, conejo?: Object}>}
     */
    const crear = async (datos) => {
        set_loading(true);
        set_error(null);
        try {
            const res = await crear_conejo(datos);
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Error al crear conejo');
            }
            const data = await res.json();
            await cargar_conejos();
            return { success: true, message: data.message, conejo: data.conejo };
        } catch (err) {
            set_error(err.message);
            return { success: false, message: err.message };
        } finally {
            set_loading(false);
        }
    };

    /**
     * Actualiza un conejo existente
     * @param {string} id
     * @param {Object} datos
     * @returns {Promise<{success: boolean, message: string}>}
     */
    const actualizar = async (id, datos) => {
        set_loading(true);
        set_error(null);
        try {
            const res = await actualizar_conejo(id, datos);
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Error al actualizar conejo');
            }
            const data = await res.json();
            await cargar_conejos();
            return { success: true, message: data.message };
        } catch (err) {
            set_error(err.message);
            return { success: false, message: err.message };
        } finally {
            set_loading(false);
        }
    };

    /**
     * Elimina un conejo
     * @param {string} id
     * @returns {Promise<{success: boolean, message: string}>}
     */
    const eliminar = async (id) => {
        set_loading(true);
        set_error(null);
        try {
            const res = await eliminar_conejo(id);
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Error al eliminar conejo');
            }
            const data = await res.json();
            await cargar_conejos();
            return { success: true, message: data.message };
        } catch (err) {
            set_error(err.message);
            return { success: false, message: err.message };
        } finally {
            set_loading(false);
        }
    };

    useEffect(() => {
        cargar_conejos();
    }, []);

    return {
        conejos,
        loading,
        error,
        cargar_conejos,
        crear,
        actualizar,
        eliminar
    };
}
