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

  // Direct Email & WhatsApp Client Dispatch Handler (Below-Button "Send Via" Selection)
  function handleDirectEmailDispatch(statusEl, subject, body, rawTextForWa, promptText) {
    const mailtoUrl = `mailto:sainathreddyakkala@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const waUrl = `https://wa.me/918500163206?text=${encodeURIComponent(rawTextForWa)}`;
    const displayText = promptText || 'Your enquiry has been drafted, how would you like to send invitation to Sainath Reddy Akkala (Personal email: sainathreddyakkala@gmail.com)?';

    // Render clean "Send Via:" action card below the button
    statusEl.innerHTML = `
      <div class="dispatch-header">
        <span class="dispatch-badge"><i class="fa-solid fa-paper-plane"></i> Send Via:</span>
        <p class="dispatch-subtext">
          ${displayText}
        </p>
      </div>
      <div class="dispatch-actions">
        <a href="${mailtoUrl}" class="btn btn-primary dispatch-btn">
          <i class="fa-solid fa-envelope"></i> Send via Email App / Gmail
        </a>
        <a href="${waUrl}" target="_blank" class="btn btn-outline-crimson dispatch-btn">
          <i class="fa-brands fa-whatsapp"></i> Send via WhatsApp
        </a>
        <button type="button" class="btn btn-outline-secondary dispatch-btn" onclick="navigator.clipboard.writeText(decodeURIComponent('${encodeURIComponent(body)}')); showToast('Message text copied to clipboard!');">
          <i class="fa-solid fa-copy"></i> Copy Text
        </button>
      </div>
    `;

    statusEl.style.display = 'block';
    statusEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    showToast('Your enquiry has been drafted. Please choose how to send.');
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

      const subject = `[Workshop Invitation] Request from ${college} - ${type}`;
      const body = `Dear Sainath Reddy,

` +
        `We would like to invite you for a session/workshop with our institution.

` +
        `• Institution / Organization: ${college}
` +
        `• Contact Person: ${name}
` +
        `• Official Email: ${email}
` +
        `• Phone / WhatsApp: ${phone}
` +
        `• Engagement Format: ${type}
` +
        `• Proposed Dates: ${date}
` +
        `• Requirements / Details: ${notes || 'None specified'}

` +
        `Looking forward to collaborating with you.

` +
        `Best regards,
${name}`;

      const waText = `Hi Sainath, I would like to invite you for a "${type}" at ${college}. My name is ${name} (Email: ${email}, Phone: ${phone}). Proposed dates: ${date}.`;
      const statusEl = document.getElementById('workshopFormStatus');
      const promptText = 'Your enquiry has been drafted, how would you like to send invitation to Sainath Reddy Akkala (Personal email: sainathreddyakkala@gmail.com)?';

      handleDirectEmailDispatch(statusEl, subject, body, waText, promptText);
    });
  }

  // 5. General Contact Form Handler
  const contactForm = document.getElementById('generalContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('cfName')?.value.trim() || '';
      const email = document.getElementById('cfEmail')?.value.trim() || '';
      const subjectInput = document.getElementById('cfSubject')?.value.trim() || 'General Inquiry';
      const message = document.getElementById('cfMessage')?.value.trim() || '';

      const subject = `[Portfolio Inquiry] ${subjectInput} - from ${name}`;
      const body = `Hi Sainath,

` +
        `Name: ${name}
` +
        `Email: ${email}
` +
        `Subject: ${subjectInput}

` +
        `Message:
${message}

` +
        `Best regards,
${name}`;

      const waText = `Hi Sainath, regarding "${subjectInput}": ${message} - from ${name} (${email})`;
      const statusEl = document.getElementById('contactFormStatus');
      const promptText = 'Your enquiry has been drafted, how would you like to send message to Sainath Reddy Akkala (Personal email: sainathreddyakkala@gmail.com)?';

      handleDirectEmailDispatch(statusEl, subject, body, waText, promptText);
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
