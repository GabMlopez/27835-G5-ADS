import GenerarReporte from '../../componentes/reportes/GenerarReporte';
import { generar_reporte_montas } from '../../servicios/reportes_servicios';

export default function ReporteMontas() {
    return (
        <GenerarReporte
            titulo="Generar Reporte de Montas"
            servicio={generar_reporte_montas}
        />
    );
}
