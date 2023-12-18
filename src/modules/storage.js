export function saveToStorage() {
  localStorage.setItem("savedTodos", JSON.stringify(todos));
}
export function getFromStorage() {
  todos = JSON.parse(localStorage.getItem("savedTodos"));
}

// localStorage.clear();
