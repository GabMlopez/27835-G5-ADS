import { useState } from 'react';

/**
 * Componente de tabla para listar jaulas
 * @param {Object} props
 * @param {Array} props.jaulas - Lista de jaulas
 * @param {Function} props.on_editar - Callback al editar jaula
 * @param {Function} props.on_eliminar - Callback al eliminar jaula
 * @param {boolean} props.loading - Estado de carga
 */
export default function TablaJaulas({ jaulas, on_editar, on_eliminar, loading }) {
    const [jaula_a_eliminar, set_jaula_a_eliminar] = useState(null);

    const confirmar_eliminacion = (jaula) => {
        set_jaula_a_eliminar(jaula);
    };

    const cancelar_eliminacion = () => {
        set_jaula_a_eliminar(null);
    };

    const ejecutar_eliminacion = () => {
        if (jaula_a_eliminar) {
            on_eliminar(jaula_a_eliminar.jaula_id);
            set_jaula_a_eliminar(null);
        }
    };

    if (loading && jaulas.length === 0) {
        return (
            <div className="flex justify-center items-center py-12">
                <svg className="animate-spin h-10 w-10 text-purple-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            </div>
        );
    }

    if (jaulas.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600 text-lg">No hay jaulas registradas</p>
                <p className="text-gray-500 text-sm mt-2">Crea tu primera jaula usando el botón "Nueva Jaula"</p>
            </div>
        );
    }

    return (
        <>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-purple-400 text-white">
                            <th className="p-4">ID</th>
                            <th className="p-4">Tipo</th>
                            <th className="p-4">Capacidad</th>
                            <th className="p-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jaulas.map((jaula) => (
                            <tr key={jaula.jaula_id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-4 font-semibold text-purple-700">{jaula.jaula_id}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${jaula.jaula_tipo === 'Reproduccion'
                                            ? 'bg-pink-100 text-pink-700'
                                            : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {jaula.jaula_tipo}
                                    </span>
                                </td>
                                <td className="p-4">{jaula.jaula_capacidad} conejo(s)</td>
                                <td className="p-4">
                                    <div className="flex gap-2 justify-center">
                                        <button
                                            onClick={() => on_editar(jaula)}
                                            disabled={loading}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Editar jaula"
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            onClick={() => confirmar_eliminacion(jaula)}
                                            disabled={loading}
                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Eliminar jaula"
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de confirmación de eliminación */}
            {jaula_a_eliminar && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                        <h3 className="text-2xl font-bold mb-4 text-gray-800">Confirmar Eliminación</h3>
                        <p className="text-gray-600 mb-6">
                            ¿Estás seguro de que deseas eliminar la jaula <strong>{jaula_a_eliminar.jaula_id}</strong>?
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                            Tipo: {jaula_a_eliminar.jaula_tipo} | Capacidad: {jaula_a_eliminar.jaula_capacidad}
                        </p>
                        <div className="flex gap-4 justify-end">
                            <button
                                onClick={cancelar_eliminacion}
                                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={ejecutar_eliminacion}
                                className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
