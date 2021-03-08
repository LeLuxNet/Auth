import React from "react";
import ReactDOM from "react-dom";
import { register } from "./api.ts";

function App() {
  return (
    <>
      <h1>Auth</h1>
      <button
        onClick={() => {
          register({
            method: "password",
            email: prompt("email"),
            username: prompt("username"),
            password: prompt("password"),
          });
        }}
      >
        Register
      </button>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
