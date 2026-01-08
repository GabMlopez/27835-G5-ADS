import { Estudiante } from "../modelo/Estudiante";

// Implementa el patrón de diseño Singleton para asegurar una única instancia.
class Lista_Estudiantes {
  /**
   * Constructor privado simulado.
   * Inicializa la lista de estudiantes y el contador de IDs.
   */
  constructor() {
    if (Lista_Estudiantes.instancia) {
      return Lista_Estudiantes.instancia;
    }
    this.estudiantes = [];
    Lista_Estudiantes.instancia = this;
  }

  /**
   * Obtiene la instancia única de la clase Lista_Estudiantes.
   * @returns {Lista_Estudiantes} La instancia única.
   */
  static obtenerInstancia() {
    if (!Lista_Estudiantes.instancia) {
      Lista_Estudiantes.instancia = new Lista_Estudiantes();
    }
    return Lista_Estudiantes.instancia;
  }

  /**
   * Agrega un nuevo estudiante a la lista.
   * @param {Object} estudiante - El objeto estudiante a agregar.
   * @returns {Object} El estudiante agregado con su ID asignado.
   */
  agregar(estudiante) {
    this.estudiantes.push(estudiante);
    console.log(this.estudiantes);
    return estudiante;
  }

  /**
   * Obtiene todos los estudiantes registrados.
   * @returns {Array} Un arreglo con todos los estudiantes.
   */
  obtener_todos() {
    return [...this.estudiantes];
  }

  /**
   * Busca un estudiante por su ID.
   * @param {number} id - El ID del estudiante a buscar.
   * @returns {Object|undefined} El estudiante encontrado o undefined si no existe.
   */
  buscar_por_id(id) {
    return this.estudiantes.find((e) => e.id === id);
  }

  modificar_por_id(id, nombre, edad){
    const estudiante = this.buscar_por_id(id);
    estudiante.setNombre(nombre);
    estudiante.setEdad(edad);
  }


  /**
   * Elimina un estudiante por su ID.
   * @param {number} id - El ID del estudiante a eliminar.
   * @returns {boolean} True si se eliminó correctamente, False si no se encontró.
   */
  eliminar_por_id(id) {
    const index = this.estudiantes.findIndex((e) => e.id === id);
    if (index !== -1) {
      this.estudiantes.splice(index, 1);
      return true;
    }
    return false;
  }
}

// Exporta la instancia única directamente
const instanciaRepositorio = new Lista_Estudiantes();
export default instanciaRepositorio;