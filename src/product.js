export const packs = [
  { id: "100", sku: "01306", price: 32640, oldPrice: 34920 },
  { id: "500", sku: "01307", price: 143200, oldPrice: 164600 },
  { id: "1000", sku: "01308", price: 206400, oldPrice: 259200 },
  { id: "5000", sku: "01309", price: 632000, oldPrice: 871000 },
];

export function formatPrice(kopecks) {
  const hasKopecks = kopecks % 100 !== 0;
  return `${new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: hasKopecks ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(kopecks / 100)}\u00A0₽`;
}

export function getPack(id) {
  return packs.find((pack) => pack.id === id) ?? packs[0];
}
