// =========================================================
// Aphelele Khambule — Portfolio interactions
// Small, dependency-free JavaScript. Each block does one job.
// =========================================================

// 1. Mobile menu: show/hide the nav on small screens
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(isOpen));
  menuBtn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

// Close the menu after a link is tapped
nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

// 2. Light / dark theme toggle, remembered between visits
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");

function savedTheme() {
  try { return localStorage.getItem("theme"); } catch { return null; }
}

const startTheme = savedTheme();
if (startTheme) root.dataset.theme = startTheme;

themeToggle.addEventListener("click", () => {
  // Work out what is showing now (an explicit choice, or the device setting)
  const current =
    root.dataset.theme ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const next = current === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch { /* storage blocked: still works for this visit */ }
});

// 3. Highlight the nav link for the section on screen
const sections = document.querySelectorAll("main section[id]");
const navLinks = nav.querySelectorAll("a");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
      });
    });
  },
  { rootMargin: "-45% 0px -50% 0px" } // counts a section as "current" when it crosses mid-screen
);
sections.forEach((section) => observer.observe(section));

// 4. Copy email address to the clipboard
const copyBtn = document.getElementById("copyEmail");
const emailText = document.getElementById("emailText");

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(emailText.textContent.trim());
    copyBtn.textContent = "Copied";
  } catch {
    // Fallback: select the text so the visitor can copy it manually
    const range = document.createRange();
    range.selectNodeContents(emailText);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    copyBtn.textContent = "Press Ctrl+C";
  }
  setTimeout(() => (copyBtn.textContent = "Copy"), 2000);
});

// 5. Keep the footer year current
document.getElementById("year").textContent = new Date().getFullYear();
