import { useState, useEffect } from 'react';
import {
    obtener_razas,
    crear_raza
} from '../servicios/raza_servicios';

/**
 * Hook personalizado para gestión de razas
 * Maneja estado, carga y creación
 */
export default function useRazas() {
    const [razas, set_razas] = useState([]);
    const [loading, set_loading] = useState(false);
    const [error, set_error] = useState(null);

    /**
     * Carga todas las razas desde el backend
     */
    const cargar_razas = async () => {
        set_loading(true);
        set_error(null);
        try {
            const res = await obtener_razas();
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Error al obtener razas');
            }
            const data = await res.json();
            set_razas(data);
        } catch (err) {
            set_error(err.message);
            console.error('Error al cargar razas:', err);
        } finally {
            set_loading(false);
        }
    };

    /**
     * Crea una nueva raza
     * @param {Object} datos - {raza_nombre, raza_descripcion}
     * @returns {Promise<{success: boolean, message: string, raza?: Object}>}
     */
    const crear = async (datos) => {
        set_loading(true);
        set_error(null);
        try {
            const res = await crear_raza(datos);
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Error al crear raza');
            }
            const data = await res.json();
            await cargar_razas(); // Recargar lista
            return { success: true, message: data.message, raza: data.raza };
        } catch (err) {
            set_error(err.message);
            return { success: false, message: err.message };
        } finally {
            set_loading(false);
        }
    };

    // Cargar razas al montar el componente
    useEffect(() => {
        cargar_razas();
    }, []);

    return {
        razas,
        loading,
        error,
        cargar_razas,
        crear
    };
}
