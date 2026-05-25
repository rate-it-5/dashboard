import UIComponent from "./UIComponent.js";

export default class QuoteWidget extends UIComponent {
  constructor(config) {
    super({
      ...config,
      title: "Мотивационная цитата",
      type: "Local Widget"
    });

    this.quotes = [
      {
        text: "Дизайн — это не только то, как выглядит продукт, но и то, как он работает.",
        author: "Стив Джобс"
      },
      {
        text: "Хороший интерфейс становится незаметным, потому что помогает пользователю решить задачу.",
        author: "UX-подход"
      },
      {
        text: "Большой проект начинается с маленького, но аккуратно выполненного шага.",
        author: "Productivity Dashboard"
      },
      {
        text: "Лучший способ научиться программировать — создавать реальные проекты.",
        author: "JavaScript Practice"
      },
      {
        text: "Системность в работе превращает сложную задачу в понятный процесс.",
        author: "Project Management"
      }
    ];

    this.currentQuote = null;
  }

  render() {
    const element = super.render();

    this.bodyElement.innerHTML = `
      <p class="quote-text"></p>
      <p class="quote-author"></p>

      <button class="btn btn--primary quote-refresh" type="button">
        Обновить цитату
      </button>

      <p class="widget-status">Цитаты хранятся в массиве внутри класса QuoteWidget.</p>
    `;

    this.quoteTextElement = this.bodyElement.querySelector(".quote-text");
    this.quoteAuthorElement = this.bodyElement.querySelector(".quote-author");
    this.refreshButton = this.bodyElement.querySelector(".quote-refresh");

    this.addListener(this.refreshButton, "click", this.showRandomQuote.bind(this));

    this.showRandomQuote();

    return element;
  }

  showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * this.quotes.length);
    this.currentQuote = this.quotes[randomIndex];

    this.quoteTextElement.textContent = `«${this.currentQuote.text}»`;
    this.quoteAuthorElement.textContent = `— ${this.currentQuote.author}`;
  }
}