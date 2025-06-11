// products.js

// Функция для рендера одной карточки товара
function renderProductCard(product) {
  return `
    <article class="catalog__article">
      <div class="catalog__img-container" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">
        <img class="catalog__img" src="images/products/${product.image}" alt="${product.name}">
        <div class="catalog__link">
          <a href="#" class="catalog__link-icon catalog__link-icon--basket" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 8V6C7 4.67 7.07 2.93 8 2C8.92 1.06 10.68 1 12 1C13.31 1 15.07 1.06 16 2C16.92 2.93 17 4.67 17 6V8H20C20.26 8 20.81 7.81 21 8C21.18 8.18 21 8.73 21 9V21C21 21.26 21.18 21.81 21 22C20.81 22.18 20.26 22 20 22H4C3.73 22 3.18 22.18 3 22C2.81 21.81 3 21.26 3 21V9C3 8.73 2.81 8.18 3 8C3.18 7.81 3.73 8 4 8H7ZM7 10H5V20H19V10H17V12H15V10H9V12H7V10ZM9 8H15V6C15 5.2 14.55 4.56 14 4C13.44 3.43 12.78 3 12 3C11.21 3 10.55 3.43 10 4C9.44 4.56 9 5.2 9 6V8Z"/>
            </svg>
          </a>
          <a href="#" class="catalog__link-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21c-.65-.58-1.38-1.17-2.15-1.8-2.72-2.22-5.79-4.74-7.15-7.75-.45-.96-.68-2-.7-3.05C2 6.94 2.57 5.55 3.61 4.54 4.64 3.52 6.04 2.97 7.5 3c1.18 0 2.33.34 3.32.98.44.28.83.62 1.18 1.02.34-.4.73-.74 1.17-1.02.99-.64 2.14-.98 3.33-.98 1.45-.03 2.85.52 3.88 1.54 1.04 1.01 1.62 2.4 1.62 3.86-.02 1.05-.25 2.1-.7 3.06-1.36 3.01-4.43 5.52-7.15 7.74l-.01.01c-.77.63-1.5 1.23-2.15 1.81zm-4.5-16c-.94-.02-1.83.34-2.5.99-.65.63-1.01 1.5-1.01 2.41.02.77.19 1.52.52 2.22.64 1.3 1.5 2.48 2.55 3.48 1 1 2.14 1.96 3.12 2.78.27.22.55.45.83.68l.18.14c.26.22.54.44.81.67l.01-.02.01-.02.01-.01.01-.01.01-.01.01-.01.02-.01.04-.04.01-.01.01-.01.01-.01.67-.54.17-.15c.28-.23.56-.45.83-.68.99-.81 2.13-1.78 3.12-2.78 1.05-1 1.91-2.18 2.56-3.47.33-.71.51-1.48.52-2.25 0-.91-.36-1.77-1-2.4-.67-.66-1.57-1.01-2.5-1-1.14.01-2.23.48-2.99 1.33L12 8.05l-1.51-1.74c-.77-.85-1.86-1.32-2.99-1.31z"/>
            </svg>
          </a>
        </div>
      </div>
      <h3 class="catalog__title">${product.name}</h3>
      <p class="catalog__description">${product.description}</p>
      <div class="catalog__price-box">
        ${product.oldPrice ? `<span class="catalog__price catalog__price--old">${product.oldPrice.toLocaleString()} руб.</span>` : ''}
        <span class="catalog__price${product.oldPrice ? ' catalog__price--new' : ''}">${product.price.toLocaleString()} руб.</span>
      </div>
    </article>
  `;
}

// Загрузка товаров и рендер в нужные контейнеры
fetch('products.json')
  .then(res => res.json())
  .then(products => {
    // Каталог (все товары)
    const catalogContainer = document.getElementById('catalog');
    if (catalogContainer) {
      catalogContainer.innerHTML = products.map(renderProductCard).join('');
    }
    // Спецпредложения (только isOffer)
    const offerContainer = document.getElementById('offer');
    if (offerContainer) {
      offerContainer.innerHTML = products.filter(p => p.isOffer).map(renderProductCard).join('');
    }
  }); 