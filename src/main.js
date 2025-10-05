/* Загрузка header и footer */
async function loadPart(id, file) {
    try {
        const res = await fetch(file);
        document.getElementById(id).innerHTML = await res.text();
    } catch (e) {
        console.error('loadPart failed', e);
    }
}
await loadPart("header", "public/header.html").then(r => console.log("Header загружен"));
await loadPart("footer", "public/footer.html").then(r => console.log("Footer загружен"));

/* Переключение темы */
const body = document.body;
const toggle = document.getElementById("toggle");
const icon = document.getElementById("theme-icon");
const toggleMobile = document.getElementById("toggle-mobile");
const iconMobile = document.getElementById("theme-icon-mobile");

// Првоерка сохраненной темы при загрузке страницы
if (localStorage.getItem("theme") === "light"){
  body.classList.remove("dark-theme");
  icon.src = "../public/images/moon.svg";
  icon.alt = "moon";
  iconMobile.src = "../public/images/moon.svg";
  iconMobile.alt = "moon";
} else {
  body.classList.add("dark-theme");
  icon.src = "../public/images/sun.svg";
  icon.alt = "sun";
  iconMobile.src = "../public/images/sun.svg";
  iconMobile.alt = "sun";
}
toggleTheme(toggle, icon);
toggleTheme(toggleMobile, iconMobile);

function toggleTheme(toggle, icon) {
    toggle.addEventListener("click", () => {
        body.classList.toggle("dark-theme");

        // Сохранение темы в localStorage
        const isDark = body.classList.contains("dark-theme");
        localStorage.setItem("theme", isDark ? "dark" : "light");

        // Смена иконки
        icon.src = isDark ? "public/images/sun.svg" : "public/images/moon.svg";
        icon.alt = isDark ? "moon" : "sun";
    });
}


// Находим нужные элементы
const burgerBtn = document.querySelector(".mobile-menu-btn"); // кнопка-гамбургер
const closeBtn = document.getElementById("closeMenu");    // кнопка "X"
const menu = document.querySelector(".menu-mobile");      // само мобильное меню

// Открытие меню
burgerBtn.addEventListener("click", () => {
    menu.classList.add("active"); // добавляем класс, который смещает меню вправо
    document.body.classList.add("lock"); // блокируем скролл страницы
});

// Закрытие меню
closeBtn.addEventListener("click", () => {
    menu.classList.remove("active"); // убираем класс, меню уезжает обратно
    document.body.classList.remove("lock"); // возвращаем скролл
});


const featureBlocks = document.querySelectorAll(".features-item");
const featureImg = document.querySelector(".features-img");
let featureImages = [
    'public/images/demo-illustration-3.webp',
    'public/images/demo-illustration-4.webp',
    'public/images/demo-illustration-5.webp',
]

featureBlocks.forEach(block => block.addEventListener("click",(e)=>{switchBlock(e)}));
function switchBlock(e)
{
    const clickedBlock = e.currentTarget.children[0];
    featureBlocks.forEach(block => block.children[0].classList.remove('active'))

    setTimeout(() => {
        clickedBlock.classList.add('active');
    }, 150);

    e.currentTarget.children[0].classList.add('active')
    featureImg.children[0].setAttribute("src",featureImages[e.currentTarget.dataset.img])
}

