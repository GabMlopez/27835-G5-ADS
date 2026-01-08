import { Estudiante } from '../../datos/modelo/Estudiante.js';
import { Command } from '../Command.js';
import { EstudianteValidacionService } from '../Validaciones/EstudianteValidacion.js';

export class ModificarEstudianteCommand extends Command {
  constructor(id, nombre, edad, repo) {
    super();
    this.id = id;
    this.nombre = nombre?.trim();
    this.edad = parseInt(edad);
    this.repo = repo;
    this.validador = new EstudianteValidacionService(repo);
  }

  execute() {
    const estudiante = this.repo.buscar_por_id(this.id);
    if (!estudiante) throw new Error('Estudiante no encontrado');
    
    const nombreValido = this.validador.validarNombre(this.nombre);
    const edadValida = this.validador.validarEdad(this.edad);

    this.repo.modificar_por_id(
      this.id,
      nombreValido || estudiante.nombre,
      edadValida ?? estudiante.edad
    );
  }
}