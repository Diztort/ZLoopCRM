// Состояние приложения
const state = {
  route: 'dashboard',
  dealsCount: 57,
  contactsCount: 128
};

// Селекторы элементов
const navItems = document.querySelectorAll('.nav-item[data-route]');
const viewPages = document.querySelectorAll('.view-page');
const modalBackdrop = document.getElementById('modalBackdrop');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const addDealForm = document.getElementById('addDealForm');
const notifBtn = document.getElementById('notifBtn');
const notifPopover = document.getElementById('notifPopover');
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');

// SPA Роутер
function navigateTo(route) {
  state.route = route;

  // Обновляем активный пункт меню
  navItems.forEach(item => {
    if (item.getAttribute('data-route') === route) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Скрываем все вьюхи
  viewPages.forEach(page => page.classList.remove('active'));

  // Отображаем нужную вьюху
  const targetView = document.getElementById(`view-${route}`);
  if (targetView) {
    targetView.classList.add('active');
  } else {
    // Фоллбэк для демонстрационных разделов
    const genericView = document.getElementById('view-generic');
    document.getElementById('genericTitle').textContent = route.toUpperCase();
    genericView.classList.add('active');
  }

  // Закрываем боковое меню на мобильных при переходе
  sidebar.classList.remove('open');
  window.location.hash = route;
}

// Назначение событий клика по меню
navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const route = item.getAttribute('data-route');
    navigateTo(route);
  });
});

// Поддержка кнопок Назад/Вперед в браузере через хеш
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '');
  if (hash) navigateTo(hash);
});

// Переключатель мобильного меню
menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

// Управление модальным окном
openModalBtn.addEventListener('click', () => modalBackdrop.classList.add('open'));
closeModalBtn.addEventListener('click', () => modalBackdrop.classList.remove('open'));
modalBackdrop.addEventListener('click', (e) => {
  if (e.target === modalBackdrop) modalBackdrop.classList.remove('open');
});

// Динамическое создание сделки без перезагрузки
addDealForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('clientName').value;
  const sum = document.getElementById('dealSum').value;

  // Вставка строки в таблицу
  const tbody = document.getElementById('dealsTableBody');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${name}</td>
    <td>${Number(sum).toLocaleString()} ₽</td>
    <td><span class="badge-status status-new">Новая</span></td>
    <td>—</td>
  `;
  tbody.prepend(tr);

  // Обновление метрики в реальном времени
  state.dealsCount += 1;
  document.getElementById('val-deals').textContent = state.dealsCount;

  // Очистка и закрытие формы
  addDealForm.reset();
  modalBackdrop.classList.remove('open');
});

// Выпадающий список уведомлений
notifBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  notifPopover.classList.toggle('open');
});

document.addEventListener('click', () => {
  notifPopover.classList.remove('open');
});

// Инициализация стартового роута
const initialHash = window.location.hash.replace('#', '');
if (initialHash) {
  navigateTo(initialHash);
}