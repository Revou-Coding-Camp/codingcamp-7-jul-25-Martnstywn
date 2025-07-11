document.addEventListener("DOMContentLoaded", () => {
  const todoForm = document.getElementById("todoForm");
  const todoTitle = document.getElementById("todoTitle");
  const todoDate = document.getElementById("todoDate");
  const todoList = document.getElementById("todoList");
  const filterStatus = document.getElementById("filterStatus");
  const clearCompleted = document.getElementById("clearCompleted");
  const titleError = document.getElementById("titleError");
  const dateError = document.getElementById("dateError");

  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  const saveTodos = () => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  // validate form
  const validateForm = () => {
    let isValid = true;

    if (todoTitle.value.trim() === "") {
      titleError.classList.add("visible");
      isValid = false;
    } else {
      titleError.classList.remove("visible");
    }

    if (todoDate.value === "") {
      dateError.classList.add("visible");
      isValid = false;
    } else {
      dateError.classList.remove("visible");
    }

    return isValid;
  };

  // format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // render todos
  const renderTodos = () => {
    const statusFilter = filterStatus.value;

    const filteredTodos = todos.filter((todo) => {
      const statusMatch =
        statusFilter === "all" ||
        (statusFilter === "completed" && todo.completed) ||
        (statusFilter === "pending" && !todo.completed);

      return statusMatch;
    });

    if (filteredTodos.length === 0) {
      todoList.innerHTML = `
        <div class="empty-state">
            <h3>No tasks found</h3>
            <p>Add a new task</p>
        </div>
      `;
      return;
    }

    todoList.innerHTML = filteredTodos
      .map(
        (todo, index) => `
        <li class="todo-item ${
          todo.completed ? "status-completed" : ""
        }" data-id="${todo.id}">
            <div class="todo-content">
                <div class="todo-title">${todo.title}</div>
                <div class="todo-date">Due: ${formatDate(todo.date)}</div>
            </div>
            <div class="todo-actions">
                <button class="btn-success toggle-complete">${
                  todo.completed ? "Undo" : "Complete"
                }</button>
                <button class="btn-danger delete-task">Delete</button>
            </div>
        </li>
    `
      )
      .join("");

    document.querySelectorAll(".toggle-complete").forEach((button) => {
      button.addEventListener("click", toggleComplete);
    });

    document.querySelectorAll(".delete-task").forEach((button) => {
      button.addEventListener("click", deleteTodo);
    });
  };

  // add a new todo
  const addTodo = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newTodo = {
      id: Date.now(),
      title: todoTitle.value.trim(),
      date: todoDate.value,
      completed: false,
    };

    todos.push(newTodo);
    saveTodos();
    renderTodos();

    // Reset form
    todoForm.reset();
    todoTitle.focus();
  };

  // completion status
  const toggleComplete = (e) => {
    const todoId = parseInt(e.target.closest(".todo-item").dataset.id);

    todos = todos.map((todo) => {
      if (todo.id === todoId) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });

    saveTodos();
    renderTodos();
  };

  // delete
  const deleteTodo = (e) => {
    const todoId = parseInt(e.target.closest(".todo-item").dataset.id);

    if (confirm("Are you sure you want to delete this task?")) {
      todos = todos.filter((todo) => todo.id !== todoId);
      saveTodos();
      renderTodos();
    }
  };

  // clear completed
  const clearCompletedTodos = () => {
    if (confirm("Are you sure you want to clear all completed tasks?")) {
      todos = todos.filter((todo) => !todo.completed);
      saveTodos();
      renderTodos();
    }
  };

  todoForm.addEventListener("submit", addTodo);
  filterStatus.addEventListener("change", renderTodos);
  clearCompleted.addEventListener("click", clearCompletedTodos);

  renderTodos();
});
