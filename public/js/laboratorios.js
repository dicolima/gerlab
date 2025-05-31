// public/js/laboratorios.js

// Carregar nome do usuário
async function loadUserGreeting() {
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
                window.location.href = '/login';
                throw new Error('Não autenticado');
            }
            throw new Error(`Erro HTTP! Status: ${response.status}`);
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
        window.location.href = '/login';
    }
}

// Carregar prédios no select
async function loadPrediosSelect() {
    try {
        console.log('Carregando prédios para o select...');
        const select = document.getElementById('predio_id');
        if (!select) {
            console.error('Elemento #predio_id não encontrado no DOM.');
            throw new Error('Elemento #predio_id não está presente no DOM');
        }
        console.log('Elemento #predio_id encontrado:', select);
        const response = await fetch('/api/predios', {
            method: 'GET',
            credentials: 'include'
        });
        console.log('Resposta do endpoint /api/predios:', response.status, response.statusText);
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                console.warn('Usuário não autenticado, redirecionando para login...');
                window.location.href = '/login';
            }
            throw new Error(`Erro HTTP! Status: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Dados recebidos de /api/predios:', data);
        if (!data.predios || !Array.isArray(data.predios)) {
            throw new Error('Formato de dados inválido: "predios" não é um array');
        }
        const activePredios = data.predios.filter(p => p.ativo);
        console.log('Prédios ativos filtrados:', activePredios);
        select.innerHTML = '<option value="">Selecione um prédio</option>';
        activePredios.forEach(predio => {
            console.log('Adicionando prédio ao select:', predio);
            const option = document.createElement('option');
            option.value = predio.prd_id;
            option.textContent = `${predio.prd_num} - ${predio.prd_nom}`;
            select.appendChild(option);
        });
        console.log('Select populado com sucesso.');
    } catch (error) {
        console.error('Erro ao carregar prédios:', error.message);
        showFeedback('Erro ao carregar prédios: ' + error.message, 'danger');
    }
}

// Carregar a lista de laboratórios
async function loadLaboratorios() {
    try {
        console.log('Carregando laboratórios...');
        const tableBody = document.getElementById('laboratoriosTable');
        if (!tableBody) {
            throw new Error('Elemento #laboratoriosTable não encontrado no DOM');
        }
        const response = await fetch('/api/laboratorios', {
            method: 'GET',
            credentials: 'include'
        });
        console.log('Resposta do endpoint /api/laboratorios:', response.status, response.statusText);
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Dados dos laboratórios:', data);
        if (!data.laboratorios || !Array.isArray(data.laboratorios)) {
            throw new Error('Formato de dados inválido: "laboratorios" não é um array');
        }
        tableBody.innerHTML = '';
        data.laboratorios.forEach(lab => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${lab.lab_id}</td>
                <td>${lab.lab_num}</td>
                <td>${lab.lab_nom || ''}</td>
                <td>${lab.lab_eqp || ''}</td>
                <td>${lab.lab_des || ''}</td>
                <td>${lab.lab_sts || ''}</td>
                <td>${lab.predio_num} - ${lab.predio_nome}</td>
                <td>${lab.lab_sem || ''}</td>
                <td>${lab.lab_com || ''}</td>
                <td>${lab.ativo ? 'Sim' : 'Não'}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editLaboratorio(${lab.lab_id})"><i class="fas fa-edit"></i> Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteLaboratorio(${lab.lab_id}, ${lab.ativo})">
                        <i class="fas fa-${lab.ativo ? 'trash' : 'undo'}"></i> ${lab.ativo ? 'Desativar' : 'Reativar'}
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar laboratórios:', error);
        showFeedback('Erro ao carregar laboratórios: ' + error.message, 'danger');
    }
}

// Abrir o modal de edição
async function editLaboratorio(id) {
    try {
        console.log(`Carregando laboratório ${id} para edição`);
        const response = await fetch(`/api/laboratorios/${id}`, {
            method: 'GET',
            credentials: 'include'
        });
        console.log('Resposta do endpoint /api/laboratorios/:id:', response.status, response.statusText);
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Dados do laboratório:', data);
        const lab = data.laboratorio;
        document.getElementById('lab_id').value = lab.lab_id;
        document.getElementById('lab_num').value = lab.lab_num;
        document.getElementById('lab_nom').value = lab.lab_nom || '';
        document.getElementById('lab_eqp').value = lab.lab_eqp || '';
        document.getElementById('lab_des').value = lab.lab_des || '';
        document.getElementById('lab_sts').value = lab.lab_sts || '';
        document.getElementById('predio_id').value = lab.predio_id;
        document.getElementById('lab_sem').value = lab.lab_sem || '';
        document.getElementById('lab_com').value = lab.lab_com || '';
        document.getElementById('laboratorioModalLabel').textContent = 'Editar Laboratório';
        document.getElementById('submitButton').textContent = 'Atualizar';
        const modal = new bootstrap.Modal(document.getElementById('laboratorioModal'));
        modal.show();
        modal._element.addEventListener('shown.bs.modal', async () => {
            console.log('Modal de edição totalmente visível, carregando prédios...');
            await loadPrediosSelect();
        }, { once: true });
    } catch (error) {
        console.error('Erro ao editar laboratório:', error);
        showFeedback('Erro ao carregar laboratório: ' + error.message, 'danger');
    }
}

// Desativar/reativar laboratório
async function deleteLaboratorio(id, ativo) {
    const action = ativo ? 'desativar' : 'reativar';
    if (confirm(`Tem certeza que deseja ${action} este laboratório?`)) {
        try {
            console.log(`Tentando ${action} laboratório ID: ${id}`);
            const response = await fetch(`/api/laboratorios/${id}/${ativo ? 'deactivate' : 'reactivate'}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            console.log('Resposta do endpoint /api/laboratorios/:id/:action:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`Erro HTTP! Status: ${response.status}`);
            }
            loadLaboratorios();
            showFeedback(`Laboratório ${action}do com sucesso!`, 'success');
        } catch (error) {
            console.error(`Erro ao ${action} laboratório:`, error);
            showFeedback(`Erro ao ${action} laboratório: ${error.message}`, 'danger');
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

// Manipular envio do formulário
document.getElementById('laboratorioForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    data.predio_id = parseInt(data.predio_id) || null;
    data.lab_sem = data.lab_sem ? parseInt(data.lab_sem) : null;
    data.lab_com = data.lab_com ? parseInt(data.lab_com) : null;
    const url = data.lab_id ? `/api/laboratorios/${data.lab_id}` : '/api/laboratorios';
    try {
        console.log('Enviando formulário:', data);
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include'
        });
        console.log('Resposta do endpoint /api/laboratorios:', response.status, response.statusText);
        const result = await response.json();
        if (response.ok) {
            document.getElementById('laboratorioForm').reset();
            document.getElementById('lab_id').value = '';
            bootstrap.Modal.getInstance(document.getElementById('laboratorioModal')).hide();
            loadLaboratorios();
            showFeedback(data.lab_id ? 'Laboratório atualizado com sucesso!' : 'Laboratório criado com sucesso!', 'success');
        } else {
            showFeedback(result.error || 'Erro ao salvar laboratório', 'danger');
        }
    } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        showFeedback('Erro ao salvar laboratório: ' + error.message, 'danger');
    }
});

