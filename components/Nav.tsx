"use client";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import Magnetic from "./Magnetic";

const links = ["About", "Skills", "Projects", "Experience", "Certificates", "GitHub", "Contact"];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever a link is tapped
  const closeMenu = () => setOpen(false);

  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner">
        <div className="brand">
          <div className="brand-mark">
            <img src="/images/logo-mark.png" alt="JamesLabs AI" />
          </div>
          James Peñero
        </div>
        <div className="nav-links">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`}>
              {l}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <ThemeToggle />
          <Magnetic href="#" className="btn btn-ghost">
            Resume
          </Magnetic>
          <button
            className="nav-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>
      <div className={`nav-mobile ${open ? "open" : ""}`}>
        <div className="nav-mobile-inner">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={closeMenu}>
              {l}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
