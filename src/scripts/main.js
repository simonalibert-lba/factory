// Page d'accueil LBA Factory : état de l'interface (sliders, menus) et motion (GSAP, ScrollTrigger, SplitText, Lenis).
// Port direct de la maquette Claude Design ; la logique de motion est volontairement identique.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

Object.assign(window, { gsap, ScrollTrigger, SplitText, Lenis });

const LABELS = {
  a: ['Mettre en pause le défilement des photos', 'Lancer le défilement des photos'],
  b: ['Mettre en pause le défilement des photos de l’agence', 'Lancer le défilement des photos de l’agence'],
};

class App {
  constructor() {
    this.state = { slide: 0, slideB: 0, autoPaused: false, autoPausedB: false, menuOpen: false, langOpen: false };
    this.root = document.querySelector('.lbaf-root');
    this.bindUi();
    this.render();
    this.componentDidMount();
  }

  setState(patch) {
    Object.assign(this.state, patch);
    this.render();
  }

  /** Applique l'état au DOM (équivalent des valeurs calculées de la maquette). */
  render() {
    const st = this.state;
    const sliders = { a: { idx: st.slide, paused: st.autoPaused }, b: { idx: st.slideB, paused: st.autoPausedB } };
    this.root.querySelectorAll('.pager[data-slider]').forEach((pager) => {
      const key = pager.dataset.slider;
      const cfg = sliders[key];
      const region = pager.parentElement;
      region.querySelectorAll('img.slide').forEach((img) => {
        const cur = Number(img.dataset.slide) === cfg.idx;
        img.style.opacity = cur ? '1' : '0';
        img.style.transform = 'scale(' + (cur ? 1 : 1.14) + ')';
        img.setAttribute('aria-hidden', cur ? 'false' : 'true');
      });
      pager.querySelectorAll('.pager-dot').forEach((dot) => {
        dot.setAttribute('aria-current', Number(dot.dataset.index) === cfg.idx ? 'true' : 'false');
      });
      pager.classList.toggle('is-paused', cfg.paused);
      const toggle = pager.querySelector('.pager-toggle');
      if (toggle) toggle.setAttribute('aria-label', LABELS[key][cfg.paused ? 1 : 0]);
    });
    const menu = document.getElementById('menu-mobile');
    if (menu) menu.hidden = !st.menuOpen;
    this.root.querySelectorAll('[aria-controls="menu-mobile"]').forEach((b) => b.setAttribute('aria-expanded', st.menuOpen ? 'true' : 'false'));
    const langs = document.getElementById('langues');
    if (langs) langs.hidden = !st.langOpen;
    this.root.querySelectorAll('[aria-controls="langues"]').forEach((b) => b.setAttribute('aria-expanded', st.langOpen ? 'true' : 'false'));
  }

