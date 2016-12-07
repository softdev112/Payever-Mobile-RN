import type { ModuleRegistry } from '../index';

import businesses from './reducers/businesses';
import user from './reducers/user';

export default function register(registry: ModuleRegistry) {
  registry
    .registerReducer('businesses', businesses)
    .registerReducer('user', user);
}