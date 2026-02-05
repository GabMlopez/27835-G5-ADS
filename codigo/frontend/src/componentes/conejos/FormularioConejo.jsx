import { useState, useEffect } from 'react';

/**
 * Componente de formulario para crear/editar conejos
 * @param {Object} props
 * @param {Object|null} props.conejo_inicial - Conejo a editar (null para crear)
 * @param {Array} props.razas - Lista de razas disponibles
 * @param {Array} props.jaulas - Lista de jaulas disponibles
 * @param {Function} props.on_submit - Callback al enviar formulario
 * @param {Function} props.on_cancelar - Callback al cancelar
 * @param {boolean} props.loading - Estado de carga
 */
export default function FormularioConejo({ conejo_inicial, razas, jaulas, on_submit, on_cancelar, loading }) {
    const [sexo, set_sexo] = useState('Macho');
    const [edad, set_edad] = useState(0);
    const [peso, set_peso] = useState(0.5);
    const [proposito, set_proposito] = useState('Engorde');
    const [fecha_nacimiento, set_fecha_nacimiento] = useState(new Date().toISOString().split('T')[0]);
    const [estado, set_estado] = useState('Saludable');
    const [raza_id, set_raza_id] = useState('');
    const [jaula_id, set_jaula_id] = useState('');
    const [errores, set_errores] = useState({});

    useEffect(() => {
        if (conejo_inicial) {
            set_sexo(conejo_inicial.conejo_sexo);
            set_edad(conejo_inicial.conejo_edad);
            set_peso(conejo_inicial.conejo_peso);
            set_proposito(conejo_inicial.conejo_proposito);
            set_fecha_nacimiento(new Date(conejo_inicial.conejo_fecha_nacimiento).toISOString().split('T')[0]);
            set_estado(conejo_inicial.conejo_estado);
            set_raza_id(conejo_inicial.conejo_raza_id);
            set_jaula_id(conejo_inicial.jaula_id);
        } else {
            if (razas.length > 0) set_raza_id(razas[0].conejo_raza_id); // Fixed to match your data structure
            if (jaulas.length > 0) set_jaula_id(jaulas[0].jaula_id);
        }
    }, [conejo_inicial, razas, jaulas]);

    const validar = () => {
        const err = {};
        if (!raza_id) err.raza = 'La raza es obligatoria';
        if (!jaula_id) err.jaula = 'La jaula es obligatoria';
        if (peso <= 0 || peso > 4.5) err.peso = 'El peso debe estar entre 0.1 y 4.5 kg';
        if (edad < 0) err.edad = 'La edad no puede ser negativa';
        return err;
    };

    const handle_submit = (e) => {
        e.preventDefault();
        const err = validar();
        if (Object.keys(err).length > 0) {
            set_errores(err);
            return;
        }

        const datos = {
            conejo_sexo: sexo,
            conejo_edad: parseInt(edad),
            conejo_peso: parseFloat(peso),
            conejo_proposito: proposito,
            conejo_fecha_nacimiento: fecha_nacimiento,
            conejo_estado: estado,
            conejo_raza_id: raza_id,
            jaula_id: jaula_id
        };

        on_submit(datos);
    };

    return (
        <form onSubmit={handle_submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
                <label className="block text-gray-700 font-bold mb-1">Sexo</label>
                <select value={sexo} onChange={(e) => set_sexo(e.target.value)} className="w-full p-2 rounded border border-gray-300">
                    <option value="Macho">Macho</option>
                    <option value="Hembra">Hembra</option>
                </select>
            </div>

            <div>
                <label className="block text-gray-700 font-bold mb-1">Estado</label>
                <select value={estado} onChange={(e) => set_estado(e.target.value)} className="w-full p-2 rounded border border-gray-300">
                    <option value="Saludable">Saludable</option>
                    <option value="Enfermo">Enfermo</option>
                    <option value="Preñada">Preñada</option>
                    <option value="Muerto">Muerto</option>
                </select>
            </div>

            <div>
                <label className="block text-gray-700 font-bold mb-1">Edad (meses)</label>
                <input
                    type="number"
                    value={edad}
                    onChange={(e) => set_edad(e.target.value)}
                    className={`w-full p-2 rounded border ${errores.edad ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errores.edad && <p className="text-red-500 text-sm mt-1">{errores.edad}</p>}
            </div>

            <div>
                <label className="block text-gray-700 font-bold mb-1">Peso (kg)</label>
                <input
                    type="number"
                    step="0.1"
                    value={peso}
                    onChange={(e) => set_peso(e.target.value)}
                    className={`w-full p-2 rounded border ${errores.peso ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errores.peso && <p className="text-red-500 text-sm mt-1">{errores.peso}</p>}
            </div>

            <div>
                <label className="block text-gray-700 font-bold mb-1">Propósito</label>
                <select value={proposito} onChange={(e) => set_proposito(e.target.value)} className="w-full p-2 rounded border border-gray-300">
                    <option value="Engorde">Engorde</option>
                    <option value="Reproduccion">Reproducción</option>
                </select>
            </div>

            <div>
                <label className="block text-gray-700 font-bold mb-1">Fecha Registro</label> 
                <input
                    type="date"
                    value={fecha_nacimiento}
                    onChange={(e) => set_fecha_nacimiento(e.target.value)}
                    className="w-full p-2 rounded border border-gray-300"
                />
            </div>

            <div>
                <label className="block text-gray-700 font-bold mb-1">Raza</label>
                <select value={raza_id} onChange={(e) => set_raza_id(e.target.value)} className={`w-full p-2 rounded border ${errores.raza ? 'border-red-500' : 'border-gray-300'}`}>
                    {razas.map(r => <option key={r.conejo_raza_id} value={r.conejo_raza_id}>{r.conejo_raza_nombre}</option>)}
                </select>
                {errores.raza && <p className="text-red-500 text-sm mt-1">{errores.raza}</p>}
            </div>

            <div>
                <label className="block text-gray-700 font-bold mb-1">Jaula</label>
                <select value={jaula_id} onChange={(e) => set_jaula_id(e.target.value)} className={`w-full p-2 rounded border ${errores.jaula ? 'border-red-500' : 'border-gray-300'}`}>
                    {jaulas.map(j => <option key={j.jaula_id} value={j.jaula_id}>{j.jaula_id} ({j.jaula_tipo})</option>)}
                </select>
                {errores.jaula && <p className="text-red-500 text-sm mt-1">{errores.jaula}</p>}
            </div>

            <div className="md:col-span-2 flex gap-4 justify-end mt-4">
                <button type="button" onClick={on_cancelar} className="px-6 py-2 bg-gray-300 rounded-full">Cancelar</button>
                <button type="submit" disabled={loading} className="px-6 py-2 bg-purple-700 text-white rounded-full">
                    {loading ? 'Guardando...' : conejo_inicial ? 'Actualizar' : 'Registrar'}
                </button>
            </div>
        </form>
    );
}