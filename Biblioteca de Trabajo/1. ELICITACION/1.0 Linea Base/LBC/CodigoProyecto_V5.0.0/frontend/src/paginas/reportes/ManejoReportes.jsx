import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManejoReportes() {
    const navigate = useNavigate();

    const cards = [
        {
            title: "Reporte de Alimentación",
            description: "Genere un informe completo sobre dietas y consumo de los conejos.",
            image: "https://placehold.co/600x400?text=Reporte+Alimentacion",
            path: "/reportes/alimentacion"
        },
        {
            title: "Reporte de Montas",
            description: "Obtenga un reporte detallado de la actividad reproductiva.",
            image: "https://placehold.co/600x400?text=Reporte+Montas",
            path: "/reportes/montas"
        },
        {
            title: "Reporte Médico",
            description: "Consulte vacunas, tratamientos y estado sanitario.",
            image: "https://placehold.co/600x400?text=Reporte+Medico",
            path: "/reportes/medicos"
        }
    ];

    return (
        <div className="min-h-screen bg-[#d8b4de] p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-2 text-black">Manejo de Reportes</h1>
                <p className="text-xl text-gray-700 mb-12">
                    Genere reportes profesionales del sistema
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            onClick={() => navigate(card.path)}
                            className="cursor-pointer group"
                        >
                            <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform transform group-hover:scale-105">
                                <img src={card.image} alt={card.title} className="w-full h-48 object-cover" />
                            </div>

                            <div className="mt-4">
                                <h2 className="text-xl font-bold mb-2 text-black">{card.title}</h2>
                                <p className="text-gray-700 text-sm">{card.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
