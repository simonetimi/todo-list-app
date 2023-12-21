import { format, parseISO } from "date-fns";

import { todos, addTodo, saveName } from "./data.js";

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

(function setModalAddTodo() {
  const dialog = document.querySelector("#add-todo-modal");
  const showButton = document.querySelector("#add-todo button");
  const closeButton = document.querySelector("#add-todo-modal button");
  const form = document.querySelector(".add-todo-modal-container");
  showButton.addEventListener("click", () => {
    listOfListsGenerator(todos);
    dialog.showModal();
  });
  closeButton.addEventListener("click", () => {
    dialog.close();
    form.reset();
  });
})();

(function setModalAddList() {
  const dialog = document.querySelector("#add-list-modal");
  const showButton = document.querySelector("#add-list-button");
  const closeButton = document.querySelector("#add-list-modal button");
  showButton.addEventListener("click", () => {
    dialog.showModal();
  });
  closeButton.addEventListener("click", () => {
    dialog.close();
  });
})();

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

// viariable (sorting)the controls the current sorting method
// variable (currentList) that controls which list the user is viewing
// default is home: renders all non complete tasks
let uiSettings = {
  sorting: "manual",
  currentList: "home",
};

function renderTodoItems() {
  if (uiSettings.currentList === "home") {
    const todoContainer = document.querySelector(".todos-container");
    todoContainer.innerHTML = "";
    for (let key in todos) {
      if (todos.hasOwnProperty(key)) {
        todos[key].forEach((todo) => {
          const todoItem = document.createElement("div");
          todoItem.setAttribute("id", `item-${todo.timestamp}`);
          todoItem.classList.add("todo-item");
          todoItem.innerHTML = generateTodoItemUI(todo);
          // checkbox button (complete task)
          const checkButton = todoItem.querySelector(`#check-${todo.timestamp}`);
          !todo.complete
            ? (checkButton.textContent = "radio_button_unchecked")
            : (checkButton.textContent = "task_alt");
          //priority indicator
          const priorityIndicator = todoItem.querySelector(`#priority-${todo.timestamp}`);
          const priorityIndicatorModal = todoItem.querySelector(
            `#modal-priority-todo-${todo.timestamp}`
          );
          if (todo.priority === "high") {
            priorityIndicator.classList.add("red");
            priorityIndicatorModal.classList.add("red");
          } else if (todo.priority === "low") {
            priorityIndicator.classList.add("green");
            priorityIndicatorModal.classList.add("green");
          } else {
            priorityIndicator.classList.add("orange");
            priorityIndicatorModal.classList.add("orange");
          }
          checkButton.addEventListener("click", () => {
            if (!todo.complete) {
              todo.complete = true;
              renderTodoItems();
            } else {
              todo.complete = false;
              renderTodoItems();
            }
          });
          todoContainer.appendChild(todoItem);
          setModalTodoItem(todo.timestamp);
        });
      }
    }
  }
}

//function that stores the rendered UI for a single todo item
function generateTodoItemUI(todo) {
  return `<span class="material-symbols-outlined" id="check-${todo.timestamp}"></span>
<p id="title-${todo.timestamp}">${todo.title}</p>
<div class="todo-end">
  <span class="material-symbols-outlined" id="priority-${todo.timestamp}">exclamation</span>
  <p>${format(parseISO(todo.dueDate), "dd/MM/yyyy")}</p>
  <p>${format(parseISO(todo.dueDate), "HH:mm")}</p>
  <button><span class="material-symbols-outlined" id="view-"${
    todo.timestamp
  }">expand_content</span></button>
  <span class="material-symbols-outlined" id="edit-todo-"${todo.timestamp}">edit_note</span>
  </div>
  <!-- Modal to view todo (dialog) -->
  <dialog class="view-todo-modal">
  <div class="view-todo-modal-container">
    <div class="todo-view-start">
      <button>
        <span class="material-symbols-outlined">collapse_content</span>
      </button>
      <span class="material-symbols-outlined" id="modal-priority-todo-${
        todo.timestamp
      }">exclamation</span>
      <p>${format(parseISO(todo.dueDate), "dd/MM/yyyy")}</p>
      <p>${format(parseISO(todo.dueDate), "HH:mm")}</p>
    </div>
    <p>${todo.title}</p>
    <p>${todo.notes}</p>
  </div>
</dialog>
  `;
}

function listOfListsGenerator(obj) {
  const listSelectModal = document.querySelector("#list");
  listSelectModal.innerHTML = "";
  for (let key in obj) {
    const option = document.createElement("option");
    const valueAsString = String(key);
    option.setAttribute("value", valueAsString);
    option.textContent = convertComputerStringToReadable(valueAsString);
    listSelectModal.appendChild(option);
  }
}

(function listenForName() {
  const usernameForm = document.querySelector("#username-form");
  const usernameInput = document.querySelector("#username");
  usernameForm.addEventListener("submit", (event) => {
    event.preventDefault();
    writeName(usernameInput.value);
    saveName(usernameInput.value);
  });
})();

function writeName(usernameValue) {
  const welcomeNameDiv = document.querySelector("#welcome-name");
  welcomeNameDiv.innerHTML = "";
  const welcomeNamePara = document.createElement("p");
  welcomeNamePara.innerHTML = `Welcome, ${usernameValue} <span>&#x1F44B;</span>`;
  welcomeNameDiv.appendChild(welcomeNamePara);
}

(function writeToday() {
  const currentDate = new Date();
  document.querySelector("#welcome-date").textContent = `${format(
    currentDate,
    "iiii, dd/MM/yyyy"
  )}`;
})();

(function captureAddTodoModal() {
  const addTodoModal = document.querySelector("#add-todo-modal");
  const form = document.querySelector(".add-todo-modal-container");
  const addTodoModalSubmit = document.querySelector("#submit-newToDo");
  addTodoModalSubmit.addEventListener("click", () => {
    let title = addTodoModal.querySelector("#title").value;
    let dueDate = addTodoModal.querySelector("#dueDate").value;
    let notes = addTodoModal.querySelector("#notes").value;
    let priority = addTodoModal.querySelector("#priority").value;
    let list = addTodoModal.querySelector("#list").value;
    if (dueDate === "") {
      return;
    }
    addTodo(title, dueDate, notes, priority, list);
    renderTodoItems();
    const dialog = document.querySelector("#add-todo-modal");
    dialog.close();
    form.reset();
  });
})();

(function preventFormsSubmit() {
  const formsArray = document.querySelectorAll("form");
  formsArray.forEach((element) => {
    element.addEventListener("submit", (event) => {
      event.preventDefault();
    });
  });
})();

export { setModalTodoItem, setModalRenameList, renderTodoItems, uiSettings, writeName };
