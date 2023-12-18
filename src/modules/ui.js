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
  const dialog = document.querySelector(`#t${timestamp} dialog`);
  const showButton = document.querySelector(`#t${timestamp} button`);
  const closeButton = document.querySelector(`#t${timestamp} dialog button`);
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

export { setModalTodoItem, setModalAddTodo, setModalAddList };

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
