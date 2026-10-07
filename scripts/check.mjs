import assert from "node:assert/strict";
import { formatPrice, getPack, packs } from "../src/product.js";

const expected = [
  ["100", "01306", 32640, 34920, "326,40", "349,20"],
  ["500", "01307", 143200, 164600, "1 432", "1 646"],
  ["1000", "01308", 206400, 259200, "2 064", "2 592"],
  ["5000", "01309", 632000, 871000, "6 320", "8 710"],
];

assert.deepEqual(packs.map(({ id }) => id), expected.map(([id]) => id));
for (const [id, sku, price, oldPrice, formatted, oldFormatted] of expected) {
  assert.deepEqual(getPack(id), { id, sku, price, oldPrice });
  assert.equal(formatPrice(price), `${formatted}\u00a0₽`);
  assert.equal(formatPrice(oldPrice), `${oldFormatted}\u00a0₽`);
}
assert.equal(formatPrice(105), "1,05\u00a0₽");
assert.equal(getPack("missing"), packs[0]);
console.log("ok");
