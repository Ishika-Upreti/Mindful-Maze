// main.jsx : React app ko browser me render karta hai
// Entry point hota hai React app ka

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // Game logic
import "./index.css"; // Styling

// Browser ke index.html me ek <div id="root"></div> hota hai
// React uske andar pura UI inject karta hai
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
