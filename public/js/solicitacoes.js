// public/js/solicitacoes.js

// Carregar nome do usuário e preencher campos automáticos
async function loadUserData() {
    try {
        console.log('Carregando usuário...');
        const response = await fetch('/api/usuarios/user', {
            method: 'GET',
            credentials: 'include'
        });
        console.log('Resposta do endpoint /api/usuarios/user:', response.status, response.statusText);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro na resposta:', errorData);
            if (response.status === 401 || response.status === 403) {
                console.warn('Usuário não autenticado, redirecionando para login...');
                window.location.href = '/login.html';
                throw new Error('Não autenticado');
            }
            throw new Error(`Erro HTTP! Status: ${response.status}, Mensagem: ${errorData.error || 'Desconhecida'}`);
        }
        const data = await response.json();
        console.log('Dados do usuário:', data);
        const userGreeting = document.getElementById('user-greeting');
        if (!userGreeting) {
            throw new Error('Elemento #user-greeting não encontrado no DOM');
        }
        userGreeting.textContent = `Bem-vindo, ${data.usr_nom}`;
        document.getElementById('sol_nom').value = data.usr_nom;
        document.getElementById('sol_sob').value = data.usr_sob;
        document.getElementById('sol_eml').value = data.usr_eml;
        document.getElementById('sol_mat').value = data.usr_mat;
    } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        window.location.href = '/login.html';
    }
}

// Carregar faculdades no select
async function loadFaculdadesSelect() {
    try {
        console.log('Carregando faculdades para o select...');
        const response = await fetch('/api/faculdades', {
            method: 'GET',
            credentials: 'include'
        });
        console.log('Resposta do endpoint /api/faculdades:', response.status, response.statusText);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erro ao carregar faculdades! Status: ${response.status}, Mensagem: ${errorData.error || 'Desconhecida'}`);
        }
        const data = await response.json();
        console.log('Dados das faculdades:', data);
        const select = document.getElementById('faculdade_id');
        if (!select) {
            throw new Error('Elemento #faculdade_id não encontrado no DOM');
        }
        select.innerHTML = '<option value="">Selecione uma faculdade</option>';
        if (!data.faculdades || !Array.isArray(data.faculdades)) {
            throw new Error('Formato de dados de faculdades inválido');
        }
        data.faculdades.filter(f => f.ativo).forEach(fac => {
            const option = document.createElement('option');
            option.value = fac.fac_id;
            option.text = fac.fac_nom || fac.fac_cur || 'Faculdade Sem Nome';
            select.appendChild(option);
        });
        select.disabled = false;
    } catch (error) {
        console.error('Erro ao carregar faculdades:', error);
        showFeedback('Erro ao carregar faculdades: ' + error.message, 'danger');
    }
}

// Carregar disciplinas no select com base na faculdade
async function loadDisciplinasSelect(faculdade_id) {
    try {
        console.log('Carregando disciplinas para o select...', { faculdade_id });
        const response = await fetch(`/api/disciplinas?faculdade_id=${faculdade_id}`, {
            method: 'GET',
            credentials: 'include'
        });
        console.log('Resposta do endpoint /api/disciplinas:', response.status, response.statusText);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erro ao carregar disciplinas! Status: ${response.status}, Mensagem: ${errorData.error || 'Desconhecida'}`);
        }
        const data = await response.json();
        console.log('Dados das disciplinas:', data);
        const select = document.getElementById('disciplina_id');
        if (!select) {
            throw new Error('Elemento #disciplina_id não encontrado no DOM');
        }
        select.innerHTML = '<option value="">Selecione uma disciplina</option>';
        if (!data.disciplinas || !Array.isArray(data.disciplinas)) {
            throw new Error('Formato de dados de disciplinas inválido');
        }
        data.disciplinas.filter(d => d.ativo).forEach(dis => {
            const option = document.createElement('option');
            option.value = dis.dis_id;
            option.text = dis.dis_nom;
            select.appendChild(option);
        });
        select.disabled = false;
    } catch (error) {
        console.error('Erro ao carregar disciplinas:', error);
        showFeedback('Erro ao carregar disciplinas: ' + error.message, 'danger');
        document.getElementById('disciplina_id').disabled = true;
    }
}

