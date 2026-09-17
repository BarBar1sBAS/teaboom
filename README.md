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

Выкладка: содержимое `dist/` на любой статический хостинг. В `vite.config.js` стоит `base: './'`.

## Почему так

Фасовки — нативные radio, цена/артикул в JS. Деньги в копейках, формат `Intl.NumberFormat('ru-RU')`. Цвета и ритм — CSS-токены с живого Teaboom. Сборка: Terser + Lightning CSS, шрифт Open Sans self-host. Корзины нет, кнопка только переключает `aria-pressed`.

Адаптив одной сеткой: 375 — колонка, 768 — две колонки и фасовки 2×2, 1440 — фасовки в ряд.

## Структура

```
index.html
src/main.js             фасовка и кнопка
src/product.js          packs, formatPrice
src/styles/_tokens.scss UI-kit
src/styles/main.scss
src/fonts/              Open Sans woff2
public/img/             WebP фото
scripts/check.mjs
vite.config.js
```
