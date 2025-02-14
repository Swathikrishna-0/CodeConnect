import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App.jsx";
import "./index.scss";

const CLERK_FRONTEND_API = "pk_test_Zml0LXN0dWQtMTEuY2xlcmsuYWNjb3VudHMuZGV2JA"; // Replace with your Clerk API key

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={CLERK_FRONTEND_API}>
      <App />
    </ClerkProvider>
  </StrictMode>
);
