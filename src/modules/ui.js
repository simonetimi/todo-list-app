import { format, parseISO } from "date-fns";

import { todos, addTodo, editTodo, saveName, removeTodo } from "./data.js";

(function init() {
  setModalAddTodo();
  setModalAddList();
  listenForName();
  writeToday();
  captureAddTodoModal();
  preventFormsSubmit();
})();

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

//basic modal settings

function setModalAddTodo() {
  const dialog = document.querySelector("#add-todo-modal");
  const showButton = document.querySelector("#add-todo button");
  const closeButton = document.querySelector("#add-todo-modal button");
  const form = document.querySelector(".add-todo-modal-container");
  showButton.addEventListener("click", () => {
    listOfListsGeneratorforAdd(todos);
    dialog.showModal();
  });
  closeButton.addEventListener("click", () => {
    dialog.close();
    form.reset();
  });
}

function setModalEditTodo(timestamp) {
  const dialog = document.querySelector(`#edit-todo-modal-${timestamp}`);
  const showButton = document.querySelector(`#edit-button-${timestamp}`);
  const closeButton = document.querySelector(`#edit-todo-modal-${timestamp} button`);
  const form = document.querySelector(`#edit-todo-modal-${timestamp} form`);
  showButton.addEventListener("click", () => {
    listOfListsGeneratorForEdit(todos, timestamp);
    dialog.showModal();
  });
  closeButton.addEventListener("click", () => {
    dialog.close();
    form.reset();
  });
}

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

// variables controlling current list viewed and sorting setting
// rules: home renders every list sorted in due date
// additional sorting: alphabetical order, due order

let uiSettings = {
  sorting: "manual",
  currentList: "home",
};

function renderTodoItems() {
  if (uiSettings.currentList === "home") {
    const todoContainer = document.querySelector(".todos-container");
    todoContainer.innerHTML = "";
    const arrayToSort = [].concat(...Object.values(todos));
    //sorting by due date
    const sortedArray = arrayToSort.sort((a, b) =>
      a.dueDate < b.dueDate ? 1 : a.dueDate > b.dueDate ? -1 : 0
    );
    sortedArray.forEach((todo) => {
      const todoItem = document.createElement("div");
      todoItem.setAttribute("id", `item-${todo.timestamp}`);
      todoItem.classList.add("todo-item");
      todoItem.innerHTML = generateTodoItemUI(todo);
      // check if due
      if (todo.due) {
        const datePara = todoItem.querySelectorAll(".todo-end > p");
        datePara.forEach((element) => {
          element.classList.add("due");
        });
      }
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
      setModalEditTodo(todo.timestamp);
      captureEditTodoModal(todo.timestamp, todo.list);
    });
  }
}

//function that stores the rendered UI for a single todo item
function generateTodoItemUI(todo) {
  const isoDueDate = new Date(todo.dueDate);
  return `<span class="material-symbols-outlined" id="check-${todo.timestamp}"></span>
  <p id="title-${todo.timestamp}">${todo.title}</p>
<div class="todo-end">
  <span class="material-symbols-outlined" id="priority-${todo.timestamp}">exclamation</span>
  <p>${format(isoDueDate, "dd/MM/yyyy")}</p>
  <p>${format(isoDueDate, "HH:mm")}</p>
  <button><span class="material-symbols-outlined">expand_content</span></button>
  <span class="material-symbols-outlined" id="edit-button-${todo.timestamp}">edit_note</span>
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
      <p>${format(isoDueDate, "dd/MM/yyyy")}</p>
      <p>${format(isoDueDate, "HH:mm")}</p>
    </div>
    <p>${todo.title}</p>
    <p>${todo.notes}</p>
  </div>
</dialog>
<!-- Modal to edit todo (dialog) -->
<dialog id="edit-todo-modal-${todo.timestamp}" class="edit-todo-modal">
<button><span class="material-symbols-outlined">collapse_content</span></button>
<form class="edit-todo-modal-container" id="edit-todo-modal-container-${
    todo.timestamp
  }" action="#" method="post">
  <div class="edit-todo-modal-container-left">
    <label for="title">Title</label>
    <input type="text" id="title" tabindex="1" maxlength="30" minlength="2" value="${
      todo.title
    }" required />
    <label for="dueDate"">Due Date</label>
    <input type="datetime-local" id="dueDate" tabindex="2" value="${format(
      isoDueDate,
      "yyyy-MM-dd"
    )}T${format(isoDueDate, "hh:mm")}" required />
    <label for="notes">Notes</label>
    <textarea id="notes" maxlength="160" tabindex="3">${todo.notes}</textarea>
  </div>
  <div class="edit-todo-modal-container-right">
    <label for="priority">Priority</label>
    <select id="priority" tabindex="4">
      <option value="low">Low</option>
      <option value="normal">Normal</option>
      <option value="hight">High</option>
    </select>
    <label for="list">List</label>
    <select id="list-${todo.timestamp}" tabindex="5" value="${todo.list}>"></select>
    <div class="edit-buttons">
     <div id="submit-editTodo-${todo.timestamp}" class="new-element">
       <span class="material-symbols-outlined">add</span>
       <p>Save</p>
       </div>
       <div id="submit-deleteTodo-${todo.timestamp}" class="new-element">
       <span class="material-symbols-outlined">delete</span>
       <p>Delete</p>
     </div>
    </div>
  </div>
</form>
</dialog>
  `;
}

