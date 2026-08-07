/* Shared site behaviors: nav scroll state, mobile menu, resume dropdown,
   scroll reveal, work-list accordion, and a text-scramble/decode hover
   (a generic, well-known UI technique — not proprietary code). */
(function () {
  'use strict';
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.addEventListener('scroll', function () {
    var nav = document.querySelector('.sys-nav');
    if (nav) nav.classList.toggle('scrolled', scrollY > 8);
  });

  // === Resume dropdown (plain disclosure, not a real ARIA menu: no arrow-key
  //     nav is implemented, so it does not claim role="menu"/"menuitem") ===
  (function () {
    var btn = document.querySelector('.sys-resume-btn');
    var dd = document.querySelector('.sys-resume-dd');
    if (!btn || !dd) return;
    function close(returnFocus) {
      dd.style.display = 'none';
      btn.setAttribute('aria-expanded', 'false');
      if (returnFocus) btn.focus();
    }
    function open() { dd.style.display = 'block'; btn.setAttribute('aria-expanded', 'true'); }
    btn.addEventListener('click', function (e) { e.stopPropagation(); dd.style.display === 'block' ? close(false) : open(); });
    document.addEventListener('click', function (e) { if (!dd.contains(e.target) && !btn.contains(e.target)) close(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && dd.style.display === 'block') close(true); });
  })();

  // === Mobile menu ===
  (function () {
    var toggle = document.getElementById('menuToggle');
    var menu = document.getElementById('mobileMenu');
    if (!toggle || !menu) return;
    var svgNS = 'http://www.w3.org/2000/svg';
    function makeSvg(lines) {
      var s = document.createElementNS(svgNS, 'svg');
      s.setAttribute('width', '22'); s.setAttribute('height', '22');
      s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('fill', 'none');
      s.setAttribute('stroke', 'currentColor'); s.setAttribute('stroke-width', '1.5');
      s.setAttribute('aria-hidden', 'true');
      s.setAttribute('stroke-linecap', 'round');
      lines.forEach(function (l) {
        var ln = document.createElementNS(svgNS, 'line');
        ln.setAttribute('x1', l[0]); ln.setAttribute('y1', l[1]);
        ln.setAttribute('x2', l[2]); ln.setAttribute('y2', l[3]);
        s.appendChild(ln);
      });
      return s;
    }
    function setIcon(isOpen) {
      while (toggle.firstChild) toggle.removeChild(toggle.firstChild);
      toggle.appendChild(isOpen ? makeSvg([[18, 6, 6, 18], [6, 6, 18, 18]]) : makeSvg([[3, 6, 21, 6], [3, 12, 21, 12], [3, 18, 21, 18]]));
    }
    function closeMenu() {
      menu.classList.remove('open'); setIcon(false);
      toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open menu');
    }
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = menu.classList.toggle('open');
      setIcon(isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('click', function (e) { if (!menu.contains(e.target) && !toggle.contains(e.target)) closeMenu(); });
  })();

  // === Scroll reveal ===
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('v'); revealObs.unobserve(x.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll('.rv').forEach(function (el) { revealObs.observe(el); });

  // === Nav scroll spy ===
  // Derive the watched sections from the nav links themselves (data-spy="work"
  // -> #work) instead of a data-spy-target attribute that no section actually
  // carries — the previous version queried an attribute nothing had, so it
  // silently never attached.
  var spyLinks = document.querySelectorAll('[data-spy]');
  var spySections = [];
  spyLinks.forEach(function (l) {
    var id = l.getAttribute('data-spy');
    var el = id && document.getElementById(id);
    if (el && spySections.indexOf(el) === -1) spySections.push(el);
  });
  if (spySections.length) {
    var spyObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = document.querySelector('[data-spy="' + entry.target.id + '"]');
        if (link && entry.isIntersecting) { spyLinks.forEach(function (l) { l.classList.remove('active'); }); link.classList.add('active'); }
      });
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });
    spySections.forEach(function (s) { spyObs.observe(s); });
  }

  // === Work-list accordion ===
  // Collapsed panels are hidden with max-height:0 (so the height can animate),
  // not display:none — which on its own leaves their links in the tab order
  // while invisible. `inert` pulls a collapsed panel out of both the tab
  // order and the accessibility tree without touching the CSS animation.
  (function () {
    var items = document.querySelectorAll('.wl-item');
    function setHeight(item, open) {
      var body = item.querySelector('.wl-body');
      var inner = item.querySelector('.wl-body-inner');
      if (!body || !inner) return;
      body.style.maxHeight = open ? inner.scrollHeight + 'px' : '0px';
      if (open) body.removeAttribute('inert'); else body.setAttribute('inert', '');
    }
    items.forEach(function (item) {
      var head = item.querySelector('.wl-head');
      if (!head) return;
      setHeight(item, item.classList.contains('open'));
      head.addEventListener('click', function () {
        var willOpen = !item.classList.contains('open');
        items.forEach(function (i) {
          i.classList.remove('open');
          var h = i.querySelector('.wl-head');
          if (h) h.setAttribute('aria-expanded', 'false');
          setHeight(i, false);
        });
        if (willOpen) { item.classList.add('open'); head.setAttribute('aria-expanded', 'true'); setHeight(item, true); }
      });
    });
    window.addEventListener('resize', function () {
      items.forEach(function (i) { if (i.classList.contains('open')) setHeight(i, true); });
    });
  })();

  // === Text scramble / decode hover ===
  var SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  function Scrambler(el) {
    this.el = el;
    this.original = el.textContent;
    this.timer = null;
  }
  // setTimeout only — no requestAnimationFrame. rAF is paused entirely by the
  // browser while a tab is backgrounded/unfocused, which can leave this stuck
  // mid-scramble indefinitely. setTimeout keeps running (throttled at worst)
  // and a hard-deadline fallback guarantees the real text always lands.
  Scrambler.prototype.run = function () {
    if (reducedMotion) { this.el.textContent = this.original; return; }
    var self = this;
    var text = this.original;
    var len = text.length;
    var revealAt = [];
    for (var i = 0; i < len; i++) revealAt.push(Math.floor(i * 1.4) + Math.random() * 4);
    var duration = Math.max.apply(null, revealAt.concat([0])) + 4;
    clearTimeout(this.timer);
    var frame = 0;
    function tick() {
      var out = '';
      for (var i = 0; i < len; i++) {
        if (text[i] === ' ') { out += ' '; continue; }
        out += (frame >= revealAt[i]) ? text[i] : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
      self.el.textContent = out;
      frame++;
      if (frame <= duration) self.timer = setTimeout(tick, 28);
      else self.el.textContent = text;
    }
    tick();
    // Hard deadline: whatever happens above, the correct text is guaranteed
    // to be showing shortly after the expected duration.
    setTimeout(function () { self.el.textContent = text; }, duration * 28 + 250);
  };
  document.querySelectorAll('.scramble').forEach(function (el) {
    var s = new Scrambler(el);
    el.addEventListener('mouseenter', function () { s.run(); });
  });
  window.runScramble = function (el, delay) {
    var s = new Scrambler(el);
    setTimeout(function () { s.run(); }, delay || 0);
    return s;
  };
})();
