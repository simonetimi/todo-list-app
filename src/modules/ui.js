import { format } from "date-fns";

import {
  todos,
  addTodo,
  editTodo,
  saveName,
  removeTodo,
  addList,
  renameList,
  removeList,
} from "./data.js";
import { saveToStorage, getFromStorage } from "./storage.js";

(function init() {
  setModalAddTodo();
  setModalAddList();
  listenForName();
  writeToday();
  captureAddTodoModal();
  preventFormsSubmit();
  addNewList();
  sortingSetter();
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

let uiSettings = {
  sorting: "dueDate",
  currentList: "home",
};

function sortingSetter() {
  const sortingButton = document.querySelector(".controls");
  const sortingDisplay = sortingButton.querySelector("p");
  sortingButton.addEventListener("click", () => {
    if (uiSettings.sorting === "dueDate") {
      uiSettings.sorting = "priority";
      sortingDisplay.innerText = "Sort by priority";
    } else if (uiSettings.sorting === "priority") {
      uiSettings.sorting = "dueDate";
      sortingDisplay.innerText = "Sort by date";
    }
    sortAndRender();
  });
}

function sortAndRender() {
  let arrayToSort = [];
  if (uiSettings.currentList === "home") {
    arrayToSort = [].concat(...Object.values(todos));
  } else {
    arrayToSort = todos[uiSettings.currentList];
  }
  //regardless of sorting selected, sort by due date
  let tempArray = sortArrayByDueDate(arrayToSort);
  if (uiSettings.sorting === "priority") {
    tempArray = sortArrayByPriority(tempArray);
  }
  const arrayToRender = sortArrayByComplete(tempArray);
  renderTodoItems(arrayToRender);
}

function sortArrayByDueDate(arrayToSort) {
  const sortedArrayByDueDate = arrayToSort.toSorted((a, b) =>
    a.dueDate < b.dueDate ? 1 : a.dueDate > b.dueDate ? -1 : 0
  );
  return sortedArrayByDueDate;
}

function sortArrayByComplete(arrayToSort) {
  const sortedArrayByComplete = arrayToSort.toSorted(
    (a, b) => Number(a.complete) - Number(b.complete)
  );
  return sortedArrayByComplete;
}

function sortArrayByPriority(arrayToSort) {
  const sortedArrayByPriority = arrayToSort.toSorted((a, b) => b.priority - a.priority);
  return sortedArrayByPriority;
}

function renderTodoItems(arrayToRender) {
  const todoContainer = document.querySelector(".todos-container");
  todoContainer.innerHTML = "";
  arrayToRender.forEach((todo) => {
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
    const priorityIndicatorModal = todoItem.querySelector(`#modal-priority-todo-${todo.timestamp}`);
    if (todo.priority === 2) {
      priorityIndicator.classList.add("red");
      priorityIndicatorModal.classList.add("red");
    } else if (todo.priority === 0) {
      priorityIndicator.classList.add("green");
      priorityIndicatorModal.classList.add("green");
    } else {
      priorityIndicator.classList.add("orange");
      priorityIndicatorModal.classList.add("orange");
    }
    checkButton.addEventListener("click", () => {
      if (!todo.complete) {
        todo.complete = true;
        sortAndRender();
      } else {
        todo.complete = false;
        sortAndRender();
      }
    });
    todoContainer.appendChild(todoItem);
    setModalTodoItem(todo.timestamp);
    setModalEditTodo(todo.timestamp);
    captureEditTodoModal(todo.timestamp, todo.list);
  });
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
    if (dueDate === "" || title === "" || list === "") {
      return;
    }
    addTodo(title, dueDate, notes, priority, list);
    sortAndRender();
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
    sortAndRender();
    editTodoModal.close();
    form.reset();
  });
  const deleteTodoModalSubmit = document.querySelector(`#submit-deleteTodo-${timestamp}`);
  deleteTodoModalSubmit.addEventListener("click", () => {
    removeTodo(list, timestamp);
    sortAndRender();
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

//navbar

let listColor = {
  personal: "#a7c7e7",
};

function setModalRenameList(originalListName) {
  // Keep track of the current list name
  let currentListName = originalListName;
  const dialog = document.getElementById(`rename-list-modal-${originalListName}`);
  const showButton = document.getElementById(`edit-${originalListName}`);
  const closeButton = document.getElementById(`collapse-button-${originalListName}`);
  showButton.addEventListener("click", () => {
    dialog.showModal();
  });
  closeButton.addEventListener("click", () => {
    dialog.close();
  });
  const saveEditsButton = document.getElementById(`save-list-edits-${originalListName}`);
  const editListInput = document.getElementById(`rename-list-${originalListName}`);
  const editColorInput = document.getElementById(`edit-list-color-${originalListName}`);
  saveEditsButton.addEventListener("click", () => {
    const renamedList = convertReadableToComputerString(editListInput.value);
    renameList(currentListName, renamedList);
    listColor[renamedList] = editColorInput.value;
    // Update the current list name for future reference
    if (currentListName !== renamedList) {
      delete listColor[currentListName];
      currentListName = renamedList;
    }
    saveToStorage("listColor", listColor);
    renderLists(todos);
    sortAndRender();
    dialog.close();
  });
  const deleteButton = document.getElementById(`delete-list-edits-${originalListName}`);
  deleteButton.addEventListener("click", () => {
    removeList(originalListName);
    renderLists(todos);
    sortAndRender();
    dialog.close();
  });
}

function renderLists(obj) {
  const listsContainer = document.querySelector(".lists-container");
  listsContainer.innerHTML = "";
  listsContainer.innerHTML = `
  <div id="home-list">
  <span class="material-symbols-outlined">home</span>
  <p>Home</p>
  </div>
  `;
  const sortedList = sortObjectKeysAlphabetically(obj);
  for (let key in sortedList) {
    const listItem = generateTodoList(key);
    listsContainer.insertAdjacentHTML("beforeend", listItem);
    const divList = document.getElementById(`div-${key}`);
    divList.addEventListener("click", () => {
      uiSettings.currentList = key;
      sortAndRender();
    });
    setModalRenameList(key);
  }
  document.getElementById("home-list").addEventListener("click", () => {
    uiSettings.currentList = "home";
    sortAndRender();
  });
}

function sortObjectKeysAlphabetically(obj) {
  const keys = Object.keys(obj).sort();
  const sortedObj = {};
  keys.forEach((key) => {
    sortedObj[key] = obj[key];
  });
  return sortedObj;
}

function generateTodoList(list) {
  return `
  <div id="div-${list}">
  <span class="material-symbols-outlined" style="color: ${listColor[list]}"
    >radio_button_unchecked</span
  >
  <p>${convertComputerStringToReadable(list)}</p>
  </div>
  <span class="material-symbols-outlined edit-list" id="edit-${list}">edit</span>
<!-- Modal for renaming the list (dialog) -->
<dialog id="rename-list-modal-${list}">
  <span class="material-symbols-outlined" id="collapse-button-${list}">collapse_content</span>
  <form class="rename-list-modal-container">
    <label for="newlist">Edit list</label>
    <div>
      <input type="text" id="rename-list-${list}" value="${convertComputerStringToReadable(list)}"/>
      <input type="color" value="${
        listColor[list]
      }" id="edit-list-color-${list}" class="rename-list-color-input" />
      <span class="material-symbols-outlined" id="save-list-edits-${list}">done</span>
      <span class="material-symbols-outlined delete-list" id="delete-list-edits-${list}">delete</span>
    </div>
  </form>
</dialog>
<!-- end modal -->
  `;
}

function setColors(newListColor) {
  if (newListColor === null) {
    return;
  } else {
    listColor = newListColor;
  }
}

function addNewList() {
  const newListInput = document.querySelector("#newlist");
  const newListColor = document.querySelector("#newlistcolor");
  const newListButton = document.querySelector("#submit-new-list");
  newListButton.addEventListener("click", () => {
    const computerNewListInput = convertReadableToComputerString(newListInput.value);
    addList(computerNewListInput);
    listColor[computerNewListInput] = newListColor.value;
    saveToStorage("listColor", listColor);
    //function to render list
    const dialog = document.querySelector("#add-list-modal");
    const form = document.querySelector(".add-list-modal-container");
    renderLists(todos);
    dialog.close();
    form.reset();
  });
}

function preventFormsSubmit() {
  const formsArray = document.querySelectorAll("form");
  formsArray.forEach((element) => {
    element.addEventListener("submit", (event) => {
      event.preventDefault();
    });
  });
}

export {
  setModalTodoItem,
  setModalRenameList,
  sortAndRender,
  uiSettings,
  writeName,
  setColors,
  renderLists,
};
