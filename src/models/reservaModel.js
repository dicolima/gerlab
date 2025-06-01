const pool = require('../database/db');

class ReservaModel {
  // Obter horários ativos
  static async getHorarios() {
    const { rows } = await pool.query('SELECT hor_lab FROM horarios WHERE ativo = true ORDER BY hor_lab');
    return rows.map(row => row.hor_lab);
  }

  // Obter laboratórios
  static async getLaboratorios() {
    const { rows } = await pool.query('SELECT lab_nom FROM laboratorio ORDER BY lab_nom');
    return rows.map(row => row.lab_nom);
  }

  // Obter status do laboratório
  static async getStatusLaboratorio(labNom) {
    const { rows } = await pool.query('SELECT lab_sts FROM laboratorio WHERE lab_nom = $1', [labNom]);
    return rows[0]?.lab_sts || '';
  }

  // Obter reservas para um laboratório e data
  static async getReservas(labNom, dataRes) {
    console.log(`getReservas: Lab=${labNom}, Data=${dataRes}`);
    const { rows } = await pool.query(`
      SELECT res.id_professor, res.laboratorio_id, prof.pro_nom, lab.lab_nom, 
             res.horario_inicio, res.horario_fim, res.data_inicio, res.data_final, 
             prof.pro_sob, lab.lab_id
      FROM reserva res 
      JOIN professor prof ON res.id_professor = prof.pro_id      
      JOIN laboratorio lab ON res.laboratorio_id = lab.lab_id
      WHERE lab.lab_nom = $1 
            AND res.data_inicio <= $2::date 
            AND res.data_final >= $2::date
    `, [labNom, dataRes]);
    console.log(`Query getReservas: Lab=${labNom}, Data=${dataRes}, Result=${JSON.stringify(rows)}`);
    return rows;
  }
}

module.exports = ReservaModel;

// const pool = require('../database/db');

// class ReservaModel {
//   // Obter horários ativos
//   static async getHorarios() {
//     const { rows } = await pool.query('SELECT hor_lab FROM horarios WHERE ativo = true ORDER BY hor_lab');
//     return rows.map(row => row.hor_lab);
//   }

//   // Obter laboratórios
//   static async getLaboratorios() {
//     const { rows } = await pool.query('SELECT lab_nom FROM laboratorio ORDER BY lab_nom');
//     return rows.map(row => row.lab_nom);
//   }

//   // Obter status do laboratório
//   static async getStatusLaboratorio(labNom) {
//     const { rows } = await pool.query('SELECT lab_sts FROM laboratorio WHERE lab_nom = $1', [labNom]);
//     return rows[0]?.lab_sts || '';
//   }

//   // Obter reservas para um laboratório e data
//   static async getReservas(labNom, dataRes) {
//     console.log(`getReservas: Lab=${labNom}, Data=${dataRes}`);
//     const { rows } = await pool.query(`
//       SELECT res.id_professor, res.laboratorio_id, prof.pro_nom, lab.lab_nom, 
//              res.horario_inicio, res.horario_fim, res.data_inicio, res.data_final, res.semana_id, 
//              prof.pro_sob, lab.lab_id, sem.sem_dia, res.sol_sts
//       FROM reserva res 
//       JOIN professor prof ON res.id_professor = prof.pro_id      
//       JOIN laboratorio lab ON res.laboratorio_id = lab.lab_id      
//       JOIN semana sem ON res.semana_id::integer = sem.sem_id
//       WHERE lab.lab_nom = $1 
//             AND res.data_inicio <= $2::date 
//             AND res.data_final >= $2::date
//             AND res.sol_sts IS NOT NULL
//     `, [labNom, dataRes]);
//     console.log(`Query getReservas: Lab=${labNom}, Data=${dataRes}, Result=${JSON.stringify(rows)}`);
//     return rows;
//   }
// }

// module.exports = ReservaModel;

// // const pool = require('../database/db');

// // class ReservaModel {
// //   // Obter horários ativos
// //   static async getHorarios() {
// //     const { rows } = await pool.query('SELECT hor_lab FROM horarios WHERE ativo = true ORDER BY hor_lab');
// //     return rows.map(row => row.hor_lab);
// //   }

// //   // Obter laboratórios
// //   static async getLaboratorios() {
// //     const { rows } = await pool.query('SELECT lab_nom FROM laboratorio ORDER BY lab_nom');
// //     return rows.map(row => row.lab_nom);
// //   }

// //   // Obter status do laboratório
// //   static async getStatusLaboratorio(labNom) {
// //     const { rows } = await pool.query('SELECT lab_sts FROM laboratorio WHERE lab_nom = $1', [labNom]);
// //     return rows[0]?.lab_sts || '';
// //   }

