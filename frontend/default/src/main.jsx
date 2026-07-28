import { BrowserRouter } from "react-router";
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "@fontsource/eb-garamond"
import { AuthProvider } from "./store/authContext.jsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {ToastContainer} from "react-toastify"
import { NetworkProvider } from "./store/networkContext.jsx";
import Error from "./pages/Error.jsx";
import { SocketProvider } from "./store/socketContext.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Do not retry if offline
        if (!navigator.onLine) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false, // default: true
    },
  },
})


createRoot(document.getElementById('root')).render(
  <NetworkProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <BrowserRouter>
        
            <App />
          {/* <Error mode="offline" /> */}
          </BrowserRouter>
          <ToastContainer />

        </SocketProvider>

      </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>
  </NetworkProvider>

)
