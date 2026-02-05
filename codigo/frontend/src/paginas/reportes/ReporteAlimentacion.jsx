import GenerarReporte from '../../componentes/reportes/GenerarReporte';
import { generar_reporte_alimentacion } from '../../servicios/reportes_servicios';

export default function ReporteAlimentacion() {
    return (
        <GenerarReporte
            titulo="Generar Reporte de Alimentación"
            servicio={generar_reporte_alimentacion}
        />
    );
}
