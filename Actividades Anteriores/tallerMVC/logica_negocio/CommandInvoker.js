export class CommandInvoker {
  constructor() {
    this.historial = [];
  }

  ejecutar(command) {
    try {
      command.execute();
      this.historial.push(command);
      console.log("Comando ejecutado:", command.constructor.name);
    } catch (error) {
      console.error("Error ejecutando comando:", error.message);
      throw error;
    }
  }
}