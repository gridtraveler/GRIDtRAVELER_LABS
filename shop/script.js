const catalog = {
  hexafracture: {
    title: "HEXAfRACTURE",
    year: "2023",
    kicker: "Collector edition · available by inquiry",
    medium: "Archival pigment print",
    format: "Landscape",
    image: "assets/hexafracture.jpg",
    alt: "Purple and coral crystalline structures suspended in a dark generative landscape",
    story: "A controlled fracture becomes a world: crystalline structures accumulate, split and reform until the boundary between geology and computation disappears.",
    details: "Edition scale, paper, framing and dimensions are selected with the collector so the physical object preserves the depth of the original realtime image."
  },
  "zen-garden": {
    title: "Metaverse Zen Garden",
    year: "2022",
    kicker: "Environment study · available by inquiry",
    medium: "Archival pigment print",
    format: "Square",
    image: "assets/zen-garden.jpg",
    alt: "Ancient luminous plants growing through a calm digital garden",
    story: "Ancient plants and synthetic atmosphere meet in a quiet world designed for pause—less a virtual location than a remembered one.",
    details: "Available as a square collector edition. Final paper, scale and framing are confirmed before production."
  },
  "ascension-codes": {
    title: "ASCENSIOnCODES",
    year: "2020",
    kicker: "Motion system still · available by inquiry",
    medium: "Archival pigment print",
    format: "Square",
    image: "assets/ascension-codes.jpg",
    alt: "Luminous abstract cellular forms from ASCENSIOnCODES",
    story: "A single frame lifted from a living field of cells, light and signal. The image suggests an alphabet discovered rather than designed.",
    details: "Available as a square collector edition with size and surface options discussed directly."
  },
  "nike-organics": {
    title: "NIKE ORGANICS",
    year: "2023",
    kicker: "Realtime GPU simulation · available by inquiry",
    medium: "Archival pigment print",
    format: "Square",
    image: "assets/nike-organics.jpg",
    alt: "Fluid organic simulation in magenta and electric blue",
    story: "An elastic organism formed in realtime—part fabric, part membrane, part energy. Its color holds the moment just before the system changes again.",
    details: "Available as a square collector edition. Final presentation is tailored to the selected scale."
  },
  "growing-ai": {
    title: "Growing AI",
    year: "2020",
    kicker: "Procedural motion still · available by inquiry",
    medium: "Archival pigment print",
    format: "Square",
    image: "assets/growing-ai.jpg",
    alt: "Radiant branching form evolving through a dark field",
    story: "A branching intelligence learns the shape of its own light. The work treats growth as choreography: rule-based, unstable and unexpectedly tender.",
    details: "Available as a square collector edition with paper and framing options confirmed at acquisition."
  }
};

const dialog = document.querySelector("[data-work-dialog]");
const lightbox = document.querySelector("[data-lightbox-dialog]");
const savedCount = document.querySelector("[data-saved-count]");
const cartCount = document.querySelector("[data-cart-count]");
const grid = document.querySelector("[data-work-grid]");
const empty = document.querySelector("[data-empty]");
let saved = new Set(JSON.parse(localStorage.getItem("gridtraveler-saved") || "[]"));
let cart = JSON.parse(localStorage.getItem("gridtraveler-cart") || "[]");
let savedOnly = false;

const products = {
  "face-01": { id: "face-01", name: "FACE 01", price: 64, variantId: null },
  "scalp-01": { id: "scalp-01", name: "SCALP 01", price: 58, variantId: null },
  "ritual-duo": { id: "ritual-duo", name: "FACE 01 + SCALP 01", price: 108, variantId: null }
};

const commerce = {
  provider: "shopify",
  storeDomain: null,
  live: false
};

function updateSavedUI() {
  savedCount.textContent = saved.size;
  document.querySelectorAll("[data-save]").forEach((button) => {
    const active = saved.has(button.dataset.save);
    button.setAttribute("aria-pressed", String(active));
    button.textContent = active ? "♥" : "♡";
  });
  if (savedOnly) applyFilter("saved");
}

function renderCart() {
  const items = document.querySelector("[data-cart-items]");
  const emptyCart = document.querySelector("[data-cart-empty]");
  const summary = document.querySelector("[data-cart-summary]");
  items.innerHTML = cart.map((id) => {
    const product = products[id];
    return `<article class="cart-line"><div><h3>${product.name}</h3><p>Studio Rituals · quantity 1</p></div><aside><strong>$${product.price}</strong><button type="button" data-remove-product="${id}">Remove</button></aside></article>`;
  }).join("");
  const total = cart.reduce((sum, id) => sum + products[id].price, 0);
  cartCount.textContent = cart.length;
  document.querySelector("[data-cart-total]").textContent = `$${total}`;
  emptyCart.hidden = cart.length > 0;
  summary.hidden = cart.length === 0;
  localStorage.setItem("gridtraveler-cart", JSON.stringify(cart));
}

function addToCart(id, open = true) {
  if (!products[id]) return;
  if (id === "ritual-duo") {
    cart = cart.filter((item) => item !== "face-01" && item !== "scalp-01" && item !== "ritual-duo");
  } else {
    cart = cart.filter((item) => item !== "ritual-duo");
  }
  if (!cart.includes(id)) cart.push(id);
  renderCart();
  if (open) document.querySelector("[data-cart-dialog]").showModal();
}

function beginCheckout(ids = cart) {
  const purchasable = ids.map((id) => products[id]).filter(Boolean);
  if (!purchasable.length) return;
  if (!commerce.live || !commerce.storeDomain || purchasable.some((product) => !product.variantId)) {
    document.querySelector("[data-checkout-notice]").showModal();
    return;
  }
  const lines = purchasable.map((product) => `${product.variantId}:1`).join(",");
  window.location.href = `https://${commerce.storeDomain}/cart/${lines}`;
}

