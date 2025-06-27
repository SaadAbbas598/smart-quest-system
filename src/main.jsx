import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./context/themeContext";
import "./index.css";
import "./global.css";
import { NotificationProvider } from "./context/notificationContext";
import { HiddenFieldProvider } from "./context/hiddenValueContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <HiddenFieldProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </HiddenFieldProvider>
    </ThemeProvider>
  </React.StrictMode>
);
