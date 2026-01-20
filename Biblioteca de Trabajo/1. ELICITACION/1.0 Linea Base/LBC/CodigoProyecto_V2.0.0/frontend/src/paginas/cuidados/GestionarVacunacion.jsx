import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function GestionarVacunacion() {
    const navigate = useNavigate();

    const data = [
        { jaula: 1, codigo: "R001", edad: 5, sexo: "hembra", vacuna: "Se aplicó? Mixomatosis VHD", desparacitacion: "Se aplicó?" },
        { jaula: 2, codigo: "L005", edad: 4, sexo: "macho", vacuna: "Se aplicó? Mixomatosis VHD", desparacitacion: "Se aplicó?" },
        { jaula: 3, codigo: "L002", edad: 8, sexo: "macho", vacuna: "Se aplicó? Mixomatosis VHD", desparacitacion: "Se aplicó?" },
        { jaula: 4, codigo: "R004", edad: 5, sexo: "macho", vacuna: "Se aplicó? Mixomatosis VHD", desparacitacion: "Se aplicó?" },
    ];

    return (
        <div className="min-h-screen bg-[#d8b4de] p-8 relative">
            <button onClick={() => navigate(-1)} className="absolute top-8 left-8 text-3xl text-black">
                ←
            </button>

            <div className="max-w-6xl mx-auto mt-12">
                <div className="flex flex-col md:flex-row justify-between items-start mb-12">
                    <div className="md:w-1/2">
                        <h1 className="text-5xl font-bold mb-6 text-black">Gestionar Vacunación</h1>
                        <p className="text-xl text-gray-800 mb-8">
                            Registre vacunas, tratamientos y revisiones para mantener un estricto control de la salud animal
                        </p>

                        <h2 className="text-4xl font-bold text-center md:text-left mb-8 text-black">Registro</h2>

                        <div className="mb-8">
                            <label className="block text-white font-bold mb-2">Buscar por :</label>
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    placeholder="Codigo"
                                    className="w-full p-3 rounded-md bg-gray-100 border-none outline-none"
                                />
                                <button className="bg-purple-700 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-purple-800 transition">
                                    <span>★</span> Registrar
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="md:w-1/3 hidden md:block">
                        <img src="https://placehold.co/400x400?text=Rabbit+Vet" alt="Rabbit Vet" className="rounded-lg shadow-lg" />
                    </div>
                </div>

                <div className="bg-white/50 rounded-lg p-6">
                    <h3 className="text-white font-bold mb-4 text-xl">Seleccionar Conejo</h3>
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-purple-400 text-white">
                                    <th className="p-4">Numero de Jaula</th>
                                    <th className="p-4">Codigo</th>
                                    <th className="p-4">Edad (meses)</th>
                                    <th className="p-4">Sexo</th>
                                    <th className="p-4">Vacuna</th>
                                    <th className="p-4">Desparacitación</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="p-4">{item.jaula}</td>
                                        <td className="p-4">{item.codigo}</td>
                                        <td className="p-4">{item.edad}</td>
                                        <td className="p-4">{item.sexo}</td>
                                        <td className="p-4 whitespace-pre-line">{item.vacuna}</td>
                                        <td className="p-4">{item.desparacitacion}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-gray-700 mt-4 underline decoration-1">Una vacuna se hace cada año y una desparasitación cada mes</p>
                    <div className="flex justify-end mt-4">
                        <button className="bg-white text-purple-700 px-6 py-2 rounded-full shadow hover:bg-gray-100 transition flex items-center gap-2">
                            <span>★</span> Mostrar todo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
