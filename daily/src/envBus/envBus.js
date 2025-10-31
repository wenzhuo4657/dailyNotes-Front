class SimpleEventBus {
  constructor() {
    this.listeners = new Map();
  }

  $on(event, callback) {
    if (typeof callback !== 'function') {
      console.warn(`[EventBus] listener for "${event}" is not a function.`);
      return;
    }
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  $off(event, callback) {
    const eventListeners = this.listeners.get(event);
    if (!eventListeners) {
      return;
    }

    eventListeners.delete(callback);
    if (eventListeners.size === 0) {
      this.listeners.delete(event);
    }
  }

  $emit(event, payload) {
    const eventListeners = this.listeners.get(event);
    if (!eventListeners) {
      return;
    }

    for (const callback of [...eventListeners]) {
      try {
        callback(payload);
      } catch (error) {
        console.error(`[EventBus] listener for "${event}" threw an error:`, error);
      }
    }
  }
}

export const EventBus = new SimpleEventBus();

export const Events = Object.freeze({
  Button_edit: 'button:edit',
  Button_view: 'button:view',
  Button_type: 'button:type',
  Button_contentName: 'button:contentName'
});
