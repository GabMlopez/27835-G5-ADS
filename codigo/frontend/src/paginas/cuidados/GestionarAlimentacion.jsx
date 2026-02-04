import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useConejos from '../../hooks/useConejos';
import { registrar_alimentacion } from '../../servicios/alimentacion_servicios';

export default function GestionarAlimentacion() {
    const navigate = useNavigate();
    const { conejos, loading } = useConejos();
    const [filtro, set_filtro] = useState('');
    const [mensaje, set_mensaje] = useState(null);

    const conejos_filtrados = conejos.filter(c =>
        c.conejo_id.toLowerCase().includes(filtro.toLowerCase()) ||
        c.conejo_nombre.toLowerCase().includes(filtro.toLowerCase())
    );

    const handle_registrar = async (conejo) => {
        // En un sistema real, esto abriría un formulario para ingresar cantidades específicas
        // Por ahora registraremos valores recomendados basados en el peso/edad si es necesario,
        // o simplemente confirmamos la dieta estándar.

        const datos = {
            conejo_id: conejo.conejo_id,
            cantidad_heno_seco: 150, // Valores de ejemplo
            cantidad_hierba_humeda: 100,
            cantidad_balanceado: 50
        };

        try {
            const res = await registrar_alimentacion(datos);
            if (res.ok) {
                set_mensaje({ tipo: 'success', texto: `Alimentación registrada para ${conejo.conejo_nombre}` });
            } else {
                const err = await res.json();
                set_mensaje({ tipo: 'error', texto: err.message || 'Error al registrar' });
            }
        } catch (error) {
            set_mensaje({ tipo: 'error', texto: 'Error de conexión' });
        }
        setTimeout(() => set_mensaje(null), 5000);
    };

    return (
        <div className="min-h-screen bg-[#d8b4de] p-8 relative">
            <button onClick={() => navigate(-1)} className="absolute top-8 left-8 text-3xl text-black">
                ←
            </button>

            <div className="max-w-6xl mx-auto mt-12">
                <div className="flex flex-col md:flex-row justify-between items-start mb-12">
                    <div className="md:w-1/2">
                        <h1 className="text-5xl font-bold mb-6 text-black">Gestionar Alimentación</h1>
                        <p className="text-xl text-gray-800 mb-8">
                            Optimice dietas y horarios para garantizar la nutrición y el crecimiento saludable de sus conejos.
                        </p>

                        <div className="mb-8">
                            <label className="block text-white font-bold mb-2">Buscar Conejo:</label>
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={filtro}
                                    onChange={(e) => set_filtro(e.target.value)}
                                    placeholder="Código o Nombre"
                                    className="w-full p-3 rounded-md bg-gray-100 border-none outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {mensaje && (
                    <div className={`mb-4 p-4 rounded-lg ${mensaje.tipo === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {mensaje.texto}
                    </div>
                )}

                <div className="bg-white/50 rounded-lg p-6">
                    <h3 className="text-white font-bold mb-4 text-xl">Seleccionar Conejo</h3>
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-purple-400 text-white">
                                    <th className="p-4">Jaula</th>
                                    <th className="p-4">Código</th>
                                    <th className="p-4">Nombre</th>
                                    <th className="p-4">Peso (kg)</th>
                                    <th className="p-4 text-center">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" className="p-4 text-center">Cargando...</td></tr>
                                ) : conejos_filtrados.length === 0 ? (
                                    <tr><td colSpan="5" className="p-4 text-center">No se encontraron conejos</td></tr>
                                ) : (
                                    conejos_filtrados.map((conejo) => (
                                        <tr key={conejo.conejo_id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="p-4">{conejo.jaula_id}</td>
                                            <td className="p-4 font-bold">{conejo.conejo_id}</td>
                                            <td className="p-4">{conejo.conejo_nombre}</td>
                                            <td className="p-4">{conejo.conejo_peso}</td>
                                            <td className="p-4 text-center">
                                                <button
                                                    onClick={() => handle_registrar(conejo)}
                                                    className="bg-purple-700 text-white px-4 py-2 rounded-full text-sm hover:bg-purple-800"
                                                >
                                                    Registrar Dieta
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
