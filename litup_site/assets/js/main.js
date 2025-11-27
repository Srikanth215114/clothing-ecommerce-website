/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById("nav__menu"),
  navToggle = document.getElementById("nav-toggle"),
  navClose = document.getElementById("nav-close");

/*===== MENU SHOW =====*/
if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu");
  });
}

/*===== MENU HIDE =====*/
if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
  });
}

/*=============== REMOVE MENU ON MOBILE CLICK ===============*/
const navLinks = document.querySelectorAll(".nav__link");

const linkAction = () => {
  navMenu.classList.remove("show-menu");
};

navLinks.forEach((n) => n.addEventListener("click", linkAction));

/*=============== SWIPER CLOTHING ===============*/
let swiperHome = null;
if (typeof Swiper !== "undefined") {
  swiperHome = new Swiper(".home__swiper", {
    loop: true,
    grabCursor: true,
    slidesPerView: "auto",

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    breakpoints: {
      768: {
        slidesPerView: 3,
        centeredSlides: true,
      },
      1152: {
        centeredSlides: true,
        spaceBetween: -64, // overlap effect
      },
    },
  });
}

/*=============== SEARCH PRODUCTS ===============*/
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const productSlides = document.querySelectorAll(".home__article");

const performSearch = () => {
  if (!swiperHome) return;
  const query = searchInput.value.trim().toLowerCase();
  if (!query) return;

  let foundIndex = null;

  productSlides.forEach((slide, index) => {
    const name = slide
      .querySelector(".home__product")
      .textContent.toLowerCase();
    if (name.includes(query) && foundIndex === null) {
      foundIndex = index;
    }
  });

  if (foundIndex !== null) {
    swiperHome.slideToLoop(foundIndex, 600);
  }
};

if (searchBtn && searchInput) {
  searchBtn.addEventListener("click", performSearch);
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") performSearch();
  });
}

/*=============== SIMPLE CART + ORDERS (per user) ===============*/
const activeUser = getActiveUser();
let CART_KEY = "litup_cart_guest";
if (activeUser && activeUser.role === "user") {
  CART_KEY = "litup_cart_" + activeUser.email;
}

let cart = [];

const cartBtn = document.getElementById("cart-btn");
const cartClose = document.getElementById("cart-close");
const cartOverlay = document.getElementById("cart-overlay");
const cartElement = document.getElementById("cart");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");
const cartCountElement = document.getElementById("cart-count");
const addToCartButtons = document.querySelectorAll(".home__add-btn");

const openCart = () => cartElement.classList.add("cart--open");
const closeCart = () => cartElement.classList.remove("cart--open");

if (cartBtn) cartBtn.addEventListener("click", openCart);
if (cartClose) cartClose.addEventListener("click", closeCart);
if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

const loadCartFromStorage = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(CART_KEY));
    if (Array.isArray(stored)) cart = stored;
  } catch (e) {
    cart = [];
  }
};

const saveCartToStorage = () => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

const renderCart = () => {
  if (!cartItemsContainer) return;
  cartItemsContainer.innerHTML = "";
  let total = 0;
  let count = 0;

  cart.forEach((item) => {
    total += item.price * item.qty;
    count += item.qty;

    const div = document.createElement("div");
    div.className = "cart__item";
    div.innerHTML = `
      <div>
        <div class="cart__item-title">${item.name}</div>
        <div class="cart__item-meta">₹${item.price} x ${item.qty}</div>
      </div>
      <button class="cart__remove" data-name="${item.name}">&times;</button>
    `;
    cartItemsContainer.appendChild(div);
  });

  if (cartTotalElement) cartTotalElement.textContent = total;
  if (cartCountElement) cartCountElement.textContent = count;
};

loadCartFromStorage();
renderCart();

addToCartButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const currentUser = getActiveUser();
    if (!currentUser || currentUser.role !== "user") {
      window.location.href = "login.html";
      return;
    }

    const name = btn.dataset.product;
    const price = parseInt(btn.dataset.price, 10);

    const existing = cart.find((item) => item.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }

    saveCartToStorage();
    addOrder(name, price);
    renderCart();
  });
});

if (cartItemsContainer) {
  cartItemsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("cart__remove")) {
      const name = e.target.dataset.name;
      const index = cart.findIndex((item) => item.name === name);
      if (index !== -1) {
        cart.splice(index, 1);
        saveCartToStorage();
        renderCart();
      }
    }
  });
}

/*=============== CHANGE BACKGROUND HEADER ===============*/
const bgHeader = () => {
  const header = document.getElementById("header");
  if (window.scrollY >= 50) header.classList.add("bg_header");
  else header.classList.remove("bg_header");
};

window.addEventListener("scroll", bgHeader);

/*=============== SCROLL REVEAL ANIMATION ===============*/
if (typeof ScrollReveal !== "undefined") {
  const sr = ScrollReveal({
    origin: "top",
    distance: "60px",
    duration: 2500,
  });

  sr.reveal(".home__swiper, .home__footer");
  sr.reveal(".home__circle", { scale: 1.5, delay: 300 });
  sr.reveal(".home__subcircle", { scale: 1.5, delay: 500 });
  sr.reveal(".home__title", { scale: 1, origin: "bottom", delay: 1200 });
  sr.reveal(".swiper-button-prev, .swiper-button-next", {
    scale: 1,
    origin: "bottom",
    delay: 1200,
  });
}