// Carregar professores no select com base na disciplina
async function loadProfessoresSelect(disciplina_id) {
    try {
        console.log('Carregando professores para o select...', { disciplina_id });
        const response = await fetch(`/api/professor_disciplina?disciplina_id=${disciplina_id}`, {
            method: 'GET',
            credentials: 'include'
        });
        console.log('Resposta do endpoint /api/professor_disciplina:', response.status, response.statusText);
        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { error: `Erro HTTP ${response.status}: ${response.statusText}` };
            }
            throw new Error(`Erro ao carregar professores! Status: ${response.status}, Mensagem: ${errorData.error || 'Desconhecida'}`);
        }
        const data = await response.json();
        console.log('Dados dos professores:', data);
        const select = document.getElementById('professor_id');
        if (!select) {
            throw new Error('Elemento #professor_id não encontrado no DOM');
        }
        select.innerHTML = '<option value="">Selecione um professor</option>';
        if (!data.vinculos || !Array.isArray(data.vinculos)) {
            throw new Error('Formato de dados de professores inválido');
        }
        data.vinculos.filter(v => v.ativo).forEach(vinc => {
            const option = document.createElement('option');
            option.value = vinc.professor_id;
            option.text = vinc.professor_nome;
            select.appendChild(option);
        });
        select.disabled = false;
    } catch (error) {
        console.error('Erro ao carregar professores:', error);
        showFeedback('Erro ao carregar professores: ' + error.message, 'danger');
        document.getElementById('professor_id').disabled = true;
    }
}

// Carregar prédios no select
async function loadPrediosSelect() {
    try {
        console.log('Carregando prédios para o select...');
        const response = await fetch('/api/predios', {
            method: 'GET',
            credentials: 'include'
        });
        console.log('Resposta do endpoint /api/predios:', response.status, response.statusText);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erro ao carregar prédios! Status: ${response.status}, Mensagem: ${errorData.error || 'Desconhecida'}`);
        }
        const data = await response.json();
        console.log('Dados dos prédios:', data);
        const select = document.getElementById('predio_id');
        if (!select) {
            throw new Error('Elemento #predio_id não encontrado no DOM');
        }
        select.innerHTML = '<option value="">Selecione um prédio</option>';
        if (!data.predios || !Array.isArray(data.predios)) {
            throw new Error('Formato de dados de prédios inválido');
        }
        data.predios.filter(p => p.ativo).forEach(pred => {
            const option = document.createElement('option');
            option.value = pred.prd_id;
            option.text = pred.prd_nom;
            select.appendChild(option);
        });
        select.disabled = false;
    } catch (error) {
        console.error('Erro ao carregar prédios:', error);
        showFeedback('Erro ao carregar prédios: ' + error.message, 'danger');
    }
}

// Carregar programas no select (livre, consulta entidade programas)
async function loadProgramasSelect() {
    try {
        console.log('Carregando programas para o select...');
        const response = await fetch('/api/programas', {
            method: 'GET',
            credentials: 'include'
        });
        console.log('Resposta do endpoint /api/programas:', response.status, response.statusText);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erro ao carregar programas! Status: ${response.status}, Mensagem: ${errorData.error || 'Desconhecida'}`);
        }
        const data = await response.json();
        console.log('Dados dos programas:', data);
        const select = document.getElementById('programa_id');
        if (!select) {
            throw new Error('Elemento #programa_id não encontrado no DOM');
        }
        select.innerHTML = '<option value="">Selecione um programa</option>';
        if (!data.programas || !Array.isArray(data.programas)) {
            throw new Error('Formato de dados de programas inválido');
        }
        data.programas.filter(p => p.ativo).forEach(prog => {
            const option = document.createElement('option');
            option.value = prog.prg_id;
            option.text = prog.prg_nom;
            select.appendChild(option);
        });
        select.disabled = false;
    } catch (error) {
        console.error('Erro ao carregar programas:', error);
        showFeedback('Erro ao carregar programas: ' + error.message, 'danger');
        document.getElementById('programa_id').disabled = true;
    }
}

