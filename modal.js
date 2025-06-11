document.addEventListener('DOMContentLoaded', function () {
  const filterSelect = document.querySelector('.select-filter1');
  const filterForm = document.querySelector('.filtering-form');
  const applyBtn = document.querySelector('.filtering-form__button');
  const closeBtn = document.querySelector('.filtering-form__close');

  if (!filterSelect || !filterForm) return;

  // Открытие модального окна
  filterSelect.addEventListener('focus', function () {
    filterForm.classList.add('filtering-form--open');
  });
  filterSelect.addEventListener('click', function () {
    filterForm.classList.add('filtering-form--open');
  });

  // Закрытие по кнопке "Применить"
  if (applyBtn) {
    applyBtn.addEventListener('click', function (e) {
      e.preventDefault();
      filterForm.classList.remove('filtering-form--open');
    });
  }

  // Закрытие по кнопке-крестику
  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      filterForm.classList.remove('filtering-form--open');
    });
  }

  // Закрытие по клику вне формы
  document.addEventListener('mousedown', function (e) {
    if (
      filterForm.classList.contains('filtering-form--open') &&
      !filterForm.contains(e.target) &&
      e.target !== filterSelect
    ) {
      filterForm.classList.remove('filtering-form--open');
    }
  });
}); 