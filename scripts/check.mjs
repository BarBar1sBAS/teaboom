import assert from "node:assert/strict";
import { formatPrice, getPack, packs } from "../src/product.js";

assert.equal(packs.length, 4);
assert.deepEqual(
  packs.map((pack) => pack.sku),
  ["01306", "01307", "01308", "01309"],
);

assert.equal(formatPrice(32640), "326,40\u00A0₽");
assert.match(formatPrice(143200), /1\s432\u00A0₽/);
assert.match(formatPrice(632000), /6\s320\u00A0₽/);

const pack = getPack("1000");
assert.equal(pack.sku, "01308");
assert.equal(pack.price, 206400);
assert.equal(pack.oldPrice, 259200);
assert.ok(pack.oldPrice > pack.price);

assert.equal(getPack("missing").id, "100");

for (const item of packs) {
  assert.ok(item.oldPrice > item.price, `${item.id} must keep a discount`);
}

console.log("ok");
