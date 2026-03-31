import { makeAutoObservable } from "mobx";

export default class BasketStore {
  constructor() {
    this._items = [];
    makeAutoObservable(this);
  }

  addItem(device) {
    const existingItem = this._items.find(item => item.device.id === device.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this._items.push({ device, quantity: 1 });
    }
  }

  removeItem(deviceId) {
    this._items = this._items.filter(item => item.device.id !== deviceId);
  }

  decreaseQuantity(deviceId) {
    const item = this._items.find(item => item.device.id === deviceId);
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        this.removeItem(deviceId);
      }
    }
  }

  clearBasket() {
    this._items = [];
  }

  get items() {
    return this._items;
  }

  get total() {
    return this._items.reduce((sum, item) => sum + (Number(item.device.price) * item.quantity), 0);
  }

  get itemCount() {
    return this._items.reduce((sum, item) => sum + item.quantity, 0);
  }
}