function openWork(id) {
  const work = catalog[id];
  if (!work) return;
  dialog.querySelector("[data-dialog-image]").src = work.image;
  dialog.querySelector("[data-dialog-image]").alt = work.alt;
  dialog.querySelector("[data-dialog-title]").innerHTML = id === "hexafracture" ? "HEXA<br>fRACTURE" : work.title;
  dialog.querySelector("[data-dialog-kicker]").textContent = work.kicker;
  dialog.querySelector("[data-dialog-line]").innerHTML = `Andrey Shcherbinin <span>${work.year}</span>`;
  dialog.querySelector("[data-dialog-story]").textContent = work.story;
  dialog.querySelector("[data-dialog-specs]").innerHTML = `<div><dt>Format</dt><dd>${work.format}</dd></div><div><dt>Medium</dt><dd>${work.medium}</dd></div><div><dt>Edition</dt><dd>Confirmed with collector</dd></div>`;
  dialog.querySelector("[data-dialog-lightbox]").dataset.lightbox = work.image;
  dialog.querySelector("[data-tab-copy]").textContent = work.details;
  dialog.dataset.activeWork = id;
  dialog.showModal();
  document.body.style.overflow = "hidden";
}

function closeDialog() {
  dialog.close();
  document.body.style.overflow = "";
}

function openLightbox(src, alt = "Artwork full-screen view") {
  lightbox.querySelector("[data-lightbox-image]").src = src;
  lightbox.querySelector("[data-lightbox-image]").alt = alt;
  lightbox.showModal();
}

function applyFilter(filter) {
  let visible = 0;
  document.querySelectorAll("[data-work-id]").forEach((card) => {
    const show = filter === "all" || (filter === "saved" ? saved.has(card.dataset.workId) : card.dataset.category.includes(filter));
    card.hidden = !show;
    if (show) visible += 1;
  });
  empty.hidden = visible > 0;
}

document.addEventListener("click", (event) => {
  const open = event.target.closest("[data-open-work]");
  if (open) { openWork(open.dataset.openWork); return; }
  const save = event.target.closest("[data-save]");
  if (save) {
    const id = save.dataset.save;
    saved.has(id) ? saved.delete(id) : saved.add(id);
    localStorage.setItem("gridtraveler-saved", JSON.stringify([...saved]));
    updateSavedUI();
    return;
  }
  const filter = event.target.closest("[data-filter]");
  if (filter) {
    savedOnly = false;
    document.querySelectorAll("[data-filter]").forEach((button) => { button.classList.toggle("active", button === filter); button.setAttribute("aria-pressed", String(button === filter)); });
    applyFilter(filter.dataset.filter);
    return;
  }
  if (event.target.closest("[data-open-saved]")) {
    savedOnly = !savedOnly;
    document.querySelectorAll("[data-filter]").forEach((button) => { button.classList.remove("active"); button.setAttribute("aria-pressed", "false"); });
    applyFilter(savedOnly ? "saved" : "all");
    document.querySelector("#works").scrollIntoView({ behavior: "smooth" });
    return;
  }
  const add = event.target.closest("[data-add-product]");
  if (add) { addToCart(add.dataset.addProduct); return; }
  const buy = event.target.closest("[data-buy-product]");
  if (buy) { addToCart(buy.dataset.buyProduct, false); beginCheckout([buy.dataset.buyProduct]); return; }
  const remove = event.target.closest("[data-remove-product]");
  if (remove) { cart = cart.filter((id) => id !== remove.dataset.removeProduct); renderCart(); return; }
  if (event.target.closest("[data-open-cart]")) { document.querySelector("[data-cart-dialog]").showModal(); return; }
  if (event.target.closest("[data-close-cart]")) { document.querySelector("[data-cart-dialog]").close(); return; }
  if (event.target.closest("[data-checkout]")) { beginCheckout(); return; }
  if (event.target.closest("[data-close-checkout-notice]")) { document.querySelector("[data-checkout-notice]").close(); return; }
  if (event.target.closest("[data-close-dialog]")) { closeDialog(); return; }
  if (event.target.closest("[data-close-lightbox]")) { lightbox.close(); return; }
  const lb = event.target.closest("[data-lightbox], [data-dialog-lightbox]");
  if (lb) openLightbox(lb.dataset.lightbox, dialog.querySelector("[data-dialog-image]")?.alt);
  const tab = event.target.closest("[data-tab]");
  if (tab) {
    document.querySelectorAll("[data-tab]").forEach((button) => button.setAttribute("aria-selected", String(button === tab)));
    const work = catalog[dialog.dataset.activeWork];
    const copy = {
      details: work.details,
      authenticity: "Edition number, signature format and certificate details are recorded in writing before checkout.",
      delivery: "Production timing, protective packaging, tracking and transit insurance are included in the final quote."
    };
    dialog.querySelector("[data-tab-copy]").textContent = copy[tab.dataset.tab];
  }
});

dialog.addEventListener("click", (event) => { if (event.target === dialog) closeDialog(); });
lightbox.addEventListener("click", (event) => { if (event.target === lightbox) lightbox.close(); });
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.open) lightbox.close();
});
window.addEventListener("scroll", () => document.querySelector(".site-header").classList.toggle("scrolled", window.scrollY > 24), { passive: true });
document.querySelector("[data-year]").textContent = new Date().getFullYear();
updateSavedUI();
renderCart();

