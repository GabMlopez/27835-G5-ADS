import { useState, useEffect } from 'react';

/**
 * Componente de formulario para registrar o editar alimentación
 * @param {Object} props
 * @param {Object|null} props.alimentacion_inicial - Datos para editar (null para crear)
 * @param {string} props.conejo_seleccionado - ID del conejo al que se le asigna la dieta
 * @param {Function} props.on_submit - Callback al enviar formulario
 * @param {Function} props.on_cancelar - Callback al cancelar
 * @param {boolean} props.loading - Estado de carga
 */
export default function FormularioAlimentacion({ alimentacion_inicial, conejo_seleccionado, on_submit, on_cancelar, loading }) {
    const [fecha, set_fecha] = useState(new Date().toISOString().split('T')[0]);
    const [dieta, set_dieta] = useState('');
    const [justificacion, set_justificacion] = useState('Mantenimiento');
    const [errores, set_errores] = useState({});

    useEffect(() => {
        if (alimentacion_inicial) {
            set_fecha(new Date(alimentacion_inicial.alimentacion_fecha).toISOString().split('T')[0]);
            set_dieta(alimentacion_inicial.alimentacion_dieta);
            set_justificacion(alimentacion_inicial.alimentacion_justificacion);
        }
    }, [alimentacion_inicial]);

    const validar = () => {
        const err = {};
        if (!dieta.trim()) err.dieta = 'La descripción de la dieta es obligatoria';
        if (!justificacion.trim()) err.justificacion = 'La justificación es obligatoria';
        if (!fecha) err.fecha = 'La fecha es obligatoria';
        return err;
    };

    const handle_submit = (e) => {
        e.preventDefault();
        const err = validar();
        if (Object.keys(err).length > 0) {
            set_errores(err);
            return;
        }

        const datos = {
            alimentacion_fecha: fecha,
            alimentacion_dieta: dieta,
            alimentacion_justificacion: justificacion,
            conejo_id: conejo_seleccionado // Viene del conejo elegido en la tabla
        };

        on_submit(datos);
    };

    return (
        <form onSubmit={handle_submit} className="space-y-4">
            <h3 className="text-xl font-bold text-purple-800 mb-4">
                {alimentacion_inicial ? 'Editar Registro' : 'Nueva Alimentación'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Fecha */}
                <div>
                    <label className="block text-gray-700 font-bold mb-1">Fecha</label>
                    <input
                        type="date"
                        value={fecha}
                        onChange={(e) => set_fecha(e.target.value)}
                        className={`w-full p-2 rounded border ${errores.fecha ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errores.fecha && <p className="text-red-500 text-sm mt-1">{errores.fecha}</p>}
                </div>

                {/* Justificación (Select para estandarizar) */}
                <div>
                    <label className="block text-gray-700 font-bold mb-1">Justificación</label>
                    <select 
                        value={justificacion} 
                        onChange={(e) => set_justificacion(e.target.value)}
                        className="w-full p-2 rounded border border-gray-300"
                    >
                        <option value="Crecimiento">Crecimiento</option>
                        <option value="Engorde">Engorde</option>
                        <option value="Gestación">Gestación</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>

                {/* Dieta / Detalles */}
                <div className="md:col-span-2">
                    <label className="block text-gray-700 font-bold mb-1">Dieta (Detalles de ración)</label>
                    <textarea
                        placeholder="Ej: 150g Heno, 50g Balanceado, Vegetales verdes"
                        value={dieta}
                        onChange={(e) => set_dieta(e.target.value)}
                        rows="3"
                        className={`w-full p-2 rounded border ${errores.dieta ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errores.dieta && <p className="text-red-500 text-sm mt-1">{errores.dieta}</p>}
                </div>
            </div>

            <div className="flex gap-4 justify-end mt-6">
                <button 
                    type="button" 
                    onClick={on_cancelar} 
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition"
                >
                    Cancelar
                </button>
                <button 
                    type="submit" 
                    disabled={loading} 
                    className="px-6 py-2 bg-purple-700 text-white rounded-full hover:bg-purple-800 transition shadow-lg"
                >
                    {loading ? 'Guardando...' : alimentacion_inicial ? 'Actualizar' : 'Registrar Dieta'}
                </button>
            </div>
        </form>
    );
}