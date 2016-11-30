import type { Component } from 'react';

const modules = [
  require('./auth'),
  require('./core'),
  require('./dashboard'),
];

export class ModuleRegistry {
  screens: {[id: string]: Component};
  reducers: {[id: string]: () => Object};
  api: {[id: string]: Class};

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

  registerApi(id: string, api: Class) {
    this.api[id] = api;
    return this;
  }
}

const registry = new ModuleRegistry();
modules.forEach(module => module.default(registry));

export default registry;