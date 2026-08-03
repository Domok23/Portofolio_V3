const STORAGE_KEY = "theme";

export function getStoredTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return "light";
}

export function applyTheme(theme) {
  const root = document.documentElement;
  const bg = theme === "dark" ? "#0a0a0f" : "#f2f4f7";
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  root.style.colorScheme = theme;
  root.style.backgroundColor = bg;
  if (document.body) document.body.style.backgroundColor = bg;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#0a0a0f" : "#f2f4f7");
  const navMeta = document.getElementById("meta-nav-color");
  if (navMeta) navMeta.setAttribute("content", theme === "dark" ? "#0a0a0f" : "#f2f4f7");
  localStorage.setItem(STORAGE_KEY, theme);
}

export function toggleTheme() {
  const next = getStoredTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
}

export function initTheme() {
  const theme = getStoredTheme();
  applyTheme(theme);
  return theme;
}

export function getAccentColor() {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-accent")
    .trim();
  return value || "#00a85a";
}
