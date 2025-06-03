// public/js/aprovacoes.js

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
  
  // Carregar solicitações pendentes
  async function loadAprovacoes() {
    try {
      console.log('Carregando solicitações pendentes...');
      const response = await fetch('/api/aprovacoes', {
        method: 'GET',
        credentials: 'include'
      });
      console.log('Resposta do endpoint /api/aprovacoes:', response.status, response.statusText);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ao carregar solicitações! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Dados das solicitações:', data);
      const tableBody = document.getElementById('aprovacoesTable');
      if (!tableBody) {
        throw new Error('Elemento #aprovacoesTable não encontrado no DOM');
      }
      tableBody.innerHTML = '';
      if (!data.solicitacoes || !Array.isArray(data.solicitacoes) || data.solicitacoes.length === 0) {
        console.log('Nenhuma solicitação pendente encontrada');
        tableBody.innerHTML = '<tr><td colspan="12" class="text-center">Nenhuma solicitação pendente</td></tr>';
        return;
      }
      data.solicitacoes.forEach(sol => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${sol.id || 'N/A'}</td>
          <td>${sol.sol_nom} ${sol.sol_sob || ''}</td>
          <td>${sol.faculdade_nome || 'Desconhecida'}</td>
          <td>${sol.disciplina_nome || 'Desconhecida'}</td>
          <td>${sol.professor_nome || 'Desconhecido'}</td>
          <td>${sol.laboratorio_nome || 'Desconhecido'}</td>
          <td>${sol.sol_dat_ini || 'N/A'}</td>
          <td>${sol.dia_semana || 'Desconhecido'}</td> <!-- Adicionado -->
          <td>${sol.sol_hor_ini} - ${sol.sol_hor_fim}</td>
          <td>${sol.qtd_alunos || 'N/A'}</td>
          <td>${sol.sol_sts || 'Pendente'}</td>
          <td>
            <button class="btn btn-sm btn-success" onclick="aprovarSolicitacao(${sol.id})"><i class="fas fa-check"></i> Aprovar</button>
            <button class="btn btn-sm btn-danger" onclick="deletarSolicitacao(${sol.id})"><i class="fas fa-trash"></i> Deletar</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error);
      showFeedback(`Erro ao carregar solicitações: ${error.message}`, 'danger');
    }
  }
  
  // Aprovar solicitação
  async function aprovarSolicitacao(id) {
    if (confirm('Tem certeza que deseja aprovar esta solicitação?')) {
      try {
        console.log(`Aprovando solicitação ID: ${id}`);
        const response = await fetch(`/api/aprovacoes/${id}/aprovar`, {
          method: 'POST',
          credentials: 'include'
        });
        console.log('Resposta do endpoint /api/aprovacoes/:id/aprovar:', response.status, response.statusText);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Erro ao aprovar solicitação! Status: ${response.status}`);
        }
        loadAprovacoes();
        showFeedback('Solicitação aprovada com sucesso!', 'success');
      } catch (error) {
        console.error('Erro ao aprovar solicitação:', error);
        showFeedback(`Erro ao aprovar solicitação: ${error.message}`, 'danger');
      }
    }
  }
  
  // Deletar solicitação (desativar)
  async function deletarSolicitacao(id) {
    if (confirm('Tem certeza que deseja deletar esta solicitação?')) {
      try {
        console.log(`Deletando solicitação ID: ${id}`);
        const response = await fetch(`/api/aprovacoes/${id}/deletar`, {
          method: 'POST',
          credentials: 'include'
        });
        console.log('Resposta do endpoint /api/aprovacoes/:id/deletar:', response.status, response.statusText);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Erro ao deletar solicitação! Status: ${response.status}`);
        }
        loadAprovacoes();
        showFeedback('Solicitação deletada com sucesso!', 'success');
      } catch (error) {
        console.error('Erro ao deletar solicitação:', error);
        showFeedback(`Erro ao deletar solicitação: ${error.message}`, 'danger');
      }
    }
  }
  
  // Exibir feedback
  function showFeedback(message, type) {
    console.log(`Feedback: ${message} (${type})`);
    const feedback = document.getElementById('error');
    if (feedback) {
      feedback.textContent = message;
      feedback.className = `alert alert-${type}`;
      feedback.style.display = 'block';
      setTimeout(() => {
        feedback.style.display = 'none';
      }, 3000);
    } else {
      console.warn('Elemento #error não encontrado no DOM');
    }
  }
  
  // Inicializar página
  document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando carregamento de dados...');
    loadUserData();
    loadAprovacoes();
  });

