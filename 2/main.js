import Dashboard from "./js/Dashboard.js";

document.addEventListener("DOMContentLoaded", () => {
  const dashboardGrid = document.getElementById("dashboardGrid");
  const emptyState = document.getElementById("emptyState");
  const widgetCounter = document.getElementById("widgetCounter");

  const addTodoBtn = document.getElementById("addTodoBtn");
  const addQuoteBtn = document.getElementById("addQuoteBtn");
  const addWeatherBtn = document.getElementById("addWeatherBtn");
  const addGithubBtn = document.getElementById("addGithubBtn");
  const clearDashboardBtn = document.getElementById("clearDashboardBtn");

  const dashboard = new Dashboard({
    container: dashboardGrid,
    emptyState,
    counter: widgetCounter
  });

  addTodoBtn.addEventListener("click", () => {
    dashboard.addWidget("todo");
  });

  addQuoteBtn.addEventListener("click", () => {
    dashboard.addWidget("quote");
  });

  addWeatherBtn.addEventListener("click", () => {
    dashboard.addWidget("weather");
  });

  addGithubBtn.addEventListener("click", () => {
    dashboard.addWidget("github");
  });

  clearDashboardBtn.addEventListener("click", () => {
    dashboard.clear();
  });

  dashboard.addWidget("todo");
  dashboard.addWidget("quote");
  dashboard.addWidget("weather");
  dashboard.addWidget("github");
});