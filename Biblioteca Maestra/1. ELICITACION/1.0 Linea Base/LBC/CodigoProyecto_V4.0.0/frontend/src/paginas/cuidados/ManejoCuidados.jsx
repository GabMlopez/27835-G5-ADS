import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManejoCuidados() {
    const navigate = useNavigate();

    const cards = [
        {
            title: "Gestionar Montas",
            description: "Controle registros de cría, ciclos reproductivos y el rendimiento genético de su plantel.",
            image: "https://placehold.co/600x400?text=Montas", // Placeholder
            path: "/cuidados/montas"
        },
        {
            title: "Gestionar Alimentación",
            description: "Optimice dietas y horarios para garantizar la nutrición y el crecimiento saludable de sus conejos.",
            image: "https://placehold.co/600x400?text=Alimentacion", // Placeholder
            path: "/cuidados/alimentacion"
        },
        {
            title: "Gestionar Controles Médicos",
            description: "Registre vacunas, tratamientos y revisiones para mantener un estricto control de la salud animal.",
            image: "https://placehold.co/600x400?text=Medicos", // Placeholder
            path: "/cuidados/vacunacion"
        }
    ];

    return (
        <div className="min-h-screen bg-[#d8b4de] p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-2 text-black">Manejo de cuidados</h1>
                <p className="text-xl text-gray-700 mb-12">Panel de administración de salud de conejos</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            onClick={() => navigate(card.path)}
                            className="cursor-pointer group"
                        >
                            <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform transform group-hover:scale-105">
                                <img src={card.image} alt={card.title} className="w-full h-48 object-cover" />
                                <div className="p-6 bg-[#d8b4de] bg-opacity-50"> {/* Matching the card background in image which seems transparent or same as bg */}
                                    {/* Actually in the image the text is below the card image, and it seems to be on the main background, not inside a white card footer. 
                    Wait, looking at image 1:
                    The images are in rounded rectangles.
                    The text is BELOW the images.
                    So the card itself is just the image? 
                    No, the text is aligned with the image.
                    Let's structure it as: Image container (white/rounded), then Text below it.
                 */}
                                </div>
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
