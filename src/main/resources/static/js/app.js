// ============================================================
// TASK MANAGER — app.js
// Comunicação com a API REST do Spring Boot via Fetch API
// ============================================================

const API_URL = 'http://localhost:8080/api/tasks';

let allTasks = [];
let currentFilter = 'all';

// ============================================================
// INICIALIZAÇÃO
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();

    // Submete com Enter no campo de título
    document.getElementById('taskTitle').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addTask();
    });
});

// ============================================================
// CARREGAR TAREFAS
// ============================================================
async function loadTasks() {
    showLoading(true);
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao carregar tarefas');
        allTasks = await response.json();
        renderTasks();
        updateStats();
    } catch (error) {
        showToast('Erro ao carregar tarefas. Verifique se o servidor está rodando.', 'error');
        console.error(error);
    } finally {
        showLoading(false);
    }
}

// ============================================================
// RENDERIZAR TAREFAS
// ============================================================
function renderTasks() {
    const list = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');

    let tasks = filterTasks(allTasks);

    // Aplica busca por texto
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    if (searchTerm) {
        tasks = tasks.filter(t =>
            t.title.toLowerCase().includes(searchTerm) ||
            (t.description && t.description.toLowerCase().includes(searchTerm))
        );
    }

    list.innerHTML = '';

    if (tasks.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    tasks.forEach(task => {
        const item = createTaskElement(task);
        list.appendChild(item);
    });
}

function filterTasks(tasks) {
    switch (currentFilter) {
        case 'pending': return tasks.filter(t => !t.completed);
        case 'done':    return tasks.filter(t => t.completed);
        default:        return tasks;
    }
}

function createTaskElement(task) {
    const div = document.createElement('div');
    div.className = `task-item ${task.completed ? 'completed' : ''}`;
    div.dataset.id = task.id;

    const date = formatDate(task.createdAt);
    const priorityLabel = { BAIXA: 'Baixa', MEDIA: 'Média', ALTA: 'Alta' }[task.priority] || task.priority;

    div.innerHTML = `
        <button class="task-checkbox" onclick="toggleTask(${task.id})" title="Marcar como ${task.completed ? 'pendente' : 'concluída'}">
            ${task.completed ? '✓' : ''}
        </button>
        <div class="task-body">
            <div class="task-title">${escapeHtml(task.title)}</div>
            ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
            <div class="task-meta">
                <span class="badge badge-${task.priority.toLowerCase()}">${priorityLabel}</span>
                <span class="task-date">${date}</span>
            </div>
        </div>
        <div class="task-actions">
            <button class="btn-icon" onclick="openEditModal(${task.id})" title="Editar">✎</button>
            <button class="btn-icon danger" onclick="deleteTask(${task.id})" title="Excluir">✕</button>
        </div>
    `;

    return div;
}

// ============================================================
// ADICIONAR TAREFA
// ============================================================
async function addTask() {
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const priority = document.querySelector('input[name="priority"]:checked')?.value || 'MEDIA';

    if (!title) {
        showToast('O título é obrigatório!');
        document.getElementById('taskTitle').focus();
        return;
    }

    const btn = document.getElementById('addBtn');
    btn.disabled = true;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, priority })
        });

        if (!response.ok) throw new Error('Erro ao criar tarefa');

        const newTask = await response.json();
        allTasks.unshift(newTask);
        renderTasks();
        updateStats();

        // Limpa o formulário
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDescription').value = '';
        document.querySelector('input[name="priority"][value="MEDIA"]').checked = true;

        showToast('Tarefa criada com sucesso! ✓');
    } catch (error) {
        showToast('Erro ao criar tarefa.');
        console.error(error);
    } finally {
        btn.disabled = false;
    }
}

// ============================================================
// TOGGLE CONCLUÍDA
// ============================================================
async function toggleTask(id) {
    try {
        const response = await fetch(`${API_URL}/${id}/toggle`, { method: 'PATCH' });
        if (!response.ok) throw new Error();
        const updated = await response.json();

        // Atualiza localmente sem recarregar tudo
        const index = allTasks.findIndex(t => t.id === id);
        if (index !== -1) allTasks[index] = updated;

        renderTasks();
        updateStats();
    } catch (error) {
        showToast('Erro ao atualizar tarefa.');
    }
}

// ============================================================
// DELETAR TAREFA
// ============================================================
async function deleteTask(id) {
    if (!confirm('Deseja excluir esta tarefa?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error();

        allTasks = allTasks.filter(t => t.id !== id);
        renderTasks();
        updateStats();
        showToast('Tarefa excluída.');
    } catch (error) {
        showToast('Erro ao excluir tarefa.');
    }
}

// ============================================================
// EDITAR TAREFA
// ============================================================
function openEditModal(id) {
    const task = allTasks.find(t => t.id === id);
    if (!task) return;

    document.getElementById('editId').value = task.id;
    document.getElementById('editTitle').value = task.title;
    document.getElementById('editDescription').value = task.description || '';
    document.getElementById('editCompleted').checked = task.completed;

    const radio = document.querySelector(`input[name="editPriority"][value="${task.priority}"]`);
    if (radio) radio.checked = true;

    document.getElementById('editModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('editModal').classList.add('hidden');
}

function closeModalOnOverlay(event) {
    if (event.target === document.getElementById('editModal')) closeModal();
}

async function saveEdit() {
    const id = parseInt(document.getElementById('editId').value);
    const title = document.getElementById('editTitle').value.trim();
    const description = document.getElementById('editDescription').value.trim();
    const priority = document.querySelector('input[name="editPriority"]:checked')?.value || 'MEDIA';
    const completed = document.getElementById('editCompleted').checked;

    if (!title) {
        showToast('O título é obrigatório!');
        document.getElementById('editTitle').focus();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, priority, completed })
        });

        if (!response.ok) throw new Error();
        const updated = await response.json();

        const index = allTasks.findIndex(t => t.id === id);
        if (index !== -1) allTasks[index] = updated;

        renderTasks();
        updateStats();
        closeModal();
        showToast('Tarefa atualizada! ✓');
    } catch (error) {
        showToast('Erro ao atualizar tarefa.');
    }
}

// ============================================================
// FILTROS & BUSCA
// ============================================================
function setFilter(filter, btn) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTasks();
}

function handleSearch() {
    renderTasks();
}

// ============================================================
// UTILITÁRIOS
// ============================================================
function updateStats() {
    document.getElementById('totalCount').textContent = allTasks.length;
    document.getElementById('doneCount').textContent = allTasks.filter(t => t.completed).length;
}

function showLoading(show) {
    document.getElementById('loading').classList.toggle('hidden', !show);
    document.getElementById('taskList').classList.toggle('hidden', show);
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');

    if (toast._timeout) clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}
