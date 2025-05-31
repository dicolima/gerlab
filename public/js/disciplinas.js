// public/js/disciplinas.js
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
            const errorText = await response.text();
            console.error('Erro na resposta:', errorText);
            throw new Error(`Erro HTTP! Status: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        console.log('Dados do usuário:', JSON.stringify(data, null, 2));
        if (!data.usr_nom) {
            console.warn('Campo usr_nom não encontrado na resposta:', data);
            throw new Error('Nome do usuário não retornado');
        }
        const userGreeting = document.getElementById('user-greeting');
        if (!userGreeting) {
            throw new Error('Elemento #user-greeting não encontrado no DOM');
        }
        userGreeting.textContent = `Bem-vindo, ${data.usr_nom}`;
        console.log('Greeting atualizado com sucesso:', userGreeting.textContent);
    } catch (error) {
        console.error('Erro ao carregar usuário:', error.message);
        window.location.href = '/login';
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
            const errorText = await response.text();
            console.error('Erro na resposta de /api/faculdades:', errorText);
            throw new Error(`Erro HTTP! Status: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        console.log('Dados de faculdades:', JSON.stringify(data, null, 2));
        if (!data.faculdades || !Array.isArray(data.faculdades)) {
            console.warn('Resposta inválida de /api/faculdades:', data);
            throw new Error('Nenhuma faculdade retornada ou formato inválido');
        }
        const select = document.getElementById('faculdade_id');
        if (!select) {
            console.error('Elemento #faculdade_id não encontrado no DOM');
            throw new Error('Elemento #faculdade_id não encontrado');
        }
        select.innerHTML = '<option value="">Selecione uma faculdade</option>';
        const activeFaculties = data.faculdades.filter(f => f.ativo);
        console.log('Faculdades ativas:', activeFaculties.length);
        activeFaculties.forEach(faculdade => {
            const option = document.createElement('option');
            option.value = faculdade.fac_id;
            option.text = faculdade.fac_cur;
            select.appendChild(option);
        });
        if (activeFaculties.length === 0) {
            console.warn('Nenhuma faculdade ativa encontrada');
            showFeedback('Nenhuma faculdade ativa disponível', 'warning');
        }
    } catch (error) {
        console.error('Erro ao carregar faculdades:', error.message);
        showFeedback('Erro ao carregar faculdades: ' + error.message, 'danger');
    }
}

