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

async function notify(msg) {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    const reg = await navigator.serviceWorker.getRegistration();
    reg.showNotification('Deadliner: ' + msg);
  }
}

function init() {
  initServiceWorker();
  loadConfig();
  refreshPage();
  setInterval(refreshPage, 250);
  notify('hello!');
}

window.addEventListener('load', init);
