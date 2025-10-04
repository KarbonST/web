/* Загрузка header и footer */
async function loadPart(id, file) {
    try {
        const res = await fetch(file);
        document.getElementById(id).innerHTML = await res.text();
    } catch (e) {
        console.error('loadPart failed', e);
    }
}
loadPart("header", "public/header.html").then(r => console.log("Header загружен"));
loadPart("footer", "public/footer.html").then(r => console.log("Footer загружен"));

/* Переключение темы */
const body = document.body;
const toggle = document.getElementById("toggle");
const icon = document.getElementById("theme-icon");

// Првоерка сохраненной темы при загрузке страницы
if (localStorage.getItem("theme") === "light"){
  body.classList.remove("dark_theme");
  icon.src = "public/images/moon.svg";
} else {
  body.classList.add("dark_theme");
  icon.src = "public/images/sun.svg"
}

// При клике тема переключается
toggle.addEventListener("click", () => {
  body.classList.toggle("dark_theme");

  // Сохранение темы в localStorage
  const isDark = body.classList.contains("dark_theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");

  // Смена иконки
  icon.src = isDark ? "public/images/moon.svg" : "public/images/sun.svg";
});
