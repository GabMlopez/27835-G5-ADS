const API = "http://localhost:3000/api/reportes";

export const generar_reporte_alimentacion = () => {
    return fetch(`${API}/alimentacion`);
};

export const generar_reporte_montas = () => {
    return fetch(`${API}/montas`);
};

export const generar_reporte_medico = () => {
    return fetch(`${API}/medicos`);
};
