import { format } from "date-fns";

import { todos } from "./todo.js";

// convert strings from user intput to variable names and vicebersa
function convertComputerStringToReadable(computerString) {
  // camelCase to spaces and uppercase initials
  let readableString = computerString.replace(/([A-Z])/g, " $1");
  // uppercase initials
  readableString = readableString.replace(/\b\w/g, (letter) => letter.toUpperCase());
  return readableString.trim();
}
function convertReadableToComputerString(readableString) {
  let computerString = readableString.toLowerCase();
  //remove spaces and add uppercase initials (camelCase)
  computerString = computerString.replace(/ (\w)/g, (match, letter) => letter.toUpperCase());
  return computerString;
}

//modal settings
function setModalTodoItem(timestamp) {
  const dialog = document.querySelector(`#item-${timestamp} dialog`);
  const showButton = document.querySelector(`#item-${timestamp} button`);
  const closeButton = document.querySelector(`#item-${timestamp} dialog button`);
  showButton.addEventListener("click", () => {
    dialog.showModal();
  });
  closeButton.addEventListener("click", () => {
    dialog.close();
  });
}

function setModalAddTodo() {
  const dialog = document.querySelector("#add-todo-modal");
  const showButton = document.querySelector("#add-todo button");
  const closeButton = document.querySelector("#add-todo-modal button");
  showButton.addEventListener("click", () => {
    dialog.showModal();
  });
  closeButton.addEventListener("click", () => {
    dialog.close();
  });
}

function setModalAddList() {
  const dialog = document.querySelector("#add-list-modal");
  const showButton = document.querySelector("#add-list-button");
  const closeButton = document.querySelector("#add-list-modal button");
  showButton.addEventListener("click", () => {
    dialog.showModal();
  });
  closeButton.addEventListener("click", () => {
    dialog.close();
  });
}

function setModalRenameList() {
  const dialog = document.querySelector("#rename-list-modal");
  const showButton = document.querySelector(".edit-list");
  const closeButton = document.querySelector("#rename-list-modal button");
  showButton.addEventListener("click", () => {
    dialog.showModal();
  });
  closeButton.addEventListener("click", () => {
    dialog.close();
  });
}

function renderTodoItems() {
  const todoContainer = document.querySelector(".todos-container");
  for (let key in todos) {
    if (todos.hasOwnProperty(key)) {
      todos[key].forEach((todo) => {
        const todoItem = document.createElement("div");
        todoItem.setAttribute("id", `item-${todo.timestamp}`);
        todoItem.classList.add("todo-item");
        todoItem.innerHTML = `
        <span class="material-symbols-outlined" id="check-${todo.timestamp}"></span>
        <p id="title-${todo.timestamp}">${todo.title}</p>
        <div class="todo-end">
          <span class="material-symbols-outlined" id="priority-${todo.timestamp}">exclamation</span>
          <p>${format(todo.dueDate, "dd-MM-yyyy")}</p>
          <p>${format(todo.dueDate, "HH:mm")}</p>
          <button><span class="material-symbols-outlined" id="view-"${
            todo.timestamp
          }">expand_content</span></button>
          <span class="material-symbols-outlined" id="edit-todo-"${todo.timestamp}">edit_note</span>
        `;
        // checkbox button (complete task)
        const checkButton = todoItem.querySelector(`#check-${todo.timestamp}`);
        !todo.complete
          ? (checkButton.textContent = "radio_button_unchecked")
          : (checkButton.textContent = "task_alt");
        //priority indicator
        const priorityIndicator = todoItem.querySelector(`#priority-${todo.timestamp}`);
        if (todo.priority === "high") {
          priorityIndicator.classList.add("red");
        } else if (todo.priority === "low") {
          priorityIndicator.classList.add("green");
        } else {
          priorityIndicator.classList.add("orange");
        }
        checkButton.addEventListener("click", () => {
          if (!todo.complete) {
            checkButton.textContent = "task_alt";
            todo.complete = true;
          } else {
            checkButton.textContent = "radio_button_unchecked";
            todo.complete = false;
          }
        });
        todoContainer.appendChild(todoItem);
        //setModalTodoItem(todo.timestamp);
      });
    }
  }
}

(function writeToday() {
  const currentDate = new Date();
  document.querySelector("#welcome-date").textContent = `${format(
    currentDate,
    "iiii, dd-MM-yyyy"
  )}`;
})();

export { setModalTodoItem, setModalAddTodo, setModalAddList, setModalRenameList, renderTodoItems };

/*

to test (to disable the whole div of the list when mouse is on the pointer)
// const dotsButtons = document.querySelectorAll('.dots');
// const listDivs = document.querySelectorAll('.lists-container > div');
dotsButton.forEach(function (element) {
  element.addEventListener("mouseenter", function () {
    listDivs.forEach(function (element) {
      element.classList.add("no-click");
    });
  });
  element.addEventListener("mouseleave", function () {
    listDivs.forEach(function (element) {
      element.classList.remove("no-click");
    });
  });
});

*/
