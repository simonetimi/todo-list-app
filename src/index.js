import "./index.css";
import { addTodo, removeTodo, todos } from "./modules/todo.js";

if (process.env.NODE_ENV !== "production") {
  console.log("Looks like we are in development mode!");
}

//example for debug purpose
addTodo("Hi", "2022-12-12", "Hello world", "high", true, "personal");
console.log(todos);
