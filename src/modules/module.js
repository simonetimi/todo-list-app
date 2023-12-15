export default function loadModule() {
  console.log("This is the first module!");

  const element = document.createElement("div");
  element.classList.add("module");

  return element;
}
