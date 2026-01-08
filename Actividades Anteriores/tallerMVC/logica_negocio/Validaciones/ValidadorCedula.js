export class CedulaValidator {
  static esValida(cedula) {
    const str = String(cedula).trim();
    if (!/^\d{10}$/.test(str)) return false;

    const digitos = str.split('').map(Number);
    const verificador = digitos.pop();

    const suma = digitos.reduce((acc, d, i) => {
      let v = d;
      if (i % 2 === 0) v = v * 2 > 9 ? v * 2 - 9 : v * 2;
      return acc + v;
    }, 0);

    return (10 - (suma % 10)) % 10 === verificador;
  }

  static existeCedula(id, repo) {
    return !!repo.buscar_por_id(id);
  }
}