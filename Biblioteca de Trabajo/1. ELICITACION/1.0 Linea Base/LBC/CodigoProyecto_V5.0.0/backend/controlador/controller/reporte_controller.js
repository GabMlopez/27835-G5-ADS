const Conejo = require("../../modelos/modelo/conejo");
const Vacunacion = require("../../modelos/modelo/vacunacion");
const Usuario = require("../../modelos/modelo/usuario");


/* ===============================
   TOTAL DE CONEJOS
================================= */
const totalConejos = async (req, res) => {
  try {
    const total = await Conejo.countDocuments();
    res.json({ total });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al generar reporte" });
  }
};

/* ===============================
   CONEJOS POR JAULA
================================= */
const conejosPorJaula = async (req, res) => {
  try {
    const reporte = await Conejo.aggregate([
      {
        $group: {
          _id: "$jaula",
          cantidad: { $sum: 1 }
        }
      }
    ]);

    res.json(reporte);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al generar reporte" });
  }
};

/* ===============================
   VACUNACIONES POR MES
================================= */
const vacunacionesPorMes = async (req, res) => {
  try {
    const reporte = await Vacunacion.aggregate([
      {
        $group: {
          _id: { $month: "$fecha" },
          total: { $sum: 1 }
        }
      }
    ]);

    res.json(reporte);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al generar reporte" });
  }
};

/* ===============================
   TOTAL USUARIOS
================================= */
const totalUsuarios = async (req, res) => {
  try {
    const total = await Usuario.countDocuments();
    res.json({ total });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al generar reporte" });
  }
};

module.exports = {
  totalConejos,
  conejosPorJaula,
  vacunacionesPorMes,
  totalUsuarios
};
