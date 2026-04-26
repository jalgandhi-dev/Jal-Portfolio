

document.addEventListener('DOMContentLoaded', () => {
 if (typeof emailjs !== "undefined") {
  emailjs.init("SrJoLXDf-M-9qlyJQ");
}

  /* ══ CUSTOM CURSOR ══════════════════════════════════════════ */
  const cursor = document.querySelector('.cursor');
  const cursorRing = document.querySelector('.cursor-ring');

  if (cursor && cursorRing) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    // Smooth ring follow
    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll(
      'a, button, .btn, .skill-card, .project-card, .filter-btn, .social-icon, .nav-link'
    );
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hovered');
        cursorRing.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovered');
        cursorRing.classList.remove('hovered');
      });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
      cursorRing.style.opacity = '1';
    });
  }

  /* ══ NAVBAR — SCROLL STATE ══════════════════════════════════ */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  /* ══ MOBILE HAMBURGER ═══════════════════════════════════════ */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });

    // Close on link click
    mobileMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* ══ ACTIVE NAV LINK ════════════════════════════════════════ */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (
      href === page ||
      (page === '' && href === 'index.html') ||
      (page === 'index.html' && href === 'index.html')
    ) {
      link.classList.add('active');
    }
  });

  /* ══ SCROLL REVEAL ══════════════════════════════════════════ */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if (revealEls.length) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Trigger skill bars if inside a revealed element
            entry.target.querySelectorAll('.skill-level-bar, .proficiency-fill')
              .forEach(bar => bar.style.width = bar.dataset.width);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach((el, i) => {
      el.style.transitionDelay = (i % 5) * 0.08 + 's';
      observer.observe(el);
    });
  }

  /* ══ SKILL / PROFICIENCY BARS ═══════════════════════════════ */
  // Set initial data-width from inline style or data attr
  document.querySelectorAll('.skill-level-bar, .proficiency-fill').forEach(bar => {
    const target = bar.getAttribute('data-width') || bar.style.width || '0%';
    bar.setAttribute('data-width', target);
    bar.style.width = '0%';
  });

  // If not wrapped in reveal, observe directly
  const allBars = document.querySelectorAll('.skill-level-bar, .proficiency-fill');
  if (allBars.length) {
    const barObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.width;
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    allBars.forEach(bar => barObserver.observe(bar));
  }

  /* ══ PROJECT FILTER ═════════════════════════════════════════ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const matches = filter === 'all' || card.dataset.category === filter;
        card.style.display = matches ? '' : 'none';
        if (matches) {
          card.style.animation = 'none';
          requestAnimationFrame(() => {
            card.style.animation = 'pageFadeIn 0.4s ease forwards';
          });
        }
      });
    });
  });

  /* ══ CERTIFICATE MODAL ══════════════════════════════════════ */
  (function initCertModal() {
    const modal    = document.getElementById("certModal");
    const iframe   = document.getElementById("certFrame");
    const closeBtn = document.getElementById("closeModal");
    const titleEl  = document.getElementById("certModalTitle");
    const metaEl   = document.getElementById("certModalMeta");
    if (!modal || !iframe || !closeBtn) return;

    function openModal(card) {
      const pdf = card.getAttribute("data-pdf");
      if (!pdf) return;

      /* Populate header from the card's own text */
      const title  = card.querySelector(".cert-title")?.textContent.trim()  || "Certificate";
      const issuer = card.querySelector(".cert-issuer")?.textContent.trim() || "";
      if (titleEl) titleEl.textContent = title;
      if (metaEl)  metaEl.textContent  = issuer;

      iframe.src = pdf + "#view=FitH&toolbar=1";
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    }

    function closeModal() {
      modal.classList.remove("active");
      /* Delay clearing src so the fade-out plays before the iframe blanks */
      setTimeout(() => { iframe.src = ""; }, 300);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    /* Open on card click */
    document.querySelectorAll(".cert-item").forEach(card => {
      card.addEventListener("click", (e) => {
        e.stopPropagation();
        openModal(card);
      });
    });

    /* Close on ✕ button */
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeModal();
    });

    /* Close on overlay click */
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    /* Close on Escape key */
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("active")) closeModal();
    });
  })();

  /* ══ CONTACT FORM VALIDATION ════════════════════════════════ */
 const form = document.querySelector('#contactForm');

