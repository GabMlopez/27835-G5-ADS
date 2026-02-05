import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GenerarReporte({ titulo, servicio }) {

    const navigate = useNavigate();
    const [loading, set_loading] = useState(false);
    const [reporte_url, set_reporte_url] = useState(null);
    const [error, set_error] = useState(null);

    const handle_generar = async () => {
        set_loading(true);
        set_error(null);

        try {
            const res = await servicio();

            if (!res.ok) {
                throw new Error("No se pudo generar el reporte");
            }

            const blob = await res.blob();

            const url = window.URL.createObjectURL(blob);

            set_reporte_url(url);
        } catch (err) {
            set_error(err.message);
        }

        set_loading(false);
    };

    return (
        <div className="min-h-screen bg-[#d8b4de] p-8 relative">

            <button
                onClick={() => navigate(-1)}
                className="absolute top-8 left-8 text-3xl text-black"
            >
                ←
            </button>

            <div className="max-w-5xl mx-auto mt-12">

                <h1 className="text-5xl font-bold mb-6 text-black">
                    {titulo}
                </h1>

                <button
                    onClick={handle_generar}
                    disabled={loading}
                    className="bg-purple-700 text-white px-8 py-4 rounded-full text-lg hover:bg-purple-800 shadow-lg"
                >
                    {loading ? "Generando..." : "Generar Reporte"}
                </button>

                {error && (
                    <div className="mt-6 bg-red-100 text-red-700 p-4 rounded-lg">
                        {error}
                    </div>
                )}

                {reporte_url && (
                    <div className="mt-10">
                        <h2 className="text-2xl font-bold mb-4">
                            Vista previa
                        </h2>

                        <iframe
                            src={reporte_url}
                            title="Reporte"
                            className="w-full h-[700px] rounded-lg shadow-lg border"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
