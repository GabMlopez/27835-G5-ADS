import { useState, useEffect } from 'react';
import {
    obtener_jaulas,
    crear_jaula,
    actualizar_jaula,
    eliminar_jaula
} from '../servicios/jaula_servicios';

/**
 * Hook personalizado para gestión de jaulas
 * Maneja estado, carga y operaciones CRUD
 */
export default function useJaulas() {
    const [jaulas, set_jaulas] = useState([]);
    const [loading, set_loading] = useState(false);
    const [error, set_error] = useState(null);

    /**
     * Carga todas las jaulas desde el backend
     */
    const cargar_jaulas = async () => {
        set_loading(true);
        set_error(null);
        try {
            const res = await obtener_jaulas();
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Error al obtener jaulas');
            }
            const data = await res.json();
            set_jaulas(data);
        } catch (err) {
            set_error(err.message);
            console.error('Error al cargar jaulas:', err);
        } finally {
            set_loading(false);
        }
    };

    /**
     * Crea una nueva jaula
     * @param {Object} datos - {jaula_tipo, jaula_capacidad}
     * @returns {Promise<{success: boolean, message: string, jaula?: Object}>}
     */
    const crear = async (datos) => {
        set_loading(true);
        set_error(null);
        try {
            const res = await crear_jaula(datos);
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Error al crear jaula');
            }
            const data = await res.json();
            await cargar_jaulas(); // Recargar lista
            return { success: true, message: data.message, jaula: data.jaula };
        } catch (err) {
            set_error(err.message);
            return { success: false, message: err.message };
        } finally {
            set_loading(false);
        }
    };

    /**
     * Actualiza una jaula existente
     * @param {string} id - ID de la jaula
     * @param {Object} datos - {jaula_tipo, jaula_capacidad}
     * @returns {Promise<{success: boolean, message: string}>}
     */
    const actualizar = async (id, datos) => {
        set_loading(true);
        set_error(null);
        try {
            const res = await actualizar_jaula(id, datos);
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Error al actualizar jaula');
            }
            const data = await res.json();
            await cargar_jaulas(); // Recargar lista
            return { success: true, message: data.message };
        } catch (err) {
            set_error(err.message);
            return { success: false, message: err.message };
        } finally {
            set_loading(false);
        }
    };

    /**
     * Elimina una jaula
     * @param {string} id - ID de la jaula
     * @returns {Promise<{success: boolean, message: string}>}
     */
    const eliminar = async (id) => {
        set_loading(true);
        set_error(null);
        try {
            const res = await eliminar_jaula(id);
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Error al eliminar jaula');
            }
            const data = await res.json();
            await cargar_jaulas(); // Recargar lista
            return { success: true, message: data.message };
        } catch (err) {
            set_error(err.message);
            return { success: false, message: err.message };
        } finally {
            set_loading(false);
        }
    };

    // Cargar jaulas al montar el componente
    useEffect(() => {
        cargar_jaulas();
    }, []);

    return {
        jaulas,
        loading,
        error,
        cargar_jaulas,
        crear,
        actualizar,
        eliminar
    };
}
