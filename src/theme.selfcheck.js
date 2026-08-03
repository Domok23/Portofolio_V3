import { applyTheme, getStoredTheme, toggleTheme } from "./theme.js";

const original = localStorage.getItem("theme");

applyTheme("light");
console.assert(!document.documentElement.classList.contains("dark"), "light clears dark");
console.assert(getStoredTheme() === "light", "stores light");

applyTheme("dark");
console.assert(document.documentElement.classList.contains("dark"), "dark adds class");
console.assert(getStoredTheme() === "dark", "stores dark");

const flipped = toggleTheme();
console.assert(flipped === "light", "toggle dark→light");
console.assert(!document.documentElement.classList.contains("dark"), "toggle cleared dark");

applyTheme("dark");
const accent = getComputedStyle(document.documentElement)
  .getPropertyValue("--color-accent")
  .trim();
console.assert(accent === "#00ff88", "dark accent cyber green");

applyTheme("light");
const lightAccent = getComputedStyle(document.documentElement)
  .getPropertyValue("--color-accent")
  .trim();
console.assert(lightAccent === "#00a85a", "light accent washed green");

if (original === "dark" || original === "light") {
  applyTheme(original);
} else {
  applyTheme("light");
  localStorage.removeItem("theme");
}

console.log("theme.selfcheck: ok");
