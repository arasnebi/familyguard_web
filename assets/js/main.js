(() => {
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;

  const saved = localStorage.getItem('af-theme');
  if (saved) root.dataset.theme = saved;
  else if (matchMedia('(prefers-color-scheme: light)').matches) root.dataset.theme = 'light';
  $$('[data-theme-toggle]').forEach(b => {
    b.textContent = root.dataset.theme === 'light' ? '🌙' : '☀️';
    b.addEventListener('click', () => {
      const next = root.dataset.theme === 'light' ? 'dark' : 'light';
      root.dataset.theme = next; localStorage.setItem('af-theme', next);
      b.textContent = next === 'light' ? '🌙' : '☀️';
    });
  });

  const links = $('.nav__links');
  $$('[data-burger]').forEach(b => b.addEventListener('click', () => {
    links?.classList.toggle('open');
    b.setAttribute('aria-expanded', links?.classList.contains('open'));
  }));
  $$('.nav__links a').forEach(a => a.addEventListener('click', () => links?.classList.remove('open')));

  const bt = $$('[data-billing]');
  const priceEls = $$('[data-price]');
  bt.forEach(btn => btn.addEventListener('click', () => {
    bt.forEach(x => x.classList.remove('active')); btn.classList.add('active');
    const mode = btn.dataset.billing;
    priceEls.forEach(el => {
      el.firstChild.textContent = mode === 'yearly' ? el.dataset.yearly : el.dataset.monthly;
      const note = el.querySelector('small');
      if (note) note.textContent = mode === 'yearly' ? '/yıl' : '/ay';
    });
  }));

  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12 });
  $$('.reveal').forEach(el => io.observe(el));

  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  const form = $('#contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const err = $('#form-err'), ok = $('#form-ok');
      err.textContent = ''; ok.hidden = true;
      const data = Object.fromEntries(new FormData(form));
      if (!data.ad?.trim() || !data.email?.includes('@') || (data.mesaj?.trim().length || 0) < 10) {
        err.textContent = 'Lütfen ad, geçerli e-posta ve en az 10 karakterlik mesaj girin.'; return;
      }
      if (!/\S+@\S+\.\S+/.test(data.email)) { err.textContent = 'Geçerli bir e-posta adresi girin.'; return; }
      const btn = form.querySelector('button[type=submit]');
      btn.disabled = true; btn.textContent = 'Gönderiliyor…';
      try {
        const res = await fetch(form.action, { method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form) });
        if (!res.ok) throw new Error();
        form.reset(); ok.hidden = false; ok.textContent = 'Mesajınız alındı. En kısa sürede dönüş yapacağız.';
      } catch {
        err.textContent = 'Gönderilemedi. Doğrudan familyguard.destek@gmail.com adresine yazabilirsiniz.';
      } finally { btn.disabled = false; btn.textContent = 'Gönder'; }
    });
  }
})();
