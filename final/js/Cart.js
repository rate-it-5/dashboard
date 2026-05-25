import StorageService from "./StorageService.js";

export default class Cart {
  constructor(products) {
    this.products = products;
    this.items = StorageService.load("pandco-cart", []);
  }

  add(productId) {
    const product = this.products.find((item) => item.id === productId);

    if (!product) {
      return;
    }

    const cartItem = this.items.find((item) => item.id === productId);

    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      this.items.push({
        id: product.id,
        quantity: 1
      });
    }

    this.save();
  }

  increase(productId) {
    const cartItem = this.items.find((item) => item.id === productId);

    if (cartItem) {
      cartItem.quantity += 1;
      this.save();
    }
  }

  decrease(productId) {
    const cartItem = this.items.find((item) => item.id === productId);

    if (!cartItem) {
      return;
    }

    cartItem.quantity -= 1;

    if (cartItem.quantity <= 0) {
      this.remove(productId);
      return;
    }

    this.save();
  }

  remove(productId) {
    this.items = this.items.filter((item) => item.id !== productId);
    this.save();
  }

  clear() {
    this.items = [];
    this.save();
  }

  getDetailedItems() {
    return this.items
      .map((item) => {
        const product = this.products.find((productItem) => productItem.id === item.id);

        if (!product) {
          return null;
        }

        return {
          ...product,
          quantity: item.quantity,
          total: product.price * item.quantity
        };
      })
      .filter(Boolean);
  }

  getSubtotal() {
    return this.getDetailedItems().reduce((sum, item) => sum + item.total, 0);
  }

  getCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  save() {
    StorageService.save("pandco-cart", this.items);
  }
}