document.addEventListener('DOMContentLoaded', () => {
    // Bonus: LocalStorage array state
    let tasks = JSON.parse(localStorage.getItem('tasks_data')) || [];

    const todoForm = document.getElementById('todoForm');
    const taskInput = document.getElementById('taskInput');
    const pendingList = document.getElementById('pendingList');
    const completedList = document.getElementById('completedList');
    const pendingCount = document.getElementById('pendingCount');
    const completedCount = document.getElementById('completedCount');
    const pendingEmpty = document.getElementById('pendingEmpty');
    const completedEmpty = document.getElementById('completedEmpty');

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        if (!text) return;

        const newTask = {
            id: Date.now().toString(),
            text: text,
            completed: false,
            createdAt: new Date().toLocaleString()
        };

        tasks.push(newTask);
        saveAndRender();
        taskInput.value = '';
    });

    function renderTasks() {
        pendingList.innerHTML = '';
        completedList.innerHTML = '';

        let pending = 0;
        let completed = 0;

        tasks.forEach(task => {
            const li = createTaskElement(task);
            if (task.completed) {
                completedList.appendChild(li);
                completed++;
            } else {
                pendingList.appendChild(li);
                pending++;
            }
        });

        // Task count indicators
        pendingCount.innerText = `${pending} pending`;
        completedCount.innerText = `${completed} completed`;

        // Empty state messaging
        pendingEmpty.style.display = pending === 0 ? 'block' : 'none';
        completedEmpty.style.display = completed === 0 ? 'block' : 'none';
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.dataset.id = task.id;

        li.innerHTML = `
            <div class="task-main">
                <span class="task-text">${escapeHTML(task.text)}</span>
            </div>
            <!-- Bonus: Timestamp -->
            <div class="timestamp"><i class="fa-regular fa-clock"></i> ${task.createdAt}</div>
            <div class="task-actions">
                <button class="action-btn complete-btn" title="Toggle Complete">
                    <i class="fa-solid ${task.completed ? 'fa-rotate-left' : 'fa-check'}"></i>
                </button>
                <button class="action-btn edit-btn" title="Edit Task">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="action-btn delete-btn" title="Delete Task">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        // Toggle Complete
        li.querySelector('.complete-btn').addEventListener('click', () => {
            task.completed = !task.completed;
            saveAndRender();
        });

        // Delete Task
        li.querySelector('.delete-btn').addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveAndRender();
        });

        // Inline Edit
        li.querySelector('.edit-btn').addEventListener('click', () => {
            const textSpan = li.querySelector('.task-text');
            const currentText = task.text;

            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.className = 'edit-input';
            editInput.value = currentText;

            textSpan.replaceWith(editInput);
            editInput.focus();

            const saveEdit = () => {
                const newText = editInput.value.trim();
                if (newText) {
                    task.text = newText;
                }
                saveAndRender();
            };

            editInput.addEventListener('blur', saveEdit);
            editInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') saveEdit();
            });
        });

        return li;
    }

    function saveAndRender() {
        localStorage.setItem('tasks_data', JSON.stringify(tasks));
        renderTasks();
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
    }

    renderTasks();
});