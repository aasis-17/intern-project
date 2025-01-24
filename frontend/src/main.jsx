import { BrowserRouter } from "react-router";
import { createRoot } from 'react-dom/client'
import ReactDOM from "react-dom"
import './index.css'
import App from './App.jsx'
import Modal from "./components/Modal.jsx";
import "@fontsource/eb-garamond"

ReactDOM.createPortal(<Modal />, document.getElementById("modal-root"))

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <App />
  </BrowserRouter>
)
