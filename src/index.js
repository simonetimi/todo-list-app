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

// init
setTodos(getFromStorage("savedTodos"));

//testing

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

console.log(todos);

setModalRenameList();
renderTodoItems();
