import { useState, useEffect, useRef } from 'react';
import { EstudianteService } from '../logica_negocio/EstudianteServicio'
import Formulario from './Formulario/FormularioUI';
import './App.css';

function App() {
  const controlador=new EstudianteService();
  const formCrearRef = useRef(null);
  const formModificarRef = useRef(null);
  const formEliminarRef = useRef(null);
  const [estudiantes, setEstudiantes] = useState([]);

  const abrirFormularioCrear = () => {
    formCrearRef.current.abrirFormulario();
    formModificarRef.current.cerrarFormulario();
    formEliminarRef.current.cerrarFormulario();
  };
  const abrirFormularioModificar = () => {
    formModificarRef.current.abrirFormulario();
    formCrearRef.current.cerrarFormulario();
    formEliminarRef.current.cerrarFormulario();
  };
  const abrirFormularioEliminar = () => {
    formEliminarRef.current.abrirFormulario();
    formCrearRef.current.cerrarFormulario();
    formModificarRef.current.cerrarFormulario();
  };

  const obtenerEstudiantes = () =>{
    setEstudiantes(controlador.listar());
  }
  
  useEffect(() => {
        obtenerEstudiantes();
    }, []);
  return (
    <>
      <h1 className=' font-bold text-3xl text-center'>Estudiantes</h1>
      <div className='container m-auto'>
        <div className='grid grid-cols-3 justify-items-between gap-1 m-auto w-fit py-3'>
          <button className='rounded-full mx-3 bg-blue-500 text-white' onClick={abrirFormularioCrear}>
          Agregar Alumno
        </button>
        <button className='rounded-full mx-3 bg-blue-500 text-white' onClick={abrirFormularioModificar}>
          Editar Alumno
        </button>
        <button className='rounded-full mx-3 bg-blue-500 text-white' onClick={abrirFormularioEliminar}>
          Eliminar Alumno
        </button>
        </div>
      </div>
      
      {/*Formulario para agregar estudiante*/}

      <Formulario tipo={"crear"} control={controlador} onChange={obtenerEstudiantes} ref={formCrearRef}/>

      {/*Formulario para eliminar estudiante*/}

      <Formulario tipo={"eliminar"} controlador={controlador} onChange={obtenerEstudiantes} ref={formEliminarRef}/>

      {/*Formulario para modificar estudiante*/}
      
      <Formulario tipo={"modificar"} control={controlador} onChange={obtenerEstudiantes} ref={formModificarRef}/>

      <div className='container m-auto w-full items-center justify-center mt-4'>
        <table border={1} className='table-auto m-auto border-gray-100 border-2'>
          <tbody> 
            <tr className='bg-gray-800 text-white'>
            <th className='border-gray-100 border p-4'>
              Id
            </th>
            <th className='border-gray-100 border p-4'>
              Nombre
            </th>
            <th className='border-gray-100 border p-4'>
              Edad
            </th>
          </tr>
            {
            estudiantes.map((estudiante) => (
              <tr key={estudiante.id} className="text-center">
                <td className='border-gray-100 border p-4'>{estudiante.id}</td>
                <td className='border-gray-100 border p-4'>{estudiante.nombre}</td>
                <td className='border-gray-100 border p-4'>{estudiante.edad}</td>
              </tr>
            ))
            }
          </tbody>
        </table>
      </div>
    </>
  )
}

export default App
