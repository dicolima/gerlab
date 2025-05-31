// public/js/programas.js
// Carregar nome do usuário
fetch('/api/user', { credentials: 'include' })
    .then(response => {
        if (!response.ok) {
            window.location.href = '/login.html';
            throw new Error('Não autenticado');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('user-greeting').textContent = `Bem-vindo, ${data.usr_nom}`;
    })
    .catch(error => {
        console.error('Erro ao carregar usuário:', error);
        window.location.href = '/login.html';
    });

// Carregar laboratórios no select
async function loadLaboratoriosSelect() {
    try {
        console.log('Carregando laboratórios para o select...');
        const response = await fetch('/api/laboratorios');
        const data = await response.json();
        const select = document.getElementById('laboratorio_id');
        select.innerHTML = '<option value="">Selecione um laboratório</option>';
        data.laboratorios.filter(l => l.ativo).forEach(lab => {
            const option = document.createElement('option');
            option.value = lab.lab_id;
            option.text = `${lab.lab_num} - ${lab.lab_nom || 'Sem Nome'}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar laboratórios:', error);
        showFeedback('Erro ao carregar laboratórios: ' + error.message, 'danger');
    }
}

// Carregar a lista de programas
async function loadProgramas() {
    try {
        console.log('Carregando programas...');
        const response = await fetch('/api/programas');
        const data = await response.json();
        const tableBody = document.getElementById('programasTable');
        tableBody.innerHTML = '';
        data.programas.forEach(prg => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${prg.prg_id}</td>
                <td>${prg.prg_nom}</td>
                <td>${prg.prg_ver || ''}</td>
                <td>${prg.prg_dat ? new Date(prg.prg_dat).toLocaleDateString('pt-BR') : ''}</td>
                <td>${prg.laboratorio_num} - ${prg.laboratorio_nome || 'Sem Nome'}</td>
                <td>${prg.ativo ? 'Sim' : 'Não'}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editPrograma(${prg.prg_id})"><i class="fas fa-edit"></i> Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deletePrograma(${prg.prg_id}, ${prg.ativo})">
                        <i class="fas fa-${prg.ativo ? 'trash' : 'undo'}"></i> ${prg.ativo ? 'Desativar' : 'Reativar'}
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar programas:', error);
        showFeedback('Erro ao carregar programas: ' + error.message, 'danger');
    }
}

// Abrir modal de edição
async function editPrograma(id) {
    try {
        console.log(`Carregando programa ${id} para edição`);
        const response = await fetch(`/api/programas/${id}`);
        if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);
        const data = await response.json();
        const prg = data.programa;
        document.getElementById('prg_id').value = prg.prg_id;
        document.getElementById('prg_nom').value = prg.prg_nom;
        document.getElementById('prg_ver').value = prg.prg_ver || '';
        document.getElementById('prg_dat').value = prg.prg_dat ? prg.prg_dat.split('T')[0] : '';
        document.getElementById('laboratorio_id').value = prg.laboratorio_id;
        document.getElementById('programaModalLabel').textContent = 'Editar Programa';
        document.getElementById('submitButton').textContent = 'Atualizar';
        const modal = new bootstrap.Modal(document.getElementById('programaModal'));
        modal.show();
        console.log('Modal de edição aberto');
    } catch (error) {
        console.error('Erro ao editar programa:', error);
        showFeedback('Erro ao carregar programa: ' + error.message, 'danger');
    }
}

// Desativar/reativar programa
async function deletePrograma(id, ativo) {
    const action = ativo ? 'desativar' : 'reativar';
    if (confirm(`Tem certeza que deseja ${action} este programa?`)) {
        try {
            console.log(`Tentando ${action} programa ID: ${id}`);
            await fetch(`/api/programas/${id}/${ativo ? 'deactivate' : 'reactivate'}`, { method: 'POST' });
            loadProgramas();
            showFeedback(`Programa ${action}do com sucesso!`, 'success');
        } catch (error) {
            console.error(`Erro ao ${action} programa:`, error);
            showFeedback(`Erro ao ${action} programa: ${error.message}`, 'danger');
        }
    }
}

// Exibir feedback no modal
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

// Manipular eventos do modal
document.addEventListener('DOMContentLoaded', () => {
    const modalElement = document.getElementById('programaModal');

    // Resetar formulário ao abrir modal para novo programa
    modalElement.addEventListener('show.bs.modal', (event) => {
        if (event.relatedTarget.id === 'newProgramaBtn') {
            console.log('Modal aberto para novo programa');
            document.getElementById('programaForm').reset();
            document.getElementById('prg_id').value = '';
            document.getElementById('programaModalLabel').textContent = 'Cadastrar Novo Programa';
            document.getElementById('submitButton').textContent = 'Cadastrar';
            document.getElementById('modalFeedback').style.display = 'none';
            loadLaboratoriosSelect();
        }
    });

    // Resetar formulário ao fechar modal
    modalElement.addEventListener('hidden.bs.modal', () => {
        console.log('Modal fechado, resetando formulário');
        document.getElementById('programaForm').reset();
        document.getElementById('prg_id').value = '';
        document.getElementById('programaModalLabel').textContent = 'Cadastrar Novo Programa';
        document.getElementById('submitButton').textContent = 'Cadastrar';
        document.getElementById('modalFeedback').style.display = 'none';
    });

    // Manipular envio do formulário
    document.getElementById('programaForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        data.laboratorio_id = parseInt(data.laboratorio_id);
        data.prg_dat = data.prg_dat || null;
        const url = data.prg_id ? `/api/programas/${data.prg_id}` : '/api/programas';

        try {
            console.log('Enviando formulário:', data);
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(data).toString()
            });
            const result = await response.json();
            if (response.ok) {
                document.getElementById('programaForm').reset();
                document.getElementById('prg_id').value = '';
                bootstrap.Modal.getInstance(modalElement).hide();
                loadProgramas();
                showFeedback(data.prg_id ? 'Programa atualizado com sucesso!' : 'Programa criado com sucesso!', 'success');
            } else {
                showFeedback(result.error || 'Erro ao salvar programa', 'danger');
            }
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            showFeedback('Erro ao salvar programa: ' + error.message, 'danger');
        }
    });

    // Abrir modal para novo programa
    document.getElementById('newProgramaBtn').addEventListener('click', () => {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    });

    // Carregar programas e laboratórios ao iniciar
    loadProgramas();
    loadLaboratoriosSelect();
});

// Função de logout
function logout() {
    fetch('/api/logout', { method: 'POST', credentials: 'include' })
        .then(() => {
            window.location.href = '/login.html';
        })
        .catch(error => {
            console.error('Erro ao fazer logout:', error);
        });
}