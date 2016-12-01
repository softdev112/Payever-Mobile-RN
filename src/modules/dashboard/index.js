import type { ModuleRegistry } from '../index';

import Dashboard from './screens/Dashboard';
import Businesses from './screens/Businesses';

export default function register(registry: ModuleRegistry) {
  registry
    .registerScreen('dashboard.Dashboard', Dashboard)
    .registerScreen('dashboard.Businesses', Businesses);
}