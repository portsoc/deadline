const DEADLINER = 'Deadliner';
const ok = "Time's up!";
let config = [{ date: '1970-01-01T00:00:00', name: '⟳' }];

const numFormatter = new Intl.NumberFormat();

function p(txt, ...cls) {
  const para = document.createElement('p');
  para.textContent = txt;
  if (cls) para.classList.add(...cls);
  document.body.append(para);
}

function refreshRow(row) {
  const futureDate = new Date(row.date);
  const futureMillis = futureDate.valueOf();

  p(row.name, 'topic');

  const now = Date.now();
  const diff = futureMillis - now;
  const seconds = diff / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;

  if (days > 2) {
    p(numFormatter.format(days.toFixed()) + ' days');
    return;
  }

  if (hours > 1) {
    p(numFormatter.format(hours.toFixed()) + ' hours');
    return;
  }

  if (minutes > 1) {
    p(numFormatter.format(minutes.toFixed()) + ' minutes');
    return;
  }

  if (seconds > 0) {
    p(numFormatter.format(seconds.toFixed()) + ' seconds');
  } else {
    p(ok);
  }
}

function refreshPage() {
  // need to refactor to be less lazy and only update times
  // until then - lazy
  document.body.textContent = '';
  for (const row of config) {
    refreshRow(row);
  }
}

async function initServiceWorker() {
  try {
    await navigator.serviceWorker.register('./worker.js');
  } catch (e) {
    console.warn("Service Worker failed.  Falling back to 'online only'.", e);
  }
}

async function loadConfig() {
  const response = await fetch('./config.json');
  config = await response.json();
}

async function notify(msg, timestamp) {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    const options = { tag: DEADLINER + timestamp };
    if (timestamp) {
      options.showTrigger = new TimestampTrigger(timestamp);
    }
    const reg = await navigator.serviceWorker.getRegistration();
    reg.showNotification(msg, options);
  }
}

async function prepNotifications() {
  // cances/close/remove any previously scheduled notifictions
  const reg = await navigator.serviceWorker.getRegistration();
  const notifications = await reg.getNotifications();
  for (const notification of notifications) {
    notification.close();
  }

  const ONE_MINUTE = 1000 * 60;
  const TEN_MINUTES = 1000 * 60 * 10;
  const ONE_HOUR = 1000 * 60 * 60;
  const ONE_DAY = 1000 * 60 * 60 * 24;
  const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

  /// add them all fresh
  for (const row of config) {
    const futureDate = new Date(row.date);
    const futureMillis = futureDate.valueOf();
    notify(row.name + ' deadline: sixty seconds', futureMillis - ONE_MINUTE);
    notify(row.name + ' deadline: ten minutes', futureMillis - TEN_MINUTES);
    notify(row.name + ' deadline: one hour', futureMillis - ONE_HOUR);
    notify(row.name + ' deadline: this time tomorrow', futureMillis - ONE_DAY);
    notify(row.name + ' deadline: one week from now', futureMillis - ONE_WEEK);
  }

  await notify('Notifications setup :-)');
  await notify('Timed notifications setup :-)', Date.now() + 5000);
}

async function init() {
  refreshPage();
  await initServiceWorker();
  await loadConfig();
  await prepNotifications();
  setInterval(refreshPage, 250);
}

window.addEventListener('load', init);
