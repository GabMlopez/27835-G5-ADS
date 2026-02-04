import { useState } from 'react';

/**
 * Componente de tabla para listar conejos
 * @param {Object} props
 * @param {Array} props.conejos - Lista de conejos
 * @param {Function} props.on_editar - Callback al editar
 * @param {Function} props.on_eliminar - Callback al eliminar
 * @param {boolean} props.loading - Estado de carga
 */
export default function TablaConejos({ conejos, on_editar, on_eliminar, loading }) {
    const [conejo_a_eliminar, set_conejo_a_eliminar] = useState(null);

    const confirmar_eliminacion = (conejo) => {
        set_conejo_a_eliminar(conejo);
    };

    const cancelar_eliminacion = () => {
        set_conejo_a_eliminar(null);
    };

    const ejecutar_eliminacion = () => {
        if (conejo_a_eliminar) {
            on_eliminar(conejo_a_eliminar.conejo_id);
            set_conejo_a_eliminar(null);
        }
    };

    if (loading && conejos.length === 0) {
        return (
            <div className="flex justify-center items-center py-12">
                <svg className="animate-spin h-10 w-10 text-purple-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            </div>
        );
    }

    if (conejos.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600 text-lg">No hay conejos registrados</p>
                <p className="text-gray-500 text-sm mt-2">Registra tu primer conejo usando el botón "Nuevo Conejo"</p>
            </div>
        );
    }

    return (
        <>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-purple-400 text-white">
                            <th className="p-4">Código</th>
                            <th className="p-4">Nombre</th>
                            <th className="p-4">Sexo</th>
                            <th className="p-4">Edad (m)</th>
                            <th className="p-4">Peso (kg)</th>
                            <th className="p-4">Raza</th>
                            <th className="p-4">Jaula</th>
                            <th className="p-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {conejos.map((conejo) => (
                            <tr key={conejo.conejo_id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-4 font-semibold text-purple-700">{conejo.conejo_codigo}</td>
                                <td className="p-4">{conejo.conejo_nombre}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${conejo.conejo_sexo === 'Macho' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                                        {conejo.conejo_sexo}
                                    </span>
                                </td>
                                <td className="p-4">{conejo.conejo_edad}</td>
                                <td className="p-4">{conejo.conejo_peso}</td>
                                <td className="p-4">{conejo.raza_id}</td>
                                <td className="p-4">{conejo.jaula_id}</td>
                                <td className="p-4">
                                    <div className="flex gap-2 justify-center">
                                        <button
                                            onClick={() => on_editar(conejo)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                            title="Editar"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => confirmar_eliminacion(conejo)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                                            title="Eliminar"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {conejo_a_eliminar && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                        <h3 className="text-2xl font-bold mb-4 text-gray-800">Confirmar Eliminación</h3>
                        <p className="text-gray-600 mb-6">
                            ¿Estás seguro de que deseas eliminar al conejo <strong>{conejo_a_eliminar.conejo_nombre}</strong> ({conejo_a_eliminar.conejo_codigo})?
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
