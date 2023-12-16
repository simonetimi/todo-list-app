export function saveToStorage(elementToSave, name) {
  localStorage.setItem(name, JSON.stringify(elementToSave));
}
// Needed for a reset function
export function removeFromStorage(name) {
  JSON.parse(localStorage.getItem(name));
}

export function getFromStorage(name) {
  JSON.parse(localStorage.getItem(name));
}
