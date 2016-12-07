import type { Component } from 'react';

const modules = [
  require('./auth'),
  require('./core'),
  require('./dashboard'),
  require('./user'),
];

export class ModuleRegistry {
  screens: {[id: string]: Component};
  reducers: {[id: string]: () => Object};

  constructor() {
    this.screens = {};
    this.reducers = {};
    this.api = {};
  }

  registerScreen(id: string, component: Component) {
    this.screens[id] = component;
    return this;
  }

  registerReducer(id: string, reducer: () => Object) {
    this.reducers[id] = reducer;
    return this;
  }
}

const registry = new ModuleRegistry();
modules.forEach(module => module.default(registry));

export default registry;