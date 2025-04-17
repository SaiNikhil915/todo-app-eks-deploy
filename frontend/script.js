const apiUrl = '/todos';

const form = document.getElementById("todo-form");
const list = document.getElementById("todo-list");

// Format status string for display (remove spaces)
const formatStatus = (status) => {
  return status.replace(/\s+/g, '');
};

// Convert priority to a more readable format
const formatPriority = (priority) => {
  return priority;
};

const displayEmptyState = () => {
  list.innerHTML = `
    <div class="empty-state">
      <i class="fas fa-clipboard-list"></i>
      <p>No tasks yet</p>
      <small>Add a new task using the form above</small>
    </div>
  `;
};

const fetchTodos = async () => {
  try {
    list.innerHTML = `
      <div class="loading">
        <i class="fas fa-circle-notch fa-spin fa-2x"></i>
        <p>Loading tasks...</p>
      </div>
    `;
    
    const res = await fetch(apiUrl);
    const todos = await res.json();

    if (todos.length === 0) {
      displayEmptyState();
      return;
    }

    list.innerHTML = "";
    todos.forEach((todo) => {
      const item = document.createElement("div");
      item.className = "todo-item";
      item.setAttribute("data-priority", todo.priority);
      
      item.innerHTML = `
        <div class="todo-content">
          <div class="todo-title">${todo.todo}</div>
          <div class="todo-meta">
            <span class="tag priority ${todo.priority}">${formatPriority(todo.priority)}</span>
            <span class="tag status ${formatStatus(todo.status)}">${todo.status}</span>
            <span class="todo-id">#${todo.id}</span>
          </div>
        </div>
        <div class="todo-actions">
          <button class="action-btn edit" onclick="editTodo(${todo.id})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete" onclick="deleteTodo(${todo.id})">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      `;
      list.appendChild(item);
    });
  } catch (error) {
    list.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Failed to load tasks</p>
        <small>Please check your connection and try again</small>
      </div>
    `;
    console.error("Error fetching todos:", error);
  }
};

const addTodo = async (e) => {
  e.preventDefault();

  const id = document.getElementById("id").value;
  const todo = document.getElementById("todo").value;
  const priority = document.getElementById("priority").value;
  const status = document.getElementById("status").value;

  try {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Adding...';
    submitButton.disabled = true;

    await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: Number(id), todo, priority, status }),
    });

    form.reset();
    await fetchTodos();
    
    // Reset button state
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
    
    // Add a quick flash notification
    const notification = document.createElement("div");
    notification.style.position = "fixed";
    notification.style.bottom = "20px";
    notification.style.right = "20px";
    notification.style.background = "var(--primary)";
    notification.style.color = "white";
    notification.style.padding = "1rem";
    notification.style.borderRadius = "6px";
    notification.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
    notification.style.zIndex = "1000";
    notification.innerHTML = "Task added successfully!";
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 2000);
  } catch (error) {
    console.error("Error adding todo:", error);
    alert("Failed to add task. Please try again.");
  }
};

const deleteTodo = async (id) => {
  if (!confirm("Are you sure you want to delete this task?")) return;
  
  try {
    await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    fetchTodos();
  } catch (error) {
    console.error("Error deleting todo:", error);
    alert("Failed to delete task. Please try again.");
  }
};

const editTodo = async (id) => {
  try {
    const res = await fetch(`${apiUrl}/${id}`);
    const todo = await res.json();
    
    // Fill the form with the todo data
    document.getElementById("id").value = todo.id;
    document.getElementById("todo").value = todo.todo;
    document.getElementById("priority").value = todo.priority;
    document.getElementById("status").value = todo.status;
    
    // Scroll to the form
    document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    console.error("Error fetching todo for edit:", error);
    alert("Failed to load task details. Please try again.");
  }
};

// Theme detector to toggle between light and dark mode
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
if (prefersDarkScheme.matches) {
  document.body.classList.add("dark-theme");
} else {
  document.body.classList.add("light-theme");
}

form.addEventListener("submit", addTodo);
fetchTodos();