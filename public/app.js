const API = '/api/tasks';

let tasks = [];
let editingId = null;

// DOM refs
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const taskCount = document.getElementById('taskCount');
const modal = document.getElementById('modal');
const taskForm = document.getElementById('taskForm');
const modalTitle = document.getElementById('modalTitle');
const searchInput = document.getElementById('searchInput');
const filterStatus = document.getElementById('filterStatus');
const filterPriority = document.getElementById('filterPriority');

// Open/close modal
document.getElementById('openModal').addEventListener('click', () => openModal());
document.getElementById('closeModal').addEventListener('click', closeModal);
document.getElementById('cancelBtn').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', closeModal);

function openModal(task = null) {
  editingId = task ? task.id : null;
  modalTitle.textContent = task ? 'Edit Task' : 'New Task';
  document.getElementById('titleInput').value = task ? task.title : '';
  document.getElementById('descInput').value = task ? task.description : '';
  document.getElementById('priorityInput').value = task ? task.priority : 'medium';
  document.getElementById('dueDateInput').value = task ? (task.dueDate || '') : '';
  modal.classList.remove('hidden');
  document.getElementById('titleInput').focus();
}

function closeModal() {
  modal.classList.add('hidden');
  taskForm.reset();
  editingId = null;
}

// Form submit
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    title: document.getElementById('titleInput').value.trim(),
    description: document.getElementById('descInput').value.trim(),
    priority: document.getElementById('priorityInput').value,
    dueDate: document.getElementById('dueDateInput').value || null
  };
  if (!payload.title) return;

  if (editingId) {
    await fetch(`${API}/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } else {
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }
  closeModal();
  loadTasks();
});

// Load tasks from API
async function loadTasks() {
  const res = await fetch(API);
  tasks = await res.json();
  renderTasks();
}

// Filter and render
function renderTasks() {
  const search = searchInput.value.toLowerCase();
  const status = filterStatus.value;
  const priority = filterPriority.value;

  let filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search) ||
                        t.description.toLowerCase().includes(search);
    const matchStatus = status === 'all' ||
                        (status === 'completed' && t.completed) ||
                        (status === 'active' && !t.completed);
    const matchPriority = priority === 'all' || t.priority === priority;
    return matchSearch && matchStatus && matchPriority;
  });

  taskList.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
    filtered.forEach(task => {
      taskList.appendChild(createTaskCard(task));
    });
  }

  taskCount.textContent = `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`;
}

function createTaskCard(task) {
  const card = document.createElement('div');
  card.className = `task-card ${task.completed ? 'completed' : ''}`;

  const isOverdue = task.dueDate && !task.completed &&
                    new Date(task.dueDate) < new Date().setHours(0,0,0,0);
  const dueDateText = task.dueDate
    ? `Due: ${new Date(task.dueDate + 'T00:00:00').toLocaleDateString()}`
    : '';

  card.innerHTML = `
    <div class="task-checkbox ${task.completed ? 'checked' : ''}" data-id="${task.id}"></div>
    <div class="task-body">
      <div class="task-title">${escapeHtml(task.title)}</div>
      ${task.description ? `<div class="task-desc">${escapeHtml(task.description)}</div>` : ''}
      <div class="task-meta">
        <span class="priority-badge priority-${task.priority}">${task.priority}</span>
        ${dueDateText ? `<span class="due-date ${isOverdue ? 'overdue' : ''}">${dueDateText}</span>` : ''}
      </div>
    </div>
    <div class="task-actions">
      <button class="btn-icon edit-btn" data-id="${task.id}">Edit</button>
      <button class="btn-icon delete delete-btn" data-id="${task.id}">Delete</button>
    </div>
  `;

  card.querySelector('.task-checkbox').addEventListener('click', () => toggleTask(task));
  card.querySelector('.edit-btn').addEventListener('click', () => openModal(task));
  card.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));

  return card;
}

async function toggleTask(task) {
  await fetch(`${API}/${task.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: !task.completed })
  });
  loadTasks();
}

async function deleteTask(id) {
  if (!confirm('Delete this task?')) return;
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  loadTasks();
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

searchInput.addEventListener('input', renderTasks);
filterStatus.addEventListener('change', renderTasks);
filterPriority.addEventListener('change', renderTasks);

// Init
loadTasks();
