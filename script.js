const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Theme toggle (remembers the choice)
document.getElementById('theme').addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try {
    localStorage.setItem('theme', next);
  } catch (e) {}
});

// Mobile menu
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(open));
});
menu.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  })
);

// Reveal on scroll, with a small stagger for siblings
const items = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver(
    (entries) => {
      entries
        .filter((e) => e.isIntersecting)
        .forEach((entry, i) => {
          entry.target.style.transitionDelay = `${Math.min(i * 70, 280)}ms`;
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  items.forEach((el) => io.observe(el));
} else {
  items.forEach((el) => el.classList.add('visible'));
}

// Rotating role in the hero
const roles = ['Next.js & React developer', 'Laravel & Node.js API builder', 'frontend team lead', 'AI feature builder'];
const roleEl = document.getElementById('role');
if (roleEl && !reduceMotion) {
  let r = 0;
  setInterval(() => {
    roleEl.classList.add('out');
    setTimeout(() => {
      r = (r + 1) % roles.length;
      roleEl.textContent = roles[r];
      roleEl.classList.remove('out');
    }, 300);
  }, 2600);
}

// Count-up stats
const counters = document.querySelectorAll('[data-count]');
const fmt = (n) => n.toLocaleString('en-US');
if ('IntersectionObserver' in window && !reduceMotion) {
  const co = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target;
        const target = Number(el.dataset.count);
        const start = performance.now();
        const dur = 1400;
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        co.unobserve(el);
      }
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => {
    el.textContent = '0';
    co.observe(el);
  });
}

// Spotlight that follows the cursor on cards
document.querySelectorAll('.card').forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});

// Project filters
const filters = document.querySelectorAll('.filter');
const projects = document.querySelectorAll('.project');
filters.forEach((btn) =>
  btn.addEventListener('click', () => {
    filters.forEach((b) => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-selected', String(b === btn));
    });
    const f = btn.dataset.filter;
    projects.forEach((p) => p.classList.toggle('hide', f !== 'all' && !p.dataset.cat.split(' ').includes(f)));
  })
);

// Highlight the current section in the nav
const links = [...menu.querySelectorAll('a')];
const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window) {
  const so = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
      }
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach((s) => so.observe(s));
}

// Copy email
const toast = document.getElementById('toast');
document.getElementById('copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('jad.4obeid@gmail.com');
    toast.textContent = 'Email copied ✓';
  } catch (e) {
    toast.textContent = 'jad.4obeid@gmail.com';
  }
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1800);
});

document.getElementById('year').textContent = new Date().getFullYear();