// Manipular eventos do modal
document.addEventListener('DOMContentLoaded', () => {
    const modalElement = document.getElementById('laboratorioModal');
    if (!modalElement) {
        console.error('Elemento #laboratorioModal não encontrado no DOM');
        return;
    }

    let isNewLaboratorio = false;

    // Detectar clique no botão Novo Laboratório
    document.getElementById('newLaboratorioBtn')?.addEventListener('click', () => {
        console.log('Botão Novo Laboratório clicado');
        isNewLaboratorio = true; // Marcar como novo laboratório
    });

    modalElement.addEventListener('shown.bs.modal', async () => {
        console.log('Modal totalmente visível');
        if (isNewLaboratorio) {
            console.log('Modal aberto para novo laboratório');
            document.getElementById('laboratorioForm').reset();
            document.getElementById('lab_id').value = '';
            document.getElementById('laboratorioModalLabel').textContent = 'Cadastrar Novo Laboratório';
            document.getElementById('submitButton').textContent = 'Cadastrar';
            const feedback = document.getElementById('modalFeedback');
            if (feedback) feedback.style.display = 'none';
            await loadPrediosSelect();
        }
    });

    modalElement.addEventListener('hidden.bs.modal', () => {
        console.log('Modal fechado, resetando formulário');
        document.getElementById('laboratorioForm').reset();
        document.getElementById('lab_id').value = '';
        document.getElementById('laboratorioModalLabel').textContent = 'Cadastrar Novo Laboratório';
        document.getElementById('submitButton').textContent = 'Cadastrar';
        const feedback = document.getElementById('modalFeedback');
        if (feedback) feedback.style.display = 'none';
        const closeButton = modalElement.querySelector('.btn-close');
        if (closeButton) closeButton.blur();
        isNewLaboratorio = false; // Resetar flag
    });

    console.log('DOMContentLoaded carregado');
    loadUserGreeting();
    loadLaboratorios();
});

// Função de logout
async function logout() {
    try {
        await fetch('/api/usuarios/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        window.location.href = '/login';
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        window.location.href = '/login';
    }
}