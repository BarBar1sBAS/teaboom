import "./styles/main.scss";
import { formatPrice, getPack } from "./product.js";

const root = document.querySelector("[data-product]");
const skuEl = root.querySelector("[data-sku]");
const priceEl = root.querySelector("[data-price]");
const oldPriceEl = root.querySelector("[data-old-price]");
const packs = root.querySelector("[data-packs]");
const packStatus = root.querySelector("#pack-status");
let selectedInput = packs.querySelector("input:checked");

function applyPack(id) {
  const pack = getPack(id);
  if (!pack) return false;
  skuEl.textContent = pack.sku;
  priceEl.textContent = formatPrice(pack.price);
  oldPriceEl.textContent = formatPrice(pack.oldPrice);
  return true;
}

if (selectedInput && applyPack(selectedInput.value)) {
  packs.addEventListener("change", (event) => {
    if (event.target.name !== "pack") return;
    if (applyPack(event.target.value)) {
      selectedInput = event.target;
    } else {
      selectedInput.checked = true;
    }
  });
  packStatus.hidden = true;
  packs.removeAttribute("aria-describedby");
  packs.disabled = false;
}