  bindUi() {
    this.root.addEventListener('click', (e) => {
      const el = e.target.closest('[data-action]');
      if (!el || !this.root.contains(el)) return;
      const action = el.dataset.action;
      if (action === 'pick') {
        const key = el.closest('.pager').dataset.slider;
        this.setState(key === 'b' ? { slideB: Number(el.dataset.index) } : { slide: Number(el.dataset.index) });
      } else if (action === 'toggle-auto') {
        if (el.dataset.slider === 'b') this.setState({ autoPausedB: !this.state.autoPausedB });
        else this.setState({ autoPaused: !this.state.autoPaused });
      } else if (action === 'toggle-lang') {
        this.setState({ langOpen: !this.state.langOpen });
      } else if (action === 'open-menu') {
        this.setState({ menuOpen: true });
        if (this._lenis) this._lenis.stop();
        document.documentElement.style.overflow = 'hidden';
        const close = document.querySelector('#menu-mobile .m-close');
        if (close) close.focus();
      } else if (action === 'close-menu') {
        this.setState({ menuOpen: false });
        if (this._lenis) this._lenis.start();
        document.documentElement.style.overflow = '';
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (this.state.menuOpen) { this.setState({ menuOpen: false }); if (this._lenis) this._lenis.start(); document.documentElement.style.overflow = ''; }
      if (this.state.langOpen) this.setState({ langOpen: false });
    });
    document.addEventListener('click', (e) => {
      if (this.state.langOpen && !e.target.closest('.lang-wrap')) this.setState({ langOpen: false });
    });
    this.bindForm();
  }

  bindForm() {
    const form = this.root.querySelector('form[data-contact]');
    if (!form) return;
    const status = form.querySelector('.form-status');
    // Retour d'un envoi sans JavaScript (redirection depuis /api/contact)
    const sent = new URLSearchParams(location.search).get('envoi');
    if (sent && status) {
      status.textContent = sent === 'ok' ? 'Merci, votre message est bien envoyé. Nous revenons vers vous rapidement.' : 'Envoi impossible pour le moment. Réessayez ou écrivez-nous directement.';
      status.classList.toggle('is-error', sent !== 'ok');
    }
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const say = (msg, error) => { status.textContent = msg; status.classList.toggle('is-error', !!error); };
      if (!form.email.value.trim() || !form.message.value.trim()) { say('Indiquez au moins votre e-mail et votre message.', true); return; }
      btn.disabled = true; say('Envoi en cours…');
      try {
        const res = await fetch(form.action, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Envoi impossible');
        form.reset(); say('Merci, votre message est bien envoyé. Nous revenons vers vous rapidement.');
      } catch (err) {
        say((err && err.message) || 'Envoi impossible. Réessayez ou écrivez-nous directement.', true);
      } finally { btn.disabled = false; }
    });
  }

