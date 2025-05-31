// public/js/laboratorio_programa.js

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

// Carregar laboratórios no select
async function loadLaboratoriosSelect() {
    try {
        console.log('Carregando laboratórios para o select...');
        const response = await fetch('/api/laboratorios', {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error(`Erro ao carregar laboratórios! Status: ${response.status}`);
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
        data.laboratorios.filter(l => l.ativo).forEach(lab => {
            const option = document.createElement('option');
            option.value = lab.lab_id;
            option.text = `${lab.lab_num} - ${lab.lab_nom}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar laboratórios:', error);
        showFeedback('Erro ao carregar laboratórios: ' + error.message, 'danger');
    }
}

// Carregar programas no select
async function loadProgramasSelect() {
    try {
        console.log('Carregando programas para o select...');
        const response = await fetch('/api/programas', {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error(`Erro ao carregar programas! Status: ${response.status}`);
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
            option.text = `${prog.prg_nom} (Versão: ${prog.prg_ver})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar programas:', error);
        showFeedback('Erro ao carregar programas: ' + error.message, 'danger');
    }
}

// Carregar a lista de vínculos
async function loadVinculos() {
    try {
        console.log('Carregando vínculos...');
        const response = await fetch('/api/laboratorio_programas', {
            method: 'GET',
            credentials: 'include'
        });
        console.log('Resposta do endpoint /api/laboratorio_programas:', response.status, response.statusText);
        if (!response.ok) {
            throw new Error(`Erro ao carregar vínculos! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Dados dos vínculos:', data);
        const tableBody = document.getElementById('vinculosTable');
        if (!tableBody) {
            throw new Error('Elemento #vinculosTable não encontrado no DOM');
        }
        tableBody.innerHTML = '';
        if (!data.vinculos || !Array.isArray(data.vinculos)) {
            console.warn('Nenhum vínculo encontrado ou formato de dados inválido');
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum vínculo encontrado</td></tr>';
            return;
        }
        if (data.vinculos.length === 0) {
            console.log('Lista de vínculos vazia');
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum vínculo cadastrado</td></tr>';
            return;
        }
        data.vinculos.forEach(vinc => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${vinc.lp_id || 'N/A'}</td>
                <td>${vinc.laboratorio_nome || 'Desconhecido'}</td>
                <td>${vinc.programa_nome || 'Desconhecido'}</td>
                <td>${vinc.ativo ? 'Sim' : 'Não'}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editVinculo(${vinc.lp_id})"><i class="fas fa-edit"></i> Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteVinculo(${vinc.lp_id}, ${vinc.ativo})">
                        <i class="fas fa-${vinc.ativo ? 'trash' : 'undo'}"></i> ${vinc.ativo ? 'Desativar' : 'Reativar'}
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar vínculos:', error);
        const tableBody = document.getElementById('vinculosTable');
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Erro ao carregar vínculos</td></tr>';
        }
        showFeedback('Erro ao carregar vínculos: ' + error.message, 'danger');
    }
}

// Abrir modal de edição
async function editVinculo(id) {
    try {
        console.log(`Carregando vínculo ${id} para edição`);
        const response = await fetch(`/api/laboratorio_programas/${id}`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error(`Erro ao carregar vínculo! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Dados do vínculo para edição:', data);
        const vinc = data.vinculo;
        if (!vinc) {
            throw new Error('Vínculo não encontrado');
        }
        document.getElementById('lp_id').value = vinc.lp_id;
        document.getElementById('laboratorio_id').value = vinc.laboratorio_id;
        document.getElementById('programa_id').value = vinc.programa_id;
        document.getElementById('vinculoModalLabel').textContent = 'Editar Vínculo';
        document.getElementById('submitButton').textContent = 'Atualizar';
        const modal = new bootstrap.Modal(document.getElementById('vinculoModal'));
        modal.show();
        console.log('Modal de edição aberto');
    } catch (error) {
        console.error('Erro ao editar vínculo:', error);
        showFeedback('Erro ao carregar vínculo: ' + error.message, 'danger');
    }
}

// Desativar/reativar vínculo
async function deleteVinculo(id, ativo) {
    const action = ativo ? 'desativar' : 'reativar';
    if (confirm(`Tem certeza que deseja ${action} este vínculo?`)) {
        try {
            console.log(`Tentando ${action} vínculo ID: ${id}`);
            const response = await fetch(`/api/laboratorio_programas/${id}/${ativo ? 'deactivate' : 'reactivate'}`, {
                method: 'POST',
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`Erro ao ${action} vínculo! Status: ${response.status}`);
            }
            loadVinculos();
            showFeedback(`Vínculo ${action}do com sucesso!`, 'success');
        } catch (error) {
            console.error(`Erro ao ${action} vínculo:`, error);
            showFeedback(`Erro ao ${action} vínculo: ${error.message}`, 'danger');
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
    const modalElement = document.getElementById('vinculoModal');
    if (!modalElement) {
        console.error('Elemento #vinculoModal não encontrado no DOM');
        return;
    }

    // Resetar formulário ao abrir modal para novo vínculo
    modalElement.addEventListener('show.bs.modal', (event) => {
        if (event.relatedTarget && event.relatedTarget.id === 'newVinculoBtn') {
            console.log('Modal aberto para novo vínculo');
            document.getElementById('vinculoForm').reset();
            document.getElementById('lp_id').value = '';
            document.getElementById('vinculoModalLabel').textContent = 'Cadastrar Novo Vínculo';
            document.getElementById('submitButton').textContent = 'Cadastrar';
            document.getElementById('modalFeedback').style.display = 'none';
            loadLaboratoriosSelect();
            loadProgramasSelect();
        }
    });

    // Resetar formulário ao fechar modal
    modalElement.addEventListener('hidden.bs.modal', () => {
        console.log('Modal fechado, resetando formulário');
        document.getElementById('vinculoForm').reset();
        document.getElementById('lp_id').value = '';
        document.getElementById('vinculoModalLabel').textContent = 'Cadastrar Novo Vínculo';
        document.getElementById('submitButton').textContent = 'Cadastrar';
        document.getElementById('modalFeedback').style.display = 'none';
    });

    // Manipular envio do formulário
    document.getElementById('vinculoForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        data.laboratorio_id = parseInt(data.laboratorio_id);
        data.programa_id = parseInt(data.programa_id);
        const url = data.lp_id ? `/api/laboratorio_programas/${data.lp_id}` : '/api/laboratorio_programas';

        try {
            console.log('Enviando formulário:', data);
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                credentials: 'include',
                body: new URLSearchParams(data).toString()
            });
            const result = await response.json();
            if (response.ok) {
                document.getElementById('vinculoForm').reset();
                document.getElementById('lp_id').value = '';
                bootstrap.Modal.getInstance(modalElement).hide();
                loadVinculos();
                showFeedback(data.lp_id ? 'Vínculo atualizado com sucesso!' : 'Vínculo criado com sucesso!', 'success');
            } else {
                showFeedback(result.error || 'Erro ao salvar vínculo', 'danger');
            }
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            showFeedback('Erro ao salvar vínculo: ' + error.message, 'danger');
        }
    });

    // Abrir modal para novo vínculo
    document.getElementById('newVinculoBtn').addEventListener('click', () => {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    });

    // Carregar vínculos e selects ao iniciar
    console.log('Inicializando carregamento de dados...');
    loadUserGreeting();
    loadVinculos();
    loadLaboratoriosSelect();
    loadProgramasSelect();
});

// Função de logout
function logout() {
    fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
    })
        .then(() => {
            window.location.href = '/login.html';
        })
        .catch(error => {
            console.error('Erro ao fazer logout:', error);
        });
}