// Carregar laboratórios no select com base em predio, programa, qtd_alunos, data e horário
async function loadLaboratoriosSelect(predio_id, programa_id, qtd_alunos, sol_dat_ini, sol_dat_fim, sol_hor_ini, sol_hor_fim) {
    try {
        console.log('Carregando laboratórios para o select...', { predio_id, programa_id, qtd_alunos, sol_dat_ini, sol_dat_fim, sol_hor_ini, sol_hor_fim });
        const params = new URLSearchParams({
            predio_id: predio_id || '',
            programa_id: programa_id || '',
            qtd_alunos: qtd_alunos || '',
            sol_dat_ini: sol_dat_ini || '',
            sol_dat_fim: sol_dat_fim || '',
            sol_hor_ini: sol_hor_ini || '',
            sol_hor_fim: sol_hor_fim || ''
        });
        const response = await fetch(`/api/laboratorios/available?${params}`, {
            method: 'GET',
            credentials: 'include'
        });
        console.log('Resposta do endpoint /api/laboratorios/available:', response.status, response.statusText);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erro ao carregar laboratórios! Status: ${response.status}, Mensagem: ${errorData.error || 'Desconhecida'}`);
        }
        const data = await response.json();
        console.log('Dados dos laboratórios:', data);
        const select = document.getElementById('laboratorio_id');
        if (!select) {
            throw new Error('Elemento #laboratorio_id não encontrado no DOM');
        }
        select.innerHTML = '<option value="">Selecione um laboratório</option>';
        if (!data.laboratorios || !Array.isArray(data.laboratorios)) {
            throw new Error('Formato de dados de laboratórios inválido');
        }
        if (data.laboratorios.length === 0) {
            console.log('Nenhum laboratório disponível para os critérios fornecidos');
            showFeedback('Nenhum laboratório disponível para os critérios selecionados', 'warning');
            select.disabled = true;
            return;
        }
        data.laboratorios.filter(l => l.ativo).forEach(lab => {
            const option = document.createElement('option');
            option.value = lab.lab_id;
            option.text = `${lab.lab_num} - ${lab.lab_nom}`;
            select.appendChild(option);
        });
        select.disabled = false;
    } catch (error) {
        console.error('Erro ao carregar laboratórios:', error);
        showFeedback('Erro ao carregar laboratórios: ' + error.message, 'danger');
        document.getElementById('laboratorio_id').disabled = true;
    }
}

// Carregar a lista de solicitações
async function loadSolicitacoes() {
    try {
        console.log('Carregando solicitações...');
        const response = await fetch('/api/solicitacoes', {
            method: 'GET',
            credentials: 'include'
        });
        console.log('Resposta do endpoint /api/solicitacoes:', response.status, response.statusText);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Erro ao carregar solicitações! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Dados das solicitações:', data);
        const tableBody = document.getElementById('solicitacoesTable');
        if (!tableBody) {
            throw new Error('Elemento #solicitacoesTable não encontrado no DOM');
        }
        tableBody.innerHTML = '';
        if (!data.solicitacoes || !Array.isArray(data.solicitacoes)) {
            console.warn('Nenhuma solicitação encontrada ou formato de dados inválido');
            tableBody.innerHTML = '<tr><td colspan="9" class="text-center">Nenhuma solicitação encontrada</td></tr>';
            return;
        }
        if (data.solicitacoes.length === 0) {
            console.log('Lista de solicitações vazia');
            tableBody.innerHTML = '<tr><td colspan="9" class="text-center">Nenhuma solicitação cadastrada</td></tr>';
            return;
        }
        data.solicitacoes.forEach(sol => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${sol.id || 'N/A'}</td>
                <td>${sol.sol_nom} ${sol.sol_sob}</td>
                <td>${sol.faculdade_nome || 'Desconhecida'}</td>
                <td>${sol.disciplina_nome || 'Desconhecida'}</td>
                <td>${sol.professor_nome || 'Desconhecido'}</td>
                <td>${sol.sol_dat_ini || 'N/A'}</td>
                <td>${sol.sol_hor_ini} - ${sol.sol_hor_fim}</td>
                <td>${sol.sol_sts || 'Pendente'}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editSolicitacao(${sol.id})"><i class="fas fa-edit"></i> Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteSolicitacao(${sol.id}, ${sol.ativo})">
                        <i class="fas fa-${sol.ativo ? 'trash' : 'undo'}"></i> ${sol.ativo ? 'Desativar' : 'Reativar'}
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar solicitações:', error);
        const tableBody = document.getElementById('solicitacoesTable');
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="9" class="text-center">Erro ao carregar solicitações</td></tr>';
        }
        showFeedback(`Erro ao carregar solicitações: ${error.message}`, 'danger');
    }
}

// Abrir modal de edição
async function editSolicitacao(id) {
    try {
        console.log(`Carregando solicitação ${id} para edição`);
        const response = await fetch(`/api/solicitacoes/${id}`, {
            method: 'GET',
            credentials: 'include'
        });
        console.log('Resposta do endpoint /api/solicitacoes/:id:', response.status, response.statusText);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erro ao carregar solicitação! Status: ${response.status}, Mensagem: ${errorData.error || 'Desconhecida'}`);
        }
        const data = await response.json();
        console.log('Dados da solicitação para edição:', data);
        const sol = data.solicitacao;
        if (!sol) {
            throw new Error('Solicitação não encontrada');
        }
        document.getElementById('id').value = sol.id;
        document.getElementById('sol_nom').value = sol.sol_nom;
        document.getElementById('sol_sob').value = sol.sol_sob;
        document.getElementById('sol_eml').value = sol.sol_eml;
        document.getElementById('sol_mat').value = sol.sol_mat;
        document.getElementById('faculdade_id').value = sol.faculdade_id;
        await loadDisciplinasSelect(sol.faculdade_id);
        document.getElementById('disciplina_id').value = sol.disciplina_id;
        await loadProfessoresSelect(sol.disciplina_id);
        document.getElementById('professor_id').value = sol.professor_id;
        document.getElementById('predio_id').value = sol.predio_id || '';
        document.getElementById('programa_id').value = sol.programa_id || '';
        await loadLaboratoriosSelect(sol.predio_id, sol.programa_id, sol.qtd_alunos, sol.sol_dat_ini, sol.sol_dat_fim, sol.sol_hor_ini, sol.sol_hor_fim);
        document.getElementById('laboratorio_id').value = sol.laboratorio_id || '';
        document.getElementById('sol_dat_ini').value = sol.sol_dat_ini;
        document.getElementById('sol_dat_fim').value = sol.sol_dat_fim;
        document.getElementById('sol_hor_ini').value = sol.sol_hor_ini;
        document.getElementById('sol_hor_fim').value = sol.sol_hor_fim;
        document.getElementById('qtd_alunos').value = sol.qtd_alunos;
        document.getElementById('solicitacaoModalLabel').textContent = 'Editar Solicitação';
        document.getElementById('submitButton').textContent = 'Atualizar';
        const modal = new bootstrap.Modal(document.getElementById('solicitacaoModal'));
        modal.show();
        console.log('Modal de edição aberto');
    } catch (error) {
        console.error('Erro ao editar solicitação:', error);
        showFeedback('Erro ao carregar solicitação: ' + error.message, 'danger');
    }
}

