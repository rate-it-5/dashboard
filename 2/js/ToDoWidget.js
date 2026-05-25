import UIComponent from "./UIComponent.js";

export default class ToDoWidget extends UIComponent {
  constructor(config) {
    super({
      ...config,
      title: "Список задач",
      type: "Local Widget"
    });

    this.tasks = [];
  }

  render() {
    const element = super.render();

    this.bodyElement.innerHTML = `
      <form class="todo-form">
        <input class="todo-input" type="text" placeholder="Введите задачу">
        <button class="btn btn--primary" type="submit">Добавить</button>
      </form>

      <ul class="todo-list"></ul>

      <p class="widget-status">Задачи хранятся внутри объекта ToDoWidget.</p>
    `;

    this.formElement = this.bodyElement.querySelector(".todo-form");
    this.inputElement = this.bodyElement.querySelector(".todo-input");
    this.listElement = this.bodyElement.querySelector(".todo-list");

    this.addListener(this.formElement, "submit", this.handleSubmit.bind(this));
    this.addListener(this.listElement, "click", this.handleListClick.bind(this));

    return element;
  }

  handleSubmit(event) {
    event.preventDefault();

    const text = this.inputElement.value.trim();

    if (text === "") {
      return;
    }

    this.addTask(text);
    this.inputElement.value = "";
  }

  addTask(text) {
    const task = {
      id: Date.now(),
      text,
      completed: false
    };

    this.tasks.push(task);
    this.updateList();
  }

  toggleTask(taskId) {
    this.tasks = this.tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          completed: !task.completed
        };
      }

      return task;
    });

    this.updateList();
  }

  deleteTask(taskId) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    this.updateList();
  }

  handleListClick(event) {
    const taskElement = event.target.closest(".todo-item");

    if (!taskElement) {
      return;
    }

    const taskId = Number(taskElement.dataset.id);

    if (event.target.classList.contains("todo-checkbox")) {
      this.toggleTask(taskId);
    }

    if (event.target.classList.contains("todo-delete")) {
      this.deleteTask(taskId);
    }
  }

  updateList() {
    this.listElement.innerHTML = "";

    if (this.tasks.length === 0) {
      this.listElement.innerHTML = `
        <li class="widget-status">Список задач пока пуст.</li>
      `;
      return;
    }

    this.tasks.forEach((task) => {
      const item = document.createElement("li");
      item.className = task.completed ? "todo-item is-completed" : "todo-item";
      item.dataset.id = task.id;

      item.innerHTML = `
        <input class="todo-checkbox" type="checkbox" ${task.completed ? "checked" : ""}>
        <span class="todo-item__text">${task.text}</span>
        <button class="todo-delete" type="button">×</button>
      `;

      this.listElement.appendChild(item);
    });
  }
}