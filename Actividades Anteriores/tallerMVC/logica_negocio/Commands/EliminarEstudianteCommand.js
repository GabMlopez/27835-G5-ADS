import { Command } from '../Command.js';

export class EliminarEstudianteCommand extends Command {
  constructor(id, repo) {
    super();
    this.id = id;
    this.repo = repo;
  }

  execute() {
    const eliminado = this.repo.eliminar_por_id(this.id);
    if (!eliminado) throw new Error('Estudiante no encontrado');
  }
}