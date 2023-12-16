import { isAfter, parseISO } from "date-fns";

class Todo {
  constructor(title, dueDate, notes, priority, complete, list) {
    this.title = title;
    this.dueDate = parseISO(dueDate);
    this.notes = notes;
    this.priority = priority;
    this.complete = complete; //boolean. if true, disable "due" (include in isDue function)
    this.list = list;
    this.due = this.isDue();
    this.timestamp = Date.now(); //for ID purpose, but also for sorting (add date). the bigger, the newer
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
function addTodo(title, dueDate, notes, priority, complete, list) {
  let todo = new Todo(title, dueDate, notes, priority, complete);
  todos[list].push(todo);
}

//remove todo from the given array (list)
function removeTodo(list, timestamp) {
  const idx = todos[list].findIndex((obj) => obj.timestamp === timestamp);
  todos[list].splice(idx, 1);
}

//remove todo and create new one in its place
function editTodo(list, timestamp) {
  const idx = todos[list].findIndex((obj) => obj.timestamp === timestamp);
  let oldTodo = todos[list].splice(idx, 1);
  //keep old timestamp value
  let saveTimestamp = oldTodo[0].timestamp;
  let newTodo = new Todo(title, dueDate, notes, priority, complete);
  newTodo.timestamp = saveTimestamp;
  todos[list].push(newTodo);
}

//move todo from a list to another
function moveTodo(originList, destinationList, timestamp) {
  const idx = todos[originList].findIndex((obj) => obj.timestamp === timestamp);
  let todo = todos[originList].splice(idx, 1);
  todos[destinationList].push(todo);
}

//add new list array to todos object
function newList(newList) {
  todos[newList] = [];
}

//remove new list array
function removeList(list) {
  delete todos[list];
}

//rename list array
function renameList(list, newListName) {
  todos[newListName] = todos[list];
  delete todos[list];
}

const todos = {
  personal: [],
};
