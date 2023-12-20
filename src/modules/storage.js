export function saveToStorage(name, target) {
  localStorage.setItem(name, JSON.stringify(target));
}
export function getFromStorage(name) {
  let savedItem = localStorage.getItem(name);
  return JSON.parse(savedItem);
}
