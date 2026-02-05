import GenerarReporte from '../../componentes/reportes/GenerarReporte';
import { generar_reporte_medico } from '../../servicios/reportes_servicios';

export default function ReporteMedico() {
    return (
        <GenerarReporte
            titulo="Generar Reporte Médico"
            servicio={generar_reporte_medico}
        />
    );
}
