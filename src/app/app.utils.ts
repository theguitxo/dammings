export function isMobileDevice(): boolean {
  // return !!RegExp(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).exec(navigator.userAgent);
  return 'ontouchstart' in window || navigator.maxTouchPoints > 1;
}
