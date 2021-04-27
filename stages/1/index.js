const ok = '📚👀🎓🎉';
const el = {};
const d = new Date('2021-05-21T23:00:00');
const future = d.valueOf();
const numFormatter = new Intl.NumberFormat();

el.seconds = document.querySelector('#seconds');
el.minutes = document.querySelector('#minutes');
el.hours = document.querySelector('#hours');
el.days = document.querySelector('#days');
el.dl = document.querySelector('#dl');

function refresh() {
  const now = Date.now();
  const diff = future - now;
  const seconds = diff / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;

  el.seconds.textContent = seconds > 0 ? numFormatter.format(seconds.toFixed()) : ok;
  el.minutes.textContent = minutes > 0 ? numFormatter.format(minutes.toFixed()) : ok;
  el.hours.textContent = hours > 0 ? numFormatter.format(hours.toFixed()) : ok;
  el.days.textContent = days > 0 ? numFormatter.format(days.toFixed()) : ok;
  el.dl.textContent = d.toDateString();
  el.dl.textContent += ' ' + d.toTimeString();
}

function init() {
  setInterval(refresh, 250);
}

window.addEventListener('load', init);
