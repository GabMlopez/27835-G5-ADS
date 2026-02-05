import { useState } from 'react';

/**
 * Componente de formulario para crear razas
 * @param {Object} props
 * @param {Function} props.on_submit - Callback al enviar formulario
 * @param {Function} props.on_cancelar - Callback al cancelar
 * @param {boolean} props.loading - Estado de carga
 */
export default function FormularioRaza({ on_submit, on_cancelar, loading }) {
    const [nombre, set_nombre] = useState('');
    const [descripcion, set_descripcion] = useState('');
    const [errores, set_errores] = useState({});

    const validar = () => {
        const errores_validacion = {};
        if (!nombre.trim()) {
            errores_validacion.nombre = 'El nombre es obligatorio';
        }
        if (!descripcion.trim()) {
            errores_validacion.descripcion = 'La descripción es obligatoria';
        }
        return errores_validacion;
    };

    const handle_submit = (e) => {
        e.preventDefault();
        const errores_validacion = validar();
        if (Object.keys(errores_validacion).length > 0) {
            set_errores(errores_validacion);
            return;
        }

        const datos = {
            conejo_raza_nombre: nombre,
            conejo_raza_descripcion: descripcion
        };

        on_submit(datos);
    };

    return (
        <form onSubmit={handle_submit} className="space-y-6">
            <div>
                <label className="block text-gray-700 font-bold mb-2">
                    Nombre de la Raza
                </label>
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => {
                        set_nombre(e.target.value);
                        set_errores({ ...errores, nombre: null });
                    }}
                    disabled={loading}
                    placeholder="Ej. Nueva Zelanda"
                    className={`w-full p-3 rounded-md bg-gray-100 border ${errores.nombre ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
                {errores.nombre && <p className="text-red-600 text-sm mt-1">{errores.nombre}</p>}
            </div>

            <div>
                <label className="block text-gray-700 font-bold mb-2">
                    Descripción
                </label>
                <textarea
                    value={descripcion}
                    onChange={(e) => {
                        set_descripcion(e.target.value);
                        set_errores({ ...errores, descripcion: null });
                    }}
                    disabled={loading}
                    placeholder="Describe las características de la raza..."
                    rows="4"
                    className={`w-full p-3 rounded-md bg-gray-100 border ${errores.descripcion ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
                {errores.descripcion && <p className="text-red-600 text-sm mt-1">{errores.descripcion}</p>}
            </div>

            <div className="flex gap-4 justify-end">
                <button
                    type="button"
                    onClick={on_cancelar}
                    disabled={loading}
                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-purple-700 text-white rounded-full hover:bg-purple-800 transition flex items-center gap-2"
                >
                    {loading ? 'Guardando...' : 'Crear Raza'}
                </button>
            </div>
        </form>
    );
}
