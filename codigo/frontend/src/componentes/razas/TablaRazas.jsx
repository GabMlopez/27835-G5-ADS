import { useState } from 'react';

/**
 * Componente de tabla para listar razas
 * @param {Object} props
 * @param {Array} props.razas - Lista de razas
 * @param {boolean} props.loading - Estado de carga
 */
export default function TablaRazas({ razas, loading }) {
    if (loading && razas.length === 0) {
        return (
            <div className="flex justify-center items-center py-12">
                <svg className="animate-spin h-10 w-10 text-purple-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            </div>
        );
    }

    if (razas.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600 text-lg">No hay razas registradas</p>
                <p className="text-gray-500 text-sm mt-2">Crea tu primera raza usando el botón "Nueva Raza"</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-purple-400 text-white">
                        <th className="p-4">ID</th>
                        <th className="p-4">Nombre</th>
                        <th className="p-4">Descripción</th>
                    </tr>
                </thead>
                <tbody>
                    {razas.map((raza) => (
                        <tr key={raza.conejo_raza_id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="p-4 font-semibold text-purple-700">{raza.conejo_raza_id}</td>
                            <td className="p-4 font-bold">{raza.conejo_raza_nombre}</td>
                            <td className="p-4 text-gray-700">{raza.conejo_raza_descripcion}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
