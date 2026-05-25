export default class ProductRenderer {
  constructor({ productsGrid, onAddToCart }) {
    this.productsGrid = productsGrid;
    this.onAddToCart = onAddToCart;
  }

  render(products) {
    this.productsGrid.innerHTML = "";

    products.forEach((product) => {
      const card = document.createElement("article");
      card.className = "product-card";

      card.innerHTML = `
        <div class="product-image">
          <img src="${product.image}" alt="${product.title}">
        </div>

        <div class="product-content">
          <div class="product-meta">
            <span>${product.badge}</span>
            <span>${this.getCategoryName(product.category)}</span>
          </div>

          <h3>${product.title}</h3>
          <p>${product.description}</p>

          <div class="product-bottom">
            <strong class="product-price">${this.formatPrice(product.price)}</strong>
            <button class="btn btn--dark product-add-btn" type="button" data-id="${product.id}">
              Добавить
            </button>
          </div>
        </div>
      `;

      this.productsGrid.appendChild(card);
    });

    this.productsGrid.querySelectorAll("button[data-id]").forEach((button) => {
      button.addEventListener("click", () => {
        this.onAddToCart(Number(button.dataset.id));

        button.textContent = "Добавлено";
        button.classList.remove("btn--dark");
        button.classList.add("btn--added");

        setTimeout(() => {
          button.textContent = "Добавить";
          button.classList.remove("btn--added");
          button.classList.add("btn--dark");
        }, 1200);
      });
    });
  }

  getCategoryName(category) {
    const categories = {
      tshirts: "Футболки",
      hoodies: "Худи",
      trousers: "Брюки",
      accessories: "Аксессуары"
    };

    return categories[category] || category;
  }

  formatPrice(value) {
    return `${value.toLocaleString("ru-RU")} ₽`;
  }
}