// public/js/professores.js

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
                window.location.href = '/login.html';
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
        window.location.href = '/login.html';
    }
}

// Carregar a lista de professores
async function loadProfessores() {
    try {
        console.log('Carregando professores...');
        const tableBody = document.getElementById('professoresTable');
        if (!tableBody) {
            throw new Error('Elemento #professoresTable não encontrado no DOM');
        }
        const response = await fetch('/api/professores', {
            method: 'GET',
            credentials: 'include'
        });
        console.log('Resposta do endpoint /api/professores:', response.status, response.statusText);
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                console.warn('Usuário não autenticado, redirecionando para login...');
                window.location.href = '/login.html';
            }
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Dados dos professores:', data);
        if (!data.professores || !Array.isArray(data.professores)) {
            throw new Error('Formato de dados inválido: "professores" não é um array');
        }
        tableBody.innerHTML = '';
        data.professores.forEach(prof => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${prof.pro_id}</td>
                <td>${prof.pro_nom}</td>
                <td>${prof.pro_sob}</td>
                <td>${prof.pro_mat}</td>
                <td>${prof.pro_eml}</td>
                <td>${prof.ativo ? 'Sim' : 'Não'}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editProfessor(${prof.pro_id})"><i class="fas fa-edit"></i> Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProfessor(${prof.pro_id}, ${prof.ativo})">
                        <i class="fas fa-${prof.ativo ? 'trash' : 'undo'}"></i> ${prof.ativo ? 'Desativar' : 'Reativar'}
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar professores:', error);
        showFeedback('Erro ao carregar professores: ' + error.message, 'danger');
    }
}

// Abrir modal de edição
async function editProfessor(id) {
    try {
        console.log(`Carregando professor ${id} para edição`);
        const response = await fetch(`/api/professores/${id}`, {
            method: 'GET',
            credentials: 'include'
        });
        console.log('Resposta do endpoint /api/professores/:id:', response.status, response.statusText);
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Dados do professor:', data);
        const prof = data.professor;
        document.getElementById('pro_id').value = prof.pro_id;
        document.getElementById('pro_nom').value = prof.pro_nom;
        document.getElementById('pro_sob').value = prof.pro_sob;
        document.getElementById('pro_mat').value = prof.pro_mat;
        document.getElementById('pro_eml').value = prof.pro_eml;
        document.getElementById('professorModalLabel').textContent = 'Editar Professor';
        document.getElementById('submitButton').textContent = 'Atualizar';
        const modal = new bootstrap.Modal(document.getElementById('professorModal'));
        modal.show();
        console.log('Modal de edição aberto');
    } catch (error) {
        console.error('Erro ao editar professor:', error);
        showFeedback('Erro ao carregar professor: ' + error.message, 'danger');
    }
}

// Desativar/reativar professor
async function deleteProfessor(id, ativo) {
    const action = ativo ? 'desativar' : 'reativar';
    if (confirm(`Tem certeza que deseja ${action} este professor?`)) {
        try {
            console.log(`Tentando ${action} professor ID: ${id}`);
            const response = await fetch(`/api/professores/${id}/${ativo ? 'deactivate' : 'reactivate'}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            console.log('Resposta do endpoint /api/professores/:id/:action:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`Erro HTTP! Status: ${response.status}`);
            }
            loadProfessores();
            showFeedback(`Professor ${action}do com sucesso!`, 'success');
        } catch (error) {
            console.error(`Erro ao ${action} professor:`, error);
            showFeedback(`Erro ao ${action} professor: ${error.message}`, 'danger');
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
document.getElementById('professorForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    data.pro_mat = parseInt(data.pro_mat);
    const url = data.pro_id ? `/api/professores/${data.pro_id}` : '/api/professores';
    try {
        console.log('Enviando formulário:', data);
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include'
        });
        console.log('Resposta do endpoint /api/professores:', response.status, response.statusText);
        const result = await response.json();
        if (response.ok) {
            document.getElementById('professorForm').reset();
            document.getElementById('pro_id').value = '';
            bootstrap.Modal.getInstance(document.getElementById('professorModal')).hide();
            loadProfessores();
            showFeedback(data.pro_id ? 'Professor atualizado com sucesso!' : 'Professor criado com sucesso!', 'success');
        } else {
            showFeedback(result.error || 'Erro ao salvar professor', 'danger');
        }
    } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        showFeedback('Erro ao salvar professor: ' + error.message, 'danger');
    }
});

// Manipular eventos do modal
document.addEventListener('DOMContentLoaded', () => {
    const modalElement = document.getElementById('professorModal');
    if (!modalElement) {
        console.error('Elemento #professorModal não encontrado no DOM');
        return;
    }

    let isNewProfessor = false;

    // Detectar clique no botão Novo Professor
    document.getElementById('newProfessorBtn')?.addEventListener('click', () => {
        console.log('Botão Novo Professor clicado');
        isNewProfessor = true; // Marcar como novo professor
    });

    modalElement.addEventListener('shown.bs.modal', () => {
        console.log('Modal totalmente visível');
        if (isNewProfessor) {
            console.log('Modal aberto para novo professor');
            document.getElementById('professorForm').reset();
            document.getElementById('pro_id').value = '';
            document.getElementById('professorModalLabel').textContent = 'Cadastrar Novo Professor';
            document.getElementById('submitButton').textContent = 'Cadastrar';
            const feedback = document.getElementById('modalFeedback');
            if (feedback) feedback.style.display = 'none';
        }
    });

    modalElement.addEventListener('hidden.bs.modal', () => {
        console.log('Modal fechado, resetando formulário');
        document.getElementById('professorForm').reset();
        document.getElementById('pro_id').value = '';
        document.getElementById('professorModalLabel').textContent = 'Cadastrar Novo Professor';
        document.getElementById('submitButton').textContent = 'Cadastrar';
        const feedback = document.getElementById('modalFeedback');
        if (feedback) feedback.style.display = 'none';
        const closeButton = modalElement.querySelector('.btn-close');
        if (closeButton) closeButton.blur();
        isNewProfessor = false; // Resetar flag
    });

    console.log('DOMContentLoaded disparado');
    loadUserGreeting();
    loadProfessores();
});

// Função de logout
async function logout() {
    try {
        await fetch('/api/usuarios/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        window.location.href = '/login.html';
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        window.location.href = '/login.html';
    }
}