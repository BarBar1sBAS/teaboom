# Карточка товара Teaboom

Верхний блок «Ананасовый улун»: HTML, SCSS, vanilla JS, Vite.

## Запуск

Нужны Node.js 20+ и npm 10+.

```bash
npm install
npm run dev      # http://localhost:5173
npm run check    # фасовки и формат цены
npm run build    # статика в dist/
npm run preview
```

Выкладка: GitHub Actions собирает и публикует сайт на GitHub Pages при каждом push в `main`. В `vite.config.js` стоит `base: './'`.

## Почему так

Фасовки: нативные radio, цена и артикул обновляются через JavaScript. Деньги хранятся в копейках, форматируются через `Intl.NumberFormat('ru-RU')`. Сборка и минификация средствами Vite, шрифт Open Sans хранится локально. Кнопка «В корзину» имеет состояния наведения, нажатия и фокуса; обработчика клика нет.

Адаптив одной сеткой: 375: название над фото, фасовки в ряд; 320: фасовки 2×2; 768: две колонки и описание снизу; 1440: фото слева, информация справа.

Интерактив: CSS-переходы 120–160 мс, hover только для точного указателя. Клавиатурные действия мгновенные; reduced motion отключает масштабирование. Цены обновляются без анимации.

## Структура

```
index.html
src/main.js             переключение фасовки
src/product.js          packs, formatPrice
src/styles/_tokens.scss UI-kit
src/styles/main.scss
src/fonts/              Open Sans woff2
public/img/             WebP фото
scripts/check.mjs
vite.config.js
```
