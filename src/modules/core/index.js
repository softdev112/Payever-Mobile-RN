import type { ModuleRegistry } from '../index';
import config from './reducers/config';

export default function register(registry: ModuleRegistry) {
  registry
    .registerReducer('config', config)
}