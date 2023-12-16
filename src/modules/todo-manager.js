import { isAfter, parseISO } from "date-fns";

class Todo {
  constructor(title, dueDate, notes, priority, complete, list) {
    this.title = title;
    this.dueDate = parseISO(dueDate);
    this.notes = notes;
    this.priority = priority;
    this.complete = complete; //boolean. if true, disable "due"
    this.list = list;
    this.due = this.isDue();
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

export function addTodo(title, dueDate, notes, priority, complete, list) {
  let todo = new Todo(title, dueDate, notes, priority, complete, list);
  todos.push(todo);
}

export function removeTodo(idx) {
  todos.splice(idx, 1);
}

//export for debug purposes
export const todos = [];
