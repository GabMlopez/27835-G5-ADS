import { useState, useEffect } from 'react';

/**
 * Componente de formulario para crear/editar jaulas
 * @param {Object} props
 * @param {Object|null} props.jaula_inicial - Jaula a editar (null para crear)
 * @param {Function} props.on_submit - Callback al enviar formulario
 * @param {Function} props.on_cancelar - Callback al cancelar
 * @param {boolean} props.loading - Estado de carga
 */
export default function FormularioJaula({ jaula_inicial, on_submit, on_cancelar, loading }) {
    const [tipo, set_tipo] = useState('Reproduccion');
    const [capacidad, set_capacidad] = useState(1);
    const [errores, set_errores] = useState({});

    // Cargar datos si es edición
    useEffect(() => {
        if (jaula_inicial) {
            set_tipo(jaula_inicial.jaula_tipo);
            set_capacidad(jaula_inicial.jaula_capacidad);
        }
    }, [jaula_inicial]);

    // Validar capacidad según tipo
    const validar_capacidad = (tipo_jaula, cap) => {
        const errores_validacion = {};

        if (!cap || cap < 1) {
            errores_validacion.capacidad = 'La capacidad debe ser mayor a 0';
            return errores_validacion;
        }

        if (tipo_jaula === 'Reproduccion' && cap !== 1) {
            errores_validacion.capacidad = 'Las jaulas de reproducción deben tener capacidad de 1';
        } else if (tipo_jaula === 'Engorde' && (cap < 1 || cap > 6)) {
            errores_validacion.capacidad = 'Las jaulas de engorde deben tener capacidad entre 1 y 6';
        }

        return errores_validacion;
    };

    // Manejar cambio de tipo
    const handle_tipo_change = (e) => {
        const nuevo_tipo = e.target.value;
        set_tipo(nuevo_tipo);

        // Ajustar capacidad automáticamente
        if (nuevo_tipo === 'Reproduccion') {
            set_capacidad(1);
        } else if (capacidad > 6) {
            set_capacidad(6);
        }

        set_errores({});
    };

    // Manejar cambio de capacidad
    const handle_capacidad_change = (e) => {
        const nueva_capacidad = parseInt(e.target.value);
        set_capacidad(nueva_capacidad);

        // Validar en tiempo real
        const errores_validacion = validar_capacidad(tipo, nueva_capacidad);
        set_errores(errores_validacion);
    };

    // Manejar envío del formulario
    const handle_submit = (e) => {
        e.preventDefault();

        // Validar antes de enviar
        const errores_validacion = validar_capacidad(tipo, capacidad);
        if (Object.keys(errores_validacion).length > 0) {
            set_errores(errores_validacion);
            return;
        }

        const datos = {
            jaula_tipo: tipo,
            jaula_capacidad: capacidad
        };

        on_submit(datos);
    };

    return (
        <form onSubmit={handle_submit} className="space-y-6">
            {/* Tipo de Jaula */}
            <div>
                <label className="block text-gray-700 font-bold mb-2">
                    Tipo de Jaula
                </label>
                <select
                    value={tipo}
                    onChange={handle_tipo_change}
                    disabled={loading}
                    className="w-full p-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    <option value="Reproduccion">Reproducción</option>
                    <option value="Engorde">Engorde</option>
                </select>
            </div>

            {/* Capacidad */}
            <div>
                <label className="block text-gray-700 font-bold mb-2">
                    Capacidad
                </label>
                <input
                    type="number"
                    min="1"
                    max={tipo === 'Reproduccion' ? 1 : 6}
                    value={capacidad}
                    onChange={handle_capacidad_change}
                    disabled={loading || tipo === 'Reproduccion'}
                    className={`w-full p-3 rounded-md bg-gray-100 border ${errores.capacidad ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-purple-500 ${tipo === 'Reproduccion' ? 'cursor-not-allowed opacity-60' : ''
                        }`}
                />
                {errores.capacidad && (
                    <p className="text-red-600 text-sm mt-1">{errores.capacidad}</p>
                )}
                <p className="text-gray-600 text-sm mt-1">
                    {tipo === 'Reproduccion'
                        ? 'Las jaulas de reproducción siempre tienen capacidad 1'
                        : 'Capacidad entre 1 y 6 conejos'}
                </p>
            </div>

            {/* Botones */}
            <div className="flex gap-4 justify-end">
                <button
                    type="button"
                    onClick={on_cancelar}
                    disabled={loading}
                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading || Object.keys(errores).length > 0}
                    className="px-6 py-3 bg-purple-700 text-white rounded-full hover:bg-purple-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Guardando...
                        </>
                    ) : (
                        <>
                            <span>★</span>
                            {jaula_inicial ? 'Actualizar' : 'Crear'} Jaula
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
