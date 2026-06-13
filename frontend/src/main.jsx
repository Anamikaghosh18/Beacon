import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App.jsx";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
console.log("VITE_CLERK_PUBLISHABLE_KEY=", PUBLISHABLE_KEY);

function MissingKeyNotice() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 720, textAlign: "center" }}>
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>
          Missing Clerk Publishable Key
        </h2>
        <p style={{ color: "#666", marginBottom: 12 }}>
          The app needs a Clerk publishable key to render authentication pages.
        </p>
        <pre
          style={{
            background: "#f6f8fa",
            padding: 12,
            borderRadius: 6,
            textAlign: "left",
          }}
        >
          {`VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here`}
        </pre>
        <p style={{ color: "#666", marginTop: 12 }}>
          Create a `.env` file in the `frontend` folder (copy from
          `.env.example`) and restart the dev server.
        </p>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      {PUBLISHABLE_KEY ? (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
          <App />
        </ClerkProvider>
      ) : (
        <MissingKeyNotice />
      )}
    </BrowserRouter>
  </StrictMode>,
);
