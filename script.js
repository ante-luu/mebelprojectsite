// Корзина хранится в localStorage
const CART_KEY = 'cart';

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.count += 1;
  } else {
    cart.push({...product, count: 1});
  }
  saveCart(cart);
  updateCartUI();
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  updateCartUI();
}

// --- UI Elements ---
function getCartCount() {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  return cart.reduce((sum, item) => sum + (item.qty || 1), 0);
}
function getCartTotal() {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  return cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
}
function showCartNotification(product) {
  let notif = document.createElement('div');
  notif.className = 'cart-notification';
  notif.innerHTML = `Товар <b>${product.name}</b> добавлен в корзину!`;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 1800);
}
function updateCartUI() {
  // Счётчик в иконке корзины (добавьте элемент с id="cart-count" в разметку, если нужно)
  let count = getCartCount();
  let el = document.getElementById('cart-count');
  if (el) el.textContent = count > 0 ? count : '';
  // Итоговая сумма (например, в корзине)
  let totalEl = document.getElementById('total-amount');
  if (totalEl) totalEl.textContent = getCartTotal().toLocaleString();
}

// Модальное окно корзины
function openCartModal() {
  const modal = document.querySelector('.modal-cart');
  if (modal) modal.classList.add('open');
}

function closeCartModal() {
  const modal = document.querySelector('.modal-cart');
  if (modal) modal.classList.remove('open');
}

// --- Обработка кликов ---
document.addEventListener('DOMContentLoaded', function () {
  // Универсальный обработчик для всех страниц
  function handleAddToCart(e) {
    let target = e.target;
    // Проверяем, кликнули ли по SVG внутри иконки
    if (target.tagName === 'svg' || target.tagName === 'path') {
      target = target.closest('[data-id][data-name][data-price]');
    }
    // Проверяем, есть ли нужные data-атрибуты
    if (target && target.hasAttribute('data-id') && target.hasAttribute('data-name') && target.hasAttribute('data-price')) {
      const id = target.getAttribute('data-id');
      const name = target.getAttribute('data-name');
      const price = parseInt(target.getAttribute('data-price'), 10);
      addToCart({ id, name, price });
      // Можно добавить анимацию или уведомление
      e.preventDefault();
      e.stopPropagation();
    }
  }

  // Навешиваем обработчик на контейнер каталога и спецпредложений (делегирование)
  document.body.addEventListener('click', function (e) {
    if (
      e.target.closest('.catalog__img-container[data-id]') ||
      e.target.closest('.catalog__link-icon--basket[data-id]') ||
      e.target.closest('.offer__link-icon--basket[data-id]') ||
      e.target.closest('.offer__img-container[data-id]')
    ) {
      let target = e.target.closest('[data-id][data-name][data-price]');
      if (target) {
        const id = target.getAttribute('data-id');
        const name = target.getAttribute('data-name');
        const price = parseInt(target.getAttribute('data-price'), 10);
        addToCart({ id, name, price });
        showCartNotification({ id, name, price });
        e.preventDefault();
        e.stopPropagation();
      }
    }
  });

  // Функция добавления товара в корзину (пример)
  function addToCart(product) {
    // Получаем корзину из localStorage
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    // Проверяем, есть ли уже такой товар
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
  }

  // Функция обновления UI корзины (заглушка)
  function updateCartUI() {
    // Здесь можно обновить счетчик, сумму и т.д.
    // Например, обновить число товаров в иконке корзины
    // или перерисовать содержимое модального окна/страницы корзины
  }

  // --- Стили для уведомления ---
  (function(){
    const style = document.createElement('style');
    style.innerHTML = `.cart-notification {position:fixed;top:30px;right:30px;z-index:9999;background:#3fa9f5;color:#fff;padding:16px 28px;border-radius:12px;font-size:1.1rem;box-shadow:0 2px 12px rgba(0,0,0,0.12);animation:cartNotifIn 0.2s;}
  @keyframes cartNotifIn {from{opacity:0;transform:translateY(-20px);}to{opacity:1;transform:translateY(0);}}`;
    document.head.appendChild(style);
  })();
});

function renderCartItems() {
  const container = document.getElementById('cart-items');
  if (!container) return;
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  if (cart.length === 0) {
    container.innerHTML = '<div class="cart__empty">Ваша корзина пуста</div>';
    updateCartUI();
    return;
  }
  container.innerHTML = cart.map(item => `
    <div class="cart__item" data-id="${item.id}">
      <div class="cart__left">
        <img src="images/product-basket/${getCartImage(item)}" alt="${item.name}" class="cart__img">
        <div class="cart__info">
          <h4 class="cart__header">${item.name}</h4>
          <span class="cart__price">${(item.price).toLocaleString()} руб.</span>
          <div class="cart__link-box">
            <a class="cart__link cart__link--favorite" href="#">Избранное</a>
            <a class="cart__link cart__link--delete" href="#">Удалить</a>
          </div>
        </div>
      </div>
      <input type="number" class="cart__value" value="${item.qty}" min="1">
    </div>
  `).join('');
  updateCartUI();
}

// Пример сопоставления id товара и картинки (доработайте по необходимости)
function getCartImage(item) {
  // Сопоставление id товара и картинки
  const images = {
    '1': 'Table-MENU.jpg', // Стол MENU
    '2': 'Sofa-NASTAN.jpg', // Диван NASTAN
    '3': 'Bed-TATRAN.jpg', // Кровать TATRAN
    '4': 'Armchair-VILORA.jpg', // Кресло VILORA
    '5': 'Table-NORMAN.jpg', // Стол NORMAN
    '6': 'Sofa-ASKESTA.jpg', // Диван ASKESTA
    // Добавьте другие товары по необходимости
  };
  // Сначала ищем в product-basket, если нет — в products
  const basketPath = 'images/product-basket/' + (images[item.id] || '');
  const productsPath = 'images/products/' + (images[item.id] || '');
  // Проверяем, есть ли файл в product-basket (только для Table-MENU и Sofa-NASTAN)
  if (['1','2'].includes(item.id)) return images[item.id];
  // Для остальных — путь из products
  return images[item.id] ? '../products/' + images[item.id] : 'Table-MENU.jpg';
}

// Удаление товара
if (window.location.pathname.includes('cart.html')) {
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('cart__link--delete')) {
      e.preventDefault();
      const item = e.target.closest('.cart__item');
      if (item) {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart = cart.filter(i => i.id !== item.dataset.id);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
      }
    }
    if (e.target.classList.contains('cart__button--delete')) {
      e.preventDefault();
      localStorage.removeItem('cart');
      renderCartItems();
    }
  });
  // Изменение количества
  document.addEventListener('input', function(e) {
    if (e.target.classList.contains('cart__value')) {
      const item = e.target.closest('.cart__item');
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const prod = cart.find(i => i.id === item.dataset.id);
      if (prod) {
        prod.qty = Math.max(1, parseInt(e.target.value, 10) || 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
      }
    }
  });
  document.addEventListener('DOMContentLoaded', renderCartItems);
} 