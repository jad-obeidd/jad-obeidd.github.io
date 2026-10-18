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

// Stagger index for chips so they pop in one after another
document.querySelectorAll('.chips, .tags').forEach((group) =>
  [...group.children].forEach((chip, i) => chip.style.setProperty('--i', i))
);

if (!reduceMotion) {
  // Scroll progress bar
  const progress = document.querySelector('.progress');
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.setProperty('--p', max > 0 ? (window.scrollY / max).toFixed(4) : 0);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (finePointer) {
    // Soft glow that follows the cursor
    const glow = document.querySelector('.cursor-glow');
    window.addEventListener('pointermove', (e) => {
      glow.style.setProperty('--cx', `${e.clientX}px`);
      glow.style.setProperty('--cy', `${e.clientY}px`);
    }, { passive: true });

    // 3D tilt on project cards
    document.querySelectorAll('.tilt, .tilt-soft').forEach((card) => {
      const max = card.classList.contains('tilt-soft') ? 3 : 6;
      card.addEventListener('pointermove', (e) => {
        if (!card.classList.contains('visible')) return;
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(1000px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => (card.style.transform = ''));
    });

    // Magnetic primary buttons
    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      btn.addEventListener('pointerleave', () => (btn.style.transform = ''));
    });

    // Floating hero chips drift with the mouse (parallax)
    const hero = document.querySelector('.hero');
    const floats = [...document.querySelectorAll('.chip-float')];
    const portrait = document.querySelector('.portrait');
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      floats.forEach((el, i) => (el.style.translate = `${x * (14 + i * 8)}px ${y * (14 + i * 8)}px`));
      portrait.style.translate = `${x * -8}px ${y * -8}px`;
    });
    hero.addEventListener('pointerleave', () => {
      floats.forEach((el) => (el.style.translate = ''));
      portrait.style.translate = '';
    });
  }

  // Type out the code card in the hero
  const code = document.querySelector('.chip-float.code');
  if (code) {
    const lines = [
      [['k', 'const'], ['', ' jad = {']],
      [['', '  stack: '], ['s', "'Next.js + Laravel'"], ['', ',']],
      [['', '  loves: '], ['s', "'AI features'"]],
      [['', '};']],
    ];
    code.innerHTML = '';
    const caret = document.createElement('span');
    caret.className = 'caret';
    let li = 0, si = 0, ci = 0, lineEl = null, spanEl = null;
    const step = () => {
      if (li >= lines.length) {
        code.appendChild(caret);
        return;
      }
      if (!lineEl) {
        lineEl = document.createElement('div');
        lineEl.style.whiteSpace = 'pre';
        code.appendChild(lineEl);
      }
      const [cls, text] = lines[li][si];
      if (!spanEl) {
        spanEl = document.createElement('span');
        if (cls) spanEl.className = cls;
        lineEl.appendChild(spanEl);
      }
      spanEl.textContent += text[ci++];
      lineEl.appendChild(caret);
      if (ci >= text.length) {
        ci = 0; si++; spanEl = null;
        if (si >= lines[li].length) { si = 0; li++; lineEl = null; }
      }
      setTimeout(step, 28 + Math.random() * 40);
    };
    setTimeout(step, 900);
  }
}
