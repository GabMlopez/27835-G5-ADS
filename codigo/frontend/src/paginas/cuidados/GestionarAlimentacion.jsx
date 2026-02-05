import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useConejos from '../../hooks/useConejos';
import { registrar_alimentacion } from '../../servicios/alimentacion_servicios';
import FormularioAlimentacion from '../../componentes/cuidados/FormularioAlimentacion';
import { GrAdd } from "react-icons/gr";
import { FaPencilAlt } from "react-icons/fa";

export default function GestionarAlimentacion() {
    const navigate = useNavigate();
    const { conejos, loading } = useConejos();
    const [filtro, set_filtro] = useState('');
    const [mensaje, set_mensaje] = useState(null);
    const [conejo_seleccionado, set_conejo_seleccionado] = useState(null);
    const [mostrar_formulario, set_mostrar_formulario] = useState(false);
    const [enviando, set_enviando] = useState(false);

    const handle_abrir_formulario = (conejo) => {
        set_conejo_seleccionado(conejo);
        set_mostrar_formulario(true);
    };

    const handle_editar_formulario = (conejo) => {
        set_conejo_seleccionado(conejo);
        set_mostrar_formulario(true);
    };

    const conejos_filtrados = conejos.filter(c =>
        c.conejo_id.toLowerCase().includes(filtro.toLowerCase()) ||
        (c.conejo_nombre && c.conejo_nombre.toLowerCase().includes(filtro.toLowerCase()))
    );

    const enviar_formulario = async (datos) => {
        set_enviando(true);
        try {
            const res = await registrar_alimentacion(datos);
            if (res.ok) {
                set_mensaje({ tipo: 'success', texto: `Alimentación registrada con éxito para el conejo ${datos.conejo_id}` });
                set_mostrar_formulario(false);
            } else {
                const err = await res.json();
                set_mensaje({ tipo: 'error', texto: err.message || 'Error al registrar la alimentación' });
            }
        } catch (error) {
            set_mensaje({ tipo: 'error', texto: 'Error de conexión con el servidor' });
        } finally {
            set_enviando(false);
            setTimeout(() => set_mensaje(null), 5000);
        }
    };

    return (
        <div className="min-h-screen bg-[#d8b4de] p-8 relative">
            {/* Botón Volver */}
            <button onClick={() => navigate(-1)} className="absolute top-8 left-8 text-3xl text-black hover:scale-110 transition-transform">
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
                            <input
                                type="text"
                                value={filtro}
                                onChange={(e) => set_filtro(e.target.value)}
                                placeholder="Código o Nombre"
                                className="w-full p-3 rounded-md bg-gray-100 border-none outline-none shadow-sm focus:ring-2 focus:ring-purple-400"
                            />
                        </div>
                    </div>
                </div>

                {/* Mensajes de feedback */}
                {mensaje && (
                    <div className={`mb-4 p-4 rounded-lg shadow-md ${mensaje.tipo === 'success' ? 'bg-green-100 text-green-700 border-l-4 border-green-500' : 'bg-red-100 text-red-700 border-l-4 border-red-500'}`}>
                        {mensaje.texto}
                    </div>
                )}

                {/* Tabla de Conejos */}
                <div className="bg-white/50 rounded-lg p-6 backdrop-blur-sm">
                    <h3 className="text-white font-bold mb-4 text-xl">Seleccionar Conejo</h3>
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-purple-400 text-white">
                                    <th className="p-4">Jaula</th>
                                    <th className="p-4">Código</th>
                                    <th className="p-4">Peso (kg)</th>
                                    <th className="p-4 text-center">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="4" className="p-4 text-center italic text-gray-500">Cargando conejos...</td></tr>
                                ) : conejos_filtrados.length === 0 ? (
                                    <tr><td colSpan="4" className="p-4 text-center text-gray-500">No se encontraron conejos</td></tr>
                                ) : (
                                    conejos_filtrados.map((conejo) => (
                                        <tr key={conejo.conejo_id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                            <td className="p-4">{conejo.jaula_id}</td>
                                            <td className="p-4 font-bold">{conejo.conejo_id}</td>
                                            <td className="p-4">{conejo.conejo_peso} kg</td>
                                            <td className="p-4 text-center">
                                                <button
                                                    onClick={() => handle_abrir_formulario(conejo)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                                        title="Crear Alimentación"
                                                    >
                                                        <GrAdd />
                                                </button>
                                                <button
                                                    onClick={() => handle_editar_formulario(conejo)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                                        title="Editar Alimentación"
                                                    >
                                                        <FaPencilAlt />
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

            {/* Modal del Formulario */}
            {mostrar_formulario && (
               <div className="fixed inset-0 bg-gray-900/30 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-2xl max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Alimentación: {conejo_seleccionado?.conejo_id}</h2>
                            <button onClick={() => set_mostrar_formulario(false)} className="text-gray-400 hover:text-red-500 text-2xl">×</button>
                        </div>
                        <FormularioAlimentacion 
                            conejo_seleccionado={conejo_seleccionado?.conejo_id}
                            on_submit={enviar_formulario}
                            on_cancelar={() => set_mostrar_formulario(false)}
                            loading={enviando}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}