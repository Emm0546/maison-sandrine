const foodCheckboxes = document.querySelectorAll(".food-checkbox");
const totalPrice = document.querySelector("#total-price");
const itemCount = document.querySelector("#item-count");
const orderButton = document.querySelector("#order-button");
const languageButtons = document.querySelectorAll(".lang-button");

const whatsappNumber = "2250749173369";

let currentLanguage = "fr";

const translations = {
  en: {
    welcome: "WELCOME TO",
    description: "Delicious treats prepared with love.",
    open: "● Order via WhatsApp",
    menu: "OUR MENU",
    choose: "Choose your treats",
    count: "06 ITEMS",
    milkBread: "Milk bread",
    milkBreadDesc: "A soft and fluffy bread.",
    chocolateBread: "Chocolate bread",
    chocolateBreadDesc: "A delicious chocolate-filled bread.",
    stuffedBread: "Stuffed bread",
    stuffedBreadDesc: "Generously filled bread.",
    miniPizza: "Mini pizza",
    miniPizzaDesc: "A delicious little pizza.",
    chocolateCake: "Chocolate cake",
    chocolateCakeDesc: "A delicious chocolate cake.",
    milkCake: "Milk cake",
    milkCakeDesc: "A soft and tasty cake.",
    selected: "Selected items",
    total: "Total",
    order: "Order via WhatsApp",
    note: "Your order will be sent directly to WhatsApp.",
    message: "Hello Maison Sandrine! I would like to place an order:",
    totalMessage: "Total:"
  },

  fr: {
    welcome: "BIENVENUE CHEZ",
    description: "De délicieuses gourmandises préparées avec amour.",
    open: "● Commandes via WhatsApp",
    menu: "NOTRE MENU",
    choose: "Choisissez vos gourmandises",
    count: "06 ARTICLES",
    milkBread: "Pain au lait",
    milkBreadDesc: "Un pain doux et moelleux.",
    chocolateBread: "Pain au chocolat",
    chocolateBreadDesc: "Un délicieux pain au chocolat.",
    stuffedBread: "Pain fourré",
    stuffedBreadDesc: "Un pain généreusement fourré.",
    miniPizza: "Mini pizza",
    miniPizzaDesc: "Une petite pizza savoureuse.",
    chocolateCake: "Cake au chocolat",
    chocolateCakeDesc: "Un cake gourmand au chocolat.",
    milkCake: "Cake au lait",
    milkCakeDesc: "Un cake doux et savoureux.",
    selected: "Articles sélectionnés",
    total: "Total",
    order: "Commander sur WhatsApp",
    note: "Votre commande sera envoyée directement sur WhatsApp.",
    message: "Bonjour Maison Sandrine ! Je souhaite passer une commande :",
    totalMessage: "Total :"
  }
};

function changeLanguage(language) {
  currentLanguage = language;

  document.documentElement.lang = language;

  document.querySelectorAll("[data-i18n]").forEach(function (element) {
    const key = element.dataset.i18n;
    element.textContent = translations[language][key];
  });

  languageButtons.forEach(function (button) {
    button.classList.toggle("active", button.dataset.lang === language);
  });

  updateOrder();
}

function updateOrder() {
  let total = 0;
  let selectedItems = [];

  foodCheckboxes.forEach(function (checkbox) {
    if (checkbox.checked) {
      const price = Number(checkbox.value);

      const name =
        currentLanguage === "fr"
          ? checkbox.dataset.nameFr
          : checkbox.dataset.name;

      total += price;

      selectedItems.push({
        name: name,
        price: price
      });
    }
  });

  totalPrice.textContent = total.toLocaleString("fr-FR") + " FCFA";
  itemCount.textContent = selectedItems.length;

  orderButton.disabled = selectedItems.length === 0;

  return {
    total: total,
    items: selectedItems
  };
}

foodCheckboxes.forEach(function (checkbox) {
  checkbox.addEventListener("change", updateOrder);
});

languageButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    changeLanguage(button.dataset.lang);
  });
});

orderButton.addEventListener("click", function () {
  const order = updateOrder();

  let message = translations[currentLanguage].message + "\n\n";

  order.items.forEach(function (item) {
    message +=
      "- " +
      item.name +
      " : " +
      item.price.toLocaleString("fr-FR") +
      " FCFA\n";
  });

  message +=
    "\n" +
    translations[currentLanguage].totalMessage +
    " " +
    order.total.toLocaleString("fr-FR") +
    " FCFA";

  const encodedMessage = encodeURIComponent(message);

  const whatsappURL =
    "https://wa.me/" + whatsappNumber + "?text=" + encodedMessage;

  window.open(whatsappURL, "_blank");
});

changeLanguage("fr");
