export default class PromoService {
  constructor() {
    this.activePromo = null;

    this.promocodes = {
      PANDCO10: {
        code: "PANDCO10",
        type: "percent",
        value: 10,
        message: "Промокод применён: скидка 10%."
      },
      STUDENT15: {
        code: "STUDENT15",
        type: "percent",
        value: 15,
        message: "Промокод применён: скидка 15%."
      },
      FREESHIP: {
        code: "FREESHIP",
        type: "delivery",
        value: 350,
        message: "Промокод применён: доставка бесплатная."
      }
    };
  }

  apply(code) {
    const normalizedCode = code.trim().toUpperCase();

    if (!normalizedCode) {
      return {
        success: false,
        message: "Введите промокод."
      };
    }

    if (!this.promocodes[normalizedCode]) {
      this.activePromo = null;

      return {
        success: false,
        message: "Такого промокода нет."
      };
    }

    this.activePromo = this.promocodes[normalizedCode];

    return {
      success: true,
      message: this.activePromo.message,
      promo: this.activePromo
    };
  }

  calculateDiscount(subtotal, deliveryPrice) {
    if (!this.activePromo) {
      return {
        discount: 0,
        deliveryDiscount: 0
      };
    }

    if (this.activePromo.type === "percent") {
      return {
        discount: Math.round(subtotal * this.activePromo.value / 100),
        deliveryDiscount: 0
      };
    }

    if (this.activePromo.type === "delivery") {
      return {
        discount: 0,
        deliveryDiscount: deliveryPrice
      };
    }

    return {
      discount: 0,
      deliveryDiscount: 0
    };
  }

  getActivePromo() {
    return this.activePromo;
  }
}