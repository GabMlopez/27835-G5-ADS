import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useRazas from '../../hooks/useRazas';
import FormularioRaza from '../../componentes/razas/FormularioRaza';
import TablaRazas from '../../componentes/razas/TablaRazas';

export default function GestionarRazas() {
    const navigate = useNavigate();
    const { razas, loading, crear } = useRazas();

    const [mostrar_formulario, set_mostrar_formulario] = useState(false);
    const [mensaje, set_mensaje] = useState(null);

    const abrir_formulario_crear = () => {
        set_mostrar_formulario(true);
        set_mensaje(null);
    };

    const cerrar_formulario = () => {
        set_mostrar_formulario(false);
    };

    const handle_submit = async (datos) => {
        const resultado = await crear(datos);

        if (resultado.success) {
            set_mensaje({
                tipo: 'success',
                texto: resultado.message || 'Raza creada exitosamente'
            });
            cerrar_formulario();
            setTimeout(() => set_mensaje(null), 5000);
        } else {
            set_mensaje({
                tipo: 'error',
                texto: resultado.message
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#d8b4de] p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-5xl font-bold mb-2 text-black">Gestión de Razas</h1>
                    <p className="text-xl text-gray-800">Administra las razas de conejos de tu granja</p>
                </div>

                {mensaje && (
                    <div className={`mb-6 p-4 rounded-lg ${mensaje.tipo === 'success'
                        ? 'bg-green-100 border border-green-400 text-green-700'
                        : 'bg-red-100 border border-red-400 text-red-700'
                        }`}>
                        <p className="font-semibold">{mensaje.texto}</p>
                    </div>
                )}

                <div className="mb-6">
                    <button
                        onClick={abrir_formulario_crear}
                        className="bg-purple-700 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-purple-800 transition shadow-lg"
                    >
                        <span>★</span> Nueva Raza
                    </button>
                </div>

                <TablaRazas razas={razas} loading={loading} />
            </div>

            {mostrar_formulario && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Nueva Raza</h2>
                        <FormularioRaza
                            on_submit={handle_submit}
                            on_cancelar={cerrar_formulario}
                            loading={loading}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
