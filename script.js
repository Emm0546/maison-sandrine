/* ============================================
   1. CONFIG: the ONLY part to change per client
   ============================================ */

const business = {
  name: "Maison Sandrine",
  whatsappNumber: "2250749173369" // country code + number, no + or spaces
};

const menuItems = [
  {
    id: "milk-bread",
    price: 100,
    name: { fr: "Pain au lait", en: "Milk bread" },
    desc: { fr: "Un pain doux et moelleux.", en: "A soft and fluffy bread." }
  },
  {
    id: "chocolate-bread",
    price: 200,
    name: { fr: "Pain au chocolat", en: "Chocolate bread" },
    desc: { fr: "Un délicieux pain au chocolat.", en: "A delicious chocolate-filled bread." }
  },
  {
    id: "stuffed-bread",
    price: 100,
    name: { fr: "Pain fourré", en: "Stuffed bread" },
    desc: { fr: "Un pain généreusement fourré.", en: "Generously filled bread." }
  },
  {
    id: "mini-pizza",
    price: 100,
    name: { fr: "Mini pizza", en: "Mini pizza" },
    desc: { fr: "Une petite pizza savoureuse.", en: "A delicious little pizza." }
  },
  {
    id: "chocolate-cake",
    price: 500,
    name: { fr: "Cake au chocolat", en: "Chocolate cake" },
    desc: { fr: "Un cake gourmand au chocolat.", en: "A delicious chocolate cake." }
  },
  {
    id: "milk-cake",
    price: 300,
    name: { fr: "Cake au lait", en: "Milk cake" },
    desc: { fr: "Un cake doux et savoureux.", en: "A soft and tasty cake." }
  }
];

const texts = {
  fr: {
    welcome: "BIENVENUE CHEZ",
    description: "De délicieuses gourmandises préparées avec amour.",
    open: "● Commandes via WhatsApp",
    menu: "NOTRE MENU",
    choose: "Choisissez vos gourmandises",
    items: "ARTICLES",
    selected: "Articles sélectionnés",
    total: "Total",
    order: "Commander sur WhatsApp",
    note: "Votre commande sera envoyée directement sur WhatsApp.",
    notePlaceholder: "Une précision ? (ex : heure de retrait, sans sucre...)",
    message: "Bonjour " + business.name + " ! Je souhaite passer une commande :",
    totalMessage: "Total :",
    noteMessage: "Note :"
  },
  en: {
    welcome: "WELCOME TO",
    description: "Delicious treats prepared with love.",
    open: "● Order via WhatsApp",
    menu: "OUR MENU",
    choose: "Choose your treats",
    items: "ITEMS",
    selected: "Selected items",
    total: "Total",
    order: "Order via WhatsApp",
    note: "Your order will be sent directly to WhatsApp.",
    notePlaceholder: "Anything to add? (e.g. pickup time, no sugar...)",
    message: "Hello " + business.name + "! I would like to place an order:",
    totalMessage: "Total:",
    noteMessage: "Note:"
  }
};

/* ============================================
   2. APP LOGIC
   ============================================ */

const menuList = document.querySelector("#menu-list");
const totalPrice = document.querySelector("#total-price");
const itemCount = document.querySelector("#item-count");
const orderButton = document.querySelector("#order-button");
const orderNote = document.querySelector("#order-note");
const languageButtons = document.querySelectorAll(".lang-button");

let currentLanguage = "fr";

// cart looks like: { "milk-bread": 2, "mini-pizza": 1 }
const cart = {};

function formatPrice(amount) {
  return amount.toLocaleString("fr-FR") + " FCFA";
}

function getOrder() {
  const lines = [];
  let total = 0;
  let count = 0;

  menuItems.forEach(function (item) {
    const quantity = cart[item.id] || 0;
    if (quantity > 0) {
      lines.push({
        name: item.name[currentLanguage],
        quantity: quantity,
        subtotal: item.price * quantity
      });
      total += item.price * quantity;
      count += quantity;
    }
  });

  return { lines: lines, total: total, count: count };
}

function renderMenu() {
  menuList.innerHTML = "";

  menuItems.forEach(function (item) {
    const quantity = cart[item.id] || 0;

    const card = document.createElement("div");
    card.className = "food-card" + (quantity > 0 ? " selected" : "");

    card.innerHTML =
      '<div class="food-info">' +
      "<h3>" + item.name[currentLanguage] + "</h3>" +
      "<p>" + item.desc[currentLanguage] + "</p>" +
      "<strong>" + formatPrice(item.price) + "</strong>" +
      "</div>" +
      '<div class="qty">' +
      '<button type="button" class="qty-btn" data-id="' + item.id + '" data-change="-1"' +
      (quantity === 0 ? " disabled" : "") + ' aria-label="-">−</button>' +
      '<span class="qty-value">' + quantity + "</span>" +
      '<button type="button" class="qty-btn" data-id="' + item.id + '" data-change="1" aria-label="+">+</button>' +
      "</div>";

    menuList.appendChild(card);
  });
}

function renderSummary() {
  const order = getOrder();
  totalPrice.textContent = formatPrice(order.total);
  itemCount.textContent = order.count;
  orderButton.disabled = order.count === 0;
}

function renderTexts() {
  const t = texts[currentLanguage];

  document.documentElement.lang = currentLanguage;
  document.querySelector("#business-name").textContent = business.name;
  document.querySelector("#menu-count").textContent =
    String(menuItems.length).padStart(2, "0") + " " + t.items;
  orderNote.placeholder = t.notePlaceholder;

  document.querySelectorAll("[data-i18n]").forEach(function (element) {
    element.textContent = t[element.dataset.i18n];
  });

  languageButtons.forEach(function (button) {
    button.classList.toggle("active", button.dataset.lang === currentLanguage);
  });
}

function renderAll() {
  renderTexts();
  renderMenu();
  renderSummary();
}

// One listener for ALL + and - buttons (event delegation)
menuList.addEventListener("click", function (event) {
  const button = event.target.closest(".qty-btn");
  if (!button) return;

  const id = button.dataset.id;
  const change = Number(button.dataset.change);
  const newQuantity = Math.max(0, (cart[id] || 0) + change);

  cart[id] = Math.min(newQuantity, 99);

  renderMenu();
  renderSummary();
});

languageButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentLanguage = button.dataset.lang;
    renderAll();
  });
});

orderButton.addEventListener("click", function () {
  const t = texts[currentLanguage];
  const order = getOrder();

  let message = t.message + "\n\n";

  order.lines.forEach(function (line) {
    message += "- " + line.quantity + " x " + line.name + " : " + formatPrice(line.subtotal) + "\n";
  });

  message += "\n" + t.totalMessage + " " + formatPrice(order.total);

  const note = orderNote.value.trim();
  if (note) {
    message += "\n\n" + t.noteMessage + " " + note;
  }

  const url =
    "https://wa.me/" + business.whatsappNumber + "?text=" + encodeURIComponent(message);

  window.open(url, "_blank");
});

renderAll();