// Carregar a lista de disciplinas
async function loadDisciplinas() {
    try {
        console.log('Carregando disciplinas...');
        const response = await fetch('/api/disciplinas', {
            method: 'GET',
            credentials: 'include'
        });
        console.log('Resposta do endpoint /api/disciplinas:', response.status, response.statusText);
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Dados de disciplinas:', JSON.stringify(data, null, 2));
        const tableBody = document.getElementById('disciplinasTable');
        if (!tableBody) {
            throw new Error('Elemento #disciplinasTable não encontrado');
        }
        tableBody.innerHTML = '';
        data.disciplinas.forEach(dis => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${dis.dis_id}</td>
                <td>${dis.dis_per || ''}</td>
                <td>${dis.dis_mod || ''}</td>
                <td>${dis.dis_ano || ''}</td>
                <td>${dis.dis_nom}</td>
                <td>${dis.faculdade_nome || 'N/A'}</td>
                <td>${dis.ativo ? 'Sim' : 'Não'}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editDisciplina(${dis.dis_id})"><i class="fas fa-edit"></i> Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteDisciplina(${dis.dis_id}, ${dis.ativo})">
                        <i class="fas fa-${dis.ativo ? 'trash' : 'undo'}"></i> ${dis.ativo ? 'Desativar' : 'Reativar'}
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar disciplinas:', error);
        showFeedback('Erro ao carregar disciplinas: ' + error.message, 'danger');
    }
}

// Abrir modal de edição
async function editDisciplina(id) {
    try {
        console.log(`Carregando disciplina ${id} para edição`);
        const response = await fetch(`/api/disciplinas/${id}`, {
            method: 'GET',
            credentials: 'include'
        });
        console.log('Resposta do endpoint /api/disciplinas/:id:', response.status, response.statusText);
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Dados da disciplina:', data);
        const dis = data.disciplina;
        document.getElementById('dis_id').value = dis.dis_id;
        document.getElementById('dis_per').value = dis.dis_per || '';
        document.getElementById('dis_mod').value = dis.dis_mod || '';
        document.getElementById('dis_ano').value = dis.dis_ano || '';
        document.getElementById('dis_nom').value = dis.dis_nom;
        document.getElementById('faculdade_id').value = dis.faculdade_id;
        document.getElementById('disciplinaModalLabel').textContent = 'Editar Disciplina';
        document.getElementById('submitButton').textContent = 'Atualizar';
        const modal = new bootstrap.Modal(document.getElementById('disciplinaModal'));
        modal.show();
        await loadFaculdadesSelect();
        console.log('Modal de edição aberto');
    } catch (error) {
        console.error('Erro ao editar disciplina:', error);
        showFeedback('Erro ao carregar disciplina: ' + error.message, 'danger');
    }
}

// Desativar/reativar disciplina
async function deleteDisciplina(id, ativo) {
    const action = ativo ? 'desativar' : 'reativar';
    if (confirm(`Tem certeza que deseja ${action} esta disciplina?`)) {
        try {
            console.log(`Tentando ${action} disciplina ID: ${id}`);
            const response = await fetch(`/api/disciplinas/${id}/${ativo ? 'deactivate' : 'reactivate'}`, {
                method: 'POST',
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`Erro HTTP! Status: ${response.status}`);
            }
            loadDisciplinas();
            showFeedback(`Disciplina ${action}da com sucesso!`, 'success');
        } catch (error) {
            console.error(`Erro ao ${action} disciplina:`, error);
            showFeedback(`Erro ao ${action} disciplina: ${error.message}`, 'danger');
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
        console.warn('Elemento #modalFeedback não encontrado');
    }
}

// Função de logout
function logout() {
    fetch('/api/usuarios/logout', {
        method: 'POST',
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

// Manipular eventos do modal
document.addEventListener('DOMContentLoaded', () => {
    const modalElement = document.getElementById('disciplinaModal');
    if (!modalElement) {
        console.error('Elemento #disciplinaModal não encontrado');
        return;
    }

    modalElement.addEventListener('show.bs.modal', async (event) => {
        console.log('Modal sendo aberto, relatedTarget:', event.relatedTarget ? event.relatedTarget.id : 'undefined');
        const form = document.getElementById('disciplinaForm');
        const feedback = document.getElementById('modalFeedback');
        const modalLabel = document.getElementById('disciplinaModalLabel');
        const submitButton = document.getElementById('submitButton');

        // Não resetar aqui; mover para newDisciplinaBtn
        try {
            await loadFaculdadesSelect();
            console.log('loadFaculdadesSelect concluído');
        } catch (error) {
            console.error('Erro no show.bs.modal:', error);
            showFeedback('Erro ao preparar o modal: ' + error.message, 'danger');
        }
    });

    modalElement.addEventListener('hidden.bs.modal', () => {
        console.log('Modal fechado, resetando formulário');
        const form = document.getElementById('disciplinaForm');
        const feedback = document.getElementById('modalFeedback');
        const modalLabel = document.getElementById('disciplinaModalLabel');
        const submitButton = document.getElementById('submitButton');
        form.reset();
        document.getElementById('dis_id').value = '';
        modalLabel.textContent = 'Cadastrar Nova Disciplina';
        submitButton.textContent = 'Cadastrar';
        if (feedback) feedback.style.display = 'none';
    });

    document.getElementById('disciplinaForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        data.faculdade_id = parseInt(data.faculdade_id);
        data.dis_per = data.dis_per ? parseInt(data.dis_per) : null;
        data.dis_mod = data.dis_mod ? parseInt(data.dis_mod) : null;
        data.dis_ano = data.dis_ano ? parseInt(data.dis_ano) : null;
        const url = data.dis_id ? `/api/disciplinas/${data.dis_id}` : '/api/disciplinas';
        try {
            console.log('Enviando formulário:', data);
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include'
            });
            console.log('Resposta do endpoint /api/disciplinas:', response.status, response.statusText);
            const result = await response.json();
            if (response.ok) {
                document.getElementById('disciplinaForm').reset();
                document.getElementById('dis_id').value = '';
                bootstrap.Modal.getInstance(modalElement).hide();
                loadDisciplinas();
                showFeedback(data.dis_id ? 'Disciplina atualizada com sucesso!' : 'Disciplina criada com sucesso!', 'success');
            } else {
                showFeedback(result.error || 'Erro ao salvar disciplina', 'danger');
            }
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            showFeedback('Erro ao salvar disciplina: ' + error.message, 'danger');
        }
    });

    document.getElementById('newDisciplinaBtn').addEventListener('click', async () => {
        console.log('Botão Nova Disciplina clicado');
        const form = document.getElementById('disciplinaForm');
        const feedback = document.getElementById('modalFeedback');
        const modalLabel = document.getElementById('disciplinaModalLabel');
        const submitButton = document.getElementById('submitButton');

        form.reset();
        document.getElementById('dis_id').value = '';
        modalLabel.textContent = 'Cadastrar Nova Disciplina';
        submitButton.textContent = 'Cadastrar';
        if (feedback) feedback.style.display = 'none';

        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        // Chamar loadFaculdadesSelect após abrir o modal
        await loadFaculdadesSelect();
    });

    console.log('DOMContentLoaded disparado');
    loadUserGreeting();
    loadDisciplinas();
});

// // public/js/disciplinas.js
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
//                 window.location.href = '/login';
//                 throw new Error('Não autenticado');
//             }
//             const errorText = await response.text();
//             console.error('Erro na resposta:', errorText);
//             throw new Error(`Erro HTTP! Status: ${response.status} - ${errorText}`);
//         }
//         const data = await response.json();
//         console.log('Dados do usuário:', JSON.stringify(data, null, 2));
//         if (!data.usr_nom) {
//             console.warn('Campo usr_nom não encontrado na resposta:', data);
//             throw new Error('Nome do usuário não retornado');
//         }
//         const userGreeting = document.getElementById('user-greeting');
//         if (!userGreeting) {
//             throw new Error('Elemento #user-greeting não encontrado no DOM');
//         }
//         userGreeting.textContent = `Bem-vindo, ${data.usr_nom}`;
//         console.log('Greeting atualizado com sucesso:', userGreeting.textContent);
//     } catch (error) {
//         console.error('Erro ao carregar usuário:', error.message);
//         window.location.href = '/login';
//     }
// }

// // Carregar faculdades no select
// async function loadFaculdadesSelect() {
//     try {
//         console.log('Carregando faculdades para o select...');
//         const response = await fetch('/api/faculdades', {
//             method: 'GET',
//             credentials: 'include'
//         });
//         console.log('Resposta do endpoint /api/faculdades:', response.status, response.statusText);
//         if (!response.ok) {
//             const errorText = await response.text();
//             console.error('Erro na resposta de /api/faculdades:', errorText);
//             throw new Error(`Erro HTTP! Status: ${response.status} - ${errorText}`);
//         }
//         const data = await response.json();
//         console.log('Dados de faculdades:', JSON.stringify(data, null, 2));
//         if (!data.faculdades || !Array.isArray(data.faculdades)) {
//             console.warn('Resposta inválida de /api/faculdades:', data);
//             throw new Error('Nenhuma faculdade retornada ou formato inválido');
//         }
//         const select = document.getElementById('faculdade_id');
//         if (!select) {
//             console.error('Elemento #faculdade_id não encontrado no DOM');
//             throw new Error('Elemento #faculdade_id não encontrado');
//         }
//         select.innerHTML = '<option value="">Selecione uma faculdade</option>';
//         const activeFaculties = data.faculdades.filter(f => f.ativo);
//         console.log('Faculdades ativas:', activeFaculties.length);
//         activeFaculties.forEach(faculdade => {
//             const option = document.createElement('option');
//             option.value = faculdade.fac_id;
//             option.text = faculdade.fac_cur;
//             select.appendChild(option);
//         });
//         if (activeFaculties.length === 0) {
//             console.warn('Nenhuma faculdade ativa encontrada');
//             showFeedback('Nenhuma faculdade ativa disponível', 'warning');
//         }
//     } catch (error) {
//         console.error('Erro ao carregar faculdades:', error.message);
//         showFeedback('Erro ao carregar faculdades: ' + error.message, 'danger');
//     }
// }

// // Carregar a lista de disciplinas
// async function loadDisciplinas() {
//     try {
//         console.log('Carregando disciplinas...');
//         const response = await fetch('/api/disciplinas', {
//             method: 'GET',
//             credentials: 'include'
//         });
//         console.log('Resposta do endpoint /api/disciplinas:', response.status, response.statusText);
//         if (!response.ok) {
//             throw new Error(`Erro HTTP! Status: ${response.status}`);
//         }
//         const data = await response.json();
//         console.log('Dados de disciplinas:', JSON.stringify(data, null, 2));
//         const tableBody = document.getElementById('disciplinasTable');
//         if (!tableBody) {
//             throw new Error('Elemento #disciplinasTable não encontrado');
//         }
//         tableBody.innerHTML = '';
//         data.disciplinas.forEach(dis => {
//             const row = document.createElement('tr');
//             row.innerHTML = `
//                 <td>${dis.dis_id}</td>
//                 <td>${dis.dis_per || ''}</td>
//                 <td>${dis.dis_mod || ''}</td>
//                 <td>${dis.dis_ano || ''}</td>
//                 <td>${dis.dis_nom}</td>
//                 <td>${dis.faculdade_nome || 'N/A'}</td>
//                 <td>${dis.ativo ? 'Sim' : 'Não'}</td>
//                 <td>
//                     <button class="btn btn-sm btn-primary" onclick="editDisciplina(${dis.dis_id})"><i class="fas fa-edit"></i> Editar</button>
//                     <button class="btn btn-sm btn-danger" onclick="deleteDisciplina(${dis.dis_id}, ${dis.ativo})">
//                         <i class="fas fa-${dis.ativo ? 'trash' : 'undo'}"></i> ${dis.ativo ? 'Desativar' : 'Reativar'}
//                     </button>
//                 </td>
//             `;
//             tableBody.appendChild(row);
//         });
//     } catch (error) {
//         console.error('Erro ao carregar disciplinas:', error);
//         showFeedback('Erro ao carregar disciplinas: ' + error.message, 'danger');
//     }
// }

// // Abrir modal de edição
// async function editDisciplina(id) {
//     try {
//         console.log(`Carregando disciplina ${id} para edição`);
//         const response = await fetch(`/api/disciplinas/${id}`, {
//             method: 'GET',
//             credentials: 'include'
//         });
//         console.log('Resposta do endpoint /api/disciplinas/:id:', response.status, response.statusText);
//         if (!response.ok) {
//             throw new Error(`Erro HTTP! Status: ${response.status}`);
//         }
//         const data = await response.json();
//         console.log('Dados da disciplina:', data);
//         const dis = data.disciplina;
//         document.getElementById('dis_id').value = dis.dis_id;
//         document.getElementById('dis_per').value = dis.dis_per || '';
//         document.getElementById('dis_mod').value = dis.dis_mod || '';
//         document.getElementById('dis_ano').value = dis.dis_ano || '';
//         document.getElementById('dis_nom').value = dis.dis_nom;
//         document.getElementById('faculdade_id').value = dis.faculdade_id;
//         document.getElementById('disciplinaModalLabel').textContent = 'Editar Disciplina';
//         document.getElementById('submitButton').textContent = 'Atualizar';
//         const modal = new bootstrap.Modal(document.getElementById('disciplinaModal'));
//         modal.show();
//         await loadFaculdadesSelect();
//         console.log('Modal de edição aberto');
//     } catch (error) {
//         console.error('Erro ao editar disciplina:', error);
//         showFeedback('Erro ao carregar disciplina: ' + error.message, 'danger');
//     }
// }

// // Desativar/reativar disciplina
// async function deleteDisciplina(id, ativo) {
//     const action = ativo ? 'desativar' : 'reativar';
//     if (confirm(`Tem certeza que deseja ${action} esta disciplina?`)) {
//         try {
//             console.log(`Tentando ${action} disciplina ID: ${id}`);
//             const response = await fetch(`/api/disciplinas/${id}/${ativo ? 'deactivate' : 'reactivate'}`, {
//                 method: 'POST',
//                 credentials: 'include'
//             });
//             if (!response.ok) {
//                 throw new Error(`Erro HTTP! Status: ${response.status}`);
//             }
//             loadDisciplinas();
//             showFeedback(`Disciplina ${action}da com sucesso!`, 'success');
//         } catch (error) {
//             console.error(`Erro ao ${action} disciplina:`, error);
//             showFeedback(`Erro ao ${action} disciplina: ${error.message}`, 'danger');
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
//         console.warn('Elemento #modalFeedback não encontrado');
//     }
// }

// // Função de logout
// function logout() {
//     fetch('/api/usuarios/logout', {
//         method: 'POST',
//         credentials: 'include'
//     })
//     .then(() => {
//         window.location.href = '/login';
//     })
//     .catch(error => {
//         console.error('Erro ao fazer logout:', error);
//         window.location.href = '/login';
//     });
// }

// // Manipular eventos do modal
// document.addEventListener('DOMContentLoaded', () => {
//     const modalElement = document.getElementById('disciplinaModal');
//     if (!modalElement) {
//         console.error('Elemento #disciplinaModal não encontrado');
//         return;
//     }

//     modalElement.addEventListener('show.bs.modal', async (event) => {
//         console.log('Modal sendo aberto, relatedTarget:', event.relatedTarget.id);
//         const form = document.getElementById('disciplinaForm');
//         const feedback = document.getElementById('modalFeedback');
//         const modalLabel = document.getElementById('disciplinaModalLabel');
//         const submitButton = document.getElementById('submitButton');
        
//         // Garantir que o modal está visível antes de manipular o select
//         setTimeout(async () => {
//             try {
//                 if (event.relatedTarget.id === 'newDisciplinaBtn') {
//                     console.log('Modal aberto para nova disciplina');
//                     form.reset();
//                     document.getElementById('dis_id').value = '';
//                     modalLabel.textContent = 'Cadastrar Nova Disciplina';
//                     submitButton.textContent = 'Cadastrar';
//                     if (feedback) feedback.style.display = 'none';
//                 }
//                 console.log('Chamando loadFaculdadesSelect...');
//                 await loadFaculdadesSelect();
//                 console.log('loadFaculdadesSelect concluído');
//             } catch (error) {
//                 console.error('Erro no show.bs.modal:', error);
//                 showFeedback('Erro ao preparar o modal: ' + error.message, 'danger');
//             }
//         }, 0);
//     });

//     modalElement.addEventListener('hidden.bs.modal', () => {
//         console.log('Modal fechado, resetando formulário');
//         const form = document.getElementById('disciplinaForm');
//         const feedback = document.getElementById('modalFeedback');
//         const modalLabel = document.getElementById('disciplinaModalLabel');
//         const submitButton = document.getElementById('submitButton');
//         form.reset();
//         document.getElementById('dis_id').value = '';
//         modalLabel.textContent = 'Cadastrar Nova Disciplina';
//         submitButton.textContent = 'Cadastrar';
//         if (feedback) feedback.style.display = 'none';
//     });

//     document.getElementById('disciplinaForm').addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const formData = new FormData(e.target);
//         const data = Object.fromEntries(formData);
//         data.faculdade_id = parseInt(data.faculdade_id);
//         data.dis_per = data.dis_per ? parseInt(data.dis_per) : null;
//         data.dis_mod = data.dis_mod ? parseInt(data.dis_mod) : null;
//         data.dis_ano = data.dis_ano ? parseInt(data.dis_ano) : null;
//         const url = data.dis_id ? `/api/disciplinas/${data.dis_id}` : '/api/disciplinas';
//         try {
//             console.log('Enviando formulário:', data);
//             const response = await fetch(url, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(data),
//                 credentials: 'include'
//             });
//             console.log('Resposta do endpoint /api/disciplinas:', response.status, response.statusText);
//             const result = await response.json();
//             if (response.ok) {
//                 document.getElementById('disciplinaForm').reset();
//                 document.getElementById('dis_id').value = '';
//                 bootstrap.Modal.getInstance(modalElement).hide();
//                 loadDisciplinas();
//                 showFeedback(data.dis_id ? 'Disciplina atualizada com sucesso!' : 'Disciplina criada com sucesso!', 'success');
//             } else {
//                 showFeedback(result.error || 'Erro ao salvar disciplina', 'danger');
//             }
//         } catch (error) {
//             console.error('Erro ao enviar formulário:', error);
//             showFeedback('Erro ao salvar disciplina: ' + error.message, 'danger');
//         }
//     });

//     document.getElementById('newDisciplinaBtn').addEventListener('click', () => {
//         console.log('Botão Nova Disciplina clicado');
//         const modal = new bootstrap.Modal(modalElement);
//         modal.show();
//     });

//     console.log('DOMContentLoaded disparado');
//     loadUserGreeting();
//     loadDisciplinas();
// });

// // // public/js/disciplinas.js
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
// //                 window.location.href = '/login';
// //                 throw new Error('Não autenticado');
// //             }
// //             const errorText = await response.text();
// //             console.error('Erro na resposta:', errorText);
// //             throw new Error(`Erro HTTP! Status: ${response.status} - ${errorText}`);
// //         }
// //         const data = await response.json();
// //         console.log('Dados do usuário:', JSON.stringify(data, null, 2));
// //         if (!data.usr_nom) {
// //             console.warn('Campo usr_nom não encontrado na resposta:', data);
// //             throw new Error('Nome do usuário não retornado');
// //         }
// //         const userGreeting = document.getElementById('user-greeting');
// //         if (!userGreeting) {
// //             throw new Error('Elemento #user-greeting não encontrado no DOM');
// //         }
// //         userGreeting.textContent = `Bem-vindo, ${data.usr_nom}`;
// //         console.log('Greeting atualizado com sucesso:', userGreeting.textContent);
// //     } catch (error) {
// //         console.error('Erro ao carregar usuário:', error.message);
// //         window.location.href = '/login';
// //     }
// // }

// // // Carregar faculdades no select
// // async function loadFaculdadesSelect() {
// //     try {
// //         console.log('Carregando faculdades para o select...');
// //         const response = await fetch('/api/faculdades', {
// //             method: 'GET',
// //             credentials: 'include'
// //         });
// //         console.log('Resposta do endpoint /api/faculdades:', response.status, response.statusText);
// //         if (!response.ok) {
// //             throw new Error(`Erro HTTP! Status: ${response.status}`);
// //         }
// //         const data = await response.json();
// //         console.log('Dados de faculdades:', JSON.stringify(data, null, 2));
// //         const select = document.getElementById('faculdade_id');
// //         if (!select) {
// //             throw new Error('Elemento #faculdade_id não encontrado');
// //         }
// //         select.innerHTML = '<option value="">Selecione uma faculdade</option>';
// //         data.faculdades.filter(f => f.ativo).forEach(faculdade => {
// //             const option = document.createElement('option');
// //             option.value = faculdade.fac_id;
// //             option.text = faculdade.fac_cur;
// //             select.appendChild(option);
// //         });
// //     } catch (error) {
// //         console.error('Erro ao carregar faculdades:', error);
// //         showFeedback('Erro ao carregar faculdades: ' + error.message, 'danger');
// //     }
// // }

// // // Carregar a lista de disciplinas
// // async function loadDisciplinas() {
// //     try {
// //         console.log('Carregando disciplinas...');
// //         const response = await fetch('/api/disciplinas', {
// //             method: 'GET',
// //             credentials: 'include'
// //         });
// //         console.log('Resposta do endpoint /api/disciplinas:', response.status, response.statusText);
// //         if (!response.ok) {
// //             throw new Error(`Erro HTTP! Status: ${response.status}`);
// //         }
// //         const data = await response.json();
// //         console.log('Dados de disciplinas:', JSON.stringify(data, null, 2));
// //         const tableBody = document.getElementById('disciplinasTable');
// //         if (!tableBody) {
// //             throw new Error('Elemento #disciplinasTable não encontrado');
// //         }
// //         tableBody.innerHTML = '';
// //         data.disciplinas.forEach(dis => {
// //             const row = document.createElement('tr');
// //             row.innerHTML = `
// //                 <td>${dis.dis_id}</td>
// //                 <td>${dis.dis_per || ''}</td>
// //                 <td>${dis.dis_mod || ''}</td>
// //                 <td>${dis.dis_ano || ''}</td>
// //                 <td>${dis.dis_nom}</td>
// //                 <td>${dis.faculdade_nome || 'N/A'}</td>
// //                 <td>${dis.ativo ? 'Sim' : 'Não'}</td>
// //                 <td>
// //                     <button class="btn btn-sm btn-primary" onclick="editDisciplina(${dis.dis_id})"><i class="fas fa-edit"></i> Editar</button>
// //                     <button class="btn btn-sm btn-danger" onclick="deleteDisciplina(${dis.dis_id}, ${dis.ativo})">
// //                         <i class="fas fa-${dis.ativo ? 'trash' : 'undo'}"></i> ${dis.ativo ? 'Desativar' : 'Reativar'}
// //                     </button>
// //                 </td>
// //             `;
// //             tableBody.appendChild(row);
// //         });
// //     } catch (error) {
// //         console.error('Erro ao carregar disciplinas:', error);
// //         showFeedback('Erro ao carregar disciplinas: ' + error.message, 'danger');
// //     }
// // }

// // // Abrir modal de edição
// // async function editDisciplina(id) {
// //     try {
// //         console.log(`Carregando disciplina ${id} para edição`);
// //         const response = await fetch(`/api/disciplinas/${id}`, {
// //             method: 'GET',
// //             credentials: 'include'
// //         });
// //         console.log('Resposta do endpoint /api/disciplinas/:id:', response.status, response.statusText);
// //         if (!response.ok) {
// //             throw new Error(`Erro HTTP! Status: ${response.status}`);
// //         }
// //         const data = await response.json();
// //         console.log('Dados da disciplina:', data);
// //         const dis = data.disciplina;
// //         document.getElementById('dis_id').value = dis.dis_id;
// //         document.getElementById('dis_per').value = dis.dis_per || '';
// //         document.getElementById('dis_mod').value = dis.dis_mod || '';
// //         document.getElementById('dis_ano').value = dis.dis_ano || '';
// //         document.getElementById('dis_nom').value = dis.dis_nom;
// //         document.getElementById('faculdade_id').value = dis.faculdade_id;
// //         document.getElementById('disciplinaModalLabel').textContent = 'Editar Disciplina';
// //         document.getElementById('submitButton').textContent = 'Atualizar';
// //         const modal = new bootstrap.Modal(document.getElementById('disciplinaModal'));
// //         modal.show();
// //         await loadFaculdadesSelect();
// //         console.log('Modal de edição aberto');
// //     } catch (error) {
// //         console.error('Erro ao editar disciplina:', error);
// //         showFeedback('Erro ao carregar disciplina: ' + error.message, 'danger');
// //     }
// // }

// // // Desativar/reativar disciplina
// // async function deleteDisciplina(id, ativo) {
// //     const action = ativo ? 'desativar' : 'reativar';
// //     if (confirm(`Tem certeza que deseja ${action} esta disciplina?`)) {
// //         try {
// //             console.log(`Tentando ${action} disciplina ID: ${id}`);
// //             const response = await fetch(`/api/disciplinas/${id}/${ativo ? 'deactivate' : 'reactivate'}`, {
// //                 method: 'POST',
// //                 credentials: 'include'
// //             });
// //             if (!response.ok) {
// //                 throw new Error(`Erro HTTP! Status: ${response.status}`);
// //             }
// //             loadDisciplinas();
// //             showFeedback(`Disciplina ${action}da com sucesso!`, 'success');
// //         } catch (error) {
// //             console.error(`Erro ao ${action} disciplina:`, error);
// //             showFeedback(`Erro ao ${action} disciplina: ${error.message}`, 'danger');
// //         }
// //     }
// // }

// // // Exibir feedback no modal
// // function showFeedback(message, type) {
// //     console.log(`Feedback: ${message} (${type})`);
// //     const feedback = document.getElementById('modalFeedback');
// //     if (feedback) {
// //         feedback.textContent = message;
// //         feedback.className = `alert alert-${type} alert-dismissible fade show`;
// //         feedback.style.display = 'block';
// //         setTimeout(() => {
// //             feedback.style.display = 'none';
// //         }, 3000);
// //     }
// // }

// // // Função de logout
// // function logout() {
// //     fetch('/api/usuarios/logout', {
// //         method: 'POST',
// //         credentials: 'include'
// //     })
// //     .then(() => {
// //         window.location.href = '/login';
// //     })
// //     .catch(error => {
// //         console.error('Erro ao fazer logout:', error);
// //         window.location.href = '/login';
// //     });
// // }

// // // Manipular eventos do modal
// // document.addEventListener('DOMContentLoaded', () => {
// //     const modalElement = document.getElementById('disciplinaModal');
// //     if (!modalElement) {
// //         console.error('Elemento #disciplinaModal não encontrado');
// //         return;
// //     }

// //     modalElement.addEventListener('show.bs.modal', async (event) => {
// //         console.log('Modal sendo aberto, relatedTarget:', event.relatedTarget.id);
// //         const form = document.getElementById('disciplinaForm');
// //         const feedback = document.getElementById('modalFeedback');
// //         const modalLabel = document.getElementById('disciplinaModalLabel');
// //         const submitButton = document.getElementById('submitButton');
        
// //         if (event.relatedTarget.id === 'newDisciplinaBtn') {
// //             console.log('Modal aberto para nova disciplina');
// //             form.reset();
// //             document.getElementById('dis_id').value = '';
// //             modalLabel.textContent = 'Cadastrar Nova Disciplina';
// //             submitButton.textContent = 'Cadastrar';
// //             if (feedback) feedback.style.display = 'none';
// //         }
// //         await loadFaculdadesSelect();
// //     });

// //     modalElement.addEventListener('hidden.bs.modal', () => {
// //         console.log('Modal fechado, resetando formulário');
// //         const form = document.getElementById('disciplinaForm');
// //         const feedback = document.getElementById('modalFeedback');
// //         const modalLabel = document.getElementById('disciplinaModalLabel');
// //         const submitButton = document.getElementById('submitButton');
// //         form.reset();
// //         document.getElementById('dis_id').value = '';
// //         modalLabel.textContent = 'Cadastrar Nova Disciplina';
// //         submitButton.textContent = 'Cadastrar';
// //         if (feedback) feedback.style.display = 'none';
// //     });

// //     document.getElementById('disciplinaForm').addEventListener('submit', async (e) => {
// //         e.preventDefault();
// //         const formData = new FormData(e.target);
// //         const data = Object.fromEntries(formData);
// //         data.faculdade_id = parseInt(data.faculdade_id);
// //         data.dis_per = data.dis_per ? parseInt(data.dis_per) : null;
// //         data.dis_mod = data.dis_mod ? parseInt(data.dis_mod) : null;
// //         data.dis_ano = data.dis_ano ? parseInt(data.dis_ano) : null;
// //         const url = data.dis_id ? `/api/disciplinas/${data.dis_id}` : '/api/disciplinas';
// //         try {
// //             console.log('Enviando formulário:', data);
// //             const response = await fetch(url, {
// //                 method: 'POST',
// //                 headers: { 'Content-Type': 'application/json' },
// //                 body: JSON.stringify(data),
// //                 credentials: 'include'
// //             });
// //             console.log('Resposta do endpoint /api/disciplinas:', response.status, response.statusText);
// //             const result = await response.json();
// //             if (response.ok) {
// //                 document.getElementById('disciplinaForm').reset();
// //                 document.getElementById('dis_id').value = '';
// //                 bootstrap.Modal.getInstance(modalElement).hide();
// //                 loadDisciplinas();
// //                 showFeedback(data.dis_id ? 'Disciplina atualizada com sucesso!' : 'Disciplina criada com sucesso!', 'success');
// //             } else {
// //                 showFeedback(result.error || 'Erro ao salvar disciplina', 'danger');
// //             }
// //         } catch (error) {
// //             console.error('Erro ao enviar formulário:', error);
// //             showFeedback('Erro ao salvar disciplina: ' + error.message, 'danger');
// //         }
// //     });

// //     document.getElementById('newDisciplinaBtn').addEventListener('click', () => {
// //         console.log('Botão Nova Disciplina clicado');
// //         const modal = new bootstrap.Modal(modalElement);
// //         modal.show();
// //     });

// //     console.log('DOMContentLoaded disparado');
// //     loadUserGreeting();
// //     loadDisciplinas();
// // });

// // // // public/js/disciplinas.js
// // // // Carregar nome do usuário
// // // async function loadUserGreeting() {
// // //     try {
// // //         console.log('Carregando usuário...');
// // //         const response = await fetch('/api/usuarios/user', {
// // //             method: 'GET',
// // //             credentials: 'include'
// // //         });
// // //         console.log('Resposta do endpoint /api/usuarios/user:', response.status, response.statusText);
// // //         if (!response.ok) {
// // //             if (response.status === 401 || response.status === 403) {
// // //                 console.warn('Usuário não autenticado, redirecionando para login...');
// // //                 window.location.href = '/login';
// // //                 throw new Error('Não autenticado');
// // //             }
// // //             const errorText = await response.text();
// // //             console.error('Erro na resposta:', errorText);
// // //             throw new Error(`Erro HTTP! Status: ${response.status} - ${errorText}`);
// // //         }
// // //         const data = await response.json();
// // //         console.log('Dados do usuário:', JSON.stringify(data, null, 2));
// // //         if (!data.usr_nom) {
// // //             console.warn('Campo usr_nom não encontrado na resposta:', data);
// // //             throw new Error('Nome do usuário não retornado');
// // //         }
// // //         const userGreeting = document.getElementById('user-greeting');
// // //         if (!userGreeting) {
// // //             throw new Error('Elemento #user-greeting não encontrado no DOM');
// // //         }
// // //         userGreeting.textContent = `Bem-vindo, ${data.usr_nom}`;
// // //         console.log('Greeting atualizado com sucesso:', userGreeting.textContent);
// // //     } catch (error) {
// // //         console.error('Erro ao carregar usuário:', error.message);
// // //         window.location.href = '/login';
// // //     }
// // // }

// // // // // Carregar nome do usuário
// // // // async function loadUserGreeting() {
// // // //     try {
// // // //         console.log('Carregando usuário...');
// // // //         const response = await fetch('/api/usuarios/user', {
// // // //             method: 'GET',
// // // //             credentials: 'include'
// // // //         });
// // // //         console.log('Resposta do endpoint /api/usuarios/user:', response.status, response.statusText);
// // // //         if (!response.ok) {
// // // //             if (response.status === 401 || response.status === 403) {
// // // //                 console.warn('Usuário não autenticado, redirecionando para login...');
// // // //                 window.location.href = '/login';
// // // //                 throw new Error('Não autenticado');
// // // //             }
// // // //             throw new Error(`Erro HTTP! Status: ${response.status}`);
// // // //         }
// // // //         const data = await response.json();
// // // //         console.log('Dados do usuário:', data);
// // // //         const userGreeting = document.getElementById('user-greeting');
// // // //         if (!userGreeting) {
// // // //             throw new Error('Elemento #user-greeting não encontrado no DOM');
// // // //         }
// // // //         userGreeting.textContent = `Bem-vindo, ${data.usr_nom}`;
// // // //     } catch (error) {
// // // //         console.error('Erro ao carregar usuário:', error);
// // // //         window.location.href = '/login';
// // // //     }
// // // // }


// // // // Carregar faculdades no select
// // // async function loadFaculdadesSelect() {
// // //     try {
// // //         console.log('Carregando faculdades para o select...');
// // //         const response = await fetch('/api/faculdades');
// // //         const data = await response.json();
// // //         const select = document.getElementById('faculdade_id');
// // //         select.innerHTML = '<option value="">Selecione uma faculdade</option>';
// // //         data.faculdades.filter(f => f.ativo).forEach(faculdade => {
// // //             const option = document.createElement('option');
// // //             option.value = faculdade.fac_id;
// // //             option.text = faculdade.fac_cur;
// // //             select.appendChild(option);
// // //         });
// // //     } catch (error) {
// // //         console.error('Erro ao carregar faculdades:', error);
// // //         showFeedback('Erro ao carregar faculdades: ' + error.message, 'danger');
// // //     }
// // // }

// // // // Carregar a lista de disciplinas
// // // async function loadDisciplinas() {
// // //     try {
// // //         console.log('Carregando disciplinas...');
// // //         const response = await fetch('/api/disciplinas');
// // //         const data = await response.json();
// // //         const tableBody = document.getElementById('disciplinasTable');
// // //         tableBody.innerHTML = '';
// // //         data.disciplinas.forEach(dis => {
// // //             const row = document.createElement('tr');
// // //             row.innerHTML = `
// // //                 <td>${dis.dis_id}</td>
// // //                 <td>${dis.dis_per || ''}</td>
// // //                 <td>${dis.dis_mod || ''}</td>
// // //                 <td>${dis.dis_ano || ''}</td>
// // //                 <td>${dis.dis_nom}</td>
// // //                 <td>${dis.faculdade_nome}</td>
// // //                 <td>${dis.ativo ? 'Sim' : 'Não'}</td>
// // //                 <td>
// // //                     <button class="btn btn-sm btn-primary" onclick="editDisciplina(${dis.dis_id})"><i class="fas fa-edit"></i> Editar</button>
// // //                     <button class="btn btn-sm btn-danger" onclick="deleteDisciplina(${dis.dis_id}, ${dis.ativo})">
// // //                         <i class="fas fa-${dis.ativo ? 'trash' : 'undo'}"></i> ${dis.ativo ? 'Desativar' : 'Reativar'}
// // //                     </button>
// // //                 </td>
// // //             `;
// // //             tableBody.appendChild(row);
// // //         });
// // //     } catch (error) {
// // //         console.error('Erro ao carregar disciplinas:', error);
// // //         showFeedback('Erro ao carregar disciplinas: ' + error.message, 'danger');
// // //     }
// // // }

// // // // Abrir modal de edição
// // // async function editDisciplina(id) {
// // //     try {
// // //         console.log(`Carregando disciplina ${id} para edição`);
// // //         const response = await fetch(`/api/disciplinas/${id}`);
// // //         if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);
// // //         const data = await response.json();
// // //         const dis = data.disciplina;
// // //         document.getElementById('dis_id').value = dis.dis_id;
// // //         document.getElementById('dis_per').value = dis.dis_per || '';
// // //         document.getElementById('dis_mod').value = dis.dis_mod || '';
// // //         document.getElementById('dis_ano').value = dis.dis_ano || '';
// // //         document.getElementById('dis_nom').value = dis.dis_nom;
// // //         document.getElementById('faculdade_id').value = dis.faculdade_id;
// // //         document.getElementById('disciplinaModalLabel').textContent = 'Editar Disciplina';
// // //         document.getElementById('submitButton').textContent = 'Atualizar';
// // //         const modal = new bootstrap.Modal(document.getElementById('disciplinaModal'));
// // //         modal.show();
// // //         console.log('Modal de edição aberto');
// // //     } catch (error) {
// // //         console.error('Erro ao editar disciplina:', error);
// // //         showFeedback('Erro ao carregar disciplina: ' + error.message, 'danger');
// // //     }
// // // }

// // // // Desativar/reativar disciplina
// // // async function deleteDisciplina(id, ativo) {
// // //     const action = ativo ? 'desativar' : 'reativar';
// // //     if (confirm(`Tem certeza que deseja ${action} esta disciplina?`)) {
// // //         try {
// // //             console.log(`Tentando ${action} disciplina ID: ${id}`);
// // //             await fetch(`/api/disciplinas/${id}/${ativo ? 'deactivate' : 'reactivate'}`, { method: 'POST' });
// // //             loadDisciplinas();
// // //             showFeedback(`Disciplina ${action}da com sucesso!`, 'success');
// // //         } catch (error) {
// // //             console.error(`Erro ao ${action} disciplina:`, error);
// // //             showFeedback(`Erro ao ${action} disciplina: ${error.message}`, 'danger');
// // //         }
// // //     }
// // // }

// // // // Exibir feedback no modal
// // // function showFeedback(message, type) {
// // //     console.log(`Feedback: ${message} (${type})`);
// // //     const feedback = document.getElementById('modalFeedback');
// // //     feedback.textContent = message;
// // //     feedback.className = `alert alert-${type} alert-dismissible fade show`;
// // //     feedback.style.display = 'block';
// // //     setTimeout(() => {
// // //         feedback.style.display = 'none';
// // //     }, 3000);
// // // }

// // // // Manipular eventos do modal
// // // document.addEventListener('DOMContentLoaded', () => {
// // //     const modalElement = document.getElementById('disciplinaModal');

// // //     // Resetar formulário ao abrir modal para nova disciplina
// // //     modalElement.addEventListener('show.bs.modal', (event) => {
// // //         if (event.relatedTarget.id === 'newDisciplinaBtn') {
// // //             console.log('Modal aberto para nova disciplina');
// // //             document.getElementById('disciplinaForm').reset();
// // //             document.getElementById('dis_id').value = '';
// // //             document.getElementById('disciplinaModalLabel').textContent = 'Cadastrar Nova Disciplina';
// // //             document.getElementById('submitButton').textContent = 'Cadastrar';
// // //             document.getElementById('modalFeedback').style.display = 'none';
// // //             loadFaculdadesSelect();
// // //         }
// // //     });

// // //     // Resetar formulário ao fechar modal
// // //     modalElement.addEventListener('hidden.bs.modal', () => {
// // //         console.log('Modal fechado, resetando formulário');
// // //         document.getElementById('disciplinaForm').reset();
// // //         document.getElementById('dis_id').value = '';
// // //         document.getElementById('disciplinaModalLabel').textContent = 'Cadastrar Nova Disciplina';
// // //         document.getElementById('submitButton').textContent = 'Cadastrar';
// // //         document.getElementById('modalFeedback').style.display = 'none';
// // //     });

// // //     // Manipular envio do formulário
// // //     document.getElementById('disciplinaForm').addEventListener('submit', async (e) => {
// // //         e.preventDefault();
// // //         const formData = new FormData(e.target);
// // //         const data = Object.fromEntries(formData);
// // //         data.faculdade_id = parseInt(data.faculdade_id);
// // //         data.dis_per = data.dis_per ? parseInt(data.dis_per) : null;
// // //         data.dis_mod = data.dis_mod ? parseInt(data.dis_mod) : null;
// // //         data.dis_ano = data.dis_ano ? parseInt(data.dis_ano) : null;
// // //         const url = data.dis_id ? `/api/disciplinas/${data.dis_id}` : '/api/disciplinas';

// // //         try {
// // //             console.log('Enviando formulário:', data);
// // //             const response = await fetch(url, {
// // //                 method: 'POST',
// // //                 headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
// // //                 body: new URLSearchParams(data).toString()
// // //             });
// // //             const result = await response.json();
// // //             if (response.ok) {
// // //                 document.getElementById('disciplinaForm').reset();
// // //                 document.getElementById('dis_id').value = '';
// // //                 bootstrap.Modal.getInstance(modalElement).hide();
// // //                 loadDisciplinas();
// // //                 showFeedback(data.dis_id ? 'Disciplina atualizada com sucesso!' : 'Disciplina criada com sucesso!', 'success');
// // //             } else {
// // //                 showFeedback(result.error || 'Erro ao salvar disciplina', 'danger');
// // //             }
// // //         } catch (error) {
// // //             console.error('Erro ao enviar formulário:', error);
// // //             showFeedback('Erro ao salvar disciplina: ' + error.message, 'danger');
// // //         }
// // //     });

// // //     // Abrir modal para nova disciplina
// // //     document.getElementById('newDisciplinaBtn').addEventListener('click', () => {
// // //         const modal = new bootstrap.Modal(modalElement);
// // //         modal.show();
// // //     });

// // //     // Carregar disciplinas e faculdades ao iniciar
// // //     loadDisciplinas();
// // //     loadFaculdadesSelect();
// // // });

// // // // Função de logout
// // // function logout() {
// // //     fetch('/api/logout', { method: 'POST', credentials: 'include' })
// // //         .then(() => {
// // //             window.location.href = '/login.html';
// // //         })
// // //         .catch(error => {
// // //             console.error('Erro ao fazer logout:', error);
// // //         });
// // // }