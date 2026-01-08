
import { Command } from '../Command.js';
import { Estudiante } from '../../datos/modelo/Estudiante.js';  
import { EstudianteValidacionService } from '../Validaciones/EstudianteValidacion.js';
export class RegistrarEstudianteCommand extends Command {
  constructor(id, nombre, edad, repo) {
    super();
    this.id = id;
    this.nombre = nombre?.trim() || '';
    this.edad = parseInt(edad);
    this.repo = repo;
    this.validador = new EstudianteValidacionService(repo);
  }

  execute() {
    this.validarNoEsNumeroValido();
    this.validador.validarCedulaNoExiste(this.id);
    this.validador.validarCedulaCorrecta(this.id);
    const nombreValido = this.validador.validarNombre(this.nombre);
    const edadValida = this.validador.validarEdad(this.edad);

    const nuevo = new Estudiante(this.id, nombreValido, edadValida);
    this.repo.agregar(nuevo);
  }

  validarNoEsNumeroValido() {
    if (!this.id || isNaN(this.id) || this.id <= 0) {
      throw new Error('ID inválido');
    }
  }
}