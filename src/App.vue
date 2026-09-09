<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';

const routes = [
  ['dashboard', 'Главная'],
  ['contacts', 'Контакты'],
  ['deals', 'Сделки'],
  ['funnel', 'Воронка'],
  ['wazzup', 'Wazzup'],
  ['tasks', 'Задачи'],
  ['analytics', 'Аналитика'],
  ['settings', 'Настройки']
];

const route = ref(window.location.hash.slice(1) || 'dashboard');
const sidebarOpen = ref(false);
const modalOpen = ref(false);
const notificationsOpen = ref(false);
const dealsCount = ref(57);
const dealForm = ref({ name: '', sum: '' });
const deals = ref([
  { name: 'Сеих', sum: 150000, status: 'В работе', statusClass: 'status-progress' },
  { name: 'ООО "Вектор"', sum: 420000, status: 'Новая', statusClass: 'status-new' }
]);

const activeRouteName = computed(() => routes.find(([key]) => key === route.value)?.[1] || route.value.toUpperCase());
const formattedSum = (sum) => `${Number(sum).toLocaleString('ru-RU')} ₽`;

function navigateTo(nextRoute) {
  route.value = nextRoute;
  window.location.hash = nextRoute;
  sidebarOpen.value = false;
}

function addDeal() {
  if (!dealForm.value.name || !dealForm.value.sum) return;
  deals.value.unshift({
    name: dealForm.value.name,
    sum: Number(dealForm.value.sum),
    status: 'Новая',
    statusClass: 'status-new'
  });
  dealsCount.value += 1;
  dealForm.value = { name: '', sum: '' };
  modalOpen.value = false;
}

function syncRoute() {
  route.value = window.location.hash.slice(1) || 'dashboard';
}

onMounted(() => window.addEventListener('hashchange', syncRoute));
onUnmounted(() => window.removeEventListener('hashchange', syncRoute));
</script>

