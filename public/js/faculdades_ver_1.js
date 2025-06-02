// public/js/faculdades.js

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

// Carregar a lista de faculdades
async function loadFaculdades() {
    try {
        console.log('Carregando faculdades...');
        const tableBody = document.getElementById('faculdadesTable');
        if (!tableBody) {
            throw new Error('Elemento #faculdadesTable não encontrado no DOM');
        }
        const response = await fetch('/api/faculdades', {
            method: 'GET',
            credentials: 'include'
        });
        console.log('Resposta do endpoint /api/faculdades:', response.status, response.statusText);
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                console.warn('Usuário não autenticado, redirecionando para login...');
                window.location.href = '/login.html';
            }
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Dados das faculdades:', data);
        if (!data.faculdades || !Array.isArray(data.faculdades)) {
            throw new Error('Formato de dados inválido: "faculdades" não é um array');
        }
        tableBody.innerHTML = '';
        data.faculdades.forEach(fac => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${fac.fac_id}</td>
                <td>${fac.fac_cur}</td>
                <td>${fac.professor_id || ''}</td>
                <td>${fac.ativo ? 'Sim' : 'Não'}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editFaculdade(${fac.fac_id})"><i class="fas fa-edit"></i> Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteFaculdade(${fac.fac_id}, ${fac.ativo})">
                        <i class="fas fa-${fac.ativo ? 'trash' : 'undo'}"></i> ${fac.ativo ? 'Desativar' : 'Reativar'}
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar faculdades:', error);
        showFeedback('Erro ao carregar faculdades: ' + error.message, 'danger');
    }
}

// Abrir modal de edição
async function editFaculdade(id) {
    try {
        console.log(`Carregando faculdade ${id} para edição`);
        const response = await fetch(`/api/faculdades/${id}`, {
            method: 'GET',
            credentials: 'include'
        });
        console.log('Resposta do endpoint /api/faculdades/:id:', response.status, response.statusText);
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Dados da faculdade:', data);
        const fac = data.faculdade;
        document.getElementById('fac_id').value = fac.fac_id;
        document.getElementById('fac_cur').value = fac.fac_cur;
        document.getElementById('professor_id').value = fac.professor_id || '';
        document.getElementById('faculdadeModalLabel').textContent = 'Editar Faculdade';
        document.getElementById('submitButton').textContent = 'Atualizar';
        const modal = new bootstrap.Modal(document.getElementById('faculdadeModal'));
        modal.show();
        console.log('Modal de edição aberto');
    } catch (error) {
        console.error('Erro ao editar faculdade:', error);
        showFeedback('Erro ao carregar faculdade: ' + error.message, 'danger');
    }
}

// Desativar/reativar faculdade
async function deleteFaculdade(id, ativo) {
    const action = ativo ? 'desativar' : 'reativar';
    if (confirm(`Tem certeza que deseja ${action} esta faculdade?`)) {
        try {
            console.log(`Tentando ${action} faculdade ID: ${id}`);
            const response = await fetch(`/api/faculdades/${id}/${ativo ? 'deactivate' : 'reactivate'}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            console.log('Resposta do endpoint /api/faculdades/:id/:action:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`Erro HTTP! Status: ${response.status}`);
            }
            loadFaculdades();
            showFeedback(`Faculdade ${action}da com sucesso!`, 'success');
        } catch (error) {
            console.error(`Erro ao ${action} faculdade:`, error);
            showFeedback(`Erro ao ${action} faculdade: ${error.message}`, 'danger');
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

// Manipular eventos do modal
document.addEventListener('DOMContentLoaded', () => {
    const modalElement = document.getElementById('faculdadeModal');
    if (!modalElement) {
        console.error('Elemento #faculdadeModal não encontrado no DOM');
        return;
    }

    let isNewFaculdade = false;

    // Detectar clique no botão Nova Faculdade
    document.getElementById('newFaculdadeBtn')?.addEventListener('click', () => {
        console.log('Botão Nova Faculdade clicado');
        isNewFaculdade = true; // Marcar como nova faculdade
    });

    modalElement.addEventListener('shown.bs.modal', () => {
        console.log('Modal totalmente visível');
        if (isNewFaculdade) {
            console.log('Modal aberto para nova faculdade');
            document.getElementById('faculdadeForm').reset();
            document.getElementById('fac_id').value = '';
            document.getElementById('faculdadeModalLabel').textContent = 'Cadastrar Nova Faculdade';
            document.getElementById('submitButton').textContent = 'Cadastrar';
            const feedback = document.getElementById('modalFeedback');
            if (feedback) feedback.style.display = 'none';
        }
    });

    modalElement.addEventListener('hidden.bs.modal', () => {
        console.log('Modal fechado, resetando formulário');
        document.getElementById('faculdadeForm').reset();
        document.getElementById('fac_id').value = '';
        document.getElementById('faculdadeModalLabel').textContent = 'Cadastrar Nova Faculdade';
        document.getElementById('submitButton').textContent = 'Cadastrar';
        const feedback = document.getElementById('modalFeedback');
        if (feedback) feedback.style.display = 'none';
        const closeButton = modalElement.querySelector('.btn-close');
        if (closeButton) closeButton.blur();
        isNewFaculdade = false; // Resetar flag
    });

    // Manipular envio do formulário
    document.getElementById('faculdadeForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        data.professor_id = data.professor_id ? parseInt(data.professor_id) : null;
        const url = data.fac_id ? `/api/faculdades/${data.fac_id}` : '/api/faculdades';
        try {
            console.log('Enviando formulário:', data);
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include'
            });
            console.log('Resposta do endpoint /api/faculdades:', response.status, response.statusText);
            const result = await response.json();
            if (response.ok) {
                document.getElementById('faculdadeForm').reset();
                document.getElementById('fac_id').value = '';
                bootstrap.Modal.getInstance(modalElement).hide();
                loadFaculdades();
                showFeedback(data.fac_id ? 'Faculdade atualizada com sucesso!' : 'Faculdade criada com sucesso!', 'success');
            } else {
                showFeedback(result.error || 'Erro ao salvar faculdade', 'danger');
            }
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            showFeedback('Erro ao salvar faculdade: ' + error.message, 'danger');
        }
    });

    console.log('DOMContentLoaded disparado');
    loadUserGreeting();
    loadFaculdades();
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