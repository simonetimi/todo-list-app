import { isAfter } from "date-fns";

import { getFromStorage, saveToStorage } from "./storage.js";
import { writeName } from "./ui.js";

let todos = {
  personal: [],
};

//function to update todos in different modules
function setTodos(newTodos) {
  if (newTodos === null) {
    return;
  } else {
    todos = newTodos;
  }
}

class Todo {
  constructor(title, dueDate, notes, priority, list) {
    this.title = title;
    this.dueDate = new Date(dueDate);
    this.notes = notes;
    this.priority = Number(priority);
    this.list = list;
    this.complete = false; //boolean. if true, disable "due" (include in isDue function)
    this.due = this.isDue();
    this.timestamp = Date.now(); //for ID purposes, but also for sorting (add date). the bigger, the newer
  }
  isDue() {
    const today = new Date();
    const dueDate = this.dueDate;
    if (isAfter(today, dueDate) && this.complete === false) {
      return true;
    } else {
      return false;
    }
  }
}

//add todo to the given array (list value being selectable on UI)
function addTodo(title, dueDate, notes, priority, list) {
  const todo = new Todo(title, dueDate, notes, priority, list);
  todos[list].push(todo);
  saveToStorage("savedTodos", todos);
}

//remove todo from the given array (list)
function removeTodo(list, timestamp) {
  const idx = todos[list].findIndex((obj) => obj.timestamp === timestamp);
  if (idx !== -1) {
    todos[list].splice(idx, 1);
  }
  saveToStorage("savedTodos", todos);
}

//remove todo and create new one in its place
function editTodo(list, timestamp, newTitle, newDueDate, newNotes, newPriority, newList) {
  const idx = todos[list].findIndex((obj) => obj.timestamp === timestamp);
  if (idx !== -1) {
    let oldTodo = todos[list].splice(idx, 1);
    //keep old timestamp value
    let savedTimestamp = oldTodo[0].timestamp;
    let newTodo = new Todo(newTitle, newDueDate, newNotes, newPriority, newList);
    newTodo.timestamp = savedTimestamp;
    todos[newList].push(newTodo);
    saveToStorage("savedTodos", todos);
  }
}

//move todo from a list to another
function moveTodo(originList, destinationList, timestamp) {
  const idx = todos[originList].findIndex((obj) => obj.timestamp === timestamp);
  if (idx !== -1) {
    let todo = todos[originList].splice(idx, 1);
    // returns an array with one object. you need the spread operator to push it as an object
    todos[destinationList].push(...todo);
    saveToStorage("savedTodos", todos);
  }
}

//add new list array to todos object
function addList(newList) {
  todos[newList] = [];
  saveToStorage("savedTodos", todos);
}

//remove new list array
function removeList(list) {
  delete todos[list];
  saveToStorage("savedTodos", todos);
}

//rename list array
function renameList(listToRename, newListName) {
  const temp = [...todos[listToRename]];
  delete todos[listToRename];
  todos[newListName] = temp;
  todos[newListName].forEach((todo) => {
    todo.list = newListName;
  });

  saveToStorage("savedTodos", todos);
}

//part to manage username
let username = getFromStorage("username");

(function checkName() {
  if (username !== null) {
    writeName(username);
  } else {
    return;
  }
})();

function saveName(nameFromForm) {
  saveToStorage("username", nameFromForm);
}

export {
  addTodo,
  removeTodo,
  editTodo,
  moveTodo,
  addList,
  removeList,
  renameList,
  setTodos,
  todos,
  username,
  saveName,
};
