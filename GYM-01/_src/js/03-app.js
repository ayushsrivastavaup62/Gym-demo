/* ==========================================================================
   OXYGEN GYM — APPLICATION
   Reads CONFIG + PHOTOS, renders the page, then wires the interactions.
   ========================================================================== */
(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const motionOK = () => !reduceMotion.matches;

  const PHOTO = (key) => PHOTOS[key] || PHOTOS.interior || "";
  const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ESCAPES[char]);
  const money = (value) => Number(value).toLocaleString("en-IN", { maximumFractionDigits: 0 });
  const price = (value) => `₹${money(value)}`;
  const pad = (value) => String(value).padStart(2, "0");
  const ratingValue = Number(CONFIG.rating.value).toFixed(1);

  const phoneHref = `tel:${String(CONFIG.contact.phoneHref).replace(/[^\d+]/g, "")}`;
  const waNumber = String(CONFIG.contact.whatsapp).replace(/\D/g, "");
  const waLink = (text) => `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
  const messages = CONFIG.messages;
  const planMessage = (plan) =>
    messages.plan.replace("{plan}", plan.name).replace("{price}", price(plan.price));

  const machineStat = CONFIG.stats.find((stat) => /machine/i.test(stat.label));
  const machineTotal = machineStat ? machineStat.value : 45;

  const ICONS = {
    bolt: '<path d="M13 2 4.5 13.2H11l-1 8.8 8.5-11.7H12L13 2Z"/>',
    bike: '<circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M5.5 17.5 10 7h3.4l5.1 10.5M9.5 7.5h4M12 17.5h6.5"/>',
    user: '<circle cx="12" cy="8" r="3.4"/><path d="M5.2 20a6.8 6.8 0 0 1 13.6 0"/>',
    dumbbell: '<path d="M4 9.5v5M7.5 7v10M16.5 7v10M20 9.5v5M7.5 12h9"/>',
    music: '<path d="M9 17.5V6.4l10-2v11.1"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="15.5" r="2.5"/>',
    whatsapp: '<path d="M20.1 3.9A10 10 0 0 0 3.4 16.7L2 22l5.4-1.4A10 10 0 0 0 20.1 3.9Zm-8.1 15a8.3 8.3 0 0 1-4.2-1.1l-.3-.2-3.2.8.9-3.1-.2-.3a8.3 8.3 0 0 1 12.9-10.2 8.3 8.3 0 0 1-5.9 14.1Z"/>'
  };
  const ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 6.5"/></svg>';
  const PLUS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ""}</svg>`;
  const stars = '<svg viewBox="0 0 24 24"><path d="M12 2.5l2.95 6.1 6.7.9-4.9 4.65 1.25 6.6L12 17.6l-5.99 3.15 1.24-6.6L2.35 9.5l6.7-.9z"/></svg>';

  /* ---------- static content bindings ---------- */
  const bindContent = () => {
    $$("[data-brand-name]").forEach((el) => (el.textContent = CONFIG.brand.wordmark));
    $$("[data-brand-hero]").forEach((el) => (el.textContent = CONFIG.brand.wordmark));
    const footerWord = $(".footer-word");
    if (footerWord) footerWord.textContent = CONFIG.brand.wordmark;

    $$("[data-phone]").forEach((el) => (el.textContent = CONFIG.contact.phoneDisplay));
    $$("[data-tel-link]").forEach((el) => (el.href = phoneHref));
    $$("[data-wa-link]").forEach((el) => (el.href = waLink(messages.general)));
    $$("[data-map-link]").forEach((el) => (el.href = CONFIG.contact.maps));
    $$("[data-wa]").forEach((el) => {
      el.href = waLink(messages[el.dataset.wa] || messages.general);
      el.target = "_blank";
      el.rel = "noopener";
    });

    $$("[data-address]").forEach((el) => (el.textContent = CONFIG.contact.addressShort));
    $$("[data-address-lines]").forEach((el) => {
      el.innerHTML = CONFIG.contact.addressLines.map(esc).join("<br>");
    });

    const contactHours = $(".hours-table [data-hours-weekday]");
    if (contactHours) contactHours.textContent = CONFIG.hours.weekday;
    $$(".footer-visit [data-hours-weekday]").forEach((el) => {
      el.textContent = `${CONFIG.hours.weekdayLabel}, ${CONFIG.hours.weekday}`;
    });
    $$("[data-hours-sunday]").forEach((el) => (el.textContent = CONFIG.hours.sunday));

    const heroEst = $(".hero-est");
    if (heroEst) heroEst.textContent = `Est. ${CONFIG.brand.established}`;
    const stampText = $(".about-stamp textPath");
    if (stampText) {
      stampText.textContent = `TRUST THE PROCESS · SINCE ${CONFIG.brand.established} · INDORE · `;
    }
    const aboutHours = $(".about-fact p");
    if (aboutHours) {
      aboutHours.textContent = `${CONFIG.hours.weekdayLabel} ${CONFIG.hours.weekday} · ${CONFIG.hours.sundayLabel} ${CONFIG.hours.sunday}`;
    }
    const signatureName = $(".signature-name");
    const signatureRole = $(".signature-role");
    if (signatureName) signatureName.textContent = CONFIG.owner.name;
    if (signatureRole) signatureRole.textContent = CONFIG.owner.role;
    const footerCopy = $(".footer-brand > p");
    if (footerCopy) {
      footerCopy.innerHTML = `Indore's strength studio since ${esc(CONFIG.brand.established)}.<br>Start where you are. Show up anyway.`;
    }
    const railNote = $(".rail-note");
    if (railNote) railNote.textContent = `${machineTotal}+ machines · serviced weekly`;

    $$("[data-credit]").forEach((el) => (el.textContent = CONFIG.brand.credit));
    const year = $("#year");
    if (year) year.textContent = String(new Date().getFullYear());

    const ratingChip = $(".rating-chip");
    if (ratingChip) {
      ratingChip.setAttribute(
        "aria-label",
        `Rated ${ratingValue} out of 5 from ${CONFIG.rating.count} ${CONFIG.rating.source} reviews`
      );
      const strong = $("strong", ratingChip);
      const meta = $(".rating-divider + span", ratingChip);
      if (strong) strong.textContent = ratingValue;
      if (meta) meta.textContent = `${CONFIG.rating.source} · ${CONFIG.rating.count} reviews`;
    }
    const googlePill = $(".google-pill");
    if (googlePill) {
      googlePill.innerHTML = `<span class="google-stars" aria-hidden="true">★★★★★</span><span><strong>${ratingValue}</strong> from ${esc(String(CONFIG.rating.count))} ${esc(CONFIG.rating.source)} reviews</span>`;
    }

    const bindSocial = (el, url, network) => {
      if (!el) return;
      if (!url || url === "#") {
        el.href = "#";
        el.setAttribute("aria-disabled", "true");
        el.title = `${network} link placeholder — add the real URL in CONFIG`;
        el.addEventListener("click", (event) => event.preventDefault());
      } else {
        el.href = url;
        el.removeAttribute("aria-disabled");
      }
    };
    bindSocial($("[data-instagram]"), CONFIG.social.instagram, "Instagram");
    bindSocial($("[data-facebook]"), CONFIG.social.facebook, "Facebook");
  };

  /* ---------- stats ---------- */
  const renderStats = () => {
    const grid = $("#statsGrid");
    if (!grid) return;
    grid.innerHTML = CONFIG.stats
      .map((stat) => {
        const decimals = Number(stat.decimals) || 0;
        const value = Number(stat.value).toFixed(decimals);
        const suffix = stat.star
          ? '<span class="star" aria-hidden="true">★</span>'
          : stat.suffix
            ? `<span class="suffix" aria-hidden="true">${esc(stat.suffix)}</span>`
            : "";
        const spoken = stat.star
          ? `${value} stars from ${CONFIG.rating.count} ${CONFIG.rating.source} reviews`
          : `${value}${stat.suffix || ""} ${stat.label}`;
        const note = stat.star
          ? `<span class="stat-note" aria-hidden="true"><strong>${CONFIG.rating.count}</strong>${esc(CONFIG.rating.source)} reviews</span>`
          : "";
        return `<div class="stat" role="group" aria-label="${esc(spoken)}">
          <div class="stat-value" aria-hidden="true"><span data-count="${Number(stat.value)}" data-decimals="${decimals}">${(0).toFixed(decimals)}</span>${suffix}</div>
          <p class="stat-label" aria-hidden="true">${esc(stat.label)}</p>${note}
        </div>`;
      })
      .join("");
  };

  /* ---------- programs ---------- */
  const renderPrograms = () => {
    const grid = $("#programGrid");
    if (!grid) return;
    grid.innerHTML = CONFIG.programs
      .map((program, index) => {
        const ask = `Hi Oxygen Gym! I'd like to know more about ${program.name} and class timings.`;
        return `<article class="card spotlight program-card" data-reveal style="--d:${(index % 3) * 70}ms">
          <div class="program-top">
            <span class="program-icon" aria-hidden="true">${icon(program.icon)}</span>
            <span class="program-index">${pad(index + 1)}</span>
          </div>
          <div class="program-body">
            <h3>${esc(program.name)}</h3>
            <p>${esc(program.description)}</p>
          </div>
          <div class="program-foot">
            <span class="program-meta">${esc(program.meta)}</span>
            <a class="program-arrow" href="${esc(waLink(ask))}" target="_blank" rel="noopener" aria-label="Ask about ${esc(program.name)} on WhatsApp">${ARROW}</a>
          </div>
        </article>`;
      })
      .join("");
  };

  /* ---------- equipment ---------- */
  const renderEquipment = () => {
    const rail = $("#equipmentRail");
    if (!rail) return;
    const cards = CONFIG.equipment
      .map(
        (item, index) => `<article class="equipment-card" data-reveal style="--d:${index * 55}ms">
          <img src="${PHOTO(item.photo)}" alt="${esc(item.alt)}" width="800" height="1000" loading="lazy" decoding="async">
          <span class="equipment-index" aria-hidden="true">${pad(index + 1)}</span>
          <div class="equipment-meta">
            <h3>${esc(item.name)}</h3>
            <p>${esc(item.description)}</p>
          </div>
        </article>`
      )
      .join("");
    const end = `<a class="equipment-card equipment-end" href="#contact" data-reveal style="--d:${CONFIG.equipment.length * 55}ms">
      <div class="end-top"><span class="end-label">And there's more</span><span class="end-label">Serviced weekly</span></div>
      <div>
        <div class="end-plus">${esc(String(machineTotal))}<span>+</span></div>
        <h3>Machines &amp; stations</h3>
        <p>Come walk the floor before you decide. A coach will show you around — no pressure to join on the spot.</p>
        <span class="text-link">Book a walkthrough ${ARROW}</span>
      </div>
    </a>`;
    rail.innerHTML = cards + end;
  };

  /* ---------- owner and trainers ---------- */
  const renderTeam = () => {
    const ownerWrap = $("#ownerCard");
    if (ownerWrap) {
      const owner = CONFIG.owner;
      ownerWrap.innerHTML = `<article class="card owner-card" data-reveal>
        <div class="owner-media">
          <img src="${PHOTO(owner.photo)}" alt="${esc(owner.alt)}" width="800" height="1000" loading="lazy" decoding="async">
          <span class="owner-badge">Founder · ${esc(owner.years)}</span>
        </div>
        <div class="owner-content">
          <p class="kicker"><span class="kicker-num">The founder</span>On the floor</p>
          <h3>${esc(owner.name)}</h3>
          <p class="owner-role">${esc(owner.role)}</p>
          <p class="owner-bio">${esc(owner.bio)}</p>
          <p class="owner-quote">“${esc(owner.quote)}”</p>
          <div class="chip-row">${owner.credentials.map((item) => `<span class="chip">${esc(item)}</span>`).join("")}</div>
        </div>
      </article>`;
    }

    const trainerGrid = $("#trainerGrid");
    if (trainerGrid) {
      trainerGrid.innerHTML = CONFIG.trainers
        .map((trainer, index) => {
          const ask = `Hi Oxygen Gym! I'd like to book a session with ${trainer.name}.`;
          return `<article class="trainer-card" data-reveal style="--d:${index * 80}ms">
            <img src="${PHOTO(trainer.photo)}" alt="${esc(trainer.alt)}" width="800" height="1000" loading="lazy" decoding="async">
            <span class="trainer-years">${esc(trainer.years)}</span>
            <a class="trainer-social" href="${esc(waLink(ask))}" target="_blank" rel="noopener" aria-label="Book a session with ${esc(trainer.name)} on WhatsApp">${icon("whatsapp")}</a>
            <div class="trainer-nameplate">
              <div>
                <h3>${esc(trainer.name)}</h3>
                <p>${esc(trainer.role)}</p>
                <p class="trainer-bio">${esc(trainer.bio)}</p>
              </div>
              <span class="trainer-arrow" aria-hidden="true">${ARROW}</span>
            </div>
          </article>`;
        })
        .join("");
    }
  };

  /* ---------- pricing ---------- */
  const renderPlans = () => {
    const grid = $("#planGrid");
    if (!grid) return;
    grid.innerHTML = CONFIG.plans
      .map((plan, index) => {
        const isMonthly = plan.id === "monthly";
        const fullBill = isMonthly ? "Billed monthly · no joining fee" : `${price(plan.monthly)} / month effective`;
        const monthlyBill = isMonthly ? "Billed monthly · no joining fee" : `${price(plan.price)} billed per ${plan.period}`;
        const saving = plan.save ? `<span class="save-chip">${esc(plan.save)}</span>` : "";
        return `<article class="plan-card${plan.popular ? " is-featured" : ""}" data-reveal style="--d:${index * 80}ms" aria-labelledby="planTitle-${esc(plan.id)}">
          <div class="plan-top">
            <div>
              <h3 id="planTitle-${esc(plan.id)}">${esc(plan.name)}</h3>
              <p class="plan-note">${esc(plan.note)}</p>
            </div>
            ${plan.popular ? '<span class="plan-tag">Most popular</span>' : ""}
          </div>
          <div class="price-wrap">
            <span class="plan-currency" aria-hidden="true">₹</span>
            <span class="plan-price" data-full="${esc(money(plan.price))}" data-monthly="${esc(money(plan.monthly))}">${esc(money(plan.price))}</span>
            <span class="plan-period" data-full="/ ${esc(plan.period)}" data-monthly="/ month">/ ${esc(plan.period)}</span>
          </div>
          <p class="plan-billing" data-full="${esc(fullBill)}" data-monthly="${esc(monthlyBill)}">${esc(fullBill)}</p>
          ${saving}
          <ul class="plan-features">
            ${plan.features.map((feature) => `<li>${CHECK}<span>${esc(feature)}</span></li>`).join("")}
          </ul>
          <a class="btn ${plan.popular ? "btn-primary" : "btn-ghost"}" href="${esc(waLink(planMessage(plan)))}" target="_blank" rel="noopener" aria-label="${esc(plan.cta)} on WhatsApp">${esc(plan.cta)} ${ARROW}</a>
        </article>`;
      })
      .join("");
  };

  const initPlans = () => {
    const toggle = $(".billing-toggle");
    const grid = $("#planGrid");
    if (!toggle || !grid) return;
    toggle.dataset.mode = "full";
    const buttons = $$("[data-billing]", toggle);
    let mode = "full";
    let swapTimer = null;

    const status = document.createElement("p");
    status.className = "sr-only";
    status.id = "billingStatus";
    status.setAttribute("aria-live", "polite");
    toggle.insertAdjacentElement("afterend", status);

    const apply = () => {
      $$(".plan-price, .plan-period, .plan-billing", grid).forEach((el) => {
        el.textContent = el.dataset[mode];
      });
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const next = button.dataset.billing;
        if (!next || next === mode) return;
        mode = next;
        toggle.dataset.mode = mode;
        buttons.forEach((item) => {
          const active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        status.textContent =
          mode === "monthly" ? "Showing effective per-month prices." : "Showing full plan prices.";
        if (motionOK()) {
          grid.classList.add("is-swapping");
          window.clearTimeout(swapTimer);
          swapTimer = window.setTimeout(() => {
            apply();
            grid.classList.remove("is-swapping");
          }, 170);
        } else {
          apply();
        }
      });
    });
  };

  /* ---------- gallery + lightbox ---------- */
  const renderGallery = () => {
    const masonry = $("#galleryMasonry");
    if (!masonry) return;
    masonry.innerHTML = CONFIG.gallery
      .map(
        (item, index) => `<button class="gallery-item" type="button" data-index="${index}" style="--ar:${esc(item.ratio)}" data-reveal aria-label="${esc(`${item.caption}. Open photo ${index + 1} of ${CONFIG.gallery.length}.`)}">
          <img src="${PHOTO(item.photo)}" alt="${esc(item.alt)}" loading="lazy" decoding="async">
          <span class="gallery-cap"><span>${esc(item.caption)}</span><span class="gallery-plus" aria-hidden="true">${PLUS}</span></span>
        </button>`
      )
      .join("");
  };

  const initGallery = () => {
    const masonry = $("#galleryMasonry");
    const lightbox = $("#lightbox");
    if (!masonry || !lightbox) return;
    const image = $("#lbImage");
    const caption = $("#lbCaption");
    const count = $("#lbCount");
    let current = 0;
    let restoreFocus = null;

    const total = () => CONFIG.gallery.length;

    const show = (index) => {
      current = ((index % total()) + total()) % total();
      const item = CONFIG.gallery[current];
      image.src = PHOTO(item.photo);
      image.alt = item.alt;
      caption.textContent = item.caption;
      count.textContent = `${pad(current + 1)} / ${pad(total())}`;
    };

    const open = (index) => {
      restoreFocus = document.activeElement;
      show(index);
      document.body.classList.add("lightbox-open");
      if (typeof lightbox.showModal === "function") {
        if (!lightbox.open) lightbox.showModal();
      } else {
        lightbox.setAttribute("open", "");
      }
      $("#lbClose")?.focus({ preventScroll: true });
    };

    const close = () => {
      if (typeof lightbox.close === "function") lightbox.close();
      else lightbox.removeAttribute("open");
    };

    masonry.addEventListener("click", (event) => {
      const trigger = event.target.closest(".gallery-item");
      if (trigger) open(Number(trigger.dataset.index));
    });
    $("#lbPrev")?.addEventListener("click", () => show(current - 1));
    $("#lbNext")?.addEventListener("click", () => show(current + 1));
    $("#lbClose")?.addEventListener("click", close);

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) close();
    });
    lightbox.addEventListener("close", () => {
      document.body.classList.remove("lightbox-open");
      if (restoreFocus && typeof restoreFocus.focus === "function") {
        restoreFocus.focus({ preventScroll: true });
      }
      restoreFocus = null;
    });
    lightbox.addEventListener("cancel", () => {
      document.body.classList.remove("lightbox-open");
    });
    document.addEventListener("keydown", (event) => {
      if (!lightbox.open) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        show(current - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        show(current + 1);
      }
    });
  };

  /* ---------- reviews carousel ---------- */
  const ratingMarkup = (value) => {
    const filled = Math.max(0, Math.min(5, Number(value) || 0));
    const starSet = stars.repeat(5);
    return `<span class="stars" role="img" aria-label="Rated ${filled} out of 5">${starSet}<span class="stars-fill" aria-hidden="true" style="width:${(filled / 5) * 100}%">${starSet}</span></span>`;
  };

  const renderReviews = () => {
    const track = $("#reviewTrack");
    const dots = $("#reviewDots");
    const count = $("#reviewCount");
    if (!track) return;
    track.innerHTML = CONFIG.reviews
      .map(
        (review, index) => `<article class="review-slide${index === 0 ? " is-active" : ""}" aria-roledescription="slide" aria-label="${index + 1} of ${CONFIG.reviews.length}" ${index === 0 ? "" : 'aria-hidden="true" inert'}>
          <div class="review-card">
            <span class="review-mark" aria-hidden="true">“</span>
            <div class="review-head">
              ${ratingMarkup(review.rating)}
              <span class="review-source">${esc(CONFIG.rating.source)} review</span>
            </div>
            <blockquote class="review-blockquote">
              <p class="review-title">${esc(review.title)}</p>
              <p class="review-body">“${esc(review.body)}”</p>
            </blockquote>
            <div class="review-person">
              <span class="review-avatar" aria-hidden="true">${esc(review.initials)}</span>
              <div><strong>${esc(review.name)}</strong><span>${esc(review.since)}</span></div>
              <span class="review-index" aria-hidden="true">${pad(index + 1)} / ${pad(CONFIG.reviews.length)}</span>
            </div>
          </div>
        </article>`
      )
      .join("");

    if (dots) {
      dots.innerHTML = CONFIG.reviews
        .map(
          (review, index) => `<button class="car-dot${index === 0 ? " is-active" : ""}" type="button" data-slide="${index}" aria-label="Go to review ${index + 1}: ${esc(review.name)}"${index === 0 ? ' aria-current="true"' : ""}></button>`
        )
        .join("");
    }
    if (count) count.textContent = `01 / ${pad(CONFIG.reviews.length)}`;
  };

  const initReviews = () => {
    const section = $("#reviews");
    const carousel = $("#reviewsCarousel");
    const track = $("#reviewTrack");
    const viewport = $(".car-viewport", carousel);
    const dotsWrap = $("#reviewDots");
    const count = $("#reviewCount");
    const pauseButton = $("#reviewPause");
    if (!section || !carousel || !track || !viewport) return;

    const slides = $$(".review-slide", track);
    const dots = $$(".car-dot", dotsWrap);
    const total = slides.length;
    if (!total) return;
    const AUTOPLAY_MS = 6500;
    let current = 0;
    let paused = !motionOK();
    let hovered = false;
    let focusWithin = false;
    let touching = false;
    let inView = false;
    let autoTimer = null;
    let drag = null;

    const live = document.createElement("p");
    live.className = "sr-only";
    live.setAttribute("aria-live", "polite");
    carousel.appendChild(live);

    const updatePauseButton = () => {
      if (!pauseButton) return;
      pauseButton.classList.toggle("is-paused", paused);
      pauseButton.setAttribute(
        "aria-label",
        paused ? "Play automatic slideshow" : "Pause automatic slideshow"
      );
      pauseButton.title = paused ? "Play automatic slideshow" : "Pause automatic slideshow";
    };

    const canAuto = () =>
      !paused && !hovered && !focusWithin && !touching && inView && !document.hidden;

    const stopAuto = () => {
      if (autoTimer) {
        window.clearTimeout(autoTimer);
        autoTimer = null;
      }
    };

    const scheduleAuto = () => {
      stopAuto();
      if (!canAuto()) return;
      autoTimer = window.setTimeout(() => {
        autoTimer = null;
        if (!canAuto()) return;
        goTo(current + 1);
      }, AUTOPLAY_MS);
    };

    const sync = () => {
      track.style.transform = `translate3d(-${current * 100}%,0,0)`;
      slides.forEach((slide, index) => {
        const active = index === current;
        slide.classList.toggle("is-active", active);
        slide.inert = !active;
        if (active) slide.removeAttribute("aria-hidden");
        else slide.setAttribute("aria-hidden", "true");
      });
      dots.forEach((dot, index) => {
        const active = index === current;
        dot.classList.toggle("is-active", active);
        if (active) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
      if (count) count.textContent = `${pad(current + 1)} / ${pad(total)}`;
    };

    const goTo = (next, announce = false) => {
      current = ((next % total) + total) % total;
      sync();
      if (announce) {
        const review = CONFIG.reviews[current];
        live.textContent = `Review ${current + 1} of ${total}: ${review.title}, by ${review.name}.`;
      }
      scheduleAuto();
    };

    updatePauseButton();
    sync();
    scheduleAuto();

    $("#reviewPrev")?.addEventListener("click", () => goTo(current - 1, true));
    $("#reviewNext")?.addEventListener("click", () => goTo(current + 1, true));
    dots.forEach((dot) => {
      dot.addEventListener("click", () => goTo(Number(dot.dataset.slide), true));
    });
    pauseButton?.addEventListener("click", () => {
      paused = !paused;
      updatePauseButton();
      scheduleAuto();
    });

    carousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(current - 1, true);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(current + 1, true);
      } else if (event.key === "Home") {
        event.preventDefault();
        goTo(0, true);
      } else if (event.key === "End") {
        event.preventDefault();
        goTo(total - 1, true);
      }
    });

    section.addEventListener("mouseenter", () => {
      if (!window.matchMedia("(hover: hover)").matches) return;
      hovered = true;
      stopAuto();
    });
    section.addEventListener("mouseleave", () => {
      hovered = false;
      scheduleAuto();
    });
    section.addEventListener("focusin", () => {
      focusWithin = true;
      stopAuto();
    });
    section.addEventListener("focusout", () => {
      window.setTimeout(() => {
        focusWithin = section.contains(document.activeElement);
        scheduleAuto();
      }, 0);
    });

    viewport.addEventListener("pointerdown", (event) => {
      if (!event.isPrimary) return;
      drag = { x: event.clientX, y: event.clientY, id: event.pointerId };
      touching = true;
      stopAuto();
    });
    const endDrag = (event) => {
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      drag = null;
      touching = false;
      if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) {
        goTo(current + (dx < 0 ? 1 : -1), true);
      } else {
        scheduleAuto();
      }
    };
    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", () => {
      drag = null;
      touching = false;
      scheduleAuto();
    });

    document.addEventListener("visibilitychange", scheduleAuto);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        (entries) => {
          inView = entries[0].isIntersecting;
          scheduleAuto();
        },
        { threshold: 0.25 }
      ).observe(carousel);
    } else {
      inView = true;
      scheduleAuto();
    }

    reduceMotion.addEventListener("change", (event) => {
      if (event.matches) {
        paused = true;
        updatePauseButton();
        stopAuto();
      }
    });
  };

  /* ---------- FAQ ---------- */
  const fillFaqTokens = (value) =>
    String(value)
      .replace(/\{monthly\}/g, price(CONFIG.plans[0].price))
      .replace(/\{quarterly\}/g, price(CONFIG.plans[1].price))
      .replace(/\{yearly\}/g, price(CONFIG.plans[2].price))
      .replace(/\{weekdayHours\}/g, CONFIG.hours.weekday)
      .replace(/\{sundayHours\}/g, CONFIG.hours.sunday);

  const renderFaq = () => {
    const list = $("#faqList");
    if (!list) return;
    list.innerHTML = CONFIG.faqs
      .map((faq, index) => {
        const open = index === 0;
        return `<div class="faq-item${open ? " is-open" : ""}" data-reveal style="--d:${index * 55}ms">
          <h3>
            <button class="faq-question" type="button" id="faqQ-${index}" aria-expanded="${open}" aria-controls="faqA-${index}">
              <span class="faq-num" aria-hidden="true">${pad(index + 1)}</span>
              <span class="faq-q-text">${esc(fillFaqTokens(faq.q))}</span>
              <span class="faq-icon" aria-hidden="true"></span>
            </button>
          </h3>
          <div class="faq-answer" id="faqA-${index}" role="region" aria-labelledby="faqQ-${index}" aria-hidden="${!open}"${open ? "" : " inert"}>
            <div><p>${esc(fillFaqTokens(faq.a))}</p></div>
          </div>
        </div>`;
      })
      .join("");
  };

  const initFaq = () => {
    const buttons = $$(".faq-question");
    const setOpen = (button, open) => {
      const item = button.closest(".faq-item");
      const panel = document.getElementById(button.getAttribute("aria-controls"));
      if (!item || !panel) return;
      item.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", String(open));
      panel.setAttribute("aria-hidden", String(!open));
      panel.inert = !open;
    };
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const wasOpen = button.getAttribute("aria-expanded") === "true";
        buttons.forEach((other) => {
          if (other !== button) setOpen(other, false);
        });
        setOpen(button, !wasOpen);
      });
    });
  };

  /* ---------- BMI ---------- */
  const initBmi = () => {
    const form = $("#bmiForm");
    if (!form) return;
    const heightInput = $("#bmiHeight");
    const weightInput = $("#bmiWeight");
    const error = $("#bmiError");
    const result = $("#bmiResult");
    const value = $("#bmiValue");
    const category = $("#bmiCategory");
    const copy = $("#bmiCopy");
    const trialLink = $("#bmiResult .text-link");

    [heightInput, weightInput].forEach((input) => {
      input.setAttribute("aria-describedby", "bmiError");
      input.addEventListener("input", () => {
        input.classList.remove("is-invalid");
        input.removeAttribute("aria-invalid");
        if (error) error.hidden = true;
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const height = Number.parseFloat(heightInput.value);
      const weight = Number.parseFloat(weightInput.value);
      const heightBad = !Number.isFinite(height) || height < 100 || height > 250;
      const weightBad = !Number.isFinite(weight) || weight < 30 || weight > 300;

      heightInput.classList.toggle("is-invalid", heightBad);
      weightInput.classList.toggle("is-invalid", weightBad);
      if (heightBad) heightInput.setAttribute("aria-invalid", "true");
      else heightInput.removeAttribute("aria-invalid");
      if (weightBad) weightInput.setAttribute("aria-invalid", "true");
      else weightInput.removeAttribute("aria-invalid");

      if (heightBad || weightBad) {
        if (result) result.hidden = true;
        if (error) {
          error.hidden = false;
          error.textContent = [
            heightBad ? "Enter a height between 100 and 250 cm." : "",
            weightBad ? "Enter a weight between 30 and 300 kg." : ""
          ]
            .filter(Boolean)
            .join(" ");
        }
        (heightBad ? heightInput : weightInput).focus();
        return;
      }

      const bmi = weight / Math.pow(height / 100, 2);
      const bmiText = bmi.toFixed(1);
      let label = "Healthy range";
      let note =
        "A solid baseline. Now the interesting work begins: getting stronger, moving better and building a habit you can keep.";
      if (bmi < 18.5) {
        label = "Below the range";
        note =
          "You're starting light. The goal isn't just to add weight — it's to add strength and steady fuel. A coach can help you build both.";
      } else if (bmi >= 30) {
        label = "High range";
        note =
          "This is information, not a label. Begin with low-impact movement, a form check and small changes. A coach can map out your first month.";
      } else if (bmi >= 25) {
        label = "Above the range";
        note =
          "A common starting point — and a very workable one. Skip crash diets. Start with strength, daily walks and a plan you can actually follow.";
      }

      if (value) value.textContent = bmiText;
      if (category) category.textContent = label;
      if (copy) copy.textContent = note;
      if (trialLink) {
        trialLink.href = waLink(
          `${messages.trial} My BMI came out to ${bmiText} (${height} cm, ${weight} kg) — I'd like to talk about a plan.`
        );
      }
      if (error) error.hidden = true;
      if (result) result.hidden = false;
    });
  };

  /* ---------- equipment rail ---------- */
  const initEquipmentRail = () => {
    const rail = $("#equipmentRail");
    const previous = $("#equipmentPrev");
    const next = $("#equipmentNext");
    if (!rail || !previous || !next) return;
    const update = () => {
      const max = Math.max(0, rail.scrollWidth - rail.clientWidth);
      previous.disabled = rail.scrollLeft <= 4;
      next.disabled = rail.scrollLeft >= max - 4;
    };
    const scroll = (direction) => {
      rail.scrollBy({
        left: direction * Math.max(280, rail.clientWidth * 0.82),
        behavior: motionOK() ? "smooth" : "auto"
      });
    };
    previous.addEventListener("click", () => scroll(-1));
    next.addEventListener("click", () => scroll(1));
    rail.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    requestAnimationFrame(update);
  };

  /* ---------- header, scrollspy, menu ---------- */
  const initHeader = () => {
    const header = $("#siteHeader");
    const progress = $("#scrollProgress");
    const hero = $("#home");
    const heroBackground = $(".hero-bg");
    const navLinks = $$(".nav-link");
    const targets = navLinks
      .map((link) => {
        const id = link.getAttribute("href")?.slice(1);
        const section = id ? document.getElementById(id) : null;
        return section ? { link, section } : null;
      })
      .filter(Boolean)
      .sort((a, b) =>
        a.section.compareDocumentPosition(b.section) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
      );
    let ticking = false;

    const update = () => {
      ticking = false;
      const scrollTop = window.scrollY;
      const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      if (header) header.classList.toggle("is-scrolled", scrollTop > 10);
      if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollTop / max) : 0})`;

      if (heroBackground && hero && motionOK()) {
        const offset = Math.min(scrollTop * 0.16, 80);
        heroBackground.style.transform = `translate3d(0,${offset}px,0)`;
      }

      if (targets.length) {
        let active = targets[0].section.id;
        const line = (header?.offsetHeight || 72) + 120;
        targets.forEach(({ section }) => {
          if (section.getBoundingClientRect().top <= line) active = section.id;
        });
        if (max > 0 && scrollTop >= max - 2) {
          active = targets[targets.length - 1].section.id;
        }
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${active}`);
        });
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  };

  const initMenu = () => {
    const menu = $("#menu");
    const trigger = $("#menuBtn");
    const closeButton = $("#menuClose");
    if (!menu || !trigger || !closeButton) return;
    let isOpen = false;

    const focusable = () =>
      $$("a[href], button:not([disabled])", menu).filter((el) => el.getClientRects().length > 0);

    const open = () => {
      isOpen = true;
      menu.inert = false;
      menu.setAttribute("aria-hidden", "false");
      menu.classList.add("is-open");
      document.body.classList.add("menu-open");
      trigger.setAttribute("aria-expanded", "true");
      trigger.setAttribute("aria-label", "Close menu");
      requestAnimationFrame(() => requestAnimationFrame(() => closeButton.focus({ preventScroll: true })));
    };

    const close = (restoreFocus = true) => {
      if (!isOpen) return;
      isOpen = false;
      menu.classList.remove("is-open");
      menu.setAttribute("aria-hidden", "true");
      menu.inert = true;
      document.body.classList.remove("menu-open");
      trigger.setAttribute("aria-expanded", "false");
      trigger.setAttribute("aria-label", "Open menu");
      if (restoreFocus) trigger.focus({ preventScroll: true });
    };

    trigger.addEventListener("click", () => (isOpen ? close() : open()));
    closeButton.addEventListener("click", () => close());
    $$("a", menu).forEach((link) => link.addEventListener("click", () => close(false)));

    menu.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    window.matchMedia("(min-width: 1024px)").addEventListener("change", (event) => {
      if (event.matches) close(false);
    });
  };

  /* ---------- forms ---------- */
  const initEnquiry = () => {
    const form = $("#enquiryForm");
    if (!form) return;
    const nameInput = $("#enqName");
    const phoneInput = $("#enqPhone");
    const goalInput = $("#enqGoal");
    const status = $("#enquiryStatus");

    const setInvalid = (input, invalid) => {
      input.classList.toggle("is-invalid", invalid);
      if (invalid) input.setAttribute("aria-invalid", "true");
      else input.removeAttribute("aria-invalid");
    };

    [nameInput, phoneInput, goalInput].forEach((input) => {
      input.addEventListener("input", () => {
        setInvalid(input, false);
        if (status) {
          status.textContent = "";
          status.className = "form-status";
        }
      });
      input.addEventListener("change", () => setInvalid(input, false));
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = nameInput.value.trim().replace(/\s+/g, " ");
      const phoneDisplay = phoneInput.value.trim();
      const digits = phoneDisplay.replace(/\D/g, "");
      const goal = goalInput.value;
      const nameBad = name.length < 2;
      const phoneBad = !/^(?:91)?[6-9]\d{9}$/.test(digits) && !/^0[6-9]\d{9}$/.test(digits);
      const goalBad = !goal;

      setInvalid(nameInput, nameBad);
      setInvalid(phoneInput, phoneBad);
      setInvalid(goalInput, goalBad);

      if (nameBad || phoneBad || goalBad) {
        if (status) {
          status.className = "form-status is-error";
          status.textContent = nameBad
            ? "Please add your name."
            : phoneBad
              ? "Enter a valid 10-digit mobile number."
              : "Pick the goal that fits best.";
        }
        (nameBad ? nameInput : phoneBad ? phoneInput : goalInput).focus();
        return;
      }

      const text = `${messages.trial}\n\nName: ${name}\nPhone: ${phoneDisplay}\nGoal: ${goal}`;
      const url = waLink(text);
      window.open(url, "_blank", "noopener");

      if (status) {
        status.className = "form-status is-success";
        status.replaceChildren(document.createTextNode("Opening WhatsApp with your details… "));
        const fallback = document.createElement("a");
        fallback.href = url;
        fallback.target = "_blank";
        fallback.rel = "noopener";
        fallback.textContent = "Open WhatsApp";
        status.append(fallback, document.createTextNode(" if it doesn't open by itself."));
      }
    });
  };

  /* ---------- open / closed status ---------- */
  const initOpenStatus = () => {
    const el = $("#openStatus");
    if (!el) return;
    const label = $("span", el);
    if (!label) return;
    el.title = "India Standard Time";

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const longDay = {
      Sun: "Sunday",
      Mon: "Monday",
      Tue: "Tuesday",
      Wed: "Wednesday",
      Thu: "Thursday",
      Fri: "Friday",
      Sat: "Saturday"
    };
    const schedule = (index) =>
      index === 0
        ? { open: CONFIG.hours.sundayOpen, close: CONFIG.hours.sundayClose }
        : { open: CONFIG.hours.weekdayOpen, close: CONFIG.hours.weekdayClose };
    const toMinutes = (value) => {
      const [hours, minutes] = String(value || "0:0").split(":").map(Number);
      return (hours || 0) * 60 + (minutes || 0);
    };
    const displayTime = (value) => {
      const [hourValue, minuteValue] = String(value || "0:0").split(":").map(Number);
      const suffix = hourValue >= 12 ? "PM" : "AM";
      const hour = hourValue % 12 || 12;
      return `${hour}:${String(minuteValue || 0).padStart(2, "0")} ${suffix}`;
    };

    const update = () => {
      try {
        const parts = new Intl.DateTimeFormat("en-GB", {
          timeZone: CONFIG.hours.timezone,
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23"
        }).formatToParts(new Date());
        const part = (type) => parts.find((item) => item.type === type)?.value || "0";
        const day = part("weekday");
        const dayIndex = Math.max(0, dayNames.indexOf(day));
        const minutes = Number(part("hour")) * 60 + Number(part("minute"));
        const today = schedule(dayIndex);
        const open = toMinutes(today.open);
        const close = toMinutes(today.close);

        if (minutes >= open && minutes < close) {
          el.classList.remove("is-closed");
          label.textContent = `Open now · closes ${displayTime(today.close)}`;
          return;
        }

        el.classList.add("is-closed");
        if (minutes < open) {
          label.textContent = `Closed · opens at ${displayTime(today.open)}`;
          return;
        }

        for (let offset = 1; offset <= 7; offset += 1) {
          const nextIndex = (dayIndex + offset) % 7;
          const nextDay = schedule(nextIndex);
          if (offset === 1) {
            label.textContent = `Closed · opens tomorrow at ${displayTime(nextDay.open)}`;
            return;
          }
          label.textContent = `Closed · opens ${longDay[dayNames[nextIndex]]} at ${displayTime(nextDay.open)}`;
          return;
        }
        label.textContent = "Closed · call us for today's hours";
      } catch (error) {
        label.textContent = "Call us for today's hours";
      }
    };

    update();
    window.setInterval(update, 60000);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) update();
    });
  };

  /* ---------- reveal + counters + pointer glow ---------- */
  const initReveal = () => {
    const items = $$("[data-reveal]");
    if (!items.length) return;
    if (!("IntersectionObserver" in window) || !motionOK()) {
      items.forEach((item) => item.classList.add("is-in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" }
    );
    items.forEach((item) => observer.observe(item));
  };

  const initCounters = () => {
    const counters = $$("[data-count]");
    if (!counters.length) return;
    const format = (el, value) => {
      el.textContent = Number(value).toFixed(Number(el.dataset.decimals) || 0);
    };
    const finish = (el) => format(el, Number(el.dataset.count) || 0);
    const animate = (el) => {
      const target = Number(el.dataset.count) || 0;
      if (!motionOK()) {
        finish(el);
        return;
      }
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        format(el, target * eased);
        if (progress < 1) requestAnimationFrame(tick);
        else finish(el);
      };
      requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window) || !motionOK()) {
      counters.forEach(finish);
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            animate(entry.target);
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach((counter) => observer.observe(counter));
    }

    reduceMotion.addEventListener("change", (event) => {
      if (event.matches) counters.forEach(finish);
    });
  };

  const initSpotlights = () => {
    $$(".spotlight").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        card.style.setProperty("--my", `${event.clientY - rect.top}px`);
      });
    });
  };

  /* ---------- boot ---------- */
  bindContent();
  renderStats();
  renderPrograms();
  renderEquipment();
  renderTeam();
  renderPlans();
  renderGallery();
  renderReviews();
  renderFaq();

  initHeader();
  initMenu();
  initPlans();
  initEquipmentRail();
  initGallery();
  initReviews();
  initFaq();
  initBmi();
  initEnquiry();
  initOpenStatus();
  initSpotlights();
  initReveal();
  initCounters();
})();
