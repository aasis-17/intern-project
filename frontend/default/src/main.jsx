import { BrowserRouter } from "react-router";
import { createRoot } from 'react-dom/client'
import ReactDOM from "react-dom"
import './index.css'
import App from './App.jsx'
import Modal from "./components/Modal.jsx";
import "@fontsource/eb-garamond"
import { AuthProvider } from "./store/authContext.jsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

ReactDOM.createPortal(<Modal />, document.getElementById("modal-root"))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
})


createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
    
        <App />
   
      </BrowserRouter>
    </AuthProvider>
  <ReactQueryDevtools initialIsOpen={false}/>
  </QueryClientProvider>
)
