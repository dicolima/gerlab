// public/js/consultar_reservas.js
// Configura a data inicial
const input = document.getElementById('datah');
const dataSelecionada = localStorage.getItem('dataSelecionada');
if (dataSelecionada) {
  input.value = dataSelecionada;
} else {
  const dataAtual = new Date().toISOString().split('T')[0];
  input.value = dataAtual;
}

// Armazena a data selecionada no localStorage
input.addEventListener('change', function () {
  const novaDataSelecionada = input.value;
  console.log('Data selecionada:', novaDataSelecionada);
  localStorage.setItem('dataSelecionada', novaDataSelecionada);
});

function limparData() {
  localStorage.removeItem('dataSelecionada');
}

// Manipula o envio do formulário
document.getElementById('form-consulta').addEventListener('submit', async (e) => {
  e.preventDefault(); // Impede o envio padrão do formulário
  const datah = document.getElementById('datah').value;

  try {
    const response = await fetch('/api/reservas/consultar_reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ datah })
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();
    console.log('Resposta do backend:', JSON.stringify(data)); // Log para depuração
    if (data.error) {
      document.getElementById('resultado').innerHTML = `<p>${data.error}</p>`;
      return;
    }

    // Exibe o dia da semana
    let html = `<p>O dia da semana correspondente à data selecionada é: ${data.diaSemana}</p>`;
    html += `<table border="1"><tr><td>Laboratórios</td>`;

    // Cabeçalho com horários
    data.horarios.forEach(horario => {
      html += `<td>${horario}</td>`;
    });
    html += `</tr>`;

    // Linhas com laboratórios e reservas
    data.reservas.forEach(lab => {
      html += `<tr><td><a href="consulta_laboratorio_prova.php?lab=${lab.lab}&data=${datah}">${lab.lab}</a></td>`;
      lab.reservas.forEach(reserva => {
        html += `<td style="background-color: ${reserva.corFundo}">${reserva.content}</td>`;
      });
      html += `</tr>`;
    });

    html += `</table>`;
    document.getElementById('resultado').innerHTML = html;
  } catch (error) {
    console.error('Erro:', error);
    document.getElementById('resultado').innerHTML = '<p>Erro ao buscar dados!</p>';
  }
});

// // Configura a data inicial
// const input = document.getElementById('datah');
// const dataSelecionada = localStorage.getItem('dataSelecionada');
// if (dataSelecionada) {
//     input.value = dataSelecionada;
// } else {
//     const dataAtual = new Date().toISOString().split('T')[0];
//     input.value = dataAtual;
// }

// // Armazena a data selecionada no localStorage
// input.addEventListener('change', function() {
//     const novaDataSelecionada = input.value;
//     console.log('Data selecionada:', novaDataSelecionada);
//     localStorage.setItem('dataSelecionada', novaDataSelecionada);
// });

// function limparData() {
//     localStorage.removeItem('dataSelecionada');
// }

// // Manipula o envio do formulário
// document.getElementById('form-consulta').addEventListener('submit', async (e) => {
//     e.preventDefault(); // Impede o envio padrão do formulário
//     const datah = document.getElementById('datah').value;

//     try {
//         const response = await fetch('/api/reservas/consultar_reservas', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ datah })
//         });

//         if (!response.ok) {
//             throw new Error(`Erro na requisição: ${response.status}`);
//         }

//         const data = await response.json();
//         if (data.error) {
//             document.getElementById('resultado').innerHTML = `<p>${data.error}</p>`;
//             return;
//         }

//         // Exibe o dia da semana
//         let html = `<p>O dia da semana correspondente à data selecionada é: ${data.diaSemana}</p>`;
//         html += `<table border="1"><tr><td>Laboratórios</td>`;

//         // Cabeçalho com horários
//         data.horarios.forEach(horario => {
//             html += `<td>${horario}</td>`;
//         });
//         html += `</tr>`;

//         // Linhas com laboratórios e reservas
//         data.reservas.forEach(lab => {
//             html += `<tr><td><a href="consulta_laboratorio_prova.php?lab=${lab.lab}&data=${datah}">${lab.lab}</a></td>`;
//             lab.reservas.forEach(reserva => {
//                 html += `<td style="background-color: ${reserva.corFundo}">${reserva.content}</td>`;
//             });
//             html += `</tr>`;
//         });

//         html += `</table>`;
//         document.getElementById('resultado').innerHTML = html;
//     } catch (error) {
//         console.error('Erro:', error);
//         document.getElementById('resultado').innerHTML = '<p>Erro ao buscar dados!</p>';
//     }
// });