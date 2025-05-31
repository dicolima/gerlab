// public/js/admin.js
async function loadEntities(entity, tableId) {
    try {
        const response = await fetch(`/api/${entity}/${entity}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error(`Erro ao carregar ${entity}`);
        }
        const data = await response.json();
        const tableBody = document.getElementById(tableId);
        tableBody.innerHTML = '';
        data[entity].forEach(item => {
            const row = document.createElement('tr');
            // Ajustar colunas com base na entidade
            if (entity === 'usuarios') {
                row.innerHTML = `
                    <td>${item.usr_id}</td>
                    <td>${item.usr_nom}</td>
                    <td>${item.usr_sob}</td>
                    <td>${item.usr_eml}</td>
                    <td>${item.usr_mat}</td>
                    <td>${item.usr_pre || ''}</td>
                    <td>${item.usr_lab || ''}</td>
                    <td>${item.usr_tel || ''}</td>
                    <td>${item.usr_nvl || ''}</td>
                    <td>
                        <button onclick="editEntity('usuarios', ${item.usr_id})">Editar</button>
                        <button onclick="deleteEntity('usuarios', ${item.usr_id})">Excluir</button>
                    </td>
                `;
            } // Adicionar outros casos para 'professores', 'disciplinas', etc.
            tableBody.appendChild(row);
        });
    } catch (error) {
        document.getElementById('error').style.display = 'block';
        document.getElementById('error').textContent = `Erro ao carregar ${entity}`;
        console.error('Erro:', error);
    }
}

async function editEntity(entity, id) {
    try {
        const response = await fetch(`/api/${entity}/${entity}/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error(`Erro ao carregar ${entity}`);
        }
        const data = await response.json();
        const item = data[entity.slice(0, -1)]; // Remove 's' para singular
        if (entity === 'usuarios') {
            document.getElementById('usr_id').value = item.usr_id;
            document.getElementById('usr_nom').value = item.usr_nom;
            document.getElementById('usr_sob').value = item.usr_sob;
            document.getElementById('usr_eml').value = item.usr_eml;
            document.getElementById('usr_mat').value = item.usr_mat;
            document.getElementById('usr_pre').value = item.usr_pre || '';
            document.getElementById('usr_lab').value = item.usr_lab || '';
            document.getElementById('usr_tel').value = item.usr_tel || '';
            document.getElementById('usr_nvl').value = item.usr_nvl || '';
            document.getElementById('usr_sen').removeAttribute('required');
            document.getElementById('formTitle').textContent = 'Editar Usuário';
            document.getElementById('submitButton').textContent = 'Atualizar';
            document.getElementById('usuarioModal').style.display = 'block';
        } // Adicionar outros casos
    } catch (error) {
        document.getElementById('error').style.display = 'block';
        document.getElementById('error').textContent = `Erro ao carregar ${entity}`;
        console.error('Erro:', error);
    }
}

async function deleteEntity(entity, id) {
    if (confirm('Tem certeza que deseja excluir?')) {
        try {
            const response = await fetch(`/api/${entity}/${entity}/${id}/deactivate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`Erro ao desativar ${entity}`);
            }
            loadEntities(entity, `${entity}Table`);
        } catch (error) {
            document.getElementById('error').style.display = 'block';
            document.getElementById('error').textContent = `Erro ao excluir ${entity}`;
            console.error('Erro:', error);
        }
    }
}

document.getElementById('usuarioForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const entity = 'usuarios';
    const url = data.usr_id ? `/api/${entity}/${entity}/${data.usr_id}` : `/api/${entity}/${entity}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include'
        });
        if (response.ok) {
            document.getElementById('usuarioForm').reset();
            document.getElementById('usr_id').value = '';
            document.getElementById('formTitle').textContent = 'Cadastrar Novo Usuário';
            document.getElementById('submitButton').textContent = 'Cadastrar';
            document.getElementById('usr_sen').setAttribute('required', 'required');
            document.getElementById('usuarioModal').style.display = 'none';
            loadEntities('usuarios', 'usuariosTable');
        } else {
            const result = await response.json();
            document.getElementById('error').style.display = 'block';
            document.getElementById('error').textContent = result.error || `Erro ao salvar ${entity}`;
        }
    } catch (error) {
        document.getElementById('error').style.display = 'block';
        document.getElementById('error').textContent = `Erro ao salvar ${entity}`;
        console.error('Erro:', error);
    }
});

document.getElementById('newUsuarioBtn')?.addEventListener('click', () => {
    document.getElementById('usuarioForm').reset();
    document.getElementById('usr_id').value = '';
    document.getElementById('formTitle').textContent = 'Cadastrar Novo Usuário';
    document.getElementById('submitButton').textContent = 'Cadastrar';
    document.getElementById('usr_sen').setAttribute('required', 'required');
    document.getElementById('usuarioModal').style.display = 'block';
});

document.querySelector('.close')?.addEventListener('click', () => {
    document.getElementById('usuarioModal').style.display = 'none';
    document.getElementById('error').style.display = 'none';
});

window.addEventListener('click', (event) => {
    const modal = document.getElementById('usuarioModal');
    if (event.target === modal) {
        modal.style.display = 'none';
        document.getElementById('error').style.display = 'none';
    }
});

// Carregar entidades ao carregar a página
window.onload = () => {
    const entity = document.body.dataset.entity || 'usuarios'; // Ajustar via data-entity
    loadEntities(entity, `${entity}Table`);
};

