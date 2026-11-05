
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initFilter();
  initFavorites();
  initScaler();
  initContactForm();
  initNewsletter();
  initBackButton();
});

// 1. DARK AND LIGHT MODE
function initTheme() {
  const toggle = document.getElementById("theme-toggle");
  const root = document.documentElement;
  const saved = localStorage.getItem("theme");

  if (saved === "dark") {
    root.setAttribute("data-theme", "dark");
  } else {
    root.removeAttribute("data-theme");
  }

  if (!toggle) return;

  toggle.textContent = saved === "dark" ? "☀️" : "🌙";

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


// 2. RECIPE FILTERING
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
        const match =
          selected === "all" || card.dataset.region === selected;

        card.classList.toggle("hidden", !match);
      });
    });
  });
}


// 3. FAVORITE RECIPES USING LOCAL STORAGE
function getFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem("favorites"));
    return Array.isArray(saved) ? saved : [];
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

  const favorites = getFavorites();

  buttons.forEach((button) => {
    paintFavorite(button, favorites.includes(button.dataset.id));
  });

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;

      if (!id) return;

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


// 4. INGREDIENT / SERVING SCALER
function initScaler() {
  const count = document.getElementById("servings-count");
  const minus = document.getElementById("servings-minus");
  const plus = document.getElementById("servings-plus");

  if (!count || !minus || !plus) return;

  const baseServings = Number(count.dataset.base);

  if (!Number.isFinite(baseServings) || baseServings <= 0) return;

  let servings = baseServings;

  function update() {
    count.textContent = servings;

    const factor = servings / baseServings;

    document.querySelectorAll("#ingredients .amt").forEach((element) => {
      const baseAmount = Number(element.dataset.base);

      if (!Number.isFinite(baseAmount)) return;

      const scaledAmount = baseAmount * factor;
      element.textContent = Math.round(scaledAmount * 100) / 100;
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


// 5. CONTACT FORM VALIDATION
function initContactForm() {
  const form = document.getElementById("contact-form");

  if (!form) return;

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const countryInput = document.getElementById("country");
  const messageInput = document.getElementById("message");
  const confirmation = document.getElementById("confirmation");

  function showError(input, errorId, text) {
    const errorElement = document.getElementById(errorId);

    if (errorElement) {
      errorElement.textContent = text;
    }

    if (input) {
      input.classList.toggle("input-error", text !== "");
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let valid = true;

    // Validate name
    if (nameInput && nameInput.value.trim() === "") {
      showError(nameInput, "name-error", "Please enter your name.");
      valid = false;
    } else if (nameInput) {
      showError(nameInput, "name-error", "");
    }

    // Validate email
    if (
      emailInput &&
      (emailInput.value.trim() === "" || !emailInput.checkValidity())
    ) {
      showError(
        emailInput,
        "email-error",
        "Please enter a valid email address."
      );
      valid = false;
    } else if (emailInput) {
      showError(emailInput, "email-error", "");
    }

    // Validate country
    if (countryInput && countryInput.value === "") {
      showError(
        countryInput,
        "country-error",
        "Please select your country."
      );
      valid = false;
    } else if (countryInput) {
      showError(countryInput, "country-error", "");
    }

    // Validate message
    if (messageInput && messageInput.value.trim().length <= 20) {
      const length = messageInput.value.trim().length;

      showError(
        messageInput,
        "message-error",
        "Your message must be more than 20 characters (currently " +
          length +
          ")."
      );

      valid = false;
    } else if (messageInput) {
      showError(messageInput, "message-error", "");
    }

    // Stop if any field is invalid
    if (!valid) return;

    // Display confirmation
    if (confirmation) {
      form.classList.add("hidden");
      confirmation.textContent =
        "Thank you, " +
        nameInput.value.trim() +
        "! We've received your message.";

      confirmation.classList.remove("hidden");
    }
  });
}


// 6. NEWSLETTER FEEDBACK
function initNewsletter() {
  const form = document.getElementById("newsletter-form");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const button = form.querySelector("button");
    const input = form.querySelector("input");

    if (!input || input.value.trim() === "" || !input.checkValidity()) {
      if (input) input.reportValidity();
      return;
    }

    input.value = "";

    if (button) {
      button.textContent = "Subscribed ✓";
      button.disabled = true;
    }
  });
}

// 7. BACK BUTTON
function initBackButton() {
  const backButtons = document.querySelectorAll(".back-button");

  backButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const previousPage = document.referrer;

      if (previousPage) {
        try {
          const previousURL = new URL(previousPage);

          if (previousURL.origin === window.location.origin) {
            window.history.back();
            return;
          }
        } catch (error) {
          // Use the fallback page if the previous URL is invalid.
        }
      }

      // Fallback when the page was opened directly
      window.location.href = "index.html";
    });
  });
}
