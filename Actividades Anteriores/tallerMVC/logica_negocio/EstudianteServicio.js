import instanciaRepositorio from '../datos/repositorio/EstudianteRepositorio.js';
import { CommandInvoker } from './CommandInvoker.js';
import { RegistrarEstudianteCommand } from './Commands/RegistrarEstudianteCommand.js';
import { ModificarEstudianteCommand } from './Commands/ModificarEstudianteCommand.js';
import { EliminarEstudianteCommand } from './Commands/EliminarEstudianteCommand.js';

export class EstudianteService {
  constructor() {
    this.repo = instanciaRepositorio;
    this.invoker = new CommandInvoker();
  }

  registrar(id,nombre, edad) {
    const comando = new RegistrarEstudianteCommand(id,nombre, edad, this.repo);
    this.invoker.ejecutar(comando);
  }

  modificar_con_id(id, nombre, edad) {
    const comando = new ModificarEstudianteCommand(id, nombre, edad, this.repo);
    this.invoker.ejecutar(comando);
  }

  eliminar(id) {
    const comando = new EliminarEstudianteCommand(id, this.repo);
    this.invoker.ejecutar(comando);
  }

  listar() {
    return this.repo.obtener_todos();
  }

  obtener_por_id(id) {
    return this.repo.buscar_por_id(id);
  }
}