export class Estudiante {
    constructor(id, nombre, edad) {
        this.id = id;
        this.nombre = nombre;
        this.edad = edad;
    }

    getId() {
        return this.id;
    }

    setNombre(nombre) {
        this.nombre = nombre; 
    }

    getNombre() {
        return this.nombre; 
    }

    setEdad(edad) {
        this.edad = edad; 
    }

    getEdad() {
        return this.edad; 
    } 
    
}