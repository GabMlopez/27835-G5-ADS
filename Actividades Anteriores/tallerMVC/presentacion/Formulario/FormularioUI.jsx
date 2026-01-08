import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { EstudianteService } from '../../logica_negocio/EstudianteServicio'
import '../App.css';

const Formulario = forwardRef(function Formulario({ tipo, control, onChange }, ref) {
    const estrategias = {
  crear: {
    title: "Crear nuevo",
    editable: true,
    busqueda: false,
    actionLabel: "Agregar",
    action: () =>{
    controlador.registrar(id_es,nombre_es,edad_es);
    cerrarFormulario();
    obtenerEstudiantes();
    onChange();
  }
  },
  modificar: {
    title: "Modificar",
    editable: true,
    busqueda: true,
    actionLabel: "Guardar cambios",
    action: (id_estudiante) =>{
    controlador.modificar_con_id(id_estudiante, nombre_es, edad_es);
    cerrarFormulario();
    obtenerEstudiantes();
    onChange();
    }
  },
  eliminar: {
    title: "Eliminar",
    editable: false,
    busqueda: true,
    actionLabel: "Eliminar",
    action: (id_estudiante) =>{
    controlador.eliminar(id_estudiante);
    cerrarFormulario();
    obtenerEstudiantes();
    onChange();
  }
  }
};
  const config=estrategias[tipo];
  const controlador = new EstudianteService();
  const [estudiantes, setEstudiantes] = useState([]);
  const [id_es,setId]=useState("");
  const [nombre_es,setNombre]=useState("");
  const [edad_es,setEdad]=useState(0);
  const [formularioAbierto, setEstado]=useState(false);
  let aparienciaFormulario = (formularioAbierto ? "container m-auto py-4 py-8 w-fit" : "hidden");
  //let editar = (config.editable ? "" : "readonly");
  const cerrarFormulario = () => {
    setEstado(false);
    setNombre("");
    setId("");
    setEdad(0);
  };
  const abrirFormulario = () =>  {
    setEstado(true);
    obtenerEstudiantes();
  }
  const buscarEstudiante = (id) =>{
    const estudiante = controlador.obtener_por_id(id);
    console.log(estudiante.nombre);
    setNombre(estudiante.nombre);
    console.log(estudiante.edad);
    setEdad(estudiante.edad);
  }

  const obtenerEstudiantes = () =>{
    setEstudiantes(controlador.listar());
  }

  useImperativeHandle(ref, () => ({
    abrirFormulario,
    cerrarFormulario,
    // expose state values so parent can read them:
    get id_es() { return id_es; },
    get nombre_es() { return nombre_es; },
    get edad_es() { return edad_es; }
  }), [id_es, nombre_es, edad_es]);

  useEffect(() => {
    obtenerEstudiantes();
    }, []);
  return(
    <>
    <div className={aparienciaFormulario}>
        <h2 className='text-center text-3xl' >{config.title} Estudiante</h2>
        <div className=' columns-2 gap-4'>
          <div>
            <label>Id del estudiante</label>
            {(config.busqueda)?
                <select defaultValue=" " onChange={(e)=>{setId(e.target.value); buscarEstudiante(e.target.value);}}>
             <option value="">
                </option>
            {
              estudiantes.map((estudiante) => (
                <option key={estudiante.id} value={estudiante.id}>
                  {estudiante.id}
                </option>
              ))
            }
          </select> :
             <input type='text' className=' border-2' value={id_es} onChange={(e)=>{setId(e.target.value)}}/>
        }
          </div>
          <div>
            <label>Nombre:</label>
            <input type='text' className=' border-2' readOnly={!config.editable} value={nombre_es} onChange={(e)=>{setNombre(e.target.value)}}/>
          </div>
          <div>
            <label>Edad:</label>
            <input type='number' className=' border-2' readOnly={!config.editable} value={edad_es} onChange={(e)=>{setEdad(e.target.value)}}/>
          </div>
        </div>
        <div className='justify-items-center m-auto w-fit my-3 py-2 gap-2'>
          <button className='mx-1 border border-white hover:bg-blue-950' onClick={()=>{config.action(id_es)}}>Agregar</button>
          <button className='mx-1 border border-white hover:bg-red-950 hover:border-red-500' onClick={cerrarFormulario}>Cancelar</button>
        </div>
      </div>
    
    </>

  );
});

export default Formulario;