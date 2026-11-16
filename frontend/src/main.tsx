import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "./context/UserContext.tsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <UserContextProvider>
    <BrowserRouter>
       <Toaster />
      <App />
    </BrowserRouter>
  </UserContextProvider>,
);

