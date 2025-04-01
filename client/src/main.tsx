import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { WebApp } from './lib/telegram';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Initialize Telegram WebApp
WebApp.init();

// Set viewport
WebApp.setViewport();

createRoot(document.getElementById("root")!).render(<App />);
