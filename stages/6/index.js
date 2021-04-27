const ok = "Time's up!";
const el = {};
let config = [{ date: '2021-05-03T13:23:45', name: 'Something' }];

const numFormatter = new Intl.NumberFormat();

el.seconds = document.querySelector('#seconds');
el.minutes = document.querySelector('#minutes');
el.hours = document.querySelector('#hours');
el.days = document.querySelector('#days');
el.dl = document.querySelector('#dl');
el.name = document.querySelector('#name');

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
  document.body.innerHTML = '';
  for (const row of config) {
    refreshRow(row);
  }
}

async function initServiceWorker() {
  if (!navigator.serviceWorker) return;
  try {
    return await navigator.serviceWorker.register('./worker.js');
  } catch (e) {
    console.error("Service Worker failed.  Falling back to 'online only'.", e);
  }
}

async function loadConfig() {
  const response = await fetch('./config.json');
  config = await response.json();
}

async function prepNotification(msg) {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    const reg = await navigator.serviceWorker.getRegistration();
    console.log('queueing notification');
    reg.showNotification('Deadliner: ' + msg);
  }
}

async function init() {
  await initServiceWorker();
  loadConfig();
  setInterval(refreshPage, 250);
  await prepNotification('hello!');
}

window.addEventListener('load', init);
