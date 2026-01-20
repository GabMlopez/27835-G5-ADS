const pool = require('../../modelos/base_de_datos/db_pool');
const servicio = require('../servicios/jaula_servicio');

exports.createPen = async (req, res) => {
  const { jaula_id, jaula_tipo, jaula_capacidad } = req.body;

    const repeatedQuery = 'SELECT * FROM jaula WHERE jaula_id = $1';
    const { rows } = await pool.query(repeatedQuery, [jaula_id]);

    if(rows.length > 0) {
      return res.status(400).json({ message: 'Ya existe una jaula con ese numero' });
    }
    
    if(!servicio.validatePenType(jaula_tipo)) {
        return res.status(400).json({ message: 'Tipo de jaula inválido' });
    }

    if(!servicio.validatePenCapacity(jaula_capacidad, jaula_tipo)) {
        return res.status(400).json({ message: 'Capacidad de jaula inválida para el tipo especificado' });
    }

    try {
        const query = `
          INSERT INTO jaula (jaula_id, jaula_tipo, jaula_capacidad)
          VALUES ($1, $2, $3)
          `;

        const jaulaData = [jaula_id, jaula_tipo, jaula_capacidad.toString()];
        await pool.query(query, jaulaData);
        res.status(201).json({ message: 'Jaula creada exitosamente' });
    } catch (error) {
        console.error('Error al crear la jaula:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};