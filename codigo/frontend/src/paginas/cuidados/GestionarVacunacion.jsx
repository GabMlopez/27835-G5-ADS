import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useConejos from '../../hooks/useConejos';
import { registrar_vacunacion_conejo } from '../../servicios/vacunacion_servicios';
import { registrar_desparasitacion_conejo } from '../../servicios/desparasitacion_servicios';
import { set } from 'date-fns';

export default function GestionarVacunacion() {
    const navigate = useNavigate();
    const { conejos, loading } = useConejos();
    const [filtro, set_filtro] = useState('');
    const [mensaje, set_mensaje] = useState(null);
    const [mostrar_modal, set_mostrar_modal] = useState(false);
    const [mostrar_confirmacion, set_mostrar_confirmacion] = useState(false);
    const [conejo_seleccionado, set_conejo_seleccionado] = useState(null);
    const [tipo_vacuna, set_tipo_vacuna] = useState('Mixomatosis');

    const conejos_filtrados = conejos.filter(c =>
        c.conejo_id.toLowerCase().includes(filtro.toLowerCase()) ||
        c.conejo_nombre.toLowerCase().includes(filtro.toLowerCase())
    );

    // Abre el modal y guarda el conejo
    const abrir_modal_vacuna = (conejo) => {
        set_conejo_seleccionado(conejo);
        set_mostrar_modal(true);
    };

    const abrir_mensaje_confirmacion = (conejo) => {
        set_conejo_seleccionado(conejo);
        set_mostrar_confirmacion(true);
    };

    const confirmar_vacunacion = async () => {
        if (!conejo_seleccionado) return;

        const datos = {
            conejo_id: conejo_seleccionado.conejo_id,
            vacunacion_tipo: tipo_vacuna,
            vacunacion_fecha: new Date().toISOString()
        };

        try {
            const res = await registrar_vacunacion_conejo(datos);
            if (res.ok) {
                set_mensaje({ tipo: 'success', texto: `Vacuna ${tipo_vacuna} registrada exitosamente` });
            } else {
                const err = await res.json();
                set_mensaje({ tipo: 'error', texto: err.message || 'Error al registrar' });
            }
        } catch (error) {
            set_mensaje({ tipo: 'error', texto: 'Error de conexión' });
        }
        
        set_mostrar_modal(false);
        setTimeout(() => set_mensaje(null), 5000);
    };

    const handle_desparasitar = async () => {
        if (!conejo_seleccionado) return;
        const datos = {
            conejo_id: conejo_seleccionado.conejo_id,
            desparasitacion_fecha: new Date().toISOString(),
            desparasitacion_realizada: true
        };

        try {
            const res = await registrar_desparasitacion_conejo(datos);
            if (res.ok) {
                set_mensaje({ tipo: 'success', texto: `Desparasitación registrada exitosamente` });
            } else {
                const err = await res.json();
                set_mensaje({ tipo: 'error', texto: err.message || 'Error al registrar' });
            }
        } catch (error) {
            set_mensaje({ tipo: 'error', texto: 'Error de conexión' });
        }
        set_mostrar_confirmacion(false);
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
                                            <td className="p-4 text-center">
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => abrir_modal_vacuna(conejo)}
                                                        className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs hover:bg-blue-700"
                                                    >
                                                        Vacunar
                                                    </button>
                                                    <button
                                                        onClick={() => abrir_mensaje_confirmacion(conejo)}
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
                {mostrar_modal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="fixed inset-0 bg-gray-900/30 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl">
                            <h2 className="text-2xl font-bold mb-4 text-purple-700">Registrar Vacuna</h2>
                            <p className="mb-4 text-gray-600">
                                Seleccione el tipo de vacuna para: <strong>{conejo_seleccionado?.conejo_nombre}</strong>
                            </p>
                            
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Vacuna:</label>
                                <select 
                                    value={tipo_vacuna}
                                    onChange={(e) => set_tipo_vacuna(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-400 outline-none"
                                >
                                    <option value="Mixomatosis">Mixomatosis</option>
                                    <option value="VHD">Hemorragia Virídica(VHD)</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button 
                                    onClick={() => set_mostrar_modal(false)}
                                    className="px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={confirmar_vacunacion}
                                    className="px-6 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                                >
                                    Registrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
            )}
            {mostrar_confirmacion && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                   <div className="fixed inset-0 bg-gray-900/30 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl">
                            <h2 className="text-2xl font-bold mb-4 text-purple-700">Registrar Control</h2>
                            <p className="mb-4 text-gray-600">
                                <strong>Desea registrar un nuevo control de vacunación para este conejo?</strong>
                            </p>
                            
        

                            <div className="flex justify-end gap-3">
                                <button 
                                    onClick={() => set_mostrar_confirmacion(false)}
                                    className="px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={handle_desparasitar}
                                    className="px-6 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                                >
                                    Registrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
            )}
            </div>

            {/* MODAL DE VACUNACIÓN */}
            
        </div>
    );
}