// Desativar/reativar solicitação
async function deleteSolicitacao(id, ativo) {
    const action = ativo ? 'desativar' : 'reativar';
    if (confirm(`Tem certeza que deseja ${action} esta solicitação?`)) {
        try {
            console.log(`Tentando ${action} solicitação ID: ${id}`);
            const response = await fetch(`/api/solicitacoes/${id}/${ativo ? 'deactivate' : 'reactivate'}`, {
                method: 'POST',
                credentials: 'include'
            });
            console.log('Resposta do endpoint /api/solicitacoes/:id/:action:', response.status, response.statusText);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Erro ao ${action} solicitação! Status: ${response.status}, Mensagem: ${errorData.error || 'Desconhecida'}`);
            }
            loadSolicitacoes();
            showFeedback(`Solicitação ${action}da com sucesso!`, 'success');
        } catch (error) {
            console.error(`Erro ao ${action} solicitação:`, error);
            showFeedback(`Erro ao ${action} solicitação: ${error.message}`, 'danger');
        }
    }
}

// Exibir feedback no modal
function showFeedback(message, type) {
    console.log(`Feedback: ${message} (${type})`);
    const feedback = document.getElementById('modalFeedback');
    if (feedback) {
        feedback.textContent = message;
        feedback.className = `alert alert-${type} alert-dismissible fade show`;
        feedback.style.display = 'block';
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 3000);
    } else {
        console.warn('Elemento #modalFeedback não encontrado no DOM');
    }
}

// Listener para o select de laboratórios
document.getElementById('laboratorio_id').addEventListener('change', function() {
    const laboratorioId = this.value;
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        submitButton.disabled = !laboratorioId || laboratorioId === '';
        console.log('Botão Cadastrar:', submitButton.disabled ? 'desabilitado' : 'habilitado', 'laboratorio_id:', laboratorioId);
    } else {
        console.error('Elemento #submitButton não encontrado no DOM');
    }
});

// Manipular eventos do modal
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando carregamento de dados...');
    const modalElement = document.getElementById('solicitacaoModal');
    if (!modalElement) {
        console.error('Elemento #solicitacaoModal não encontrado no DOM');
        return;
    }

    // Carregar dados do usuário e solicitações ao iniciar
    loadUserData();
    loadSolicitacoes();

    // Evento show.bs.modal apenas para log
    modalElement.addEventListener('show.bs.modal', (event) => {
        console.log('Modal sendo aberto, relatedTarget:', event.relatedTarget ? event.relatedTarget.id : 'undefined');
    });

    // Resetar formulário ao fechar modal
    modalElement.addEventListener('hidden.bs.modal', () => {
        console.log('Modal fechado, resetando formulário');
        const form = document.getElementById('solicitacaoForm');
        const feedback = document.getElementById('modalFeedback');
        const modalLabel = document.getElementById('solicitacaoModalLabel');
        const submitButton = document.getElementById('submitButton');
        form.reset();
        document.getElementById('id').value = '';
        document.getElementById('faculdade_id').value = '';
        document.getElementById('disciplina_id').innerHTML = '<option value="">Selecione uma disciplina</option>';
        document.getElementById('disciplina_id').disabled = true;
        document.getElementById('professor_id').innerHTML = '<option value="">Selecione um professor</option>';
        document.getElementById('professor_id').disabled = true;
        document.getElementById('predio_id').value = '';
        document.getElementById('programa_id').value = '';
        document.getElementById('laboratorio_id').innerHTML = '<option value="">Selecione um laboratório</option>';
        document.getElementById('laboratorio_id').disabled = true;
        modalLabel.textContent = 'Cadastrar Nova Solicitação';
        submitButton.textContent = 'Cadastrar';
        if (feedback) feedback.style.display = 'none';
    });

    // Abrir modal para nova solicitação e carregar selects
    document.getElementById('newSolicitacaoBtn').addEventListener('click', async () => {
        console.log('Botão Nova Solicitação clicado');
        const form = document.getElementById('solicitacaoForm');
        const feedback = document.getElementById('modalFeedback');
        const modalLabel = document.getElementById('solicitacaoModalLabel');
        const submitButton = document.getElementById('submitButton');

        // Resetar formulário
        form.reset();
        document.getElementById('id').value = '';
        document.getElementById('faculdade_id').value = '';
        document.getElementById('disciplina_id').innerHTML = '<option value="">Selecione uma disciplina</option>';
        document.getElementById('disciplina_id').disabled = true;
        document.getElementById('professor_id').innerHTML = '<option value="">Selecione um professor</option>';
        document.getElementById('professor_id').disabled = true;
        document.getElementById('predio_id').value = '';
        document.getElementById('programa_id').value = '';
        document.getElementById('laboratorio_id').innerHTML = '<option value="">Selecione um laboratório</option>';
        document.getElementById('laboratorio_id').disabled = true;
        document.getElementById('sol_dat_ini').value = '';
        document.getElementById('sol_dat_fim').value = '';
        document.getElementById('sol_hor_ini').value = '';
        document.getElementById('sol_hor_fim').value = '';
        document.getElementById('qtd_alunos').value = '1';
        modalLabel.textContent = 'Cadastrar Nova Solicitação';
        submitButton.textContent = 'Cadastrar';
        if (feedback) feedback.style.display = 'none';

        // Carregar dados do usuário
        await loadUserData();

        // Abrir modal
        const modal = new bootstrap.Modal(modalElement);
        modal.show();

        // Carregar selects após abrir o modal
        try {
            await loadFaculdadesSelect();
            console.log('loadFaculdadesSelect concluído');
            await loadPrediosSelect();
            console.log('loadPrediosSelect concluído');
            await loadProgramasSelect();
            console.log('loadProgramasSelect concluído');
        } catch (error) {
            console.error('Erro ao carregar selects:', error);
            showFeedback('Erro ao carregar selects: ' + error.message, 'danger');
        }
    });

    // Manipular mudança na faculdade
    document.getElementById('faculdade_id').addEventListener('change', async (e) => {
        const faculdade_id = e.target.value;
        document.getElementById('disciplina_id').innerHTML = '<option value="">Selecione uma disciplina</option>';
        document.getElementById('disciplina_id').disabled = true;
        document.getElementById('professor_id').innerHTML = '<option value="">Selecione um professor</option>';
        document.getElementById('professor_id').disabled = true;
        if (faculdade_id) {
            await loadDisciplinasSelect(faculdade_id);
        }
    });

    // Manipular mudança na disciplina
    document.getElementById('disciplina_id').addEventListener('change', async (e) => {
        const disciplina_id = e.target.value;
        document.getElementById('professor_id').innerHTML = '<option value="">Selecione um professor</option>';
        document.getElementById('professor_id').disabled = true;
        if (disciplina_id) {
            await loadProfessoresSelect(disciplina_id);
        }
    });

    // Manipular mudança no prédio
    document.getElementById('predio_id').addEventListener('change', async () => {
        await updateLaboratorios();
    });

    // Manipular mudança no programa
    document.getElementById('programa_id').addEventListener('change', async () => {
        await updateLaboratorios();
    });

    // Manipular mudança na quantidade de alunos
    document.getElementById('qtd_alunos').addEventListener('change', async () => {
        await updateLaboratorios();
    });

    // Manipular mudanças nas datas e horários
    document.getElementById('sol_dat_ini').addEventListener('change', async () => {
        await updateLaboratorios();
    });
    document.getElementById('sol_dat_fim').addEventListener('change', async () => {
        await updateLaboratorios();
    });
    document.getElementById('sol_hor_ini').addEventListener('change', async () => {
        await updateLaboratorios();
    });
    document.getElementById('sol_hor_fim').addEventListener('change', async () => {
        await updateLaboratorios();
    });

    // Função auxiliar para atualizar laboratórios
    async function updateLaboratorios() {
        const predio_id = document.getElementById('predio_id').value;
        const programa_id = document.getElementById('programa_id').value;
        const qtd_alunos = document.getElementById('qtd_alunos').value;
        const sol_dat_ini = document.getElementById('sol_dat_ini').value;
        const sol_dat_fim = document.getElementById('sol_dat_fim').value;
        const sol_hor_ini = document.getElementById('sol_hor_ini').value;
        const sol_hor_fim = document.getElementById('sol_hor_fim').value;
        document.getElementById('laboratorio_id').innerHTML = '<option value="">Selecione um laboratório</option>';
        document.getElementById('laboratorio_id').disabled = true;
        if (predio_id && programa_id && qtd_alunos && sol_dat_ini && sol_dat_fim && sol_hor_ini && sol_hor_fim) {
            await loadLaboratoriosSelect(predio_id, programa_id, qtd_alunos, sol_dat_ini, sol_dat_fim, sol_hor_ini, sol_hor_fim);
        }
    }

    // Manipular envio do formulário
    document.getElementById('solicitacaoForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        data.professor_id = parseInt(data.professor_id);
        data.faculdade_id = parseInt(data.faculdade_id);
        data.disciplina_id = parseInt(data.disciplina_id);
        data.programa_id = parseInt(data.programa_id);
        data.predio_id = data.predio_id ? parseInt(data.predio_id) : null;
        data.laboratorio_id = data.laboratorio_id ? parseInt(data.laboratorio_id) : null;
        data.qtd_alunos = parseInt(data.qtd_alunos);
        const url = data.id ? `/api/solicitacoes/${data.id}` : '/api/solicitacoes';

        try {
            console.log('Enviando formulário:', data);
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                credentials: 'include',
                body: new URLSearchParams(data).toString()
            });
            console.log('Resposta do endpoint /api/solicitacoes:', response.status, response.statusText);
            if (response.ok) {
                document.getElementById('solicitacaoForm').reset();
                document.getElementById('id').value = '';
                bootstrap.Modal.getInstance(modalElement).hide();
                loadSolicitacoes();
                showFeedback(data.id ? 'Solicitação atualizada com sucesso!' : 'Solicitação criada com sucesso!', 'success');
            } else {
                const errorData = await response.json();
                showFeedback(errorData.error || 'Erro ao salvar solicitação', 'danger');
            }
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            showFeedback('Erro ao salvar solicitação: ' + error.message, 'danger');
        }
    });
});
