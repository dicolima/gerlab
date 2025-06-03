// public/js/lista_presenca.js

// Função para logout
function logout() {
  console.log('Realizando logout...');
  localStorage.removeItem('token');
  window.location.href = '/login.html';
}

// Carregar nome do usuário
async function loadUserData() {
  try {
    console.log('Carregando usuário...');
    const response = await fetch('/api/usuarios/user', {
      method: 'GET',
      credentials: 'include'
    });
    console.log('Resposta do endpoint /api/usuarios/user:', response.status, response.statusText);
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        console.warn('Usuário não autenticado, redirecionando para login...');
        window.location.href = '/login.html';
        throw new Error('Não autenticado');
      }
      const errorData = await response.json();
      throw new Error(`Erro HTTP! Status: ${response.status}, Mensagem: ${errorData.error || 'Desconhecida'}`);
    }
    const data = await response.json();
    console.log('Dados do usuário:', data);
    const userGreeting = document.getElementById('user-greeting');
    if (!userGreeting) {
      throw new Error('Elemento #user-greeting não encontrado no DOM');
    }
    userGreeting.textContent = `Bem-vindo, ${data.usr_nom}`;
  } catch (error) {
    console.error('Erro ao carregar usuário:', error);
    window.location.href = '/login.html';
  }
}

// Formatador de data e dia da semana
function formatarDataDiaSemana(data) {
  const diasDaSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const dateObj = new Date(data + 'T00:00:00-03:00');
  const diaSemana = diasDaSemana[dateObj.getDay()];
  const [ano, mes, dia] = data.split('-');
  return `${diaSemana}, ${dia}/${mes}/${ano}`;
}

// Manipula o envio do formulário
document.getElementById('form-lista-presenca').addEventListener('submit', async (e) => {
  e.preventDefault();
  const datah = document.getElementById('datah').value;
  const semestre = document.getElementById('semestre').value;

  if (!datah || !semestre) {
    alert('Por favor, preencha a data e o semestre.');
    return;
  }

  try {
    const response = await fetch('/api/reservas/lista_presenca', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ datah, semestre })
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();
    console.log('Resposta do backend:', JSON.stringify(data));

    if (data.error) {
      document.getElementById('lista-presenca').style.display = 'none';
      alert(data.error);
      return;
    }

    const tbody = document.getElementById('lista-presenca-tbody');
    const semestreTitulo = document.getElementById('semestre-titulo');
    const dataDiaSemana = document.getElementById('data-dia-semana');
    tbody.innerHTML = '';

    if (!data.reservas || data.reservas.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhuma reserva encontrada para a data selecionada</td></tr>';
    } else {
      data.reservas.forEach(reserva => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${reserva.lab_nom}</td>
          <td>${reserva.horario_inicio} - ${reserva.horario_fim}</td>
          <td>${reserva.pro_nom} ${reserva.pro_sob}</td>
          <td>${reserva.faculdade_nome || 'Desconhecido'}</td>
          <td>${reserva.dis_nom || 'Desconhecida'}</td>
          <td class="assinatura"></td>
        `;
        tbody.appendChild(row);
      });
    }

    semestreTitulo.textContent = semestre;
    dataDiaSemana.textContent = formatarDataDiaSemana(datah);
    document.getElementById('lista-presenca').style.display = 'block';
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao gerar lista de presença: ' + error.message);
  }
});

// Inicializar página
document.addEventListener('DOMContentLoaded', () => {
  console.log('Inicializando carregamento de dados...');
  loadUserData();
});