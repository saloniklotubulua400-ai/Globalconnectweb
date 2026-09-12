import React from "react";
import "./Footer.css";


const footerLinks = {
  Products: [
    { label: "eSIM", href: "/esim" },
    { label: "Mobile Top Up", href: "/topup" },
    { label: "Gift Cards", href: "/giftcard" },
  ],

  Support: [
    { label: "Contact us", href: "/contact" },
    { label: "Help center", href: "/help" },
    { label: "Order status", href: "/orders" },
  ],

  Company: [
    { label: "About us", href: "/about" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

function handleNavigation(event, href) {
  if (
    href.startsWith("/") &&
    !href.startsWith("//")
  ) {
    event.preventDefault();

    window.history.pushState({}, "", href);

    window.dispatchEvent(
      new PopStateEvent("popstate")
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">

        {/* ================================================
            MAIN FOOTER
        ================================================= */}

        <div className="footer-main">

          {/* Brand */}
          <div className="footer-brand">
            <a
              href="/"
              className="logo"
              onClick={(event) =>
                handleNavigation(event, "/")
              }
            >
              <span className="logo-mark">
                +
              </span>

              <span>YourBrand</span>
            </a>

            <p className="footer-description">
              Simple, secure digital services for staying
              connected wherever you are.
            </p>

            <div className="footer-trust">
              <span>🔒</span>
              <span>Secure payments</span>
            </div>
          </div>


          {/* Links */}
          <div className="footer-links">

            {Object.entries(footerLinks).map(
              ([title, links]) => (
                <div
                  className="footer-column"
                  key={title}
                >
                  <h3>{title}</h3>

                  <ul>
                    {links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          onClick={(event) =>
                            handleNavigation(
                              event,
                              link.href
                            )
                          }
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}

          </div>
        </div>


        {/* ================================================
            NEWSLETTER / SUPPORT STRIP
        ================================================= */}

        <div className="footer-middle">

          <div>
            <strong>
              Need help?
            </strong>

            <span>
              Our support team is here for you.
            </span>
          </div>

          <a
            href="/contact"
            className="btn btn-secondary"
            onClick={(event) =>
              handleNavigation(
                event,
                "/contact"
              )
            }
          >
            Contact support
          </a>

        </div>


        {/* ================================================
            BOTTOM BAR
        ================================================= */}

        <div className="footer-bottom">

          <p>
            © {year} YourBrand. All rights reserved.
          </p>

          <div className="footer-bottom-links">
            <a
              href="/privacy"
              onClick={(event) =>
                handleNavigation(
                  event,
                  "/privacy"
                )
              }
            >
              Privacy
            </a>

            <a
              href="/terms"
              onClick={(event) =>
                handleNavigation(
                  event,
                  "/terms"
                )
              }
            >
              Terms
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
}
