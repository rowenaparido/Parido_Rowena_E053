// Mobile menu: opens and closes the navigation on small screens
const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");

menuBtn.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", isOpen);
});

// Close the menu after tapping a link
menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

// Theme toggle: dark by default, remembers the visitor's choice
const themeBtn = document.getElementById("themeBtn");
const root = document.documentElement;

/** @param {string} theme "dark" or "light" */
function setTheme(theme) {
  root.dataset.theme = theme;
  const next = theme === "dark" ? "light" : "dark";
  themeBtn.textContent = next === "light" ? "Light" : "Dark";
  themeBtn.setAttribute("aria-label", "Switch to " + next + " theme");
  try { localStorage.setItem("theme", theme); } catch (e) { /* storage unavailable */ }
}

let saved = "dark";
try { saved = localStorage.getItem("theme") || "dark"; } catch (e) { /* storage unavailable */ }
setTheme(saved);

themeBtn.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

// Show one section at a time: the menu link you tap decides which section is visible
const sections = document.querySelectorAll("main > section");
const menuLinks = document.querySelectorAll("#menu a");

// Twinkling stars in the background (dark theme)
const sky = document.createElement("div");
sky.className = "sky";
sky.setAttribute("aria-hidden", "true");
for (let i = 0; i < 70; i++) {
  const star = document.createElement("i");
  star.style.cssText = "left:" + Math.random() * 100 + "%;top:" + Math.random() * 100 + "%;" +
    "--size:" + (1 + Math.random() * 3) + "px;--delay:" + Math.random() * 5 + "s;--dur:" + (2 + Math.random() * 4) + "s";
  sky.appendChild(star);
}
document.body.prepend(sky);

// A soft glow follows the pointer
window.addEventListener("pointermove", (e) => {
  root.style.setProperty("--mx", e.clientX + "px");
  root.style.setProperty("--my", e.clientY + "px");
});

// Typing effect for the tagline
const tagline = document.querySelector(".tagline");
const taglineText = tagline.textContent;
let typer;
function typeTagline() {
  clearInterval(typer);
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { tagline.textContent = taglineText; return; }
  let i = 0;
  tagline.textContent = "";
  typer = setInterval(() => {
    tagline.textContent = taglineText.slice(0, ++i);
    if (i >= taglineText.length) clearInterval(typer);
  }, 60);
}

function showSection() {
  const id = location.hash.slice(1);
  const target = document.getElementById(id) ? id : "home";
  sections.forEach((section) => { section.hidden = section.id !== target; });
  menuLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + target);
  });
  window.scrollTo({ top: 0, behavior: "instant" });
  if (target === "home") typeTagline();
}

window.addEventListener("hashchange", showSection);
showSection();



