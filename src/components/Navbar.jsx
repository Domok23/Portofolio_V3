import React, { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { getStoredTheme, toggleTheme } from "../theme";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const ThemeToggle = ({ theme, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
    }
    className={`p-2 min-h-11 min-w-11 inline-flex items-center justify-center text-foreground hover:text-accent transition-colors duration-200 cursor-pointer ${focusRing}`}
  >
    {theme === "dark" ? (
      <Sun className="w-5 h-5" />
    ) : (
      <Moon className="w-5 h-5" />
    )}
  </button>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");
  const [theme, setTheme] = useState(() => getStoredTheme());

  const navItems = [
    { href: "#Home", label: "Home" },
    { href: "#About", label: "About" },
    { href: "#Portofolio", label: "Portofolio" },
    { href: "#Contact", label: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = navItems
        .map((item) => {
          const section = document.querySelector(item.href);
          if (section) {
            return {
              id: item.href.replace("#", ""),
              offset: section.offsetTop - 550,
              height: section.offsetHeight,
            };
          }
          return null;
        })
        .filter(Boolean);

      const currentPosition = window.scrollY;
      const active = sections.find(
        (section) =>
          currentPosition >= section.offset &&
          currentPosition < section.offset + section.height
      );

      if (active) {
        setActiveSection(active.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const section = document.querySelector(href);
    if (section) {
      const top = section.offsetTop - 100;
      window.scrollTo({
        top: top,
        behavior: "smooth",
      });
    }
    setIsOpen(false);
  };

  const handleToggleTheme = () => {
    setTheme(toggleTheme());
  };

  return (
    <nav
      className={`fixed w-full top-0 z-50 border-b border-border transition-colors duration-200 ${
        isOpen || scrolled ? "bg-background" : "bg-background/90"
      }`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-[10%]">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a
              href="#Home"
              onClick={(e) => scrollToSection(e, "#Home")}
              className={`text-xl font-heading font-semibold text-foreground cursor-pointer ${focusRing}`}
            >
              Domm.
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className={`group relative px-1 py-2 text-sm font-medium cursor-pointer ${focusRing}`}
              >
                <span
                  className={`relative z-10 transition-colors duration-200 ${
                    activeSection === item.href.substring(1)
                      ? "text-accent font-semibold"
                      : "text-muted group-hover:text-foreground"
                  }`}
                >
                  {item.label}
                </span>
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-accent transform origin-left transition-transform duration-200 ${
                    activeSection === item.href.substring(1)
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </a>
            ))}
            <ThemeToggle theme={theme} onToggle={handleToggleTheme} />
          </div>

          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle theme={theme} onToggle={handleToggleTheme} />
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              className={`relative p-2 min-h-11 min-w-11 inline-flex items-center justify-center text-foreground transition-transform duration-200 cursor-pointer ${focusRing}`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden fixed inset-x-0 bg-background border-b border-border transition-all duration-200 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
        style={{ top: "64px" }}
      >
        <div className="px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              className={`block px-4 py-3 text-lg font-medium min-h-11 transition-colors duration-200 cursor-pointer ${focusRing} ${
                activeSection === item.href.substring(1)
                  ? "text-accent font-semibold"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
