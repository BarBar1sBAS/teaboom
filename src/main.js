import "./styles/main.scss";
import { formatPrice, getPack } from "./product.js";

const root = document.querySelector("[data-product]");
const skuEl = root.querySelector("[data-sku]");
const priceEl = root.querySelector("[data-price]");
const oldPriceEl = root.querySelector("[data-old-price]");
const packs = root.querySelector("[data-packs]");

function applyPack(id) {
  const pack = getPack(id);
  skuEl.textContent = pack.sku;
  priceEl.textContent = formatPrice(pack.price);
  oldPriceEl.textContent = formatPrice(pack.oldPrice);
}

packs.addEventListener("change", (event) => {
  if (event.target.name === "pack") applyPack(event.target.value);
});

applyPack(packs.querySelector("input:checked")?.value);

const cartBtn = root.querySelector("[data-cart]");
const labelAdd = "В корзину";
const labelAdded = "В корзине";

cartBtn.addEventListener("click", () => {
  const added = cartBtn.getAttribute("aria-pressed") !== "true";
  cartBtn.setAttribute("aria-pressed", String(added));
  cartBtn.textContent = added ? labelAdded : labelAdd;
});
