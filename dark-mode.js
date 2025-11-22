const html = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const iconMoon = document.getElementById("theme-icon-moon");
const iconSun = document.getElementById("theme-icon-sun");


//apply saved theme on load
if (localStorage.theme === "light") {
  html.classList.remove("dark");
  iconMoon.classList.remove("hidden");
  iconSun.classList.add("hidden");
} else {
  html.classList.add("dark");
  iconMoon.classList.add("hidden");
  iconSun.classList.remove("hidden");
}

//theme toggle handler
themeToggle.addEventListener("click", () => {
  const isDark = html.classList.toggle("dark");
  iconMoon.classList.toggle("hidden", isDark);
  iconSun.classList.toggle("hidden", !isDark);
  localStorage.theme = isDark ? "dark" : "light";
});

