// src/controllers/reservaController.js
const ReservaModel = require('../models/reservaModel.js');

class ReservaController {
  static async consultarReservas(req, res) {
    const { datah } = req.body;

    if (!datah) {
      return res.status(400).json({ error: 'Data não fornecida' });
    }

    try {
      // Obter dia da semana
      const diasDaSemana = {
        0: 'DOMINGO',
        1: 'SEGUNDA-FEIRA',
        2: 'TERÇA-FEIRA',
        3: 'QUARTA-FEIRA',
        4: 'QUINTA-FEIRA',
        5: 'SEXTA-FEIRA',
        6: 'SÁBADO'
      };
      const dateObj = new Date(datah + 'T00:00:00-03:00'); // Forçar fuso horário de Brasília
      const diaSemana = diasDaSemana[dateObj.getDay()];
      console.log(`Data selecionada: ${datah}, Dia da semana: ${diaSemana}, getDay: ${dateObj.getDay()}`);

      // Obter horários e laboratórios
      const horarios = await ReservaModel.getHorarios();
      const laboratorios = await ReservaModel.getLaboratorios();
      console.log(`Horários: ${horarios}, Laboratórios: ${laboratorios}`);

      // Montar resposta
      const response = {
        diaSemana,
        horarios,
        laboratorios,
        reservas: []
      };

      // Consultar reservas para cada laboratório
      for (const lab of laboratorios) {
        const labReservations = [];
        const reservas = await ReservaModel.getReservas(lab, datah);
        const labStatus = await ReservaModel.getStatusLaboratorio(lab);
        console.log(`Lab: ${lab}, Data: ${datah}, Reservas: ${JSON.stringify(reservas)}`);

        // Para cada horário no cabeçalho
        for (const hora of horarios) {
          let cellContent = '';
          let corFundo = '';

          // Encontrar reservas que cobrem o intervalo [hora, hora + 1]
          const horaInicio = hora; // ex.: '19:00:00'
          const horaFim = `${(parseInt(hora.split(':')[0], 10) + 1).toString().padStart(2, '0')}:00:00`; // ex.: '20:00:00'

          for (const reserva of reservas) {
            const { pro_nom, pro_sob, horario_inicio, horario_fim, data_inicio, data_final, dis_nom } = reserva;
            console.log(`Reserva: ${pro_nom} ${pro_sob}, Horário: ${horario_inicio} às ${horario_fim}, Data: ${data_inicio} a ${data_final}, Disciplina: ${dis_nom}`);

            // Verificar se a data está no intervalo
            if (new Date(datah).toISOString().split('T')[0] >= new Date(data_inicio).toISOString().split('T')[0] &&
                new Date(datah).toISOString().split('T')[0] <= new Date(data_final).toISOString().split('T')[0]) {
              // Comparar intervalos de horário
              const inicioReserva = new Date(`1970-01-01T${horario_inicio}`);
              const fimReserva = new Date(`1970-01-01T${horario_fim}`);
              const inicioHora = new Date(`1970-01-01T${horaInicio}`);
              const fimHora = new Date(`1970-01-01T${horaFim}`);

              if (inicioReserva <= fimHora && fimReserva >= inicioHora) {
                if (labStatus === 'Falta') {
                  corFundo = 'lightblue';
                  cellContent = 'Falta';
                } else if (labStatus === 'Reservado') {
                  corFundo = 'lightgreen';
                  cellContent = '';
                } else if (labStatus === 'Realocado') {
                  corFundo = '#ffff00';
                  cellContent = 'Realocado';
                } else {
                  cellContent = `${pro_nom} ${pro_sob}<br>${dis_nom || 'Sem disciplina'}`; // Adicionado dis_nom
                }
                break; // Usar a primeira reserva válida
              }
            }
          }

          labReservations.push({ hora, campus: 'Não definido', content: cellContent, corFundo });
        }
        response.reservas.push({ lab, reservas: labReservations });
      }

      res.json(response);
    } catch (error) {
      console.error('Erro ao consultar reservas:', error);
      res.status(500).json({ error: 'Erro no servidor' });
    }
  }
}

module.exports = ReservaController;

