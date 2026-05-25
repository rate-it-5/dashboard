import { products } from "../data/products.js";
import Cart from "./Cart.js";
import ProductRenderer from "./ProductRenderer.js";
import PromoService from "./PromoService.js";
import Checkout from "./Checkout.js";

document.addEventListener("DOMContentLoaded", () => {
  const productsGrid = document.getElementById("productsGrid");
  const filters = document.getElementById("filters");

  const cartCount = document.getElementById("cartCount");
  const cartList = document.getElementById("cartList");
  const clearCartBtn = document.getElementById("clearCartBtn");

  const subtotalValue = document.getElementById("subtotalValue");
  const discountValue = document.getElementById("discountValue");
  const deliveryValue = document.getElementById("deliveryValue");
  const totalValue = document.getElementById("totalValue");

  const promoForm = document.getElementById("promoForm");
  const promoInput = document.getElementById("promoInput");
  const promoMessage = document.getElementById("promoMessage");

  const checkoutForm = document.getElementById("checkoutForm");
  const checkoutMessage = document.getElementById("checkoutMessage");
  const orderJson = document.getElementById("orderJson");
  const copyJsonBtn = document.getElementById("copyJsonBtn");

  const cart = new Cart(products);
  const promoService = new PromoService();

  const productRenderer = new ProductRenderer({
    productsGrid,
    onAddToCart: (productId) => {
      cart.add(productId);
      renderCart();
    }
  });

  productRenderer.render(products);
  renderCart();

  filters.addEventListener("click", (event) => {
    const button = event.target.closest(".filter-btn");

    if (!button) {
      return;
    }

    const category = button.dataset.category;

    filters.querySelectorAll(".filter-btn").forEach((item) => {
      item.classList.remove("is-active");
    });

    button.classList.add("is-active");

    const filteredProducts = category === "all"
      ? products
      : products.filter((product) => product.category === category);

    productRenderer.render(filteredProducts);
  });

  clearCartBtn.addEventListener("click", () => {
    cart.clear();
    orderJson.textContent = "{}";
    renderCart();
  });

  promoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const result = promoService.apply(promoInput.value);

    promoMessage.textContent = result.message;
    promoMessage.classList.remove("is-error", "is-success");
    promoMessage.classList.add(result.success ? "is-success" : "is-error");

    renderCart();
  });

  cartList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");

    if (!button) {
      return;
    }

    const productId = Number(button.dataset.id);
    const action = button.dataset.action;

    if (action === "increase") {
      cart.increase(productId);
    }

    if (action === "decrease") {
      cart.decrease(productId);
    }

    if (action === "remove") {
      cart.remove(productId);
    }

    orderJson.textContent = "{}";
    renderCart();
  });

  new Checkout({
    form: checkoutForm,
    messageElement: checkoutMessage,
    jsonElement: orderJson,
    copyButton: copyJsonBtn,
    cart,
    promoService,
    getSummary
  });

  function renderCart() {
    const detailedItems = cart.getDetailedItems();

    cartCount.textContent = cart.getCount();

    if (detailedItems.length === 0) {
      cartList.innerHTML = `
        <div class="empty-cart">
          <h3>Корзина пока пустая</h3>
          <p>Добавьте товары из каталога, чтобы оформить заказ.</p>
        </div>
      `;
    } else {
      cartList.innerHTML = detailedItems.map((item) => `
        <article class="cart-item">
          <div class="cart-item__info">
            <h3>${item.title}</h3>
            <p>${formatPrice(item.price)} × ${item.quantity} = ${formatPrice(item.total)}</p>
          </div>

          <div class="cart-item__actions">
            <button class="quantity-btn" type="button" data-action="decrease" data-id="${item.id}">−</button>
            <strong>${item.quantity}</strong>
            <button class="quantity-btn" type="button" data-action="increase" data-id="${item.id}">+</button>
            <button class="remove-btn" type="button" data-action="remove" data-id="${item.id}">×</button>
          </div>
        </article>
      `).join("");
    }

    const summary = getSummary();

    subtotalValue.textContent = formatPrice(summary.subtotal);
    discountValue.textContent = `−${formatPrice(summary.discount)}`;
    deliveryValue.textContent = summary.delivery === 0 ? "Бесплатно" : formatPrice(summary.delivery);
    totalValue.textContent = formatPrice(summary.total);
  }

  function getSummary() {
    const subtotal = cart.getSubtotal();
    const baseDelivery = cart.getCount() > 0 ? 350 : 0;
    const promoDiscount = promoService.calculateDiscount(subtotal, baseDelivery);

    const discount = promoDiscount.discount;
    const delivery = Math.max(0, baseDelivery - promoDiscount.deliveryDiscount);
    const total = Math.max(0, subtotal - discount + delivery);

    return {
      subtotal,
      discount,
      delivery,
      total
    };
  }

  function formatPrice(value) {
    return `${value.toLocaleString("ru-RU")} ₽`;
  }
});