import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useConejos from '../../hooks/useConejos';
import { registrar_monta } from '../../servicios/monta_servicios';

export default function GestionarMontas() {
    const navigate = useNavigate();
    const { conejos, loading } = useConejos();
    const [macho_id, set_macho_id] = useState('');
    const [hembra_id, set_hembra_id] = useState('');
    const [mensaje, set_mensaje] = useState(null);

    const machos = conejos.filter(c => c.conejo_sexo === 'Macho' && c.conejo_estado === 'Saludable');
    const hembras = conejos.filter(c => c.conejo_sexo === 'Hembra' && c.conejo_estado === 'Saludable');

    const handle_submit = async (e) => {
        e.preventDefault();
        if (!macho_id || !hembra_id) {
            set_mensaje({ tipo: 'error', texto: 'Seleccione un macho y una hembra' });
            return;
        }

        const datos = {
            macho_id,
            hembra_id,
            monta_fecha_monta: new Date().toISOString()
        };

        try {
            const res = await registrar_monta(datos);
            if (res.ok) {
                set_mensaje({ tipo: 'success', texto: 'Monta registrada exitosamente' });
                set_macho_id('');
                set_hembra_id('');
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

            <div className="max-w-4xl mx-auto mt-12">
                <h1 className="text-5xl font-bold mb-6 text-black">Gestionar Montas</h1>
                <p className="text-xl text-gray-800 mb-8">
                    Registre los ciclos reproductivos de su plantel.
                </p>

                {mensaje && (
                    <div className={`mb-6 p-4 rounded-lg ${mensaje.tipo === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {mensaje.texto}
                    </div>
                )}

                <div className="bg-white rounded-lg p-8 shadow-lg">
                    <form onSubmit={handle_submit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Seleccionar Macho (Semental):</label>
                            <select
                                value={macho_id}
                                onChange={(e) => set_macho_id(e.target.value)}
                                className="w-full p-3 rounded-md bg-gray-100 border border-gray-300"
                            >
                                <option value="">Seleccione un macho...</option>
                                {machos.map(m => (
                                    <option key={m.conejo_id} value={m.conejo_id}>
                                        {m.conejo_id} - {m.conejo_nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Seleccionar Hembra (Productora):</label>
                            <select
                                value={hembra_id}
                                onChange={(e) => set_hembra_id(e.target.value)}
                                className="w-full p-3 rounded-md bg-gray-100 border border-gray-300"
                            >
                                <option value="">Seleccione una hembra...</option>
                                {hembras.map(h => (
                                    <option key={h.conejo_id} value={h.conejo_id}>
                                        {h.conejo_id} - {h.conejo_nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-purple-700 text-white font-bold py-3 rounded-full hover:bg-purple-800 transition shadow-lg"
                        >
                            {loading ? 'Procesando...' : 'Registrar Monta'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
