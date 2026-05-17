// Theme toggle ─────────────────────────────────────────────
const themeBtn = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');
const sunSvg = '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>';
const moonSvg = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
function setTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  themeIcon.innerHTML = t === 'dark' ? sunSvg : moonSvg;
  try { localStorage.setItem('npd-theme', t); } catch {}
}
const stored = (() => { try { return localStorage.getItem('npd-theme'); } catch { return null; } })();
setTheme(stored || 'light');
themeBtn.addEventListener('click', () => {
  setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

// Mobile nav panel ───────────────────────────────────────────
const navMenuBtn = document.getElementById('navMenuBtn');
const navPanel = document.getElementById('navPanel');
const navPanelClose = document.getElementById('navPanelClose');
const navPanelBackdrop = document.getElementById('navPanelBackdrop');
const panelLinks = document.querySelectorAll('.nav-panel-links a[href^="#"]');

function openNavPanel() {
  navPanel.classList.add('open');
  navPanel.setAttribute('aria-hidden', 'false');
  navMenuBtn.setAttribute('aria-expanded', 'true');
  document.body.classList.add('nav-panel-open');
}
function closeNavPanel() {
  navPanel.classList.remove('open');
  navPanel.setAttribute('aria-hidden', 'true');
  navMenuBtn.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('nav-panel-open');
}

navMenuBtn.addEventListener('click', () => {
  if (navPanel.classList.contains('open')) closeNavPanel();
  else openNavPanel();
});
navPanelClose.addEventListener('click', closeNavPanel);
navPanelBackdrop.addEventListener('click', closeNavPanel);
panelLinks.forEach(a => a.addEventListener('click', closeNavPanel));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navPanel.classList.contains('open')) closeNavPanel();
});

// Scroll-spy for nav ───────────────────────────────────────
const navLinks = document.querySelectorAll('.nav-links a[href^="#"], .nav-panel-links a[href^="#"]');
const sections = [...new Set([...navLinks].map(a => a.getAttribute('href').slice(1)))]
  .map(id => document.getElementById(id))
  .filter(Boolean);
const spy = () => {
  const y = window.scrollY + 120;
  let active = sections[0]?.id;
  for (const s of sections) if (s.offsetTop <= y) active = s.id;
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + active));
};
window.addEventListener('scroll', spy, { passive: true });
spy();

// Publication filters ──────────────────────────────────────
const filters = document.querySelectorAll('.pub-filter');
const pubs = document.querySelectorAll('.pub');
const pubCount = document.getElementById('pubCount');
filters.forEach(b => b.addEventListener('click', () => {
  filters.forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  const f = b.dataset.filter;
  let n = 0;
  pubs.forEach(p => {
    const show = f === 'all' || p.dataset.year === f || p.dataset.type === f;
    p.style.display = show ? '' : 'none';
    if (show) n++;
  });
  pubCount.textContent = `// ${n} paper${n === 1 ? '' : 's'}`;
}));

// BibTeX copy ──────────────────────────────────────────────
const toast = document.getElementById('toast');
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 1600);
}
document.querySelectorAll('.copy-bib').forEach(btn => {
  btn.addEventListener('click', async () => {
    const key = btn.dataset.bib;
    const article = btn.closest('.pub');
    const title = article.querySelector('.pub-title').textContent.trim();
    const venue = article.querySelector('.pub-venue').textContent.trim();
    const authors = article.querySelector('.pub-authors').textContent.trim();
    const year = article.querySelector('.pub-year')?.textContent.trim() || article.dataset.year || '';
    const bib = `@article{${key},\n  title   = {${title}},\n  author  = {${authors}},\n  journal = {${venue}},\n  year    = {${year}}\n}`;
    try {
      await navigator.clipboard.writeText(bib);
      showToast('bibtex copied');
    } catch {
      showToast('copy failed');
    }
  });
});

// CV download stub ─────────────────────────────────────────
document.getElementById('cvBtn').addEventListener('click', e => {
  e.preventDefault();
  showToast('CV.pdf — placeholder');
});
