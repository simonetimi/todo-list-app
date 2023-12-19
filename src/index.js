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
import {
  setModalTodoItem,
  setModalAddTodo,
  setModalAddList,
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

addTodo(
  "Hi",
  "2017-06-01T08:30",
  "Hello world more notes notes more notesnotesmore notes notes more notes notes more notes notes",
  "high",
  false,
  "personal"
);
addList("peracotta");
addTodo("Altro todo", "2014-01-01T08:30", "Hello cookie", "low", true, "peracotta");

console.log(todos);

setModalAddTodo();
setModalAddList();
setModalRenameList();

renderTodoItems();