<template>
  <div class="app-layout">
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="logo"><div><span>The</span>LoopCRM</div></div>
      <nav class="nav-menu">
        <a v-for="([key, label], index) in routes" :key="key" class="nav-item" :class="{ active: route === key }" href="#" @click.prevent="navigateTo(key)">
          <span class="nav-symbol">{{ ['⌂', '♙', '▣', '▽', '▰', '✓', '▥', '⚙'][index] }}</span>{{ label }}
        </a>
      </nav>
      <div class="sidebar-footer"><a class="nav-item" href="#"><span>⠋</span>Профиль</a></div>
    </aside>

    <main class="main-content">
      <header class="top-header">
        <div class="header-left">
          <button class="menu-toggle" aria-label="Открыть меню" @click="sidebarOpen = !sidebarOpen">☰</button>
          <div class="search-box"><span class="search-symbol">⌕</span><input type="text" placeholder="Поиск..."></div>
        </div>
        <div class="header-right">
          <div class="notification-wrap">
            <button class="icon-btn" aria-label="Уведомления" @click="notificationsOpen = !notificationsOpen">♧<span class="notif-badge"></span></button>
            <div v-if="notificationsOpen" class="notif-popover">
              <div class="notification-title">Уведомления</div>
              <div class="notification-text">Новое сообщение от Wazzup: «Здравствуйте!»</div>
            </div>
          </div>
          <button class="btn btn-primary" @click="modalOpen = true">+ Добавить</button>
        </div>
      </header>

      <div class="view-container">
        <div v-if="route === 'dashboard'" class="view-page active">
          <section class="metrics-grid">
            <div class="metric-card bg-blue"><div class="metric-title">Новые контакты</div><div class="metric-value">128</div><div class="metric-badge">+12%</div></div>
            <div class="metric-card bg-green"><div class="metric-title">Активные сделки</div><div class="metric-value">{{ dealsCount }}</div><div class="metric-badge">+8%</div></div>
            <div class="metric-card bg-orange"><div class="metric-title">Выбранные сделки</div><div class="metric-value">23</div><div class="metric-badge">+15%</div></div>
            <div class="metric-card bg-white"><div class="metric-title">Выручка</div><div class="metric-value">1 250 000 ₽</div><div class="metric-badge text-green">+18%</div></div>
          </section>

          <section class="middle-grid">
            <div class="card">
              <div class="card-header"><h2 class="card-title">Воронка продаж</h2><span class="color-tag">#3B82F6</span></div>
              <div class="funnel-body"><div class="funnel-shapes"><div class="funnel-step step-1">2,04</div><div class="funnel-step step-2">2,05</div><div class="funnel-step step-3">1,39</div><div class="funnel-step step-4">11</div></div><div class="chart-container"><svg class="chart-svg" viewBox="0 0 400 150"><path d="M 10 130 Q 50 120 90 120 T 170 90 T 250 80 T 330 20 T 380 130" fill="none" stroke="#3b82f6" stroke-width="3"/><circle cx="330" cy="20" r="5" fill="#3b82f6"/><line x1="330" y1="20" x2="330" y2="130" stroke="#3b82f6" stroke-dasharray="3,3"/></svg></div></div>
            </div>
            <div class="widgets-stack"><div class="card"><h3 class="widget-title">Новые сообщения (Wazzup)</h3><div class="status-item"><span class="check-circle">✓</span><span>Новое сообщение</span></div></div><div class="card"><h3 class="widget-title">Задачи на сегодня</h3><div class="bars-widget"><div class="bar h-40"></div><div class="bar h-80 active"></div><div class="bar h-100 active-bright"></div><div class="bar h-50"></div><div class="bar h-30"></div></div></div></div>
          </section>

          <section class="bottom-grid"><div class="card"><div class="card-header"><h2 class="card-title">Активные сделки</h2><span class="color-tag">#3B82F6</span></div><div class="table-wrapper"><table class="data-table"><thead><tr><th>Клиент</th><th>Сумма</th><th>Стадия</th><th>Действие</th></tr></thead><tbody><tr v-for="deal in deals" :key="deal.name + deal.sum"><td>{{ deal.name }}</td><td>{{ formattedSum(deal.sum) }}</td><td><span class="badge-status" :class="deal.statusClass">{{ deal.status }}</span></td><td>—</td></tr></tbody></table></div></div><div class="card"><h3 class="widget-title">Задачи на сегодня</h3><div class="status-item"><span class="check-circle green">✓</span><span>Активные сделки</span></div></div></section>
        </div>

        <div v-else-if="route === 'contacts'" class="view-page active"><div class="card"><div class="card-header"><h2 class="card-title">Контакты</h2></div><div class="table-wrapper"><table class="data-table"><thead><tr><th>Имя</th><th>Телефон</th><th>Компания</th><th>Статус</th></tr></thead><tbody><tr><td>Александр Сеих</td><td>+7 (999) 000-11-22</td><td>ИП Сеих</td><td><span class="badge-status status-done">Активен</span></td></tr><tr><td>Мария Иванова</td><td>+7 (999) 333-44-55</td><td>ООО Техно</td><td><span class="badge-status status-done">Активен</span></td></tr></tbody></table></div></div></div>
        <div v-else-if="route === 'deals'" class="view-page active"><div class="card"><div class="card-header"><h2 class="card-title">Все сделки</h2></div><p class="muted-text">Раздел управления сделками и интеграциями.</p></div></div>
        <div v-else class="view-page active"><div class="card"><h2 class="card-title">{{ activeRouteName }}</h2><p class="muted-text">Раздел загружен через Vue-роутинг.</p></div></div>
      </div>
    </main>
  </div>

  <div v-if="modalOpen" class="modal-backdrop" @click.self="modalOpen = false"><div class="modal"><div class="modal-header"><h3 class="modal-title">Новая сделка</h3><button class="modal-close" @click="modalOpen = false">×</button></div><form @submit.prevent="addDeal"><div class="form-group"><label>Имя клиента</label><input v-model="dealForm.name" type="text" class="form-control" placeholder="Введите имя" required></div><div class="form-group"><label>Сумма (₽)</label><input v-model="dealForm.sum" type="number" class="form-control" placeholder="100000" required></div><button type="submit" class="btn btn-primary form-submit">Создать</button></form></div></div>
</template>

<style scoped>
.nav-symbol { width: 20px; text-align: center; }
.search-symbol { font-size: 22px; line-height: 1; }
.notification-wrap { position: relative; }
.notification-title { font-weight: 700; margin-bottom: 8px; }
.notification-text, .muted-text { color: var(--text-muted); font-size: 14px; }
.form-submit { width: 100%; margin-top: 10px; }
</style>