if (form) {
  const nameInput = form.querySelector('#name');
  const emailInput = form.querySelector('#email');
  const subjectInput = form.querySelector('#subject');
  const msgInput = form.querySelector('#message');
  const typeInput = form.querySelector('#type');
  const successEl = document.querySelector('.form-success');

  function setError(field, msg) {
    const group = field.closest('.form-group');
    group.classList.add('error');
    group.querySelector('.input-error').textContent = msg;
  }

  function clearError(field) {
    field.closest('.form-group').classList.remove('error');
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  [nameInput, emailInput, subjectInput, msgInput].forEach(input => {
    if (input) input.addEventListener('input', () => clearError(input));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    if (!nameInput.value.trim()) {
      setError(nameInput, 'Please enter your name.');
      valid = false;
    }

    if (!emailInput.value.trim()) {
      setError(emailInput, 'Please enter your email.');
      valid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      setError(emailInput, 'Please enter a valid email address.');
      valid = false;
    }

    if (typeInput && !typeInput.value) {
      setError(typeInput, 'Please select a type.');
      valid = false;
    }

    if (!subjectInput.value.trim()) {
      setError(subjectInput, 'Please enter a subject.');
      valid = false;
    }

    if (!msgInput.value.trim()) {
      setError(msgInput, 'Please enter your message.');
      valid = false;
    }

    // emailjs.send(...)
// OR entire contact form block

  if (valid) {

  if (document.getElementById("contactForm")) {

  emailjs.send(
  "service_cl6ezdf",
  "template_6jww6y6",
  {
    name: nameInput.value,
    email: emailInput.value,
    phone: form.querySelector('#phone').value || "Not provided",
    subject: subjectInput.value,
    message: msgInput.value,
    type: typeInput.value
  },
  "SrJoLXDf-M-9qlyJQ"   // ✅ ADD PUBLIC KEY HERE
  )
  .then(() => {
    form.style.display = 'none';
    successEl.style.display = 'block';
  })
  .catch((error) => {
    console.log("ERROR:", error);
    alert(error.text || "Failed to send message");
  });

    
}

}
  });
}

  /* ══ PAGE TRANSITION ════════════════════════════════════════ */
  const overlay = document.querySelector('.page-overlay');

  if (overlay) {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (
        !href.startsWith('#') &&
        !href.startsWith('http') &&
        !href.startsWith('mailto') &&
        href !== ''
      ) {
        link.addEventListener('click', e => {
          e.preventDefault();
          overlay.classList.add('active');
          setTimeout(() => { window.location.href = href; }, 350);
        });
      }
    });
  }

  /* ══ TYPED EFFECT (home page) ═══════════════════════════════ */
  const typeEl = document.querySelector('.typed-text');
  if (typeEl) {
    const words = typeEl.dataset.words ? typeEl.dataset.words.split(',') : [];
    let wIndex = 0, cIndex = 0, deleting = false;

    function typeLoop() {
      const word = words[wIndex];
      if (!deleting) {
        typeEl.textContent = word.slice(0, ++cIndex);
        if (cIndex === word.length) {
          deleting = true;
          setTimeout(typeLoop, 2000);
          return;
        }
      } else {
        typeEl.textContent = word.slice(0, --cIndex);
        if (cIndex === 0) {
          deleting = false;
          wIndex = (wIndex + 1) % words.length;
        }
      }
      setTimeout(typeLoop, deleting ? 60 : 100);
    }

    if (words.length) setTimeout(typeLoop, 600);
  }

  /* ══ STAGGER CHILDREN ═══════════════════════════════════════ */
  document.querySelectorAll('[data-stagger]').forEach(container => {
    const delay = parseFloat(container.dataset.stagger) || 0.1;
    Array.from(container.children).forEach((child, i) => {
      child.style.transitionDelay = (i * delay) + 's';
    });
  });

  /* ══ BACK TO TOP ═════════════════════════════════════════════ */
  const backToTop = document.querySelector('#backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
