// public/js/predios.js
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

// Função para carregar usuários no select
async function loadUsuariosSelect() {
    try {
        console.log('Carregando usuários para o select...');
        const select = document.getElementById('usr_mat');
        if (!select) {
            throw new Error('Elemento #usr_mat não encontrado no DOM');
        }
        const response = await fetch('/api/usuarios/usuarios', {
            method: 'GET',
            credentials: 'include'
        });
        console.log('Resposta do endpoint /api/usuarios/usuarios:', response.status, response.statusText);
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Dados dos usuários:', data);
        if (!data.usuarios || !Array.isArray(data.usuarios)) {
            throw new Error('Formato de dados inválido: "usuarios" não é um array');
        }
        select.innerHTML = '<option value="">Selecione um usuário</option>';
        data.usuarios
            .filter(u => u.ativo && !isNaN(parseInt(u.usr_mat)))
            .forEach(usuario => {
                const option = document.createElement('option');
                option.value = parseInt(usuario.usr_mat);
                option.text = `${usuario.usr_nom} ${usuario.usr_sob} (${usuario.usr_mat})`;
                select.appendChild(option);
            });
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        showFeedback('Erro ao carregar usuários: ' + error.message, 'danger');
    }
}

// Função para carregar a lista de prédios
async function loadPredios() {
    try {
        console.log('Carregando prédios...');
        const tableBody = document.getElementById('prediosTable');
        if (!tableBody) {
            throw new Error('Elemento #prediosTable não encontrado no DOM');
        }
        const response = await fetch('/api/predios', {
            method: 'GET',
            credentials: 'include'
        });
        console.log('Resposta do endpoint /api/predios:', response.status, response.statusText);
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Dados dos prédios:', data);
        if (!data.predios || !Array.isArray(data.predios)) {
            throw new Error('Formato de dados inválido: "predios" não é um array');
        }
        tableBody.innerHTML = '';
        data.predios.forEach(predio => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${predio.prd_id}</td>
                <td>${predio.prd_num}</td>
                <td>${predio.prd_nom}</td>
                <td>${predio.usr_mat} (${predio.usr_nom || ''} ${predio.usr_sob || ''})</td>
                <td>${predio.dat_ent || ''}</td>
                <td>${predio.dat_sai || ''}</td>
                <td>${predio.hor_ent || ''}</td>
                <td>${predio.hor_sai || ''}</td>
                <td>${predio.dia_ini || ''}</td>
                <td>${predio.dia_fim || ''}</td>
                <td>${predio.ativo ? 'Sim' : 'Não'}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editPredio(${predio.prd_id})"><i class="fas fa-edit"></i> Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deletePredio(${predio.prd_id}, ${predio.ativo})">
                        <i class="fas fa-${predio.ativo ? 'trash' : 'undo'}"></i> ${predio.ativo ? 'Desativar' : 'Reativar'}
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar prédios:', error);
        showFeedback('Erro ao carregar prédios: ' + error.message, 'danger');
    }
}

// Função para abrir o modal de edição
async function editPredio(id) {
    try {
        console.log(`Carregando prédio ${id} para edição`);
        const response = await fetch(`/api/predios/${id}`, {
            method: 'GET',
            credentials: 'include'
        });
        console.log('Resposta do endpoint /api/predios/:id:', response.status, response.statusText);
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Dados do prédio:', data);
        const predio = data.predio;
        document.getElementById('prd_id').value = predio.prd_id;
        document.getElementById('prd_num').value = predio.prd_num;
        document.getElementById('prd_nom').value = predio.prd_nom;
        document.getElementById('usr_mat').value = predio.usr_mat;
        document.getElementById('dat_ent').value = predio.dat_ent || '';
        document.getElementById('dat_sai').value = predio.dat_sai || '';
        document.getElementById('hor_ent').value = predio.hor_ent || '';
        document.getElementById('hor_sai').value = predio.hor_sai || '';
        document.getElementById('dia_ini').value = predio.dia_ini || '';
        document.getElementById('dia_fim').value = predio.dia_fim || '';
        document.getElementById('predioModalLabel').textContent = 'Editar Prédio';
        document.getElementById('submitButton').textContent = 'Atualizar';
        await loadUsuariosSelect(); // Carregar usuários no select
        const modal = new bootstrap.Modal(document.getElementById('predioModal'));
        modal.show();
        console.log('Modal de edição aberto');
    } catch (error) {
        console.error('Erro ao editar prédio:', error);
        showFeedback('Erro ao carregar prédio: ' + error.message, 'danger');
    }
}

// Função para desativar/reativar prédio
async function deletePredio(id, ativo) {
    const action = ativo ? 'desativar' : 'reativar';
    if (confirm(`Tem certeza que deseja ${action} este prédio?`)) {
        try {
            console.log(`Tentando ${action} prédio ID: ${id}`);
            const response = await fetch(`/api/predios/${id}/${ativo ? 'deactivate' : 'reactivate'}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            console.log('Resposta do endpoint /api/predios/:id/:action:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`Erro HTTP! Status: ${response.status}`);
            }
            loadPredios();
            showFeedback(`Prédio ${action}do com sucesso!`, 'success');
        } catch (error) {
            console.error(`Erro ao ${action} prédio:`, error);
            showFeedback(`Erro ao ${action} prédio: ${error.message}`, 'danger');
        }
    }
}

// Função para exibir feedback no modal
function showFeedback(message, type) {
    console.log(`Feedback: ${message} (${type})`);
    const feedback = document.getElementById('modalFeedback');
    feedback.textContent = message;
    feedback.className = `alert alert-${type} alert-dismissible fade show`;
    feedback.style.display = 'block';
    setTimeout(() => {
        feedback.style.display = 'none';
    }, 3000);
}

// Manipular envio do formulário
document.getElementById('predioForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    data.usr_mat = parseInt(data.usr_mat);
    const url = data.prd_id ? `/api/predios/${data.prd_id}` : '/api/predios';

    try {
        console.log('Enviando formulário:', data);
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include'
        });
        console.log('Resposta do endpoint /api/predios:', response.status, response.statusText);
        const result = await response.json();
        if (response.ok) {
            document.getElementById('predioForm').reset();
            document.getElementById('prd_id').value = '';
            bootstrap.Modal.getInstance(document.getElementById('predioModal')).hide();
            loadPredios();
            showFeedback(data.prd_id ? 'Prédio atualizado com sucesso!' : 'Prédio criado com sucesso!', 'success');
        } else {
            showFeedback(result.error || 'Erro ao salvar prédio', 'danger');
        }
    } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        showFeedback('Erro ao salvar prédio: ' + error.message, 'danger');
    }
});

// Manipular eventos do modal
document.addEventListener('DOMContentLoaded', async () => {
    const modalElement = document.getElementById('predioModal');
    modalElement.addEventListener('show.bs.modal', async (event) => {
        if (event.relatedTarget && event.relatedTarget.id === 'newPredioBtn') {
            console.log('Modal aberto para novo prédio');
            document.getElementById('predioForm').reset();
            document.getElementById('prd_id').value = '';
            document.getElementById('predioModalLabel').textContent = 'Cadastrar Novo Prédio';
            document.getElementById('submitButton').textContent = 'Cadastrar';
            document.getElementById('modalFeedback').style.display = 'none';
            await loadUsuariosSelect();
        }
    });

    modalElement.addEventListener('hidden.bs.modal', () => {
        console.log('Modal fechado, resetando formulário');
        document.getElementById('predioForm').reset();
        document.getElementById('prd_id').value = '';
        document.getElementById('predioModalLabel').textContent = 'Cadastrar Novo Prédio';
        document.getElementById('submitButton').textContent = 'Cadastrar';
        document.getElementById('modalFeedback').style.display = 'none';
    });

    document.getElementById('newPredioBtn').addEventListener('click', () => {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    });

    console.log('DOMContentLoaded disparado');
    loadUserGreeting();
    loadPredios();
    // loadUsuariosSelect(); // Carregar apenas no modal
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