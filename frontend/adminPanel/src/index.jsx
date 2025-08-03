import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import App from "./App";
import { Provider } from "react-redux";
import store from "./store/store";
import { ToastContainer } from "react-toastify";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <BrowserRouter future={{ v7_startTransition: true }}>
      <App />
    </BrowserRouter>
    <ToastContainer />
  </Provider>
);
