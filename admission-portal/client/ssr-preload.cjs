// Minimal browser globals so the app modules can be imported in Node.
globalThis.localStorage = {
  store: new Map(),
  getItem(k) { return this.store.has(k) ? this.store.get(k) : null; },
  setItem(k, v) { this.store.set(k, String(v)); },
  removeItem(k) { this.store.delete(k); },
};
globalThis.fetch = async () => ({ ok: true, status: 200, text: async () => '{}', json: async () => ({}) });