// add todo modal functions

function listOfListsGeneratorforAdd(obj) {
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

function captureAddTodoModal() {
  const addTodoModal = document.querySelector("#add-todo-modal");
  const form = addTodoModal.querySelector(".add-todo-modal-container");
  const addTodoModalSubmit = addTodoModal.querySelector("#submit-newToDo");
  addTodoModalSubmit.addEventListener("click", () => {
    let title = addTodoModal.querySelector("#title").value;
    let dueDate = addTodoModal.querySelector("#dueDate").value;
    let notes = addTodoModal.querySelector("#notes").value;
    let priority = addTodoModal.querySelector("#priority").value;
    let list = addTodoModal.querySelector("#list").value;
    if (dueDate === "" || title === "") {
      return;
    }
    addTodo(title, dueDate, notes, priority, list);
    renderTodoItems();
    addTodoModal.close();
    form.reset();
  });
}

//edit todo modal functions

function listOfListsGeneratorForEdit(obj, timestamp) {
  const listSelectModal = document.querySelector(`#list-${timestamp}`);
  listSelectModal.innerHTML = "";
  for (let key in obj) {
    const option = document.createElement("option");
    const valueAsString = String(key);
    option.setAttribute("value", valueAsString);
    option.textContent = convertComputerStringToReadable(valueAsString);
    listSelectModal.appendChild(option);
  }
}

//BUGS TO FIX
// 3. style the modal properly (CSS)
function captureEditTodoModal(timestamp, list) {
  const editTodoModal = document.querySelector(`#edit-todo-modal-${timestamp}`);
  const form = document.querySelector(`#edit-todo-modal-container-${timestamp}`);
  const editTodoModalSubmit = document.querySelector(`#submit-editTodo-${timestamp}`);
  editTodoModalSubmit.addEventListener("click", () => {
    const newTitle = editTodoModal.querySelector("#title").value;
    const newDueDate = editTodoModal.querySelector("#dueDate").value;
    const newNotes = editTodoModal.querySelector("#notes").value;
    const newPriority = editTodoModal.querySelector("#priority").value;
    const newList = editTodoModal.querySelector(`#list-${timestamp}`).value;
    if (dueDate === "" || title === "") {
      return;
    }
    editTodo(list, timestamp, newTitle, newDueDate, newNotes, newPriority, newList);
    renderTodoItems();
    editTodoModal.close();
    form.reset();
  });
  const deleteTodoModalSubmit = document.querySelector(`#submit-deleteTodo-${timestamp}`);
  deleteTodoModalSubmit.addEventListener("click", () => {
    removeTodo(list, timestamp);
    renderTodoItems();
    editTodoModal.close();
    form.reset();
  });
}

//header

function listenForName() {
  const usernameForm = document.querySelector("#username-form");
  const usernameInput = document.querySelector("#username");
  usernameForm.addEventListener("submit", (event) => {
    event.preventDefault();
    writeName(usernameInput.value);
    saveName(usernameInput.value);
  });
}

function writeName(usernameValue) {
  const welcomeNameDiv = document.querySelector("#welcome-name");
  welcomeNameDiv.innerHTML = "";
  const welcomeNamePara = document.createElement("p");
  welcomeNamePara.innerHTML = `Welcome, ${usernameValue} <span>&#x1F44B;</span>`;
  welcomeNameDiv.appendChild(welcomeNamePara);
}

function writeToday() {
  const currentDate = new Date();
  document.querySelector("#welcome-date").textContent = `${format(
    currentDate,
    "iiii, dd/MM/yyyy"
  )}`;
}

function preventFormsSubmit() {
  const formsArray = document.querySelectorAll("form");
  formsArray.forEach((element) => {
    element.addEventListener("submit", (event) => {
      event.preventDefault();
    });
  });
}

export { setModalTodoItem, setModalRenameList, renderTodoItems, uiSettings, writeName };
