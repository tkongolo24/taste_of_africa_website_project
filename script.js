/* =========================================================
   Tastes of Africa - script.js
   Features: theme toggle, recipe filter, favorites,
   ingredient scaler, contact validation, newsletter
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initFilter();
  initFavorites();
  initScaler();
  initContactForm();
  initNewsletter();
});

/* ---------- Dark / light mode (saved in localStorage) ---------- */
function initTheme() {
  const toggle = document.getElementById("theme-toggle");
  const root = document.documentElement;
  const saved = localStorage.getItem("theme");

  if (saved === "dark") {
    root.setAttribute("data-theme", "dark");
    if (toggle) toggle.textContent = "☀️";
  }
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    if (isDark) {
      root.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
      toggle.textContent = "🌙";
    } else {
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      toggle.textContent = "☀️";
    }
  });
}

/* ---------- Recipe filter by region ---------- */
function initFilter() {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".recipe-card");
  if (buttons.length === 0) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const selected = button.dataset.filter;

      buttons.forEach((b) => b.classList.remove("active"));
      button.classList.add("active");

      cards.forEach((card) => {
        const match = selected === "all" || card.dataset.region === selected;
        card.classList.toggle("hidden", !match);
      });
    });
  });
}

/* ---------- Favorites (saved in localStorage) ---------- */
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  } catch (error) {
    return [];
  }
}

function saveFavorites(list) {
  localStorage.setItem("favorites", JSON.stringify(list));
}

function paintFavorite(button, isFav) {
  button.classList.toggle("favorited", isFav);
  button.textContent = isFav ? "❤️ Favorited" : "🤍 Favorite";
  button.setAttribute("aria-pressed", String(isFav));
}

function initFavorites() {
  const buttons = document.querySelectorAll(".fav-btn");
  if (buttons.length === 0) return;

  // Restore saved favorites on page load
  const favorites = getFavorites();
  buttons.forEach((button) => {
    paintFavorite(button, favorites.includes(button.dataset.id));
  });

  // Toggle on click
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      let current = getFavorites();

      if (current.includes(id)) {
        current = current.filter((item) => item !== id);
      } else {
        current.push(id);
      }
      saveFavorites(current);
      paintFavorite(button, current.includes(id));
    });
  });
}

/* ---------- Ingredient scaler (recipe pages) ---------- */
function initScaler() {
  const count = document.getElementById("servings-count");
  const minus = document.getElementById("servings-minus");
  const plus = document.getElementById("servings-plus");
  if (!count || !minus || !plus) return;

  const baseServings = Number(count.dataset.base);
  let servings = baseServings;

  function update() {
    count.textContent = servings;
    const factor = servings / baseServings;
    document.querySelectorAll("#ingredients .amt").forEach((el) => {
      const scaled = Number(el.dataset.base) * factor;
      el.textContent = Math.round(scaled * 100) / 100;
    });
  }

  minus.addEventListener("click", () => {
    if (servings > 1) {
      servings--;
      update();
    }
  });
  plus.addEventListener("click", () => {
    if (servings < 20) {
      servings++;
      update();
    }
  });
}

/* ---------- Contact form validation ---------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const confirmation = document.getElementById("confirmation");

  function showError(input, errorId, text) {
    document.getElementById(errorId).textContent = text;
    input.classList.toggle("input-error", text !== "");
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();
    let valid = true;

    if (name === "") {
      showError(nameInput, "name-error", "Please enter your name.");
      valid = false;
    } else {
      showError(nameInput, "name-error", "");
    }

    if (email === "" || !emailInput.checkValidity()) {
      showError(emailInput, "email-error", "Please enter a valid email address.");
      valid = false;
    } else {
      showError(emailInput, "email-error", "");
    }

    if (message.length <= 20) {
      showError(messageInput, "message-error", "Your message must be more than 20 characters (currently " + message.length + ").");
      valid = false;
    } else {
      showError(messageInput, "message-error", "");
    }

    if (!valid) return;

    // Success: hide form, show personalized confirmation
    form.classList.add("hidden");
    confirmation.textContent = "Thank you, " + name + "! We've received your message.";
    confirmation.classList.remove("hidden");
  });
}

/* ---------- Newsletter (footer) ---------- */
function initNewsletter() {
  const form = document.getElementById("newsletter-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = form.querySelector("button");
    form.querySelector("input").value = "";
    button.textContent = "Subscribed ✓";
    button.disabled = true;
  });
}