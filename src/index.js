import "./index.css";
import { saveToStorage, getFromStorage } from "./modules/storage.js";
import {
  addTodo,
  removeTodo,
  editTodo,
  moveTodo,
  addList,
  removeList,
  renameList,
  setTodos,
  todos,
} from "./modules/data.js";
import {
  setModalTodoItem,
  setModalRenameList,
  renderTodoItems,
  currentList,
  sortingSetting,
} from "./modules/ui.js";

if (process.env.NODE_ENV !== "production") {
  console.log("Looks like we are in development mode!");
}

//testing

// Assicurati di chiamare la funzione setModal

window.test = {
  addTodo,
  removeTodo,
  editTodo,
  moveTodo,
  addList,
  removeList,
  renameList,
  todos,
  saveToStorage,
};

saveToStorage("savedTodos", todos);

removeTodo("personal", 589473829);

console.log(todos);
setTodos(getFromStorage("savedTodos"));
console.log(todos);

setModalRenameList();
renderTodoItems();
