/**
 * SAINATH REDDY AKKALA - OFFICIAL PORTFOLIO SCRIPT
 * Handling interactive workshop booking, gallery filters, lightbox modals,
 * copy-to-clipboard, and smooth responsive behaviors.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
      const icon = navToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('mobile-open')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });

    // Close menu when clicking on any nav link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
        const icon = navToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  // 2. Active Link on Scroll (ScrollSpy)
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        current = sectionId;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // 3. Metric Counter Animation
  const counters = document.querySelectorAll('.metric-number');
  let animated = false;

  const animateCounters = () => {
    counters.forEach(counter => {
      const targetStr = counter.getAttribute('data-target') || counter.innerText;
      const target = parseInt(targetStr.replace(/[^0-9]/g, ''));
      const suffix = targetStr.includes('+') ? '+' : '';
      const hasComma = targetStr.includes(',');
      let count = 0;
      const speed = 25;
      const increment = Math.ceil(target / 40);

      const updateCount = () => {
        count += increment;
        if (count >= target) {
          const formatted = hasComma ? target.toLocaleString('en-US') : target;
          counter.innerText = formatted + suffix;
        } else {
          const formatted = hasComma ? count.toLocaleString('en-US') : count;
          counter.innerText = formatted + suffix;
          setTimeout(updateCount, speed);
        }
      };

      updateCount();
    });
  };

  const metricSection = document.querySelector('.metrics-ribbon');
  if (metricSection) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        animateCounters();
      }
    }, { threshold: 0.3 });

    observer.observe(metricSection);
  }

  // Generic Unified Form Submission (Netlify Forms + FormSubmit.co Email Service + Mailto Fallback)
  async function submitDualIntegratedForm(form, submitBtn, statusEl, defaultMailto) {
    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending message...';
    statusEl.style.display = 'none';

    const formData = new FormData(form);
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';
    let netlifySuccess = false;

    // Try Netlify Forms POST only when deployed on a live host
    if (!isLocalhost) {
      try {
        const urlEncoded = new URLSearchParams(formData).toString();
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: urlEncoded
        });
        if (res.ok) {
          netlifySuccess = true;
        }
      } catch (e) {
        // Offline or non-Netlify environment
      }
    }

    // If deployed on Vercel or other live domains (not Netlify, not localhost), submit via FormSubmit.co JSON API
    let externalSuccess = false;
    if (!netlifySuccess && !isLocalhost) {
      try {
        const payload = {};
        formData.forEach((value, key) => {
          if (key !== 'bot-field') payload[key] = value;
        });
        payload['_subject'] = `[Portfolio] New message from ${payload.name || 'Visitor'}`;
        payload['_captcha'] = 'false';

        const fsRes = await fetch('https://formsubmit.co/ajax/sainathreddyakkala@gmail.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (fsRes.ok) {
          externalSuccess = true;
        }
      } catch (err) {
        console.warn('FormSubmit endpoint error:', err);
      }
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnHtml;

    form.reset();
    statusEl.className = 'form-status-alert success';

    if (netlifySuccess || externalSuccess) {
      statusEl.innerHTML = `<i class="fa-solid fa-circle-check" style="font-size: 1.25rem; color: #10B981; flex-shrink: 0; margin-top: 2px;"></i>
        <div>
          <strong style="color: #065F46;">Message Delivered Successfully!</strong><br>
          <span style="color: #047857;">Your inquiry has been dispatched directly to Sainath Reddy's personal inbox (sainathreddyakkala@gmail.com). You will receive a response within 24 hours.</span>
        </div>`;
      showToast('Message sent successfully!');
    } else {
      // Local development or fallback mode
      statusEl.innerHTML = `<i class="fa-solid fa-circle-check" style="font-size: 1.25rem; color: #10B981; flex-shrink: 0; margin-top: 2px;"></i>
        <div>
          <strong style="color: #065F46;">Inquiry Successfully Prepared!</strong><br>
          <span style="color: #047857;">Your details have been captured and validated for delivery to <strong>sainathreddyakkala@gmail.com</strong>.</span>
          <div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap;">
            <a href="${defaultMailto}" class="btn btn-sm btn-primary" style="padding: 6px 14px; font-size: 0.82rem;">
              <i class="fa-solid fa-envelope"></i> Open in Email App
            </a>
            <a href="https://wa.me/918500163206" target="_blank" class="btn btn-sm btn-outline-crimson" style="padding: 6px 14px; font-size: 0.82rem;">
              <i class="fa-brands fa-whatsapp"></i> Chat on WhatsApp
            </a>
          </div>
        </div>`;
      showToast('Inquiry ready to send!');
    }
    statusEl.style.display = 'flex';
  }

  // 4. Workshop Request Form Handler
  const workshopForm = document.getElementById('workshopForm');
  if (workshopForm) {
    workshopForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('wfName')?.value.trim() || '';
      const email = document.getElementById('wfEmail')?.value.trim() || '';
      const phone = document.getElementById('wfPhone')?.value.trim() || '';
      const college = document.getElementById('wfCollege')?.value.trim() || '';
      const type = document.getElementById('wfType')?.value || 'Hands-on Workshop';
      const date = document.getElementById('wfDate')?.value.trim() || 'Tentative';
      const notes = document.getElementById('wfNotes')?.value.trim() || '';

      const subject = encodeURIComponent(`[Workshop Invitation] Request from ${college} - ${type}`);
      const body = encodeURIComponent(
        `Dear Sainath Reddy,

` +
        `We would like to invite you for a session/workshop with our institution.

` +
        `Institution: ${college}
` +
        `Contact Person: ${name}
` +
        `Email: ${email}
` +
        `Phone: ${phone}
` +
        `Format: ${type}
` +
        `Proposed Dates: ${date}
` +
        `Requirements / Notes: ${notes}

` +
        `Looking forward to collaborating with you.
` +
        `Best regards,
${name}`
      );

      const mailtoUrl = `mailto:sainathreddyakkala@gmail.com?subject=${subject}&body=${body}`;
      const submitBtn = document.getElementById('btnSubmitWorkshop');
      const statusEl = document.getElementById('workshopFormStatus');

      submitDualIntegratedForm(workshopForm, submitBtn, statusEl, mailtoUrl);
    });
  }

  // 5. General Contact Form Handler
  const contactForm = document.getElementById('generalContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('cfName')?.value.trim() || '';
      const email = document.getElementById('cfEmail')?.value.trim() || '';
      const subject = document.getElementById('cfSubject')?.value.trim() || '';
      const message = document.getElementById('cfMessage')?.value.trim() || '';

      const mailSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject} - from ${name}`);
      const mailBody = encodeURIComponent(
        `Hi Sainath,

` +
        `Name: ${name}
` +
        `Email: ${email}

` +
        `Subject: ${subject}

` +
        `Message:
${message}
`
      );

      const mailtoUrl = `mailto:sainathreddyakkala@gmail.com?subject=${mailSubject}&body=${mailBody}`;
      const submitBtn = document.getElementById('btnSubmitContact');
      const statusEl = document.getElementById('contactFormStatus');

      submitDualIntegratedForm(contactForm, submitBtn, statusEl, mailtoUrl);
    });
  }

  // 6. Gallery Filtering
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 7. Lightbox Modal for Gallery & Media Images
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  const modalClose = document.getElementById('modalClose');

  const openLightbox = (src, caption) => {
    if (modal && modalImg && modalCaption) {
      modalImg.src = src;
      modalCaption.innerText = caption || '';
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeLightbox = () => {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  document.querySelectorAll('.gallery-item, .marquee-photo-card').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('h5')?.innerText || '';
      const sub = item.querySelector('span')?.innerText || '';
      if (img) {
        openLightbox(img.src, `${title} — ${sub}`);
      }
    });
  });

  document.querySelectorAll('.media-image-frame').forEach(frame => {
    frame.addEventListener('click', () => {
      const img = frame.querySelector('img');
      const card = frame.closest('.media-card');
      const headline = card?.querySelector('.media-headline')?.innerText || '';
      const source = card?.querySelector('.media-source')?.innerText || '';
      if (img) {
        openLightbox(img.src, `${source}: ${headline}`);
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeLightbox);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeBibModal();
    }
  });

  // 8. BibTeX Modal & Copy Handler
  const bibModal = document.getElementById('bibtexModal');
  const bibContent = document.getElementById('bibtexCode');
  const bibClose = document.getElementById('bibtexClose');
  const copyBibBtn = document.getElementById('btnCopyBibtex');

  const bibData = {
    apscon2026: `@inproceedings{akkala2026multisensor,
  title={Multi-Sensor Fusion Framework for UAV Navigation in GPS-Denied Environments},
  author={Akkala, Sainath Reddy and Collaborators},
  booktitle={IEEE Applied Sensing Conference (APSCON)},
  year={2026},
  organization={IEEE},
  note={Best Paper Award}
}`,
    iitcee2026: `@inproceedings{akkala2026modular,
  title={A Modular, Passive Scanning Framework for Web Vulnerability Enumeration},
  author={Akkala, Sainath Reddy and Research Team},
  booktitle={IEEE International Conference on Emerging Trends in Electrical, Communication and Information Technologies (IITCEE)},
  year={2026},
  organization={IEEE}
}`,
    indicon2025: `@inproceedings{akkala2025resilient,
  title={Resilient Navigation for UAVs: GNSS Attack Detection and Seamless Transition to VIO},
  author={Akkala, Sainath Reddy and Collaborators},
  booktitle={IEEE India Council International Conference (INDICON)},
  year={2025},
  organization={IEEE}
}`,
    springer2025: `@incollection{akkala2025harnessing,
  title={Harnessing AI in Education and Training: Addressing Cybersecurity Challenges in Emerging Economies},
  author={Akkala, Sainath Reddy},
  note={Accepted / In Press},
  year={2025}
}`,
    cropiq: `@article{akkala2025cropiq,
  title={CropIQ: An Integrated AI-Powered Decision Support System for Proactive Crop Management and Profit Optimization},
  author={Akkala, Sainath Reddy},
  journal={International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)},
  volume={4},
  issue={2},
  year={2024},
  url={https://ijarsct.co.in/Paper32708.pdf}
}`
  };

  window.showBibtex = (key) => {
    if (bibData[key] && bibModal && bibContent) {
      bibContent.innerText = bibData[key];
      bibModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeBibModal = () => {
    if (bibModal) {
      bibModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (bibClose) bibClose.addEventListener('click', closeBibModal);
  if (bibModal) {
    bibModal.addEventListener('click', (e) => {
      if (e.target === bibModal) closeBibModal();
    });
  }

  if (copyBibBtn) {
    copyBibBtn.addEventListener('click', () => {
      if (bibContent) {
        navigator.clipboard.writeText(bibContent.innerText).then(() => {
          showToast('BibTeX citation copied to clipboard!');
        });
      }
    });
  }

  // 9. Toast Notification Helper
  function showToast(message) {
    let toast = document.getElementById('toastNotice');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastNotice';
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #22C55E;"></i> <span>${message}</span>`;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  }

  window.showToast = showToast;
});
