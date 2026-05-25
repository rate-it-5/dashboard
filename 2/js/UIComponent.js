export default class UIComponent {
  constructor({ id, title, type, onClose }) {
    this.id = id;
    this.title = title;
    this.type = type;
    this.onClose = onClose;
    this.element = null;
    this.bodyElement = null;
    this.eventListeners = [];
  }

  render() {
    this.element = document.createElement("article");
    this.element.className = "widget";
    this.element.dataset.id = this.id;

    this.element.innerHTML = `
      <div class="widget__header">
        <div>
          <h3 class="widget__title">${this.title}</h3>
          <span class="widget__type">${this.type}</span>
        </div>

        <div class="widget__actions">
          <button class="widget__icon-btn" data-action="minimize" type="button" aria-label="Свернуть виджет">−</button>
          <button class="widget__icon-btn" data-action="close" type="button" aria-label="Удалить виджет">×</button>
        </div>
      </div>

      <div class="widget__body"></div>
    `;

    this.bodyElement = this.element.querySelector(".widget__body");

    const minimizeButton = this.element.querySelector('[data-action="minimize"]');
    const closeButton = this.element.querySelector('[data-action="close"]');

    this.addListener(minimizeButton, "click", this.minimize.bind(this));
    this.addListener(closeButton, "click", this.close.bind(this));

    return this.element;
  }

  addListener(element, eventName, handler) {
    element.addEventListener(eventName, handler);

    this.eventListeners.push({
      element,
      eventName,
      handler
    });
  }

  minimize() {
    if (!this.element) return;
    this.element.classList.toggle("is-minimized");
  }

  close() {
    if (typeof this.onClose === "function") {
      this.onClose(this.id);
    }
  }

  destroy() {
    this.eventListeners.forEach(({ element, eventName, handler }) => {
      element.removeEventListener(eventName, handler);
    });

    this.eventListeners = [];

    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
}