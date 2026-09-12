import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import Esim from "./pages/Esim";
import Giftcard from "./pages/Giftcard";
import Topup from "./pages/Topup";
import Success from "./pages/Success";

import "./app.css";

const getCleanPath = () => {
  const path = window.location.pathname.replace(/\/+$/, "").toLowerCase();
  return path === "" ? "/" : path;
};

const ROUTES = {
  "/": { Component: Home },
  "/checkout": { Component: Checkout },
  "/esim": { Component: Esim },
  "/esims": { Component: Esim },
  "/giftcard": { Component: Giftcard },
  "/gift-card": { Component: Giftcard },
  "/giftcards": { Component: Giftcard },
  "/topup": { Component: Topup },
  "/top-up": { Component: Topup },
  "/success": { Component: Success },
  "/order/success": { Component: Success },
};

export default function App() {
  const [path, setPath] = useState(getCleanPath);

  useEffect(() => {
    const handleNavigation = () => setPath(getCleanPath());
    window.addEventListener("popstate", handleNavigation);
    return () => window.removeEventListener("popstate", handleNavigation);
  }, []);

  const currentRoute = ROUTES[path] || ROUTES["/"];
  const { Component } = currentRoute;

  return (
    <div className="app">
      <main className="app-main">
        <Component />
      </main>
    </div>
  );
}