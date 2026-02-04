import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useConejos from '../../hooks/useConejos';
import { registrar_vacunacion_conejo } from '../../servicios/vacunacion_servicios';
import { registrar_desparasitacion_conejo } from '../../servicios/desparasitacion_servicios';

export default function GestionarVacunacion() {
    const navigate = useNavigate();
    const { conejos, loading } = useConejos();
    const [filtro, set_filtro] = useState('');
    const [mensaje, set_mensaje] = useState(null);

    const conejos_filtrados = conejos.filter(c =>
        c.conejo_id.toLowerCase().includes(filtro.toLowerCase()) ||
        c.conejo_nombre.toLowerCase().includes(filtro.toLowerCase())
    );

    const handle_vacunar = async (conejo) => {
        const datos = {
            conejo_id: conejo.conejo_id,
            vacunacion_tipo: 'Mixomatosis VHD',
            vacunacion_fecha: new Date().toISOString()
        };

        try {
            const res = await registrar_vacunacion_conejo(datos);
            if (res.ok) {
                set_mensaje({ tipo: 'success', texto: `Vacuna registrada para ${conejo.conejo_nombre}` });
            } else {
                const err = await res.json();
                set_mensaje({ tipo: 'error', texto: err.message || 'Error al registrar' });
            }
        } catch (error) {
            set_mensaje({ tipo: 'error', texto: 'Error de conexión' });
        }
        setTimeout(() => set_mensaje(null), 5000);
    };

    const handle_desparasitar = async (conejo) => {
        const datos = {
            conejo_id: conejo.conejo_id,
            desparasitacion_tipo: 'Interna/Externa',
            desparasitacion_fecha: new Date().toISOString()
        };

        try {
            const res = await registrar_desparasitacion_conejo(datos);
            if (res.ok) {
                set_mensaje({ tipo: 'success', texto: `Desparasitación registrada para ${conejo.conejo_nombre}` });
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
                <h1 className="text-5xl font-bold mb-6 text-black">Gestionar Controles Médicos</h1>
                <p className="text-xl text-gray-800 mb-8">
                    Registre vacunas y desparasitaciones para mantener la salud de sus animales.
                </p>

                <div className="mb-8">
                    <label className="block text-white font-bold mb-2">Buscar Conejo:</label>
                    <input
                        type="text"
                        value={filtro}
                        onChange={(e) => set_filtro(e.target.value)}
                        placeholder="Código o Nombre"
                        className="w-full p-3 rounded-md bg-gray-100 border-none outline-none"
                    />
                </div>

                {mensaje && (
                    <div className={`mb-6 p-4 rounded-lg ${mensaje.tipo === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {mensaje.texto}
                    </div>
                )}

                <div className="bg-white/50 rounded-lg p-6">
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-purple-400 text-white">
                                    <th className="p-4">Jaula</th>
                                    <th className="p-4">Código</th>
                                    <th className="p-4">Nombre</th>
                                    <th className="p-4 text-center">Acciones Médicas</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="4" className="p-4 text-center">Cargando...</td></tr>
                                ) : conejos_filtrados.length === 0 ? (
                                    <tr><td colSpan="4" className="p-4 text-center">No se encontraron conejos</td></tr>
                                ) : (
                                    conejos_filtrados.map((conejo) => (
                                        <tr key={conejo.conejo_id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="p-4">{conejo.jaula_id}</td>
                                            <td className="p-4 font-bold">{conejo.conejo_id}</td>
                                            <td className="p-4">{conejo.conejo_nombre}</td>
                                            <td className="p-4 text-center">
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => handle_vacunar(conejo)}
                                                        className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs hover:bg-blue-700"
                                                    >
                                                        Vacunar
                                                    </button>
                                                    <button
                                                        onClick={() => handle_desparasitar(conejo)}
                                                        className="bg-green-600 text-white px-4 py-2 rounded-full text-xs hover:bg-green-700"
                                                    >
                                                        Desparasitar
                                                    </button>
                                                </div>
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