// //   // Obter reservas para um laboratório, horário e data
// //   static async getReservas(labNom, horaLab, dataRes) {
// //     // Calcular o horário final do intervalo (horaLab + 1 hora)
// //     const horaInicio = horaLab; // ex.: '19:00:00'
// //     const horaFim = `${(parseInt(horaLab.split(':')[0], 10) + 1).toString().padStart(2, '0')}:00:00`; // ex.: '20:00:00'
// //     console.log(`getReservas: Lab=${labNom}, HoraInicio=${horaInicio}, HoraFim=${horaFim}, Data=${dataRes}`);

// //     const { rows } = await pool.query(`
// //       SELECT res.id_professor, res.laboratorio_id, prof.pro_nom, lab.lab_nom, 
// //              res.horario_inicio, res.horario_fim, res.data_inicio, res.data_final, res.semana_id, 
// //              prof.pro_sob, lab.lab_id, sem.sem_dia, res.sol_sts
// //       FROM reserva res 
// //       JOIN professor prof ON res.id_professor = prof.pro_id      
// //       JOIN laboratorio lab ON res.laboratorio_id = lab.lab_id      
// //       JOIN semana sem ON res.semana_id::integer = sem.sem_id
// //       WHERE lab.lab_nom = $1 
// //             AND CAST(res.horario_inicio AS time) <= CAST($3 AS time)
// //             AND CAST(res.horario_fim AS time) >= CAST($2 AS time)
// //             AND res.data_inicio <= $4::date 
// //             AND res.data_final >= $4::date
// //             AND res.sol_sts IS NOT NULL
// //     `, [labNom, horaInicio, horaFim, dataRes]);
// //     console.log(`Query getReservas: Lab=${labNom}, HoraInicio=${horaInicio}, HoraFim=${horaFim}, Data=${dataRes}, Result=${JSON.stringify(rows)}`);
// //     return rows;
// //   }
// // }

// // module.exports = ReservaModel;

// // // const pool = require('../database/db');

// // // class ReservaModel {
// // //   // Obter horários ativos
// // //   static async getHorarios() {
// // //     const { rows } = await pool.query('SELECT hor_lab FROM horarios WHERE ativo = true ORDER BY hor_lab');
// // //     return rows.map(row => row.hor_lab);
// // //   }

// // //   // Obter laboratórios
// // //   static async getLaboratorios() {
// // //     const { rows } = await pool.query('SELECT lab_nom FROM laboratorio ORDER BY lab_nom');
// // //     return rows.map(row => row.lab_nom);
// // //   }

// // //   // Obter status do laboratório
// // //   static async getStatusLaboratorio(labNom) {
// // //     const { rows } = await pool.query('SELECT lab_sts FROM laboratorio WHERE lab_nom = $1', [labNom]);
// // //     return rows[0]?.lab_sts || '';
// // //   }

// // //   // Obter reservas para um laboratório, horário e data
// // //   static async getReservas(labNom, horaLab, dataRes) {
// // //     // Extrair a hora de horaLab como número inteiro
// // //     const horaInt = parseInt(horaLab.split(':')[0], 10);
// // //     console.log(`getReservas: Lab=${labNom}, HoraLab=${horaLab}, HoraInt=${horaInt}, Data=${dataRes}`);

// // //     const { rows } = await pool.query(`
// // //       SELECT res.id_professor, res.laboratorio_id, prof.pro_nom, lab.lab_nom, 
// // //              res.horario_inicio, res.horario_fim, res.data_inicio, res.data_final, res.semana_id, 
// // //              prof.pro_sob, lab.lab_id, sem.sem_dia, res.sol_sts
// // //       FROM reserva res 
// // //       JOIN professor prof ON res.id_professor = prof.pro_id      
// // //       JOIN laboratorio lab ON res.laboratorio_id = lab.lab_id      
// // //       JOIN semana sem ON res.semana_id::integer = sem.sem_id
// // //       WHERE lab.lab_nom = $1 
// // //             AND EXTRACT(HOUR FROM CAST(res.horario_inicio AS time)) <= $2
// // //             AND EXTRACT(HOUR FROM CAST(res.horario_fim AS time)) >= $2
// // //             AND res.data_inicio <= $3::date 
// // //             AND res.data_final >= $3::date
// // //             AND res.sol_sts IS NOT NULL
// // //     `, [labNom, horaInt, dataRes]);
// // //     console.log(`Query getReservas: Lab=${labNom}, Hora=${horaInt}, Data=${dataRes}, Result=${JSON.stringify(rows)}`);
// // //     return rows;
// // //   }
// // // }

// // // module.exports = ReservaModel;

// // // // const pool = require('../database/db');

// // // // class ReservaModel {
// // // //   // Obter horários ativos
// // // //   static async getHorarios() {
// // // //     const { rows } = await pool.query('SELECT hor_lab FROM horarios WHERE ativo = true ORDER BY hor_lab');
// // // //     return rows.map(row => row.hor_lab);
// // // //   }

