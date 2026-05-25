export default class Checkout {
  constructor({ form, messageElement, jsonElement, copyButton, cart, promoService, getSummary }) {
    this.form = form;
    this.messageElement = messageElement;
    this.jsonElement = jsonElement;
    this.copyButton = copyButton;
    this.cart = cart;
    this.promoService = promoService;
    this.getSummary = getSummary;

    this.form.addEventListener("submit", this.handleSubmit.bind(this));
    this.copyButton.addEventListener("click", this.copyJson.bind(this));
  }

  handleSubmit(event) {
    event.preventDefault();

    const customer = this.getCustomerData();
    const validation = this.validate(customer);

    if (!validation.success) {
      this.showMessage(validation.message, "error");
      return;
    }

    if (this.cart.getCount() === 0) {
      this.showMessage("Корзина пустая. Добавьте товары перед оформлением заказа.", "error");
      return;
    }

    const order = this.createOrder(customer);
    this.jsonElement.textContent = JSON.stringify(order, null, 2);

    this.showMessage("JSON заказа успешно сформирован.", "success");
  }

  getCustomerData() {
    return {
      name: document.getElementById("customerName").value.trim(),
      phone: document.getElementById("customerPhone").value.trim(),
      email: document.getElementById("customerEmail").value.trim(),
      deliveryMethod: document.getElementById("deliveryMethod").value,
      address: document.getElementById("customerAddress").value.trim()
    };
  }

  validate(customer) {
    const emailRegex = /^\S+@\S+\.\S+$/;
    const phoneRegex = /^\+?[\d\s()-]{7,}$/;

    if (!customer.name || !customer.phone || !customer.email || !customer.address) {
      return {
        success: false,
        message: "Заполните все поля формы."
      };
    }

    if (!phoneRegex.test(customer.phone)) {
      return {
        success: false,
        message: "Введите корректный номер телефона."
      };
    }

    if (!emailRegex.test(customer.email)) {
      return {
        success: false,
        message: "Введите корректный email."
      };
    }

    return {
      success: true
    };
  }

  createOrder(customer) {
    const summary = this.getSummary();
    const promo = this.promoService.getActivePromo();

    return {
      orderId: `PANDCO-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "created",
      customer,
      items: this.cart.getDetailedItems().map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        price: item.price,
        quantity: item.quantity,
        total: item.total
      })),
      promo: promo ? promo.code : null,
      summary
    };
  }

  async copyJson() {
    const text = this.jsonElement.textContent;

    if (!text || text === "{}") {
      this.showMessage("Сначала сформируйте JSON заказа.", "error");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      this.showMessage("JSON скопирован в буфер обмена.", "success");
    } catch (error) {
      this.showMessage("Не удалось скопировать JSON.", "error");
    }
  }

  showMessage(text, type) {
    this.messageElement.textContent = text;
    this.messageElement.classList.remove("is-error", "is-success");
    this.messageElement.classList.add(type === "error" ? "is-error" : "is-success");
  }
}