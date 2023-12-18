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
  todos,
} from "./modules/todo.js";
import { setModalTodoItem, setModalAddTodo, setModalAddList } from "./modules/ui.js";

if (process.env.NODE_ENV !== "production") {
  console.log("Looks like we are in development mode!");
}

//testing

// Assicurati di chiamare la funzione setModal
setModalTodoItem("0859375933");
setModalTodoItem("6859375907");
setModalTodoItem("3259353941");
setModalAddTodo();
setModalAddList();

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

addTodo("Hi", "2022-12-12", "Hello world", "high", false, "personal");
addList("peracotta");
addTodo("Altro todo", "2024-12-12", "Hello cookie", "low", true, "peracotta");

console.log(todos);
