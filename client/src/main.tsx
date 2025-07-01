import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {App} from "./App.tsx";
import { ErrorBoundary } from "react-error-boundary";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div>
          Error: {error.message}{" "}
          <button onClick={resetErrorBoundary}>Try again</button>
        </div>
      )}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </StrictMode>,
);