  componentDidMount() {
    let reduce = false;
    try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    this._reduce = reduce;
    if (reduce) this.setState({ autoPaused: true, autoPausedB: true });
    // Slide duration is driven by the pager fill animation (5 s): pause freezes it, picking a dot restarts it.
    this._onFill = (e) => {
      if (e.animationName !== 'pager-fill') return;
      const pager = e.target.closest && e.target.closest('.pager');
      if (!pager) return;
      const st = this.state || {};
      if (pager.dataset.slider === 'b') { if (!st.autoPausedB) this.setState({ slideB: ((st.slideB || 0) + 1) % 3 }); }
      else if (!st.autoPaused) this.setState({ slide: ((st.slide || 0) + 1) % 3 });
    };
    document.addEventListener('animationend', this._onFill);
    requestAnimationFrame(() => this.initMotion());
  }
  componentWillUnmount() {
    document.removeEventListener('animationend', this._onFill);
    try { if (this._lenis) this._lenis.destroy(); if (window.ScrollTrigger) window.ScrollTrigger.getAll().forEach((t) => t.kill()); } catch (e) {}
  }
  initFloatNav(root, ST) {
    const bar = root.querySelector('.float-nav'); if (!bar) return;
    const head = root.querySelector('.site-header');
    const ind = bar.querySelector('.float-ind');
    const cur = bar.querySelector('.float-current');
    const links = Array.from(bar.querySelectorAll('.float-links a'));
    const show = (on) => {
      bar.classList.toggle('is-visible', on);
      if (on) { bar.removeAttribute('inert'); bar.removeAttribute('aria-hidden'); }
      else { bar.setAttribute('inert', ''); bar.setAttribute('aria-hidden', 'true'); }
    };
    ST.create({ trigger: head, start: 'bottom top', end: 'max', onToggle: (self) => show(self.isActive) });
    const setActive = (id) => {
      let found = null;
      links.forEach((a) => { const on = a.getAttribute('data-target') === id; if (on) { a.setAttribute('aria-current', 'true'); found = a; } else { a.removeAttribute('aria-current'); } a.style.color = on ? 'var(--text-primary)' : ''; });
      if (found && ind) { ind.style.opacity = '1'; ind.style.transform = 'translateX(' + found.offsetLeft + 'px)'; ind.style.inlineSize = found.offsetWidth + 'px'; }
      else if (ind) { ind.style.opacity = '0'; }
      if (cur) cur.textContent = found ? found.textContent : '';
    };
    links.forEach((a) => {
      const sec = root.querySelector('#' + a.getAttribute('data-target'));
      if (!sec) return;
      ST.create({ trigger: sec, start: 'top 45%', end: 'bottom 45%', onToggle: (self) => { if (self.isActive) setActive(a.getAttribute('data-target')); } });
    });
    const contact = root.querySelector('#contact');
    if (contact) ST.create({ trigger: contact, start: 'top 45%', end: 'bottom 45%', onToggle: (self) => { if (self.isActive) setActive('contact'); } });
    ST.create({ trigger: root.querySelector('main'), start: 'top top', end: 'bottom 45%', onToggle: (self) => { if (self.isActive) setActive(null); } });
    window.addEventListener('resize', () => { const a = bar.querySelector('.float-links a[aria-current="true"]'); if (a) setActive(a.getAttribute('data-target')); });
  }
  initMotion() {
    const g = window.gsap, ST = window.ScrollTrigger, Split = window.SplitText;
    if (!g || !ST) { this._tries = (this._tries || 0) + 1; if (this._tries < 40) setTimeout(() => this.initMotion(), 100); return; }
    if (this._motionReady) return;
    this._motionReady = true;
    g.registerPlugin(ST); if (Split) g.registerPlugin(Split);
    const root = document.querySelector('.lbaf-root'); if (!root) return;
    const reduce = this._reduce;
    const ease = 'expo.out';
    const FADE = 0.25;
    if (!reduce && window.Lenis) {
      const lenis = new window.Lenis({ lerp: 0.1, anchors: { offset: -88 } });
      lenis.on('scroll', ST.update);
      g.ticker.add((t) => lenis.raf(t * 1000));
      g.ticker.lagSmoothing(0);
      this._lenis = lenis;
    }
    this.initFloatNav(root, ST);
    const titles = Array.from(root.querySelectorAll('h1, h2'));
    let entered = false;
    const runTitles = () => {
      titles.forEach((el) => {
        const hero = el.tagName === 'H1';
        if (hero && !reduce && Split && !entered) { this._heroQueue = () => make(el, hero); return; }
        make(el, hero);
      });
      g.set(titles, { visibility: 'visible' });
    };
    const make = (el, hero) => {
      {
        const st = hero ? undefined : { trigger: el, start: 'top 85%', once: true };
        if (reduce || !Split) { g.fromTo(el, { opacity: 0 }, { opacity: 1, duration: FADE, scrollTrigger: st, clearProps: 'opacity' }); return; }
        const split = Split.create(el, { type: 'lines', linesClass: 'line' });
        const tl = g.timeline({ scrollTrigger: st, delay: hero ? 0.15 : 0, onComplete: () => { split.revert(); } });
        tl.from(split.lines, { opacity: 0, y: 14, filter: 'blur(8px)', duration: 1.1, stagger: 0.07, ease: 'power3.out' });
        const hls = el.querySelectorAll('.hl');
        if (hls.length) tl.fromTo(hls, { '--hl': 0 }, { '--hl': 1, duration: 0.6, ease: 'power3.out' }, '-=0.35');
        if (hero) setTimeout(() => { if (tl.progress() < 1) tl.progress(1); }, 2200);
      }
    };
    g.set(titles, { visibility: 'hidden' });
    const fam = getComputedStyle(titles[0] || root).fontFamily;
    const fontsReady = (document.fonts && document.fonts.load)
      ? Promise.all([document.fonts.load('400 1em ' + fam), document.fonts.load('500 1em ' + fam)]).then(() => document.fonts.ready)
      : Promise.resolve();
    let started = false;
    const start = () => { if (started) return; started = true; runTitles(); ST.refresh(); };
    fontsReady.then(start, start);
    setTimeout(start, 1200);
    // Chorégraphie : en-tête, puis titre, texte, médias ; dans chaque section, surtitre, titre, texte, puis cartes décalées.
    const tracked = [];
    const CLR = 'filter,transform';
    const show = (els, vars) => {
      const list = (!els ? [] : (els instanceof Element ? [els] : Array.from(els))).filter(Boolean);
      if (!list.length) return null;
      tracked.push(...list);
      const v = Object.assign({}, vars || {});
      if (reduce) return g.from(list, { opacity: 0, duration: FADE, delay: v.delay ? Math.min(v.delay, 0.3) : 0, stagger: v.stagger ? 0.05 : 0, scrollTrigger: v.scrollTrigger });
      return g.from(list, Object.assign({ opacity: 0, y: 14, filter: 'blur(6px)', duration: 0.9, ease: 'power3.out', clearProps: CLR }, v));
    };
    const onEnter = (el, start) => ({ trigger: el, start: start || 'top 86%', once: true });
    // Intro : le logo s'écrit (vidéo), puis il vole jusqu'à l'en-tête pendant que la page apparaît
    const html = document.documentElement;
    const intro = root.querySelector('.intro');
    const vid = intro && intro.querySelector('video');
    const useIntro = !reduce && !!vid && html.classList.contains('lbaf-intro');
    if (!useIntro) html.classList.remove('lbaf-intro');
    const entrance = () => {
      if (entered) return;
      entered = true;
      // En-tête
      const header = root.querySelector('.site-header');
      show(root.querySelectorAll((useIntro ? '' : '.site-header header > a, ') + '.site-header .nav li, .site-header .lang-wrap, .site-header .head-cta, .site-header .menu-btn'), { y: -8, filter: 'blur(4px)', duration: 0.8, stagger: 0.05, delay: 0.05 });
      if (!reduce) {
        // Filets tracés au défilement : sous la navigation, sur les côtés, entre les sections et les lignes
        // Au chargement : le filet de la navigation se trace en entier, les filets latéraux descendent jusqu'au bas de l'écran
        if (header) g.fromTo(header, { '--sl': 0 }, { '--sl': 1, duration: 1.8, ease: 'expo.inOut', delay: 0.1 });
        const sideLines = () => {
          const H = root.scrollHeight, vh = window.innerHeight, max = Math.max(1, H - vh);
          const s = Math.max(0, -root.getBoundingClientRect().top);
          const p = Math.min(1, s / max);
          return Math.min(1, (s + vh * (0.72 + 0.28 * p)) / H);
        };
        const vl = { v: 0 };
        let introDone = false;
        const paintVl = () => root.style.setProperty('--vl', vl.v.toFixed(4));
        paintVl();
        g.to(vl, { v: () => sideLines(), duration: 2, ease: 'expo.inOut', delay: 0.25, onUpdate: paintVl, onComplete: () => { introDone = true; if (setVl) setVl(sideLines()); } });
        const setVl = g.quickTo ? g.quickTo(vl, 'v', { duration: 0.6, ease: 'power3.out', onUpdate: () => root.style.setProperty('--vl', vl.v.toFixed(4)) }) : null;
        ST.create({ trigger: root, start: 'top top', end: 'bottom bottom', onUpdate: () => { if (!introDone) return; if (setVl) setVl(sideLines()); else { vl.v = sideLines(); paintVl(); } }, onRefresh: () => { if (!introDone) return; vl.v = sideLines(); paintVl(); } });
      }
      // Hero
      const heroMain = root.querySelector('main');
      const textCol = heroMain && heroMain.children[0];
      const mediaCol = heroMain && heroMain.children[1];
      const heroText = root.querySelectorAll('main > div:first-child > p, main > div:first-child > div');
      show(heroText, { delay: 0.55, stagger: 0.12 });
      if (mediaCol) {
        const tiles = Array.from(mediaCol.querySelectorAll(':scope > .squircle'));
        show(tiles[0], { y: 28, scale: 0.97, filter: 'blur(12px)', duration: 1.4, ease: 'expo.out', delay: 0.3 });
        show(tiles.slice(1), { y: 32, filter: 'blur(10px)', duration: 1.3, ease: 'expo.out', delay: 0.55, stagger: 0.12 });
        if (!reduce) g.from(mediaCol.querySelectorAll('.squircle img:not(.slide)'), { scale: 1.12, duration: 1.8, ease, delay: 0.55, stagger: 0.12 });
        show(mediaCol.querySelector('.pager'), { y: 8, filter: 'blur(4px)', duration: 0.7, delay: 1.1 });
        show(mediaCol.querySelector('.meta'), { y: 6, duration: 0.7, delay: 1.3 });
        if (!reduce) {
          const sc = { trigger: heroMain, start: 'top top', end: 'bottom top', scrub: true };
          if (textCol) g.to(textCol, { yPercent: -10, ease: 'none', scrollTrigger: sc });
          g.to(mediaCol, { yPercent: -4, ease: 'none', scrollTrigger: sc });
        }
      }
      if (this._heroQueue) { const q = this._heroQueue; this._heroQueue = null; q(); }
      setTimeout(net, 2500);
    };
    if (useIntro) {
      const LOGO_DONE = 2.3;
      const lenis = this._lenis;
      if (lenis) lenis.stop();
      html.style.overflow = 'hidden';
      let flown = false, flyTimer = null;
      const finish = () => {
        html.classList.remove('lbaf-intro');
        html.style.overflow = '';
        if (lenis) lenis.start();
        ST.refresh();
      };
      const fly = () => {
        if (flown) return; flown = true;
        clearTimeout(flyTimer);
        intro.style.pointerEvents = 'none';
        const img = root.querySelector('.site-header header > a img');
        entrance();
        if (!img) { g.to(intro, { opacity: 0, duration: 0.5, onComplete: finish }); return; }
        const vr = vid.getBoundingClientRect(), ir = img.getBoundingClientRect();
        // Position du logo dans l'image de la vidéo (960 × 240) : x 26, y 33, largeur 907
        const lx = vr.width * 26 / 960, ly = vr.height * 33 / 240, lw = vr.width * 907 / 960;
        const k = ir.width / lw;
        g.timeline({ onComplete: finish })
          .to(vid, { x: ir.left - (vr.left + lx * k), y: ir.top - (vr.top + ly * k), scale: k, duration: 1.05, ease: 'expo.inOut' }, 0)
          .to(intro, { backgroundColor: 'rgba(253,252,252,0)', duration: 0.8, ease: 'power2.inOut' }, 0.15);
      };
      const skip = () => { try { vid.pause(); vid.currentTime = 2.55; } catch (e) {} fly(); };
      intro.addEventListener('click', skip);
      window.addEventListener('keydown', skip, { once: true });
      const schedule = () => { clearTimeout(flyTimer); flyTimer = setTimeout(fly, Math.max(0, LOGO_DONE - (vid.currentTime || 0)) * 1000); };
      vid.addEventListener('playing', schedule);
      vid.addEventListener('ended', fly);
      const p = vid.paused ? vid.play() : null;
      if (p && p.catch) p.catch(() => { g.to(intro, { opacity: 0, duration: 0.4, onComplete: finish }); entrance(); flown = true; });
      if (!vid.paused) schedule();
      // Si la vidéo ne démarre pas vite, on n'attend pas
      setTimeout(() => { if (!flown && (vid.paused || vid.currentTime < 0.05)) { flown = true; entrance(); g.to(intro, { opacity: 0, duration: 0.4, onComplete: finish }); } }, 1200);
    } else {
      entrance();
    }
    // Têtes de section : surtitre avant le titre, texte d'accompagnement après
    root.querySelectorAll('.surtitre').forEach((el) => show(el, { y: 10, duration: 0.8, scrollTrigger: onEnter(el, 'top 88%') }));
    root.querySelectorAll('.sec-head > p:not(.surtitre), #agence h2 + p, #contact h2 + p').forEach((el) => {
      const h = el.parentElement.querySelector('h2') || el;
      show(el, { delay: 0.35, scrollTrigger: onEnter(h, 'top 85%') });
    });
    // Filets et panneaux
    if (!reduce) {
      root.querySelectorAll('#solutions, #expertises, #references, #recrutement').forEach((sec) => {
        g.fromTo(sec, { '--sl': 0 }, { '--sl': 1, ease: 'none', scrollTrigger: { trigger: sec, start: 'top 98%', end: 'top 42%', scrub: 0.6 } });
      });
      root.querySelectorAll('#agence, #contact').forEach((sec) => {
        g.fromTo(sec, { '--bgx': 0.9, '--bgy': 0.96, '--bgr': 48 }, { '--bgx': 1, '--bgy': 1, '--bgr': 0, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'top 25%', scrub: true } });
      });
    }
    // Cartes et images : chaque tuile entre avec un léger décalage, puis son contenu
    const tiles = Array.from(root.querySelectorAll('#solutions .card, #references .card, #recrutement .card, #recrutement figure, #agence figure'));
    const kidsOf = (t) => t.matches('figure') ? [] : Array.from(t.querySelectorAll(':scope > p, :scope > div:not([role]) > :not(svg):not(.illu-zoom), :scope > div[role="img"]'));
    tracked.push(...tiles);
    g.set(tiles, reduce ? { opacity: 0 } : { opacity: 0, y: 48, filter: 'blur(10px)' });
    ST.batch(tiles, {
      start: 'top 88%', once: true,
      onEnter: (batch) => batch.forEach((t, i) => {
        if (reduce) { g.to(t, { opacity: 1, duration: FADE, delay: i * 0.05 }); return; }
        const tl = g.timeline({ delay: i * 0.14 });
        tl.to(t, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'expo.out', clearProps: CLR });
        const img = t.matches('figure') && t.querySelector(':scope > img');
        if (img) tl.from(img, { scale: 1.16, duration: 1.8, ease, clearProps: 'transform' }, 0);
        const kids = kidsOf(t);
        if (kids.length) tl.from(kids, { opacity: 0, y: 12, filter: 'blur(4px)', duration: 0.8, stagger: 0.07, ease: 'power3.out', clearProps: CLR }, 0.2);
      })
    });
    // Lignes (expertises, offres) : le filet se trace, puis le contenu de la ligne
    const rows = Array.from(root.querySelectorAll('.rows > li'));
    tracked.push(...rows);
    g.set(rows, { opacity: 0 });
    if (!reduce) root.querySelectorAll('.rows > li + li').forEach((li) => g.fromTo(li, { '--line': 0 }, { '--line': 1, ease: 'none', scrollTrigger: { trigger: li, start: 'top 96%', end: 'top 60%', scrub: 0.6 } }));
    ST.batch(rows, {
      start: 'top 90%', once: true,
      onEnter: (batch) => batch.forEach((li, i) => {
        if (reduce) { g.to(li, { opacity: 1, duration: FADE }); return; }
        const tl = g.timeline({ delay: i * 0.12 });
        tl.set(li, { opacity: 1 });
        tl.from(li.children, { opacity: 0, y: 14, filter: 'blur(5px)', duration: 0.85, stagger: 0.07, ease: 'power3.out', clearProps: CLR }, 0.15);
      })
    });
    // L'agence et contact : lignes de chiffres et coordonnées en cascade
    root.querySelectorAll('#agence dl, #contact dl').forEach((dl) => show(dl.children, { stagger: 0.12, delay: 0.15, scrollTrigger: onEnter(dl, 'top 88%') }));
    const form = root.querySelector('#contact form');
    if (form) {
      show(form, { y: 48, filter: 'blur(10px)', duration: 1.2, ease: 'expo.out', scrollTrigger: onEnter(form, 'top 85%') });
      show(form.children, { y: 12, filter: 'blur(4px)', duration: 0.8, stagger: 0.06, delay: 0.25, scrollTrigger: onEnter(form, 'top 85%') });
    }
    show(root.querySelectorAll('footer .foot > *'), { y: 10, stagger: 0.08, scrollTrigger: onEnter(root.querySelector('footer'), 'top 95%') });
    if (!reduce) {
      const img = root.querySelector('.parallax-img');
      if (img) g.fromTo(img, { yPercent: -5, scale: 1.12 }, { yPercent: 5, scale: 1.12, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
      root.querySelectorAll('.count').forEach((el) => {
        const node = el.firstChild; const to = parseInt(el.getAttribute('data-to'), 10) || 0; const o = { v: 0 };
        node.nodeValue = '0';
        g.to(o, { v: to, duration: 1.4, delay: 0.3, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true }, onUpdate: () => { node.nodeValue = String(Math.round(o.v)); } });
      });
    }
    root.querySelectorAll('.map').forEach((m) => ST.create({ trigger: m, start: 'top 85%', once: true, onEnter: () => g.delayedCall(reduce ? 0 : 0.5, () => m.classList.add('is-in')) }));
    setTimeout(() => root.querySelectorAll('.map').forEach((m) => { const r = m.getBoundingClientRect(); if (r.top < window.innerHeight) m.classList.add('is-in'); }), 2000);
    // Illustrations pilotées par le défilement : chaque carte se construit en descendant
    if (!reduce) {
      const LOOP = ['x-meridian', 'e-orbit', 'x-stream', 'x-rise', 'x-core', 'x-node', 'e-wave', 'a-flow'];
      root.querySelectorAll('#solutions .card').forEach((card) => {
        const anims = (card.getAnimations ? card.getAnimations({ subtree: true }) : []).filter((a) => a.animationName);
        if (!anims.length) return;
        anims.forEach((a) => a.pause());
        // Moment de l'animation où chaque élément est à son amplitude maximale
        const PEAK = { 'x-up': 0.52, 'x-down': 0.52, 'e-draw': 0.6, 'x-grow': 0.7, 'e-fill': 0.7, 'e-cur': 0.62, 'x-layer': 0.52, 'x-ripple': 0.5, 'x-out': 0.74, 'x-pop': 0.78, 'x-scan': 0.5 };
        const apply = (p) => anims.forEach((a) => {
          const t = a.effect.getTiming();
          const dur = typeof t.duration === 'number' ? t.duration : 0;
          const name = a.animationName;
          if (LOOP.indexOf(name) > -1) { a.currentTime = p * dur * 3; return; }
          const peak = PEAK[name] || 0.6;
          a.currentTime = Math.min(p / 0.85, 1) * dur * peak;
        });
        apply(0);
        // Survol : l'illustration joue en boucle, puis revient en douceur à l'état lié au défilement
        let hovering = false, progress = 0, back = null;
        const st = ST.create({ trigger: card, start: 'top bottom', end: 'bottom 30%', scrub: 1, onUpdate: (self) => { progress = self.progress; if (!hovering && !back) apply(progress); }, onRefresh: (self) => { progress = self.progress; if (!hovering) apply(progress); } });
        card.addEventListener('pointerenter', (e) => {
          if (e.pointerType !== 'mouse') return;
          hovering = true; if (back) { back.kill(); back = null; }
          anims.forEach((a) => { a.playbackRate = 1; a.play(); });
        });
        card.addEventListener('pointerleave', (e) => {
          if (e.pointerType !== 'mouse') return;
          hovering = false;
          anims.forEach((a) => a.pause());
          const from = anims.map((a) => a.currentTime || 0);
          apply(progress);
          const to = anims.map((a) => a.currentTime || 0);
          anims.forEach((a, i) => { a.currentTime = from[i]; });
          const k = { t: 0 };
          back = g.to(k, { t: 1, duration: 0.7, ease: 'power3.out', onUpdate: () => anims.forEach((a, i) => { a.currentTime = from[i] + (to[i] - from[i]) * k.t; }), onComplete: () => { back = null; apply(progress); } });
        });
        const svg = card.querySelector('.illu');
        if (svg) g.fromTo(svg, { scale: 0.8, yPercent: 10, rotate: -3 }, { scale: 1, yPercent: 0, rotate: 0, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 35%', scrub: 1 } });
      });
    }
    // Filet de sécurité : rien ne doit rester invisible dans la fenêtre
    function net() {
      tracked.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0 && parseFloat(getComputedStyle(el).opacity) < 0.05) g.set(el, { opacity: 1, y: 0, filter: 'none', '--line': 1 });
      });
    }
  }
}

new App();
