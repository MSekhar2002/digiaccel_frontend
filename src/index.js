import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import TodoProvider from "./TodoProvider";
import AppWrapper from "./AppWrapper";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <TodoProvider>
      <AppWrapper />
    </TodoProvider>{" "}
  </React.StrictMode>
);
