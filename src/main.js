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

/* === INFINITE SLIDER (по стрелкам) c фиксом «проскакивания» ======================== */
(() => {
    const slider = document.querySelector(".slider");
    const track  = document.querySelector(".slides");
    const prev   = document.getElementById("prev");
    const next   = document.getElementById("next");

    if (!slider || !track || !prev || !next) return;

    // Клонируем крайние слайды для бесконечной прокрутки
    let originalSlides = Array.from(track.children);
    if (originalSlides.length < 2) return;

    const firstClone = originalSlides[0].cloneNode(true);
    const lastClone  = originalSlides[originalSlides.length - 1].cloneNode(true);
    firstClone.dataset.clone = "first";
    lastClone.dataset.clone  = "last";

    track.appendChild(firstClone);
    track.insertBefore(lastClone, originalSlides[0]);

    let slides = Array.from(track.children);

    // Текущее положение (c учётом левого клона)
    let index = 1;
    let animating = false;
    let teleporting = false;

    const forceReflow = (el) => { void el.offsetHeight; }; // принудительный reflow, чтобы зафиксировать состояние без transition
    const slideWidth = () => slider.getBoundingClientRect().width;

    const setTranslate = () => {
        const x = Math.round(index * slideWidth()); // округляем для исключения субпикселей
        track.style.transform = `translate3d(-${x}px, 0, 0)`;
    };

    const init = () => {
        track.classList.add("no-transition");
        setTranslate();
        forceReflow(track);
        requestAnimationFrame(() => track.classList.remove("no-transition"));
    };

    const goTo = (nextIndex) => {
        if (animating || teleporting) return;
        animating = true;
        index = nextIndex;
        track.classList.remove("no-transition");
        setTranslate();
    };

    next.addEventListener("click", () => goTo(index + 1));
    prev.addEventListener("click", () => goTo(index - 1));

    // По окончании анимации проверяем клоны и «телепортируемся» без анимации
    track.addEventListener("transitionend", (e) => {
        if (e.target !== track || e.propertyName !== "transform") return;

        animating = false;

        const current = slides[index];
        if (!current) return;

        if (current.dataset.clone === "first") {
            teleporting = true;
            track.classList.add("no-transition");
            index = 1; // реальный первый
            setTranslate();
            forceReflow(track);
            requestAnimationFrame(() => {
                track.classList.remove("no-transition");
                teleporting = false;
            });
        } else if (current.dataset.clone === "last") {
            teleporting = true;
            track.classList.add("no-transition");
            index = slides.length - 2; // реальный последний
            setTranslate();
            forceReflow(track);
            requestAnimationFrame(() => {
                track.classList.remove("no-transition");
                teleporting = false;
            });
        }
    });

    // Пересчёт позиции при ресайзе
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            track.classList.add("no-transition");
            setTranslate();
            forceReflow(track);
            requestAnimationFrame(() => track.classList.remove("no-transition"));
        }, 100);
    });

    // Управление стрелками с клавиатуры
    window.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") next.click();
        if (e.key === "ArrowLeft")  prev.click();
    });

    // Запрет перетаскивания картинок мышью
    track.querySelectorAll("img").forEach(img => (img.draggable = false));

    // Старт
    init();
})();




