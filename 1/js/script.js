document.addEventListener("DOMContentLoaded", function () {
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav");
  const themeToggle = document.querySelector(".theme-toggle");
  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  // Адаптивное меню
  burger.addEventListener("click", function () {
    nav.classList.toggle("is-open");
  });

  const navLinks = document.querySelectorAll(".nav a");

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("is-open");
    });
  });

  // Переключение темы и сохранение выбора в LocalStorage
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
  }

  themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-theme");

    if (document.body.classList.contains("dark-theme")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  });

  // Анимация появления блоков при прокрутке
  const revealElements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  }, {
    threshold: 0.15
  });

  revealElements.forEach(function (element) {
    observer.observe(element);
  });

  // Валидация формы обратной связи
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nameInput = document.getElementById("nameInput");
    const emailInput = document.getElementById("emailInput");
    const messageInput = document.getElementById("messageInput");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    const emailRegex = /^\S+@\S+\.\S+$/;

    if (name === "" || email === "" || message === "") {
      formMessage.textContent = "Пожалуйста, заполните все поля.";
      return;
    }

    if (!emailRegex.test(email)) {
      formMessage.textContent = "Введите корректный email.";
      return;
    }

    formMessage.textContent = "Сообщение успешно отправлено!";
    contactForm.reset();
  });
});