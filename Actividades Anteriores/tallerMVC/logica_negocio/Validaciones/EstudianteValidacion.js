import { CedulaValidator } from './ValidadorCedula.js';

export class EstudianteValidacionService {
  constructor(repositorio) {
    this.repo = repositorio;
  }

  validarCedulaExiste(id) {
    const existe = this.repo.buscar_por_id(id);
    if (!existe) throw new Error('El estudiante con esa cédula no existe');
  }

  validarCedulaNoExiste(id) {
    const existe = this.repo.buscar_por_id(id);
    if (existe) throw new Error('Ya existe un estudiante con esa cédula');
  }

  validarCedulaCorrecta(id) {
    if (!CedulaValidator.esValida(id)) {
      throw new Error('El número de cédula no es válido');
    }
  }

  validarNombre(nombre) {
    const n = (nombre || '').toString().trim();
    if (!n || n.length < 2) throw new Error('Nombre inválido');
    if (/\d/.test(n)) throw new Error('El nombre no puede contener números');
    return n;
  }

  validarEdad(edad) {
    const e = parseInt(edad);
    if (isNaN(e) || e < 15 || e > 100) {
      throw new Error('Edad inválida o fuera de rango (15-100)');
    }
    return e;
  }
}