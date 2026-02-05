import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useConejos from '../../hooks/useConejos';
import useRazas from '../../hooks/useRazas';
import useJaulas from '../../hooks/useJaulas';
import FormularioConejo from '../../componentes/conejos/FormularioConejo';
import TablaConejos from '../../componentes/conejos/TablaConejos';

export default function GestionarConejos() {
    const navigate = useNavigate();
    const { conejos, loading: loadingConejos, crear, actualizar, eliminar } = useConejos();
    const { razas, loading: loadingRazas } = useRazas();
    const { jaulas, loading: loadingJaulas } = useJaulas();

    const [mostrar_formulario, set_mostrar_formulario] = useState(false);
    const [conejo_editando, set_conejo_editando] = useState(null);
    const [mensaje, set_mensaje] = useState(null);

    const loading = loadingConejos || loadingRazas || loadingJaulas;

    const abrir_formulario_crear = () => {
        set_conejo_editando(null);
        set_mostrar_formulario(true);
        set_mensaje(null);
    };

    const abrir_formulario_editar = (conejo) => {
        set_conejo_editando(conejo);
        set_mostrar_formulario(true);
        set_mensaje(null);
    };

    const cerrar_formulario = () => {
        set_mostrar_formulario(false);
        set_conejo_editando(null);
    };

    const handle_submit = async (datos) => {
        let resultado;
        if (conejo_editando) {
            resultado = await actualizar(conejo_editando.conejo_id, datos);
        } else {
            resultado = await crear(datos);
        }

        if (resultado.success) {
            set_mensaje({ tipo: 'success', texto: resultado.message });
            cerrar_formulario();
            setTimeout(() => set_mensaje(null), 5000);
        } else {
            set_mensaje({ tipo: 'error', texto: resultado.message });
        }
    };

    const handle_eliminar = async (id) => {
        const resultado = await eliminar(id);
        if (resultado.success) {
            set_mensaje({ tipo: 'success', texto: resultado.message });
            setTimeout(() => set_mensaje(null), 5000);
        } else {
            set_mensaje({ tipo: 'error', texto: resultado.message });
        }
    };

    return (
        <div className="min-h-screen bg-[#d8b4de] p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-5xl font-bold mb-2 text-black">Gestión de Conejos</h1>
                    <p className="text-xl text-gray-800">Administra el inventario de conejos de tu granja</p>
                </div>

                {mensaje && (
                    <div className={`mb-6 p-4 rounded-lg ${mensaje.tipo === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        <p className="font-semibold">{mensaje.texto}</p>
                    </div>
                )}

                <div className="mb-6">
                    <button
                        onClick={abrir_formulario_crear}
                        className="bg-purple-700 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-purple-800 transition shadow-lg"
                    >
                        <span>★</span> Nuevo Conejo
                    </button>
                </div>

                <TablaConejos
                    conejos={conejos}
                    on_editar={abrir_formulario_editar}
                    on_eliminar={handle_eliminar}
                    loading={loading}
                />
            </div>

            {mostrar_formulario && (
                <div className="fixed inset-0 bg-gray-900/30 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">
                            {conejo_editando ? 'Editar Conejo' : 'Nuevo Conejo'}
                        </h2>
                        <FormularioConejo
                            conejo_inicial={conejo_editando}
                            razas={razas}
                            jaulas={jaulas}
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
