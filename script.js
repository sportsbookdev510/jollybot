(() => {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("mobile-menu");
  const copyBtn = document.getElementById("copy-ca");
  const caText = document.getElementById("ca-text");
  const progress = document.getElementById("scroll-progress");
  const heroImg = document.getElementById("hero-img");
  const blob = document.getElementById("cursor-blob");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 12);

    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (y / max) * 100 : 0;
      progress.style.width = `${pct}%`;
    }

    if (heroImg && !reduceMotion) {
      const shift = Math.min(y * 0.28, 120);
      heroImg.style.transform = `scale(1.08) translate3d(0, ${shift}px, 0)`;
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      menu.hidden = open;
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (copyBtn && caText) {
    copyBtn.addEventListener("click", async () => {
      const value = caText.textContent.trim();
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        const range = document.createRange();
        range.selectNodeContents(caText);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand("copy");
        selection.removeAllRanges();
      }
      copyBtn.textContent = "Copied";
      copyBtn.classList.add("copied");
      setTimeout(() => {
        copyBtn.textContent = "Copy";
        copyBtn.classList.remove("copied");
      }, 1600);
    });
  }

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  /* Magnetic buttons */
  if (!reduceMotion) {
    document.querySelectorAll(".magnetic").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* Soft tilt on about image */
  const tilt = document.querySelector(".tilt");
  if (tilt && !reduceMotion) {
    tilt.addEventListener("pointermove", (e) => {
      const rect = tilt.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (py - 0.5) * -10;
      const ry = (px - 0.5) * 12;
      tilt.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    tilt.addEventListener("pointerleave", () => {
      tilt.style.transform = "";
    });
  }

  /* Cursor blob */
  if (blob && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let raf = 0;

    const tick = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      blob.style.left = `${x}px`;
      blob.style.top = `${y}px`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener(
      "pointermove",
      (e) => {
        tx = e.clientX;
        ty = e.clientY;
        blob.classList.add("active");
        if (!raf) raf = requestAnimationFrame(tick);
      },
      { passive: true }
    );

    window.addEventListener("pointerleave", () => {
      blob.classList.remove("active");
    });
  }

  /* Title scramble on load */
  const title = document.querySelector(".title-ent");
  if (title && !reduceMotion) {
    const finalText = title.dataset.text || title.textContent;
    const chars = "ABCDEFGHJKLMNOPQRSTUVWXYZ$jolly";
    let frame = 0;
    const total = 18;
    const scramble = () => {
      title.textContent = finalText
        .split("")
        .map((ch, i) => {
          if (ch === " ") return " ";
          if (frame / total > i / finalText.length) return finalText[i];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");
      frame += 1;
      if (frame <= total) requestAnimationFrame(scramble);
      else title.textContent = finalText;
    };
    scramble();
  }
})();