// const ReservaModel = require('../models/reservaModel.js');

// class ReservaController {
//   static async consultarReservas(req, res) {
//     const { datah } = req.body;

//     if (!datah) {
//       return res.status(400).json({ error: 'Data não fornecida' });
//     }

//     try {
//       // Obter dia da semana
//       const diasDaSemana = {
//         0: 'DOMINGO',
//         1: 'SEGUNDA-FEIRA',
//         2: 'TERÇA-FEIRA',
//         3: 'QUARTA-FEIRA',
//         4: 'QUINTA-FEIRA',
//         5: 'SEXTA-FEIRA',
//         6: 'SÁBADO'
//       };
//       const dateObj = new Date(datah + 'T00:00:00-03:00'); // Forçar fuso horário de Brasília
//       const diaSemana = diasDaSemana[dateObj.getDay()];
//       console.log(`Data selecionada: ${datah}, Dia da semana: ${diaSemana}, getDay: ${dateObj.getDay()}`);

//       // Obter horários e laboratórios
//       const horarios = await ReservaModel.getHorarios();
//       const laboratorios = await ReservaModel.getLaboratorios();
//       console.log(`Horários: ${horarios}, Laboratórios: ${laboratorios}`);

//       // Montar resposta
//       const response = {
//         diaSemana,
//         horarios,
//         laboratorios,
//         reservas: []
//       };

//       // Consultar reservas para cada laboratório
//       for (const lab of laboratorios) {
//         const labReservations = [];
//         const reservas = await ReservaModel.getReservas(lab, datah);
//         const labStatus = await ReservaModel.getStatusLaboratorio(lab);
//         console.log(`Lab: ${lab}, Data: ${datah}, Reservas: ${JSON.stringify(reservas)}`);

//         // Para cada horário no cabeçalho
//         for (const hora of horarios) {
//           let cellContent = '';
//           let corFundo = '';

//           // Encontrar reservas que cobrem o intervalo [hora, hora + 1]
//           const horaInicio = hora; // ex.: '19:00:00'
//           const horaFim = `${(parseInt(hora.split(':')[0], 10) + 1).toString().padStart(2, '0')}:00:00`; // ex.: '20:00:00'

//           for (const reserva of reservas) {
//             const { pro_nom, pro_sob, horario_inicio, horario_fim, data_inicio, data_final } = reserva;
//             console.log(`Reserva: ${pro_nom} ${pro_sob}, Horário: ${horario_inicio} às ${horario_fim}, Data: ${data_inicio} a ${data_final}`);

//             // Verificar se a data está no intervalo
//             if (new Date(datah).toISOString().split('T')[0] >= new Date(data_inicio).toISOString().split('T')[0] &&
//                 new Date(datah).toISOString().split('T')[0] <= new Date(data_final).toISOString().split('T')[0]) {
//               // Comparar intervalos de horário
//               const inicioReserva = new Date(`1970-01-01T${horario_inicio}`);
//               const fimReserva = new Date(`1970-01-01T${horario_fim}`);
//               const inicioHora = new Date(`1970-01-01T${horaInicio}`);
//               const fimHora = new Date(`1970-01-01T${horaFim}`);

//               if (inicioReserva <= fimHora && fimReserva >= inicioHora) {
//                 if (labStatus === 'Falta') {
//                   corFundo = 'lightblue';
//                   cellContent = 'Falta';
//                 } else if (labStatus === 'Reservado') {
//                   corFundo = 'lightgreen';
//                   cellContent = '';
//                 } else if (labStatus === 'Realocado') {
//                   corFundo = '#ffff00';
//                   cellContent = 'Realocado';
//                 } else {
//                   cellContent = `${pro_nom} ${pro_sob}<br>`;
//                 }
//                 break; // Usar a primeira reserva válida
//               }
//             }
//           }

//           labReservations.push({ hora, content: cellContent, corFundo });
//         }
//         response.reservas.push({ lab, reservas: labReservations });
//       }

//       res.json(response);
//     } catch (error) {
//       console.error('Erro ao consultar reservas:', error);
//       res.status(500).json({ error: 'Erro no servidor' });
//     }
//   }
// }

// module.exports = ReservaController;