// // // //   // Obter laboratórios
// // // //   static async getLaboratorios() {
// // // //     const { rows } = await pool.query('SELECT lab_nom FROM laboratorio ORDER BY lab_nom');
// // // //     return rows.map(row => row.lab_nom);
// // // //   }

// // // //   // Obter status do laboratório
// // // //   static async getStatusLaboratorio(labNom) {
// // // //     const { rows } = await pool.query('SELECT lab_sts FROM laboratorio WHERE lab_nom = $1', [labNom]);
// // // //     return rows[0]?.lab_sts || '';
// // // //   }

// // // //   // Obter reservas para um laboratório, horário e data
// // // //   static async getReservas(labNom, horaLab, dataRes) {
// // // //     const { rows } = await pool.query(`
// // // //       SELECT res.id_professor, res.laboratorio_id, prof.pro_nom, lab.lab_nom, 
// // // //              res.horario_inicio, res.horario_fim, res.data_inicio, res.data_final, res.semana_id, 
// // // //              prof.pro_sob, lab.lab_id, sem.sem_dia, res.sol_sts
// // // //       FROM reserva res 
// // // //       JOIN professor prof ON res.id_professor = prof.pro_id      
// // // //       JOIN laboratorio lab ON res.laboratorio_id = lab.lab_id      
// // // //       JOIN semana sem ON res.semana_id::integer = sem.sem_id
// // // //       WHERE lab.lab_nom = $1 
// // // //             AND EXTRACT(HOUR FROM CAST(res.horario_inicio AS time)) <= EXTRACT(HOUR FROM CAST($2 AS time))
// // // //             AND EXTRACT(HOUR FROM CAST(res.horario_fim AS time)) >= EXTRACT(HOUR FROM CAST($2 AS time))
// // // //             AND res.data_inicio <= $3::date 
// // // //             AND res.data_final >= $3::date
// // // //             AND res.sol_sts IS NOT NULL
// // // //     `, [labNom, horaLab, dataRes]);
// // // //     console.log(`Query getReservas: Lab=${labNom}, Hora=${horaLab}, Data=${dataRes}, Result=${JSON.stringify(rows)}`);
// // // //     return rows;
// // // //   }
// // // // }

// // // // module.exports = ReservaModel;

// // // // // const pool = require('../database/db');

// // // // // class ReservaModel {
// // // // //   // Obter horários ativos
// // // // //   static async getHorarios() {
// // // // //     const { rows } = await pool.query('SELECT hor_lab FROM horarios WHERE ativo = true ORDER BY hor_lab');
// // // // //     return rows.map(row => row.hor_lab);
// // // // //   }

// // // // //   // Obter laboratórios
// // // // //   static async getLaboratorios() {
// // // // //     const { rows } = await pool.query('SELECT lab_nom FROM laboratorio ORDER BY lab_nom');
// // // // //     return rows.map(row => row.lab_nom);
// // // // //   }

// // // // //   // Obter status do laboratório
// // // // //   static async getStatusLaboratorio(labNom) {
// // // // //     const { rows } = await pool.query('SELECT lab_sts FROM laboratorio WHERE lab_nom = $1', [labNom]);
// // // // //     return rows[0]?.lab_sts || '';
// // // // //   }

// // // // //   // Obter reservas para um laboratório, horário e data
// // // // //   static async getReservas(labNom, horaLab, dataRes) {
// // // // //     const { rows } = await pool.query(`
// // // // //       SELECT res.id_professor, res.laboratorio_id, prof.pro_nom, lab.lab_nom, 
// // // // //              res.horario_inicio, res.horario_fim, res.data_inicio, res.data_final, res.semana_id, 
// // // // //              prof.pro_sob, lab.lab_id, sem.sem_dia, res.sol_sts
// // // // //       FROM reserva res 
// // // // //       JOIN professor prof ON res.id_professor = prof.pro_id      
// // // // //       JOIN laboratorio lab ON res.laboratorio_id = lab.lab_id      
// // // // //       JOIN semana sem ON res.semana_id::integer = sem.sem_id
// // // // //       WHERE lab.lab_nom = $1 
// // // // //             AND EXTRACT(HOUR FROM res.horario_inicio) <= EXTRACT(HOUR FROM CAST($2 AS time))
// // // // //             AND EXTRACT(HOUR FROM res.horario_fim) >= EXTRACT(HOUR FROM CAST($2 AS time))
// // // // //             AND res.data_inicio <= $3::date 
// // // // //             AND res.data_final >= $3::date
// // // // //             AND res.sol_sts IS NOT NULL
// // // // //     `, [labNom, horaLab, dataRes]);
// // // // //     return rows;
// // // // //   }
// // // // // }

// // // // // module.exports = ReservaModel;

