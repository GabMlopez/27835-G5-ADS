import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useJaulas from '../../hooks/useJaulas';
import FormularioJaula from '../../componentes/jaulas/FormularioJaula';
import TablaJaulas from '../../componentes/jaulas/TablaJaulas';

export default function GestionarJaulas() {
    const navigate = useNavigate();
    const { jaulas, loading, crear, actualizar, eliminar } = useJaulas();

    const [mostrar_formulario, set_mostrar_formulario] = useState(false);
    const [jaula_editando, set_jaula_editando] = useState(null);
    const [mensaje, set_mensaje] = useState(null);

    // Abrir formulario para crear
    const abrir_formulario_crear = () => {
        set_jaula_editando(null);
        set_mostrar_formulario(true);
        set_mensaje(null);
    };

    // Abrir formulario para editar
    const abrir_formulario_editar = (jaula) => {
        set_jaula_editando(jaula);
        set_mostrar_formulario(true);
        set_mensaje(null);
    };

    // Cerrar formulario
    const cerrar_formulario = () => {
        set_mostrar_formulario(false);
        set_jaula_editando(null);
    };

    // Manejar envío del formulario
    const handle_submit = async (datos) => {
        let resultado;

        if (jaula_editando) {
            // Actualizar
            resultado = await actualizar(jaula_editando.jaula_id, datos);
        } else {
            // Crear
            resultado = await crear(datos);
        }

        if (resultado.success) {
            set_mensaje({
                tipo: 'success',
                texto: resultado.message
            });
            cerrar_formulario();

            // Limpiar mensaje después de 5 segundos
            setTimeout(() => set_mensaje(null), 5000);
        } else {
            set_mensaje({
                tipo: 'error',
                texto: resultado.message
            });
        }
    };

    // Manejar eliminación
    const handle_eliminar = async (id) => {
        const resultado = await eliminar(id);

        if (resultado.success) {
            set_mensaje({
                tipo: 'success',
                texto: resultado.message
            });
        } else {
            set_mensaje({
                tipo: 'error',
                texto: resultado.message
            });
        }

        // Limpiar mensaje después de 5 segundos
        setTimeout(() => set_mensaje(null), 5000);
    };

    return (
        <div className="min-h-screen bg-[#d8b4de] p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-5xl font-bold mb-2 text-black">Gestión de Jaulas</h1>
                    <p className="text-xl text-gray-800">Administra las jaulas de tu granja de conejos</p>
                </div>

                {/* Mensajes */}
                {mensaje && (
                    <div className={`mb-6 p-4 rounded-lg ${mensaje.tipo === 'success'
                            ? 'bg-green-100 border border-green-400 text-green-700'
                            : 'bg-red-100 border border-red-400 text-red-700'
                        }`}>
                        <p className="font-semibold">{mensaje.texto}</p>
                    </div>
                )}

                {/* Botón Nueva Jaula */}
                <div className="mb-6">
                    <button
                        onClick={abrir_formulario_crear}
                        className="bg-purple-700 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-purple-800 transition shadow-lg"
                    >
                        <span>★</span> Nueva Jaula
                    </button>
                </div>

                {/* Tabla de Jaulas */}
                <TablaJaulas
                    jaulas={jaulas}
                    on_editar={abrir_formulario_editar}
                    on_eliminar={handle_eliminar}
                    loading={loading}
                />

                {/* Información adicional */}
                <div className="mt-8 bg-white/50 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Información sobre Jaulas</h3>
                    <ul className="text-gray-700 space-y-2">
                        <li>• <strong>Jaulas de Reproducción:</strong> Capacidad fija de 1 conejo (para cría)</li>
                        <li>• <strong>Jaulas de Engorde:</strong> Capacidad de 1 a 6 conejos (para producción)</li>
                        <li>• Las jaulas con conejos asignados no pueden ser eliminadas</li>
                    </ul>
                </div>
            </div>

            {/* Modal de Formulario */}
            {mostrar_formulario && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">
                            {jaula_editando ? 'Editar Jaula' : 'Nueva Jaula'}
                        </h2>

                        {mensaje && mensaje.tipo === 'error' && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {mensaje.texto}
                            </div>
                        )}

                        <FormularioJaula
                            jaula_inicial={jaula_editando}
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
