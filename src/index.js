import "./index.css";
import loadModule from "./modules/module.js";

if (process.env.NODE_ENV !== "production") {
  console.log("Looks like we are in development mode!");
}

document.body.appendChild(loadModule());
