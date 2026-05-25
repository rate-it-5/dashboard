import UIComponent from "./UIComponent.js";

export default class GitHubWidget extends UIComponent {
  constructor(config) {
    super({
      ...config,
      title: "GitHub профиль",
      type: "API Widget"
    });

    this.defaultUsername = "rate-it-5";
  }

  render() {
    const element = super.render();

    this.bodyElement.innerHTML = `
      <span class="api-badge">GitHub API</span>

      <form class="github-form">
        <input class="github-input" type="text" value="${this.defaultUsername}" placeholder="Введите GitHub username">
        <button class="btn btn--primary" type="submit">Найти</button>
      </form>

      <div class="github-result">
        <p class="widget-status">Данные загружаются...</p>
      </div>
    `;

    this.formElement = this.bodyElement.querySelector(".github-form");
    this.inputElement = this.bodyElement.querySelector(".github-input");
    this.resultElement = this.bodyElement.querySelector(".github-result");

    this.addListener(this.formElement, "submit", this.handleSubmit.bind(this));

    this.loadProfile(this.defaultUsername);

    return element;
  }

  handleSubmit(event) {
    event.preventDefault();

    const username = this.inputElement.value.trim();

    if (username === "") {
      this.showMessage("Введите имя пользователя GitHub.");
      return;
    }

    this.loadProfile(username);
  }

  async loadProfile(username) {
    try {
      this.showMessage("Загружаем профиль...");

      const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);

      if (!response.ok) {
        this.showMessage("Пользователь не найден.");
        return;
      }

      const profile = await response.json();
      this.renderProfile(profile);
    } catch (error) {
      this.showMessage("Не удалось получить данные. Проверьте подключение к интернету.");
      console.error(error);
    }
  }

  renderProfile(profile) {
    this.resultElement.innerHTML = `
      <div class="github-profile">
        <img class="github-avatar" src="${profile.avatar_url}" alt="Аватар пользователя ${profile.login}">

        <div>
          <p class="github-name">${profile.name || "Без имени"}</p>
          <p class="github-login">@${profile.login}</p>
        </div>
      </div>

      <div class="github-details">
        <span>Публичные репозитории: ${profile.public_repos}</span>
        <span>Подписчики: ${profile.followers}</span>
        <span>Подписки: ${profile.following}</span>
      </div>

      <a class="github-link" href="${profile.html_url}" target="_blank">
        Открыть профиль
      </a>
    `;
  }

  showMessage(message) {
    this.resultElement.innerHTML = `
      <p class="widget-status">${message}</p>
    `;
  }
}