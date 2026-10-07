import "./styles/main.scss";
import { formatPrice, getPack } from "./product.js";

const root = document.querySelector("[data-product]");
const skuEl = root.querySelector("[data-sku]");
const priceEl = root.querySelector("[data-price]");
const oldPriceEl = root.querySelector("[data-old-price]");
const packs = root.querySelector("[data-packs]");
const status = root.querySelector("[data-status]");

function applyPack(id) {
  const pack = getPack(id);
  skuEl.textContent = pack.sku;
  priceEl.textContent = formatPrice(pack.price);
  oldPriceEl.textContent = formatPrice(pack.oldPrice);
  status.textContent = "";
  status.removeAttribute("data-visible");
}

packs.addEventListener("change", (event) => {
  if (event.target.name === "pack") applyPack(event.target.value);
});
applyPack(packs.querySelector("input:checked")?.value);

root.querySelector("[data-cart]").addEventListener("click", () => {
  const pack = getPack(packs.querySelector("input:checked").value);
  status.textContent = `Демо: выбрана фасовка ${pack.id} г. Корзина не подключена.`;
  status.setAttribute("data-visible", "");
});

document.addEventListener("keydown", () => {
  document.documentElement.dataset.input = "keyboard";
});
document.addEventListener("pointerdown", () => {
  document.documentElement.dataset.input = "pointer";
});
