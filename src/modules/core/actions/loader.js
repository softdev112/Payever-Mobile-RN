export const SHOW_LOADER = 'core.SHOW_LOADER';
export const HIDE_LOADER = 'core.HIDE_LOADER';

export function showLoader() {
  return { type: SHOW_LOADER };
}

export function hideLoader() {
  return { type: HIDE_LOADER };
}