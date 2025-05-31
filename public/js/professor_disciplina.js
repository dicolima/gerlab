// public/js/professor_disciplina.js

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

// Carregar professores no select
async function loadProfessoresSelect() {
    try {
        console.log('Carregando professores para o select...');
        const response = await fetch('/api/professores', {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error(`Erro ao carregar professores! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Dados dos professores:', data);
        const select = document.getElementById('professor_id');
        if (!select) {
            throw new Error('Elemento #professor_id não encontrado no DOM');
        }
        select.innerHTML = '<option value="">Selecione um professor</option>';
        if (!data.professores || !Array.isArray(data.professores)) {
            throw new Error('Formato de dados de professores inválido');
        }
        data.professores.filter(p => p.ativo).forEach(prof => {
            const option = document.createElement('option');
            option.value = prof.pro_id;
            option.text = `${prof.pro_nom} ${prof.pro_sob}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar professores:', error);
        showFeedback('Erro ao carregar professores: ' + error.message, 'danger');
    }
}

// Carregar disciplinas no select
async function loadDisciplinasSelect() {
    try {
        console.log('Carregando disciplinas para o select...');
        const response = await fetch('/api/disciplinas', {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error(`Erro ao carregar disciplinas! Status: ${response.status}`);
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
    } catch (error) {
        console.error('Erro ao carregar disciplinas:', error);
        showFeedback('Erro ao carregar disciplinas: ' + error.message, 'danger');
    }
}

// Carregar a lista de vínculos
async function loadVinculos() {
    try {
        console.log('Carregando vínculos...');
        const response = await fetch('/api/professor_disciplina', {
            method: 'GET',
            credentials: 'include'
        });
        console.log('Resposta do endpoint /api/professor_disciplina:', response.status, response.statusText);
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
                <td>${vinc.pd_id || 'N/A'}</td>
                <td>${vinc.professor_nome || 'Desconhecido'}</td>
                <td>${vinc.disciplina_nome || 'Desconhecida'}</td>
                <td>${vinc.ativo ? 'Sim' : 'Não'}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editVinculo(${vinc.pd_id})"><i class="fas fa-edit"></i> Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteVinculo(${vinc.pd_id}, ${vinc.ativo})">
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
        const response = await fetch(`/api/professor_disciplina/${id}`, {
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
        document.getElementById('pd_id').value = vinc.pd_id;
        document.getElementById('professor_id').value = vinc.professor_id;
        document.getElementById('disciplina_id').value = vinc.disciplina_id;
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
            const response = await fetch(`/api/professor_disciplina/${id}/${ativo ? 'deactivate' : 'reactivate'}`, {
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
            document.getElementById('pd_id').value = '';
            document.getElementById('vinculoModalLabel').textContent = 'Cadastrar Novo Vínculo';
            document.getElementById('submitButton').textContent = 'Cadastrar';
            document.getElementById('modalFeedback').style.display = 'none';
            loadProfessoresSelect();
            loadDisciplinasSelect();
        }
    });

    // Resetar formulário ao fechar modal
    modalElement.addEventListener('hidden.bs.modal', () => {
        console.log('Modal fechado, resetando formulário');
        document.getElementById('vinculoForm').reset();
        document.getElementById('pd_id').value = '';
        document.getElementById('vinculoModalLabel').textContent = 'Cadastrar Novo Vínculo';
        document.getElementById('submitButton').textContent = 'Cadastrar';
        document.getElementById('modalFeedback').style.display = 'none';
    });

    // Manipular envio do formulário
    document.getElementById('vinculoForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        data.professor_id = parseInt(data.professor_id);
        data.disciplina_id = parseInt(data.disciplina_id);
        const url = data.pd_id ? `/api/professor_disciplina/${data.pd_id}` : '/api/professor_disciplina';

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
                document.getElementById('pd_id').value = '';
                bootstrap.Modal.getInstance(modalElement).hide();
                loadVinculos();
                showFeedback(data.pd_id ? 'Vínculo atualizado com sucesso!' : 'Vínculo criado com sucesso!', 'success');
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
    loadProfessoresSelect();
    loadDisciplinasSelect();
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

// // public/js/professor_disciplina.js

// // Carregar nome do usuário
// async function loadUserGreeting() {
//     try {
//         console.log('Carregando usuário...');
//         const response = await fetch('/api/usuarios/user', {
//             method: 'GET',
//             credentials: 'include'
//         });
//         console.log('Resposta do endpoint /api/usuarios/user:', response.status, response.statusText);
//         if (!response.ok) {
//             if (response.status === 401 || response.status === 403) {
//                 console.warn('Usuário não autenticado, redirecionando para login...');
//                 window.location.href = '/login.html';
//                 throw new Error('Não autenticado');
//             }
//             throw new Error(`Erro HTTP! Status: ${response.status}`);
//         }
//         const data = await response.json();
//         console.log('Dados do usuário:', data);
//         const userGreeting = document.getElementById('user-greeting');
//         if (!userGreeting) {
//             throw new Error('Elemento #user-greeting não encontrado no DOM');
//         }
//         userGreeting.textContent = `Bem-vindo, ${data.usr_nom}`;
//     } catch (error) {
//         console.error('Erro ao carregar usuário:', error);
//         window.location.href = '/login.html';
//     }
// }

// // Carregar professores no select
// async function loadProfessoresSelect() {
//     try {
//         console.log('Carregando professores para o select...');
//         const response = await fetch('/api/professores', {
//             method: 'GET',
//             credentials: 'include' // Adicionado para garantir autenticação
//         });
//         if (!response.ok) {
//             throw new Error(`Erro ao carregar professores! Status: ${response.status}`);
//         }
//         const data = await response.json();
//         console.log('Dados dos professores:', data);
//         const select = document.getElementById('professor_id');
//         if (!select) {
//             throw new Error('Elemento #professor_id não encontrado no DOM');
//         }
//         select.innerHTML = '<option value="">Selecione um professor</option>';
//         if (!data.professores || !Array.isArray(data.professores)) {
//             throw new Error('Formato de dados de professores inválido');
//         }
//         data.professores.filter(p => p.ativo).forEach(prof => {
//             const option = document.createElement('option');
//             option.value = prof.pro_id;
//             option.text = `${prof.pro_nom} ${prof.pro_sob}`;
//             select.appendChild(option);
//         });
//     } catch (error) {
//         console.error('Erro ao carregar professores:', error);
//         showFeedback('Erro ao carregar professores: ' + error.message, 'danger');
//     }
// }

// // Carregar disciplinas no select
// async function loadDisciplinasSelect() {
//     try {
//         console.log('Carregando disciplinas para o select...');
//         const response = await fetch('/api/disciplinas', {
//             method: 'GET',
//             credentials: 'include' // Adicionado para garantir autenticação
//         });
//         if (!response.ok) {
//             throw new Error(`Erro ao carregar disciplinas! Status: ${response.status}`);
//         }
//         const data = await response.json();
//         console.log('Dados das disciplinas:', data);
//         const select = document.getElementById('disciplina_id');
//         if (!select) {
//             throw new Error('Elemento #disciplina_id não encontrado no DOM');
//         }
//         select.innerHTML = '<option value="">Selecione uma disciplina</option>';
//         if (!data.disciplinas || !Array.isArray(data.disciplinas)) {
//             throw new Error('Formato de dados de disciplinas inválido');
//         }
//         data.disciplinas.filter(d => d.ativo).forEach(dis => {
//             const option = document.createElement('option');
//             option.value = dis.dis_id;
//             option.text = dis.dis_nom;
//             select.appendChild(option);
//         });
//     } catch (error) {
//         console.error('Erro ao carregar disciplinas:', error);
//         showFeedback('Erro ao carregar disciplinas: ' + error.message, 'danger');
//     }
// }

// // Carregar a lista de vínculos
// async function loadVinculos() {
//     try {
//         console.log('Carregando vínculos...');
//         const response = await fetch('/api/professor_disciplina', {
//             method: 'GET',
//             credentials: 'include' // Adicionado para garantir autenticação
//         });
//         console.log('Resposta do endpoint /api/professor_disciplina:', response.status, response.statusText);
//         if (!response.ok) {
//             throw new Error(`Erro ao carregar vínculos! Status: ${response.status}`);
//         }
//         const data = await response.json();
//         console.log('Dados dos vínculos:', data);
//         const tableBody = document.getElementById('vinculosTable');
//         if (!tableBody) {
//             throw new Error('Elemento #vinculosTable não encontrado no DOM');
//         }
//         tableBody.innerHTML = ''; // Limpa a tabela antes de preencher
//         if (!data.vinculos || !Array.isArray(data.vinculos)) {
//             console.warn('Nenhum vínculo encontrado ou formato de dados inválido');
//             tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum vínculo encontrado</td></tr>';
//             return;
//         }
//         if (data.vinculos.length === 0) {
//             console.log('Lista de vínculos vazia');
//             tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum vínculo cadastrado</td></tr>';
//             return;
//         }
//         data.vinculos.forEach(vinc => {
//             const row = document.createElement('tr');
//             row.innerHTML = `
//                 <td>${vinc.pd_id || 'N/A'}</td>
//                 <td>${vinc.professor_nome || 'Desconhecido'}</td>
//                 <td>${vinc.disciplina_nome || 'Desconhecida'}</td>
//                 <td>${vinc.ativo ? 'Sim' : 'Não'}</td>
//                 <td>
//                     <button class="btn btn-sm btn-primary" onclick="editVinculo(${vinc.pd_id})"><i class="fas fa-edit"></i> Editar</button>
//                     <button class="btn btn-sm btn-danger" onclick="deleteVinculo(${vinc.pd_id}, ${vinc.ativo})">
//                         <i class="fas fa-${vinc.ativo ? 'trash' : 'undo'}"></i> ${vinc.ativo ? 'Desativar' : 'Reativar'}
//                     </button>
//                 </td>
//             `;
//             tableBody.appendChild(row);
//         });
//     } catch (error) {
//         console.error('Erro ao carregar vínculos:', error);
//         const tableBody = document.getElementById('vinculosTable');
//         if (tableBody) {
//             tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Erro ao carregar vínculos</td></tr>';
//         }
//         showFeedback('Erro ao carregar vínculos: ' + error.message, 'danger');
//     }
// }

// // Abrir modal de edição
// async function editVinculo(id) {
//     try {
//         console.log(`Carregando vínculo ${id} para edição`);
//         const response = await fetch(`/api/professor_disciplina/${id}`, {
//             method: 'GET',
//             credentials: 'include' // Adicionado para garantir autenticação
//         });
//         if (!response.ok) {
//             throw new Error(`Erro ao carregar vínculo! Status: ${response.status}`);
//         }
//         const data = await response.json();
//         console.log('Dados do vínculo para edição:', data);
//         const vinc = data.vinculo;
//         if (!vinc) {
//             throw new Error('Vínculo não encontrado');
//         }
//         document.getElementById('pd_id').value = vinc.pd_id;
//         document.getElementById('professor_id').value = vinc.professor_id;
//         document.getElementById('disciplina_id').value = vinc.disciplina_id;
//         document.getElementById('vinculoModalLabel').textContent = 'Editar Vínculo';
//         document.getElementById('submitButton').textContent = 'Atualizar';
//         const modal = new bootstrap.Modal(document.getElementById('vinculoModal'));
//         modal.show();
//         console.log('Modal de edição aberto');
//     } catch (error) {
//         console.error('Erro ao editar vínculo:', error);
//         showFeedback('Erro ao carregar vínculo: ' + error.message, 'danger');
//     }
// }

// // Desativar/reativar vínculo
// async function deleteVinculo(id, ativo) {
//     const action = ativo ? 'desativar' : 'reativar';
//     if (confirm(`Tem certeza que deseja ${action} este vínculo?`)) {
//         try {
//             console.log(`Tentando ${action} vínculo ID: ${id}`);
//             const response = await fetch(`/api/professor_disciplina/${id}/${ativo ? 'deactivate' : 'reactivate'}`, {
//                 method: 'POST',
//                 credentials: 'include' // Adicionado para garantir autenticação
//             });
//             if (!response.ok) {
//                 throw new Error(`Erro ao ${action} vínculo! Status: ${response.status}`);
//             }
//             loadVinculos();
//             showFeedback(`Vínculo ${action}do com sucesso!`, 'success');
//         } catch (error) {
//             console.error(`Erro ao ${action} vínculo:`, error);
//             showFeedback(`Erro ao ${action} vínculo: ${error.message}`, 'danger');
//         }
//     }
// }

// // Exibir feedback no modal
// function showFeedback(message, type) {
//     console.log(`Feedback: ${message} (${type})`);
//     const feedback = document.getElementById('modalFeedback');
//     if (feedback) {
//         feedback.textContent = message;
//         feedback.className = `alert alert-${type} alert-dismissible fade show`;
//         feedback.style.display = 'block';
//         setTimeout(() => {
//             feedback.style.display = 'none';
//         }, 3000);
//     } else {
//         console.warn('Elemento #modalFeedback não encontrado no DOM');
//     }
// }

// // Manipular eventos do modal
// document.addEventListener('DOMContentLoaded', () => {
//     const modalElement = document.getElementById('vinculoModal');
//     if (!modalElement) {
//         console.error('Elemento #vinculoModal não encontrado no DOM');
//         return;
//     }

//     // Resetar formulário ao abrir modal para novo vínculo
//     modalElement.addEventListener('show.bs.modal', (event) => {
//         if (event.relatedTarget.id === 'newVinculoBtn') {
//             console.log('Modal aberto para novo vínculo');
//             document.getElementById('vinculoForm').reset();
//             document.getElementById('pd_id').value = '';
//             document.getElementById('vinculoModalLabel').textContent = 'Cadastrar Novo Vínculo';
//             document.getElementById('submitButton').textContent = 'Cadastrar';
//             document.getElementById('modalFeedback').style.display = 'none';
//             loadProfessoresSelect();
//             loadDisciplinasSelect();
//         }
//     });

//     // Resetar formulário ao fechar modal
//     modalElement.addEventListener('hidden.bs.modal', () => {
//         console.log('Modal fechado, resetando formulário');
//         document.getElementById('vinculoForm').reset();
//         document.getElementById('pd_id').value = '';
//         document.getElementById('vinculoModalLabel').textContent = 'Cadastrar Novo Vínculo';
//         document.getElementById('submitButton').textContent = 'Cadastrar';
//         document.getElementById('modalFeedback').style.display = 'none';
//     });

//     // Manipular envio do formulário
//     document.getElementById('vinculoForm').addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const formData = new FormData(e.target);
//         const data = Object.fromEntries(formData);
//         data.professor_id = parseInt(data.professor_id);
//         data.disciplina_id = parseInt(data.disciplina_id);
//         const url = data.pd_id ? `/api/professor_disciplina/${data.pd_id}` : '/api/professor_disciplina';

//         try {
//             console.log('Enviando formulário:', data);
//             const response = await fetch(url, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//                 credentials: 'include', // Adicionado para garantir autenticação
//                 body: new URLSearchParams(data).toString()
//             });
//             const result = await response.json();
//             if (response.ok) {
//                 document.getElementById('vinculoForm').reset();
//                 document.getElementById('pd_id').value = '';
//                 bootstrap.Modal.getInstance(modalElement).hide();
//                 loadVinculos();
//                 showFeedback(data.pd_id ? 'Vínculo atualizado com sucesso!' : 'Vínculo criado com sucesso!', 'success');
//             } else {
//                 showFeedback(result.error || 'Erro ao salvar vínculo', 'danger');
//             }
//         } catch (error) {
//             console.error('Erro ao enviar formulário:', error);
//             showFeedback('Erro ao salvar vínculo: ' + error.message, 'danger');
//         }
//     });

//     // Abrir modal para novo vínculo
//     document.getElementById('newVinculoBtn').addEventListener('click', () => {
//         const modal = new bootstrap.Modal(modalElement);
//         modal.show();
//     });

//     // Carregar vínculos e selects ao iniciar
//     console.log('Inicializando carregamento de dados...');
//     loadUserGreeting();
//     loadVinculos();
//     loadProfessoresSelect();
//     loadDisciplinasSelect();
// });

// // Função de logout
// function logout() {
//     fetch('/api/logout', {
//         method: 'POST',
//         credentials: 'include'
//     })
//         .then(() => {
//             window.location.href = '/login.html';
//         })
//         .catch(error => {
//             console.error('Erro ao fazer logout:', error);
//         });
// }

// // // public/js/professor_disciplina.js
// // // Carregar nome do usuário
// // async function loadUserGreeting() {
// //     try {
// //         console.log('Carregando usuário...');
// //         const response = await fetch('/api/usuarios/user', {
// //             method: 'GET',
// //             credentials: 'include'
// //         });
// //         console.log('Resposta do endpoint /api/usuarios/user:', response.status, response.statusText);
// //         if (!response.ok) {
// //             if (response.status === 401 || response.status === 403) {
// //                 console.warn('Usuário não autenticado, redirecionando para login...');
// //                 window.location.href = '/login.html';
// //                 throw new Error('Não autenticado');
// //             }
// //             throw new Error(`Erro HTTP! Status: ${response.status}`);
// //         }
// //         const data = await response.json();
// //         console.log('Dados do usuário:', data);
// //         const userGreeting = document.getElementById('user-greeting');
// //         if (!userGreeting) {
// //             throw new Error('Elemento #user-greeting não encontrado no DOM');
// //         }
// //         userGreeting.textContent = `Bem-vindo, ${data.usr_nom}`;
// //     } catch (error) {
// //         console.error('Erro ao carregar usuário:', error);
// //         window.location.href = '/login.html';
// //     }
// // }

// // // fetch('/api/user', { credentials: 'include' })
// // //     .then(response => {
// // //         if (!response.ok) {
// // //             window.location.href = '/login.html';
// // //             throw new Error('Não autenticado');
// // //         }
// // //         return response.json();
// // //     })
// // //     .then(data => {
// // //         document.getElementById('user-greeting').textContent = `Bem-vindo, ${data.usr_nom}`;
// // //     })
// // //     .catch(error => {
// // //         console.error('Erro ao carregar usuário:', error);
// // //         window.location.href = '/login.html';
// // //     });

// // // Carregar professores no select
// // async function loadProfessoresSelect() {
// //     try {
// //         console.log('Carregando professores para o select...');
// //         const response = await fetch('/api/professores');
// //         const data = await response.json();
// //         const select = document.getElementById('professor_id');
// //         select.innerHTML = '<option value="">Selecione um professor</option>';
// //         data.professores.filter(p => p.ativo).forEach(prof => {
// //             const option = document.createElement('option');
// //             option.value = prof.pro_id;
// //             option.text = `${prof.pro_nom} ${prof.pro_sob}`;
// //             select.appendChild(option);
// //         });
// //     } catch (error) {
// //         console.error('Erro ao carregar professores:', error);
// //         showFeedback('Erro ao carregar professores: ' + error.message, 'danger');
// //     }
// // }

// // // Carregar disciplinas no select
// // async function loadDisciplinasSelect() {
// //     try {
// //         console.log('Carregando disciplinas para o select...');
// //         const response = await fetch('/api/disciplinas');
// //         const data = await response.json();
// //         const select = document.getElementById('disciplina_id');
// //         select.innerHTML = '<option value="">Selecione uma disciplina</option>';
// //         data.disciplinas.filter(d => d.ativo).forEach(dis => {
// //             const option = document.createElement('option');
// //             option.value = dis.dis_id;
// //             option.text = dis.dis_nom;
// //             select.appendChild(option);
// //         });
// //     } catch (error) {
// //         console.error('Erro ao carregar disciplinas:', error);
// //         showFeedback('Erro ao carregar disciplinas: ' + error.message, 'danger');
// //     }
// // }

// // // Carregar a lista de vínculos
// // async function loadVinculos() {
// //     try {
// //         console.log('Carregando vínculos...');
// //         const response = await fetch('/api/professor_disciplina');
// //         const data = await response.json();
// //         const tableBody = document.getElementById('vinculosTable');
// //         tableBody.innerHTML = '';
// //         data.vinculos.forEach(vinc => {
// //             const row = document.createElement('tr');
// //             row.innerHTML = `
// //                 <td>${vinc.pd_id}</td>
// //                 <td>${vinc.professor_nome}</td>
// //                 <td>${vinc.disciplina_nome}</td>
// //                 <td>${vinc.ativo ? 'Sim' : 'Não'}</td>
// //                 <td>
// //                     <button class="btn btn-sm btn-primary" onclick="editVinculo(${vinc.pd_id})"><i class="fas fa-edit"></i> Editar</button>
// //                     <button class="btn btn-sm btn-danger" onclick="deleteVinculo(${vinc.pd_id}, ${vinc.ativo})">
// //                         <i class="fas fa-${vinc.ativo ? 'trash' : 'undo'}"></i> ${vinc.ativo ? 'Desativar' : 'Reativar'}
// //                     </button>
// //                 </td>
// //             `;
// //             tableBody.appendChild(row);
// //         });
// //     } catch (error) {
// //         console.error('Erro ao carregar vínculos:', error);
// //         showFeedback('Erro ao carregar vínculos: ' + error.message, 'danger');
// //     }
// // }

// // // Abrir modal de edição
// // async function editVinculo(id) {
// //     try {
// //         console.log(`Carregando vínculo ${id} para edição`);
// //         const response = await fetch(`/api/professor_disciplina/${id}`);
// //         if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);
// //         const data = await response.json();
// //         const vinc = data.vinculo;
// //         document.getElementById('pd_id').value = vinc.pd_id;
// //         document.getElementById('professor_id').value = vinc.professor_id;
// //         document.getElementById('disciplina_id').value = vinc.disciplina_id;
// //         document.getElementById('vinculoModalLabel').textContent = 'Editar Vínculo';
// //         document.getElementById('submitButton').textContent = 'Atualizar';
// //         const modal = new bootstrap.Modal(document.getElementById('vinculoModal'));
// //         modal.show();
// //         console.log('Modal de edição aberto');
// //     } catch (error) {
// //         console.error('Erro ao editar vínculo:', error);
// //         showFeedback('Erro ao carregar vínculo: ' + error.message, 'danger');
// //     }
// // }

// // // Desativar/reativar vínculo
// // async function deleteVinculo(id, ativo) {
// //     const action = ativo ? 'desativar' : 'reativar';
// //     if (confirm(`Tem certeza que deseja ${action} este vínculo?`)) {
// //         try {
// //             console.log(`Tentando ${action} vínculo ID: ${id}`);
// //             await fetch(`/api/professor_disciplina/${id}/${ativo ? 'deactivate' : 'reactivate'}`, { method: 'POST' });
// //             loadVinculos();
// //             showFeedback(`Vínculo ${action}do com sucesso!`, 'success');
// //         } catch (error) {
// //             console.error(`Erro ao ${action} vínculo:`, error);
// //             showFeedback(`Erro ao ${action} vínculo: ${error.message}`, 'danger');
// //         }
// //     }
// // }

// // // Exibir feedback no modal
// // function showFeedback(message, type) {
// //     console.log(`Feedback: ${message} (${type})`);
// //     const feedback = document.getElementById('modalFeedback');
// //     feedback.textContent = message;
// //     feedback.className = `alert alert-${type} alert-dismissible fade show`;
// //     feedback.style.display = 'block';
// //     setTimeout(() => {
// //         feedback.style.display = 'none';
// //     }, 3000);
// // }

// // // Manipular eventos do modal
// // document.addEventListener('DOMContentLoaded', () => {
// //     const modalElement = document.getElementById('vinculoModal');

// //     // Resetar formulário ao abrir modal para novo vínculo
// //     modalElement.addEventListener('show.bs.modal', (event) => {
// //         if (event.relatedTarget.id === 'newVinculoBtn') {
// //             console.log('Modal aberto para novo vínculo');
// //             document.getElementById('vinculoForm').reset();
// //             document.getElementById('pd_id').value = '';
// //             document.getElementById('vinculoModalLabel').textContent = 'Cadastrar Novo Vínculo';
// //             document.getElementById('submitButton').textContent = 'Cadastrar';
// //             document.getElementById('modalFeedback').style.display = 'none';
// //             loadProfessoresSelect();
// //             loadDisciplinasSelect();
// //         }
// //     });

// //     // Resetar formulário ao fechar modal
// //     modalElement.addEventListener('hidden.bs.modal', () => {
// //         console.log('Modal fechado, resetando formulário');
// //         document.getElementById('vinculoForm').reset();
// //         document.getElementById('pd_id').value = '';
// //         document.getElementById('vinculoModalLabel').textContent = 'Cadastrar Novo Vínculo';
// //         document.getElementById('submitButton').textContent = 'Cadastrar';
// //         document.getElementById('modalFeedback').style.display = 'none';
// //     });

// //     // Manipular envio do formulário
// //     document.getElementById('vinculoForm').addEventListener('submit', async (e) => {
// //         e.preventDefault();
// //         const formData = new FormData(e.target);
// //         const data = Object.fromEntries(formData);
// //         data.professor_id = parseInt(data.professor_id);
// //         data.disciplina_id = parseInt(data.disciplina_id);
// //         const url = data.pd_id ? `/api/professor_disciplina/${data.pd_id}` : '/api/professor_disciplina';

// //         try {
// //             console.log('Enviando formulário:', data);
// //             const response = await fetch(url, {
// //                 method: 'POST',
// //                 headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
// //                 body: new URLSearchParams(data).toString()
// //             });
// //             const result = await response.json();
// //             if (response.ok) {
// //                 document.getElementById('vinculoForm').reset();
// //                 document.getElementById('pd_id').value = '';
// //                 bootstrap.Modal.getInstance(modalElement).hide();
// //                 loadVinculos();
// //                 showFeedback(data.pd_id ? 'Vínculo atualizado com sucesso!' : 'Vínculo criado com sucesso!', 'success');
// //             } else {
// //                 showFeedback(result.error || 'Erro ao salvar vínculo', 'danger');
// //             }
// //         } catch (error) {
// //             console.error('Erro ao enviar formulário:', error);
// //             showFeedback('Erro ao salvar vínculo: ' + error.message, 'danger');
// //         }
// //     });

// //     // Abrir modal para novo vínculo
// //     document.getElementById('newVinculoBtn').addEventListener('click', () => {
// //         const modal = new bootstrap.Modal(modalElement);
// //         modal.show();
// //     });

// //     // Carregar vínculos e selects ao iniciar
// //     loadVinculos();
// //     loadProfessoresSelect();
// //     loadDisciplinasSelect();
// // });

// // // Função de logout
// // function logout() {
// //     fetch('/api/logout', { method: 'POST', credentials: 'include' })
// //         .then(() => {
// //             window.location.href = '/login.html';
// //         })
// //         .catch(error => {
// //             console.error('Erro ao fazer logout:', error);
// //         });
// // }