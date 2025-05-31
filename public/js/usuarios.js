// public/js/usuarios.js
// Carregar nome do usuário
// Carregar nome do usuário
// fetch('/api/usuarios/user', { credentials: 'include' })
//     .then(response => {
//         if (!response.ok) {
//             window.location.href = '/login.html';
//             throw new Error('Não autenticado');
//         }
//         return response.json();
//     })
//     .then(data => {
//         document.getElementById('user-greeting').textContent = `Bem-vindo, ${data.usr_nom}`;
//     })
//     .catch(error => {
//         console.error('Erro ao carregar usuário:', error);
//         window.location.href = '/login.html';
//     });

function loadUserGreeting() {
    fetch('/api/usuarios/user', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) {
                window.location.href = '/login';
                throw new Error('Não autenticado');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('user-greeting').textContent = `Bem-vindo, ${data.usr_nom}`;
        })
        .catch(error => {
            console.error('Erro ao carregar usuário:', error);
            window.location.href = '/login';
        });
}

// Função para carregar a lista de usuários
async function loadUsuarios() {
    try {
        console.log('Carregando usuários...');
        const response = await fetch('/api/usuarios/usuarios', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const data = await response.json();
        const tableBody = document.getElementById('usuariosTable');
        tableBody.innerHTML = '';
        data.usuarios.forEach(usuario => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${usuario.usr_id}</td>
                <td>${usuario.usr_nom}</td>
                <td>${usuario.usr_sob}</td>
                <td>${usuario.usr_eml}</td>
                <td>${usuario.usr_mat}</td>
                <td>${usuario.usr_pre || ''}</td>
                <td>${usuario.usr_lab || ''}</td>
                <td>${usuario.usr_tel || ''}</td>
                <td>${usuario.usr_nvl || ''}</td>
                <td>${usuario.ativo ? 'Sim' : 'Não'}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editUsuario(${usuario.usr_id})"><i class="fas fa-edit"></i> Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUsuario(${usuario.usr_id}, ${usuario.ativo})">
                        <i class="fas fa-${usuario.ativo ? 'trash' : 'undo'}"></i> ${usuario.ativo ? 'Desativar' : 'Reativar'}
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        showFeedback('Erro ao carregar usuários: ' + error.message, 'danger');
    }
}

// Função para abrir o modal de edição
async function editUsuario(id) {
    try {
        console.log(`Carregando usuário ${id} para edição`);
        const response = await fetch(`/api/usuarios/usuarios/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const data = await response.json();
        const usuario = data.usuario;
        document.getElementById('usr_id').value = usuario.usr_id;
        document.getElementById('usr_nom').value = usuario.usr_nom;
        document.getElementById('usr_sob').value = usuario.usr_sob;
        document.getElementById('usr_eml').value = usuario.usr_eml;
        document.getElementById('usr_mat').value = usuario.usr_mat;
        document.getElementById('usr_pre').value = usuario.usr_pre || '';
        document.getElementById('usr_lab').value = usuario.usr_lab || '';
        document.getElementById('usr_tel').value = usuario.usr_tel || '';
        document.getElementById('usr_nvl').value = usuario.usr_nvl || '';
        document.getElementById('usr_sen').removeAttribute('required');
        document.getElementById('usuarioModalLabel').textContent = 'Editar Usuário';
        document.getElementById('submitButton').textContent = 'Atualizar';
        const modal = new bootstrap.Modal(document.getElementById('usuarioModal'));
        modal.show();
        console.log('Modal de edição aberto');
    } catch (error) {
        console.error('Erro ao editar usuário:', error);
        showFeedback('Erro ao carregar usuário: ' + error.message, 'danger');
    }
}

// Função para desativar/reativar usuário
async function deleteUsuario(id, ativo) {
    const action = ativo ? 'desativar' : 'reativar';
    if (confirm(`Tem certeza que deseja ${action} este usuário?`)) {
        try {
            console.log(`Tentando ${action} usuário ID: ${id}`);
            const response = await fetch(`/api/usuarios/usuarios/${id}/${ativo ? 'deactivate' : 'reactivate'}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`Erro HTTP! Status: ${response.status}`);
            }
            loadUsuarios();
            showFeedback(`Usuário ${action}do com sucesso!`, 'success');
        } catch (error) {
            console.error(`Erro ao ${action} usuário:`, error);
            showFeedback(`Erro ao ${action} usuário: ${error.message}`, 'danger');
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
document.getElementById('usuarioForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const url = data.usr_id ? `/api/usuarios/usuarios/${data.usr_id}` : '/api/usuarios/usuarios';

    try {
        console.log('Enviando formulário:', data);
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include'
        });
        const result = await response.json();
        if (response.ok) {
            document.getElementById('usuarioForm').reset();
            document.getElementById('usr_id').value = '';
            bootstrap.Modal.getInstance(document.getElementById('usuarioModal')).hide();
            loadUsuarios();
            showFeedback(data.usr_id ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!', 'success');
        } else {
            showFeedback(result.error || 'Erro ao salvar usuário', 'danger');
        }
    } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        showFeedback('Erro ao salvar usuário: ' + error.message, 'danger');
    }
});

// Manipular eventos do modal
document.addEventListener('DOMContentLoaded', () => {
    const modalElement = document.getElementById('usuarioModal');

    // Resetar formulário quando o modal for aberto para "Novo Usuário"
    modalElement.addEventListener('show.bs.modal', (event) => {
        if (event.relatedTarget.id === 'newUsuarioBtn') {
            console.log('Modal aberto para novo usuário');
            document.getElementById('usuarioForm').reset();
            document.getElementById('usr_id').value = '';
            document.getElementById('usr_sen').setAttribute('required', 'required');
            document.getElementById('usuarioModalLabel').textContent = 'Cadastrar Novo Usuário';
            document.getElementById('submitButton').textContent = 'Cadastrar';
            document.getElementById('modalFeedback').style.display = 'none';
        }
    });

    // Resetar formulário quando o modal for fechado
    modalElement.addEventListener('hidden.bs.modal', () => {
        console.log('Modal fechado, resetando formulário');
        document.getElementById('usuarioForm').reset();
        document.getElementById('usr_id').value = '';
        document.getElementById('usr_sen').setAttribute('required', 'required');
        document.getElementById('usuarioModalLabel').textContent = 'Cadastrar Novo Usuário';
        document.getElementById('submitButton').textContent = 'Cadastrar';
        document.getElementById('modalFeedback').style.display = 'none';
    });

    // Manipular abertura do modal para novo usuário
    document.getElementById('newUsuarioBtn').addEventListener('click', () => {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    });

    // Carregar usuário e lista de usuários ao iniciar
    loadUserGreeting();
    loadUsuarios();
});

// Função de logout
function logout() {
    fetch('/api/usuarios/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
        .then(() => {
            window.location.href = '/login';
        })
        .catch(error => {
            console.error('Erro ao fazer logout:', error);
            window.location.href = '/login';
        });
}