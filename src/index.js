import "./index.css";
import Logo from "./images/logo.jpg";
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
(function addLogo() {
  const sidebar = document.querySelector("nav");
  const logoImg = new Image();
  logoImg.src = Logo;
  sidebar.prepend(logoImg);
})();
setTodos(getFromStorage("savedTodos"));
renderTodoItems();

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

const arrayToSort = [].concat(...Object.values(todos));
