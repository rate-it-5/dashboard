import ToDoWidget from "./ToDoWidget.js";
import QuoteWidget from "./QuoteWidget.js";
import WeatherWidget from "./WeatherWidget.js";
import GitHubWidget from "./GitHubWidget.js";

export default class Dashboard {
  constructor({ container, emptyState, counter }) {
    this.container = container;
    this.emptyState = emptyState;
    this.counter = counter;
    this.widgets = [];
  }

  addWidget(widgetType) {
    const widgetId = `${widgetType}-${Date.now()}`;

    let widget = null;

    switch (widgetType) {
      case "todo":
        widget = new ToDoWidget({
          id: widgetId,
          onClose: this.removeWidget.bind(this)
        });
        break;

      case "quote":
        widget = new QuoteWidget({
          id: widgetId,
          onClose: this.removeWidget.bind(this)
        });
        break;

      case "weather":
        widget = new WeatherWidget({
          id: widgetId,
          onClose: this.removeWidget.bind(this)
        });
        break;

      case "github":
        widget = new GitHubWidget({
          id: widgetId,
          onClose: this.removeWidget.bind(this)
        });
        break;

      default:
        console.warn("Неизвестный тип виджета:", widgetType);
        return;
    }

    this.widgets.push(widget);

    const widgetElement = widget.render();
    this.container.appendChild(widgetElement);

    this.updateInterface();
  }

  removeWidget(widgetId) {
    const widget = this.widgets.find((item) => item.id === widgetId);

    if (!widget) {
      return;
    }

    widget.destroy();

    this.widgets = this.widgets.filter((item) => item.id !== widgetId);

    this.updateInterface();
  }

  clear() {
    this.widgets.forEach((widget) => {
      widget.destroy();
    });

    this.widgets = [];
    this.updateInterface();
  }

  updateInterface() {
    this.updateEmptyState();
    this.updateCounter();
  }

  updateEmptyState() {
    if (!this.emptyState) {
      return;
    }

    if (this.widgets.length === 0) {
      this.emptyState.classList.remove("is-hidden");
    } else {
      this.emptyState.classList.add("is-hidden");
    }
  }

  updateCounter() {
    if (!this.counter) {
      return;
    }

    const count = this.widgets.length;

    if (count === 1) {
      this.counter.textContent = "1 виджет";
    } else if (count >= 2 && count <= 4) {
      this.counter.textContent = `${count} виджета`;
    } else {
      this.counter.textContent = `${count} виджетов`;
    }
  }
}