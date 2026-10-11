/* ============================================================
   AndroForge / FamilyGuard — site JS  (v2 — düzeltilmiş)
   DÜZELTME 1: main.js içine yanlışlıkla yapıştırılan HTML bloğu
               kaldırıldı (SyntaxError tüm JS'i öldürüyor, .reveal
               öğeleri görünmez kalıyordu → "site boş" sorunu).
   DÜZELTME 2: Lightbox mantığı buraya taşındı (index.html).
   DÜZELTME 3: data-apk-child / data-apk-parent / data-play-parent
               düğmeleri artık RELEASES bloğundan bağlanıyor.
   ============================================================ */
(() => {
  'use strict';
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  if (!root.classList.contains('js')) root.classList.add('js');

  /* ===== SÜRÜM & BAĞLANTI AYARLARI — tek yerden güncelle ===== */
  const RELEASES = {
    apkChild:   'downloads/FamilyGuard_cocuk_v1.0.12_release.apk',
    apkParent:  'downloads/FamilyGuard_ebeveyn_v1.2.0_release.apk',
    playParent: '' /* Google Play sayfası yayına girince tam URL'yi buraya yaz */
  };

  /* ---- Tema ---- */
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

  /* ---- Mobil menü ---- */
  const links = $('.nav__links');
  $$('[data-burger]').forEach(b => b.addEventListener('click', () => {
    links?.classList.toggle('open');
    b.setAttribute('aria-expanded', links?.classList.contains('open'));
  }));
  $$('.nav__links a').forEach(a => a.addEventListener('click', () => links?.classList.remove('open')));

  /* ---- Abonelik: aylık/yıllık geçiş ---- */
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

  /* ---- Scroll animasyonu (reveal) ----
     JS çalışmazsa CSS 'html.js' kapısı sayesinde içerik görünür kalır. */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12 });
  $$('.reveal').forEach(el => io.observe(el));

  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  /* ---- İletişim formu ----
     Formspree form kimliği (XXXX...) henüz girilmediyse form otomatik
     olarak e-posta taslağına düşer; böylece hiçbir mesaj kaybolmaz. */
  const CONTACT_MAIL = 'familyguard.destek@gmail.com';
  const form = $('#contact-form');
  if (form) {
    const action = form.getAttribute('action') || '';
    const endpointReady = !/X{4,}/i.test(action);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const err = $('#form-err'), ok = $('#form-ok');
      err.textContent = ''; ok.hidden = true;
      const data = Object.fromEntries(new FormData(form));
      if (!data.ad?.trim() || !data.email?.includes('@') || (data.mesaj?.trim().length || 0) < 10) {
        err.textContent = 'Lütfen ad, geçerli e-posta ve en az 10 karakterlik mesaj girin.'; return;
      }
      if (!/\S+@\S+\.\S+/.test(data.email)) { err.textContent = 'Geçerli bir e-posta adresi girin.'; return; }
      if (!endpointReady) {
        const subject = encodeURIComponent('[Site] ' + (data.konu || 'İletişim') + ' — ' + data.ad);
        const body = encodeURIComponent('Ad Soyad: ' + data.ad + '\nE-posta: ' + data.email + '\nKonu: ' + (data.konu || '-') + '\n\n' + data.mesaj);
        window.location.href = 'mailto:' + CONTACT_MAIL + '?subject=' + subject + '&body=' + body;
        ok.hidden = false;
        ok.textContent = 'E-posta uygulamanız açılıyor. Mesajı oradan gönderin; dilerseniz ' + CONTACT_MAIL + ' adresine doğrudan yazabilirsiniz.';
        return;
      }
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

  /* ---- İndirme düğmeleri ---- */
  $$('[data-apk-child]').forEach(a => { a.href = RELEASES.apkChild; a.setAttribute('download', ''); });
  $$('[data-apk-parent]').forEach(a => { a.href = RELEASES.apkParent; a.setAttribute('download', ''); });
  $$('[data-play-parent]').forEach(a => {
    if (RELEASES.playParent) {
      a.href = RELEASES.playParent; a.target = '_blank'; a.rel = 'noopener';
    } else {
      /* Google Play henüz yayında değilse düğme imzalı APK'ya düşer */
      a.href = RELEASES.apkParent; a.setAttribute('download', '');
      a.title = 'Google Play bağlantısı yakında — şimdilik imzalı APK';
    }
  });

  /* ---- Lightbox (index.html ekran görüntüleri) ---- */
  const lb = $('#lightbox'), lbImg = $('#lightbox-img');
  if (lb && lbImg) {
    const openLb = (img) => {
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt || '';
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
    };
    const closeLb = () => {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      lbImg.src = '';
    };
    $$('[data-shot] img').forEach(img => {
      img.setAttribute('tabindex', '0');
      img.addEventListener('click', () => openLb(img));
      img.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(img); } });
    });
    lb.addEventListener('click', e => {
      if (e.target === lb || e.target.closest('[data-lb-close]')) closeLb();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && lb.classList.contains('open')) closeLb(); });
  }
})();