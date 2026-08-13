/* =========================================================
   Sridaran — Portfolio interactions
   jQuery + vanilla JS (IntersectionObserver scroll animations)
   ========================================================= */

$(function () {
  'use strict';

  const $win = $(window);
  const $html = $('html');

  /* ---------------------------------------------------
     1. Preloader
  --------------------------------------------------- */
  // If the brand art is missing the loader keeps just its ring, never a broken image
  $('.loader-logo').each(function () {
    if (this.complete && this.naturalWidth === 0) $(this).addClass('is-missing');
    $(this).on('error', function () { $(this).addClass('is-missing'); });
  });

  $win.on('load', function () {
    setTimeout(() => $('#preloader').addClass('hidden'), 350);
  });
  // Safety net in case `load` already fired
  setTimeout(() => $('#preloader').addClass('hidden'), 2500);

  /* ---------------------------------------------------
     2. Theme toggle (light / dark) with localStorage
  --------------------------------------------------- */
  const THEME_KEY = 'kp-theme';

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    $html.toggleClass('dark', isDark);          // Tailwind darkMode: 'class'
    $html.attr('data-bs-theme', theme);         // Bootstrap 5.3 colour mode
    localStorage.setItem(THEME_KEY, theme);
  }

  const saved = localStorage.getItem(THEME_KEY);
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(saved || (prefersLight ? 'light' : 'dark'));

  $('#themeToggle').on('click', function () {
    applyTheme($html.hasClass('dark') ? 'light' : 'dark');
    showToast($html.hasClass('dark') ? 'Dark theme enabled' : 'Light theme enabled');
  });

  /* ---------------------------------------------------
     3. Smooth scrolling for nav / anchor links
  --------------------------------------------------- */
  $('a[href^="#"]').on('click', function (e) {
    const target = $(this).attr('href');
    if (!target || target === '#') return;

    const $target = $(target);
    if (!$target.length) return;

    e.preventDefault();
    const navH = $('#siteNav').outerHeight() || 70;

    // CSS `scroll-behavior: smooth` would fight jQuery's animation — pause it
    document.documentElement.style.scrollBehavior = 'auto';

    $('html, body').stop(true).animate(
      { scrollTop: $target.offset().top - navH + 1 },
      750,
      'swing',
      function () { document.documentElement.style.scrollBehavior = ''; }
    );

    // close the mobile menu after tapping a link
    const $menu = $('#navMenu');
    if ($menu.hasClass('show')) {
      bootstrap.Collapse.getOrCreateInstance($menu[0]).hide();
    }
  });

  /* ---------------------------------------------------
     4. Sticky navbar + scroll progress + scroll-to-top
  --------------------------------------------------- */
  const $nav = $('#siteNav');
  const $bar = $('#progressBar');
  const $toTop = $('#scrollTop');
  const $ring = $('.fab-ring circle');
  const RING = 126;
  const sections = $('section[id], header[id]').toArray();

  function onScroll() {
    const top = $win.scrollTop();
    const docH = $(document).height() - $win.height();
    const pct = docH > 0 ? Math.min(top / docH, 1) : 0;

    $nav.toggleClass('scrolled', top > 40);
    $bar.css('width', (pct * 100) + '%');
    $ring.css('stroke-dashoffset', RING - RING * pct);
    $toTop.toggleClass('show', top > 400);

    spyScroll(top);
  }

  $win.on('scroll', onScroll);
  onScroll();

  $toTop.on('click', function () {
    document.documentElement.style.scrollBehavior = 'auto';
    $('html, body').stop(true).animate({ scrollTop: 0 }, 700, 'swing', function () {
      document.documentElement.style.scrollBehavior = '';
    });
  });

  /* ---------------------------------------------------
     5. Scroll spy — highlight the active nav link
  --------------------------------------------------- */
  function spyScroll(top) {
    if (!sections.length) return;

    const offset = ($('#siteNav').outerHeight() || 70) + 40;
    let current = sections[0] ? sections[0].id : 'home';

    sections.forEach(function (sec) {
      if (top >= sec.offsetTop - offset) current = sec.id;
    });

    // bottom of page → last section
    if (top + $win.height() >= $(document).height() - 10) {
      current = sections[sections.length - 1].id;
    }

    $('.nav-links .nav-link').each(function () {
      $(this).toggleClass('active', $(this).attr('href') === '#' + current);
    });
  }

  /* ---------------------------------------------------
     6. Scroll reveal animations (IntersectionObserver)
  --------------------------------------------------- */
  const revealItems = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealItems.forEach(el => io.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add('revealed'));
  }

  /* ---------------------------------------------------
     7. Counters + skill bars animate once, when scrolled into view
  --------------------------------------------------- */
  function animateCounter(el) {
    const $el = $(el);
    const target = parseInt($el.data('target'), 10) || 0;
    $({ n: 0 }).animate({ n: target }, {
      duration: 1400,
      easing: 'swing',
      step: function () { $el.text(Math.floor(this.n)); },
      complete: function () { $el.text(target); }
    });
  }

  function fillBar(el) { el.style.width = el.dataset.width + '%'; }

  const onceItems = document.querySelectorAll('.counter, .bar i[data-width]');

  if ('IntersectionObserver' in window) {
    const onceObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;

        if (el.classList.contains('counter')) animateCounter(el);
        else fillBar(el);

        obs.unobserve(el);
      });
    }, { threshold: 0.4 });

    onceItems.forEach(el => onceObserver.observe(el));
  } else {
    onceItems.forEach(function (el) {
      if (el.classList.contains('counter')) $(el).text($(el).data('target'));
      else fillBar(el);
    });
  }

  /* ---------------------------------------------------
     8. Hero typing effect
  --------------------------------------------------- */
  const words = ['Web Developer', 'Front-End Engineer', 'UI/UX Enthusiast', 'React Specialist'];
  const $typed = $('#typed');
  let wIndex = 0, cIndex = 0, deleting = false;

  (function type() {
    const word = words[wIndex];
    cIndex += deleting ? -1 : 1;
    $typed.text(word.substring(0, cIndex));

    let delay = deleting ? 55 : 110;

    if (!deleting && cIndex === word.length) { delay = 1600; deleting = true; }
    else if (deleting && cIndex === 0) { deleting = false; wIndex = (wIndex + 1) % words.length; delay = 350; }

    setTimeout(type, delay);
  })();

  /* ---------------------------------------------------
     9. Project filtering
  --------------------------------------------------- */
  $('.filter-btn').on('click', function () {
    const filter = $(this).data('filter');
    $('.filter-btn').removeClass('active');
    $(this).addClass('active');

    $('.project-item').each(function () {
      const match = filter === 'all' || $(this).data('cat') === filter;
      const $item = $(this);
      if (match) {
        $item.removeClass('hide').css({ opacity: 0, transform: 'scale(.94)' });
        requestAnimationFrame(() => $item.css({ opacity: 1, transform: 'scale(1)' }));
      } else {
        $item.addClass('hide');
      }
    });
  });

  /* ---------------------------------------------------
     10. Material-style ripple on buttons
  --------------------------------------------------- */
  $(document).on('click', '.btn-mui', function (e) {
    const $btn = $(this);
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const $ripple = $('<span class="ripple"></span>').css({
      width: size, height: size,
      left: e.clientX - rect.left - size / 2,
      top: e.clientY - rect.top - size / 2
    });
    $btn.append($ripple);
    setTimeout(() => $ripple.remove(), 620);
  });

  /* ---------------------------------------------------
     11. Toast helper
  --------------------------------------------------- */
  let toastTimer;
  function showToast(msg) {
    clearTimeout(toastTimer);
    $('#toastMsg').text(msg);
    $('#toast').addClass('show');
    toastTimer = setTimeout(() => $('#toast').removeClass('show'), 3000);
  }

  /* ---------------------------------------------------
     12. Forms & validation
  --------------------------------------------------- */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

  // Hero "Get Access"
  $('#earlyForm').on('submit', function (e) {
    e.preventDefault();
    const val = $('#heroEmail').val().trim();
    const $note = $('#heroNote').removeClass('ok err');

    if (!EMAIL_RE.test(val)) {
      $note.addClass('err').text('Please enter a valid email address.');
      $('#heroEmail').closest('.mui-field').addClass('invalid');
      return;
    }
    $('#heroEmail').closest('.mui-field').removeClass('invalid');
    $note.addClass('ok').text('Thanks! I will get in touch shortly.');
    this.reset();
    showToast('You are on the list 🎉');
  });

  // Newsletter
  $('#newsForm').on('submit', function (e) {
    e.preventDefault();
    const val = $('#newsEmail').val().trim();
    const $note = $('#newsNote').removeClass('ok err');

    if (!EMAIL_RE.test(val)) { $note.addClass('err').text('Enter a valid email.'); return; }
    $note.addClass('ok').text('Subscribed successfully!');
    this.reset();
    showToast('Subscribed to the newsletter');
  });

  // Contact form
  $('#contactForm').on('submit', function (e) {
    e.preventDefault();

    const fields = [
      { id: '#name', test: v => v.length >= 2, msg: 'Please enter your full name (2+ characters).' },
      { id: '#email', test: v => EMAIL_RE.test(v), msg: 'Please enter a valid email address.' },
      { id: '#subject', test: v => v.length >= 3, msg: 'Please add a short subject.' },
      { id: '#message', test: v => v.length >= 10, msg: 'Your message should be at least 10 characters.' }
    ];

    const $alert = $('#formAlert').removeClass('show success error');
    let firstError = null;

    fields.forEach(function (f) {
      const $input = $(f.id);
      const ok = f.test($input.val().trim());
      $input.closest('.mui-field').toggleClass('invalid', !ok);
      if (!ok && !firstError) firstError = f;
    });

    if (firstError) {
      $alert.addClass('show error').text(firstError.msg);
      $(firstError.id).trigger('focus');
      return;
    }

    // Simulated async send
    const $btn = $('#submitBtn');
    const original = $btn.html();
    $btn.prop('disabled', true).html('<span class="material-icons">hourglass_top</span> Sending…');

    setTimeout(function () {
      $btn.prop('disabled', false).html(original);
      $alert.addClass('show success')
        .text('Thanks! Your message has been sent — I will reply within 24 hours.');
      $('#contactForm')[0].reset();
      showToast('Message sent successfully');
    }, 1200);
  });

  /* ---------------------------------------------------
     13. Brand artwork — find whichever file the user saved
         (any common extension) and swap it in. Until then
         the gradient "SR" letter mark stands in.
  --------------------------------------------------- */
  const IMG_EXTS = ['png', 'svg', 'jpg', 'jpeg', 'webp', 'ico'];

  // Resolves with the first URL that decodes as a real image, else null.
  function findAsset(base, exts) {
    return exts.reduce(function (chain, ext) {
      return chain.then(function (found) {
        if (found) return found;
        const url = 'assets/' + base + '.' + ext;
        return new Promise(function (resolve) {
          const probe = new Image();
          probe.onload = () => resolve(probe.naturalWidth > 0 ? url : null);
          probe.onerror = () => resolve(null);
          probe.src = url;
        });
      });
    }, Promise.resolve(null));
  }

  findAsset('logo', IMG_EXTS).then(function (url) {
    if (!url) return;
    $('.brand-logo').each(function () {
      const img = this;
      $(img).on('load', function () { $(img).closest('.brand-mark').addClass('has-logo'); });
      img.src = url;
    });
  });

  // A favicon is a raw image file, so CSS can't round it — redraw it on a canvas
  // behind a rounded-rect clip and hand the browser the result.
  function roundedIcon(url, size, radius) {
    return new Promise(function (resolve) {
      const img = new Image();

      img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext('2d');
        const r = Math.min(radius, size / 2);

        ctx.beginPath();
        ctx.moveTo(r, 0);
        ctx.lineTo(size - r, 0); ctx.quadraticCurveTo(size, 0, size, r);
        ctx.lineTo(size, size - r); ctx.quadraticCurveTo(size, size, size - r, size);
        ctx.lineTo(r, size); ctx.quadraticCurveTo(0, size, 0, size - r);
        ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(img, 0, 0, size, size);

        // toDataURL throws on a tainted canvas (e.g. opened over file://)
        try { resolve(canvas.toDataURL('image/png')); } catch (err) { resolve(null); }
      };

      img.onerror = function () { resolve(null); };
      img.src = url;
    });
  }

  // Prefer a real photo if one is saved; otherwise fall back to the brand logo,
  // so the About card matches the navbar mark instead of a bare letter.
  findAsset('profile', IMG_EXTS)
    .then(function (url) { return url || findAsset('logo', IMG_EXTS); })
    .then(function (url) {
      if (!url) return;
      $('.avatar-photo').each(function () {
        const img = this;
        $(img).on('load', function () { $(img).closest('.avatar').addClass('has-photo'); });
        img.src = url;
      });
    });

  findAsset('favicon', IMG_EXTS).then(function (url) {
    if (!url) return;
    // radius is clamped to size / 2, so 50 renders the icon as a full circle
    roundedIcon(url, 64, 50).then(function (rounded) {
      $('#favicon').attr({ href: rounded || url, type: 'image/png' });
    });
  });

  /* ---------------------------------------------------
     14. Misc
  --------------------------------------------------- */
  $('#year').text(new Date().getFullYear());
});
