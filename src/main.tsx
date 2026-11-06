import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initFortressGuard } from "./utils/fortressGuard";
import { preloadAllAssetLogos } from "./utils/assetImages";

// Activate client Fortress security shield and pre-cache asset logos
initFortressGuard();
preloadAllAssetLogos();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
