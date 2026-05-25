export default class StorageService {
  static save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static load(key, fallback = null) {
    const data = localStorage.getItem(key);

    if (!data) {
      return fallback;
    }

    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Ошибка чтения LocalStorage:", error);
      return fallback;
    }
  }

  static remove(key) {
    localStorage.removeItem(key);
  }
}