import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // ya app.css jahan tailwind directives hain
import { AuthProvider } from "./context/AuthProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthProvider>
        <div className="dark:bg-slate-900 dark:text-white">
        <App />

        </div>
    </AuthProvider>
);
