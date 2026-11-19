(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const els = {
    text: $("quoteText"), author: $("quoteAuthor"), category: $("quoteCategory"),
    index: $("quoteIndex"), content: $("quoteContent"), filter: $("categoryFilter"),
    favorite: $("favoriteButton"), count: $("favoriteCount"), toast: $("toast"),
    home: $("homeView"), favoritesView: $("favoritesView"), favoritesList: $("favoritesList")
  };
  const FAVORITES_KEY = "daily-inspiration-favorites";
  const THEME_KEY = "daily-inspiration-theme";
  let currentQuote = null;
  let toastTimer = null;
  let favorites = readFavorites();

  function readFavorites() {
    try {
      const parsed = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn("Could not read favorites from storage:", error);
      return [];
    }
  }
  function saveFavorites() {
    try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites)); }
    catch (error) { showToast("Unable to save favorites in this browser."); }
    updateFavoriteCount();
  }
  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2200);
  }
  function filteredQuotes() {
    const category = els.filter.value;
    return window.QUOTES.filter(q => category === "All" || q.category === category);
  }
  function pickQuote() {
    const pool = filteredQuotes();
    if (!pool.length) return null;
    if (pool.length === 1) return pool[0];
    let next;
    do { next = pool[Math.floor(Math.random() * pool.length)]; }
    while (currentQuote && next.text === currentQuote.text);
    return next;
  }
  function isFavorite(quote) {
    return favorites.some(q => q.text === quote.text && q.author === quote.author);
  }
  function renderQuote(quote, animate = true) {
    if (!quote) { showToast("No quotes found in this category."); return; }
    const update = () => {
      currentQuote = quote;
      els.text.textContent = quote.text;
      els.author.textContent = quote.author;
      els.category.textContent = quote.category.toUpperCase();
      els.index.textContent = "A THOUGHT FOR TODAY";
      els.favorite.classList.toggle("active", isFavorite(quote));
      els.favorite.textContent = isFavorite(quote) ? "♥" : "♡";
      els.favorite.setAttribute("aria-label", isFavorite(quote) ? "Remove from favorites" : "Add to favorites");
      els.favorite.title = isFavorite(quote) ? "Remove from favorites" : "Add to favorites";
      els.content.classList.remove("changing");
    };
    if (animate) {
      els.content.classList.add("changing");
      window.setTimeout(update, 180);
    } else update();
  }
  function newQuote() {
    const quote = pickQuote();
    renderQuote(quote);
  }
  function updateFavoriteCount() { els.count.textContent = String(favorites.length); }
  function toggleFavorite() {
    if (!currentQuote) return;
    if (isFavorite(currentQuote)) {
      favorites = favorites.filter(q => !(q.text === currentQuote.text && q.author === currentQuote.author));
      showToast("Removed from your favorites.");
    } else {
      favorites.unshift(currentQuote);
      showToast("Added to your favorites.");
    }
    saveFavorites();
    els.favorite.classList.toggle("active", isFavorite(currentQuote));
    els.favorite.textContent = isFavorite(currentQuote) ? "♥" : "♡";
    els.favorite.setAttribute("aria-label", isFavorite(currentQuote) ? "Remove from favorites" : "Add to favorites");
    if (!els.favoritesView.classList.contains("hidden")) renderFavorites();
  }
  async function copyQuote() {
    if (!currentQuote) return;
    const value = `“${currentQuote.text}” — ${currentQuote.author}`;
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(value);
      else {
        const area = document.createElement("textarea");
        area.value = value; area.style.position = "fixed"; area.style.opacity = "0";
        document.body.appendChild(area); area.select();
        const ok = document.execCommand("copy"); area.remove();
        if (!ok) throw new Error("Copy command failed");
      }
      showToast("Quote copied to clipboard.");
    } catch (error) { showToast("Copy is unavailable in this browser."); }
  }
  async function shareQuote() {
    if (!currentQuote) return;
    const text = `“${currentQuote.text}” — ${currentQuote.author}`;
    try {
      if (navigator.share) await navigator.share({ title: "Daily Inspiration", text });
      else if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text); showToast("Sharing isn't available here — quote copied instead.");
      } else showToast("Sharing isn't supported by this browser.");
    } catch (error) {
      if (error.name !== "AbortError") showToast("Unable to share this quote.");
    }
  }
  function renderFavorites() {
    els.favoritesList.replaceChildren();
    if (!favorites.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      const title = document.createElement("strong"); title.textContent = "No favorites just yet";
      const copy = document.createElement("span"); copy.textContent = "Tap the heart on any quote to save it here.";
      empty.append(title, copy); els.favoritesList.appendChild(empty); return;
    }
    favorites.forEach((quote) => {
      const card = document.createElement("article"); card.className = "favorite-card";
      const text = document.createElement("p"); text.textContent = `“${quote.text}”`;
      const meta = document.createElement("div"); meta.className = "favorite-meta";
      const author = document.createElement("span"); author.textContent = `— ${quote.author}`;
      const category = document.createElement("strong"); category.textContent = quote.category;
      const remove = document.createElement("button"); remove.className = "remove-favorite";
      remove.type = "button"; remove.textContent = "×"; remove.title = "Remove favorite";
      remove.setAttribute("aria-label", `Remove quote by ${quote.author}`);
      remove.addEventListener("click", () => {
        favorites = favorites.filter(q => !(q.text === quote.text && q.author === quote.author));
        saveFavorites(); renderFavorites(); showToast("Favorite removed.");
        if (currentQuote) renderQuote(currentQuote, false);
      });
      meta.append(author, category, remove); card.append(text, meta); els.favoritesList.appendChild(card);
    });
  }
  function showFavorites() {
    els.home.classList.add("hidden"); els.favoritesView.classList.remove("hidden");
    renderFavorites(); window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function showHome() {
    els.favoritesView.classList.add("hidden"); els.home.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    $("themeToggle").textContent = theme === "dark" ? "☀" : "☾";
    $("themeToggle").setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    try { localStorage.setItem(THEME_KEY, theme); } catch (error) { /* Theme still works for this session. */ }
  }

  $("newQuoteButton").addEventListener("click", newQuote);
  $("copyButton").addEventListener("click", copyQuote);
  $("shareButton").addEventListener("click", shareQuote);
  els.favorite.addEventListener("click", toggleFavorite);
  $("showFavorites").addEventListener("click", showFavorites);
  $("backHome").addEventListener("click", showHome);
  els.filter.addEventListener("change", newQuote);
  $("themeToggle").addEventListener("click", () => applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));

  try {
    const savedTheme = localStorage.getItem(THEME_KEY);
    applyTheme(savedTheme === "dark" ? "dark" : "light");
  } catch (error) { applyTheme("light"); }
  updateFavoriteCount();
  renderQuote(pickQuote(), false);
})();
