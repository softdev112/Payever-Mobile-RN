import routes from '../store/webviewRoutes';
import { Actions } from 'react-native-router-flux';

export function processNavigation(navigator: object, navigationState: object) {
  console.log('Navigate to ' + navigator.url);
  const path = parseUrl(navigator.url).path;
  const route = routes[path];

  if (!route) {
    return true;
  }

  if (typeof route === 'string') {
    Actions[route]();
    console.log('calling string route');
    return false;
  }

  if (route.route) {
    Actions[route.route](route);
    console.log('calling object route');
    return false;
  }

  return true;
}

function parseUrl(url: string) {
  if (!url || !url.match) {
    return {};
  }

  const matches = url.match(/\w+:\/\/([\w.]+)\/(.*)/);
  return {
    domain: matches[1],
    path: matches[2]
  }
}