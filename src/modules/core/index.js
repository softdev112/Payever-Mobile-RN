import type { ModuleRegistry } from '../index';

import config from './reducers/config';
import loader from './reducers/loader';
import WebView from './screens/WebView';

export default function register(registry: ModuleRegistry) {
  registry
    .registerReducer('config', config)
    .registerReducer('loader', loader)
    .registerScreen('core.WebView', WebView);
}