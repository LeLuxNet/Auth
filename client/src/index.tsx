import React from "react";
import ReactDOM from "react-dom";
import { data, register } from "./api";

function App() {
  return (
    <>
      <h1>Auth</h1>
      <button
        onClick={() => {
          register({
            method: "password",
            email: prompt("email")!,
            username: prompt("username")!,
            password: prompt("password")!,
          });
        }}
      >
        Register
      </button>
      <button onClick={() => data().then((res) => console.log(res.data.data))}>
        Get data
      </button>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
