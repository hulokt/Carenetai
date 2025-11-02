import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Buffer } from "buffer";

// Polyfill Buffer for browser
window.Buffer = Buffer;
globalThis.Buffer = Buffer;

import { StateContextProvider } from "./context";
import App from "./App";
import "./index.css";
import { PrivyProvider } from "@privy-io/react-auth";
import logoImage from "./assets/Carenetai_logo.png";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <PrivyProvider
    appId="cmhgn8qmu019clb0b0ww833vl"
    config={{
      appearance: {
        theme: "light",
        accentColor: "#1F4E89",
        landingHeader: "Welcome to Carenetai",
        loginMessage: "A community for cancer",
        logo: logoImage,
        walletList: [],
      },
      loginMethods: ["email", "sms"],
      embeddedWallets: {
        createOnLogin: "users-without-wallets",
      },
    }}
  >
    <Router>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </Router>
  </PrivyProvider>,
);
