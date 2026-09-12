import { useEffect, useState } from "react";
import "./Navbar.css"; // Ensure your CSS file is imported here

const NAV_LINKS = [
  { href: "#topup", label: "Mobile Top Up" },
  { href: "#services", label: "Data" },
  { href: "#services", label: "eSIM" },
  { href: "#services", label: "Gift Cards" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Close the mobile menu on Escape, and lock body scroll while open
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <a href="/" className="logo">
          <div className="logo-icon">⚡</div>

          <div>
            <div className="logo-text">
              Global<span>Connect</span>
            </div>
            <div className="logo-subtitle">Digital Services</div>
          </div>
        </a>

        {/* Desktop navigation */}
        <div className="nav-links-desktop">
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className="auth-buttons-desktop">
          <button className="btn-login">Login</button>
          <button className="btn-signup">Create Account</button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="menu-toggle"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`mobile-menu ${open ? "open" : ""}`}
      >
        <div className="mobile-menu-content">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="nav-link"
            >
              {link.label}
            </a>
          ))}

          <div className="mobile-auth">
            <button className="btn-login">Login</button>
            <button className="btn-signup">Create Account</button>
          </div>
        </div>
      </div>
    </nav>
  );
}