import UIComponent from "./UIComponent.js";

export default class WeatherWidget extends UIComponent {
  constructor(config) {
    super({
      ...config,
      title: "Погода",
      type: "API Widget"
    });

    this.defaultCity = "Saint Petersburg";
  }

  render() {
    const element = super.render();

    this.bodyElement.innerHTML = `
      <span class="api-badge">Open-Meteo API</span>

      <form class="weather-form">
        <input class="weather-input" type="text" value="${this.defaultCity}" placeholder="Введите город">
        <button class="btn btn--primary" type="submit">Показать</button>
      </form>

      <div class="weather-result">
        <p class="widget-status">Данные загружаются...</p>
      </div>
    `;

    this.formElement = this.bodyElement.querySelector(".weather-form");
    this.inputElement = this.bodyElement.querySelector(".weather-input");
    this.resultElement = this.bodyElement.querySelector(".weather-result");

    this.addListener(this.formElement, "submit", this.handleSubmit.bind(this));

    this.loadWeather(this.defaultCity);

    return element;
  }

  handleSubmit(event) {
    event.preventDefault();

    const city = this.inputElement.value.trim();

    if (city === "") {
      this.showMessage("Введите название города.");
      return;
    }

    this.loadWeather(city);
  }

  async loadWeather(city) {
    try {
      this.showMessage("Загружаем данные о погоде...");

      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=ru&format=json`
      );

      if (!geoResponse.ok) {
        throw new Error("Ошибка при поиске города.");
      }

      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        this.showMessage("Город не найден. Попробуйте ввести другое название.");
        return;
      }

      const location = geoData.results[0];

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
      );

      if (!weatherResponse.ok) {
        throw new Error("Ошибка при загрузке погоды.");
      }

      const weatherData = await weatherResponse.json();
      const current = weatherData.current;

      this.renderWeather(location, current);
    } catch (error) {
      this.showMessage("Не удалось получить данные. Проверьте подключение к интернету.");
      console.error(error);
    }
  }

  renderWeather(location, current) {
    const description = this.getWeatherDescription(current.weather_code);

    this.resultElement.innerHTML = `
      <p>${location.name}, ${location.country}</p>
      <div class="weather-temp">${Math.round(current.temperature_2m)}°C</div>

      <div class="weather-details">
        <span>Состояние: ${description}</span>
        <span>Влажность: ${current.relative_humidity_2m}%</span>
        <span>Ветер: ${current.wind_speed_10m} км/ч</span>
      </div>
    `;
  }

  getWeatherDescription(code) {
    const weatherCodes = {
      0: "ясно",
      1: "преимущественно ясно",
      2: "переменная облачность",
      3: "пасмурно",
      45: "туман",
      48: "изморозь",
      51: "слабая морось",
      53: "морось",
      55: "сильная морось",
      61: "слабый дождь",
      63: "дождь",
      65: "сильный дождь",
      71: "слабый снег",
      73: "снег",
      75: "сильный снег",
      80: "ливень",
      95: "гроза"
    };

    return weatherCodes[code] || "данные о погоде";
  }

  showMessage(message) {
    this.resultElement.innerHTML = `
      <p class="widget-status">${message}</p>
    `;
  }
}