// // // // // // const pool = require('../database/db');

// // // // // // class ReservaModel {
// // // // // //   // Obter horários ativos
// // // // // //   static async getHorarios() {
// // // // // //     const { rows } = await pool.query('SELECT hor_lab FROM horarios WHERE ativo = true ORDER BY hor_lab');
// // // // // //     return rows.map(row => row.hor_lab);
// // // // // //   }

// // // // // //   // Obter laboratórios
// // // // // //   static async getLaboratorios() {
// // // // // //     const { rows } = await pool.query('SELECT lab_nom FROM laboratorio ORDER BY lab_nom');
// // // // // //     return rows.map(row => row.lab_nom);
// // // // // //   }

// // // // // //   // Obter status do laboratório
// // // // // //   static async getStatusLaboratorio(labNom) {
// // // // // //     const { rows } = await pool.query('SELECT lab_sts FROM laboratorio WHERE lab_nom = $1', [labNom]);
// // // // // //     return rows[0]?.lab_sts || '';
// // // // // //   }

// // // // // //   // Obter reservas para um laboratório, horário e data
// // // // // //   static async getReservas(labNom, horaLab, dataRes) {
// // // // // //     const { rows } = await pool.query(`
// // // // // //       SELECT res.id_professor, res.laboratorio_id, prof.pro_nom, lab.lab_nom, 
// // // // // //              res.horario_inicio, res.horario_fim, res.data_inicio, res.data_final, res.semana_id, 
// // // // // //              prof.pro_sob, lab.lab_id, sem.sem_dia, res.sol_sts
// // // // // //       FROM reserva res 
// // // // // //       JOIN professor prof ON res.id_professor = prof.pro_id      
// // // // // //       JOIN laboratorio lab ON res.laboratorio_id = lab.lab_id      
// // // // // //       JOIN semana sem ON res.semana_id::integer = sem.sem_id
// // // // // //       WHERE lab.lab_nom = $1 
// // // // // //             AND res.horario_inicio <= $2::time 
// // // // // //             AND res.horario_fim >= $2::time 
// // // // // //             AND res.data_inicio <= $3::date 
// // // // // //             AND res.data_final >= $3::date
// // // // // //             AND res.sol_sts IS NOT NULL
// // // // // //     `, [labNom, horaLab, dataRes]);
// // // // // //     return rows;
// // // // // //   }
// // // // // // }

// // // // // // module.exports = ReservaModel;

// // // // // // // const pool = require('../database/db');

// // // // // // // class ReservaModel {
// // // // // // //   // Obter horários ativos
// // // // // // //   static async getHorarios() {
// // // // // // //     const { rows } = await pool.query('SELECT hor_lab FROM horarios WHERE ativo = true ORDER BY hor_lab');
// // // // // // //     return rows.map(row => row.hor_lab);
// // // // // // //   }

// // // // // // //   // Obter laboratórios
// // // // // // //   static async getLaboratorios() {
// // // // // // //     const { rows } = await pool.query('SELECT lab_nom FROM laboratorio ORDER BY lab_nom');
// // // // // // //     return rows.map(row => row.lab_nom);
// // // // // // //   }

// // // // // // //   // Obter status do laboratório
// // // // // // //   static async getStatusLaboratorio(labNom) {
// // // // // // //     const { rows } = await pool.query('SELECT lab_sts FROM laboratorio WHERE lab_nom = $1', [labNom]);
// // // // // // //     return rows[0]?.lab_sts || '';
// // // // // // //   }

// // // // // // //   // Obter reservas para um laboratório, horário e data
// // // // // // //   static async getReservas(labNom, horaLab, dataRes) {
// // // // // // //     const { rows } = await pool.query(`
// // // // // // //       SELECT res.id_professor, res.laboratorio_id, prof.pro_nom, lab.lab_nom, 
// // // // // // //              res.horario_inicio, res.horario_fim, res.data_inicio, res.data_final, res.semana_id, 
// // // // // // //              prof.pro_sob, lab.lab_id, sem.sem_dia, res.sol_sts
// // // // // // //       FROM reserva res 
// // // // // // //       JOIN professor prof ON res.id_professor = prof.pro_id      
// // // // // // //       JOIN laboratorio lab ON res.laboratorio_id = lab.lab_id      
// // // // // // //       JOIN semana sem ON res.semana_id = sem.sem_id
// // // // // // //       WHERE lab.lab_nom = $1 AND res.horario_inicio <= $2 AND res.horario_fim >= $2 
// // // // // // //             AND res.data_inicio <= $3 AND res.data_final >= $3
// // // // // // //             AND res.sol_sts = 1
// // // // // // //     `, [labNom, horaLab, dataRes]);
// // // // // // //     return rows;
// // // // // // //   }
// // // // // // // }

// // // // // // // module.exports = ReservaModel;