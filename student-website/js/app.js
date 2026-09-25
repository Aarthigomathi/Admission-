/* ==========================================================================
   js/app.js — Student website shared helpers
   - SVG icon set (PR-style: lucide icons, no emojis)
   - Student session helpers (localStorage: sw_student / sw_users)
   - OTP helper: send(demo) → verify → green tick beside the field
   ========================================================================== */
(function () {
  "use strict";
  const IC = {
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-3.6 4.5-5.5 8-5.5s6.5 1.9 8 5.5"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.27a2 2 0 0 1 2.1-.45c.9.34 1.84.57 2.8.7A2 2 0 0 1 22 16.9z"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 10v10h14V10"/>',
    cap: '<path d="M22 9 12 4 2 9l10 5 10-5z"/><path d="M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5"/><path d="M22 9v5"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z"/>',
    shield: '<path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    checkcircle: '<circle cx="12" cy="12" r="10"/><path d="m8.5 12.2 2.4 2.4 4.6-4.8"/>',
    build: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 21v-4h6v4"/><path d="M8 7h2M8 11h2M14 7h2M14 11h2M8 15h2M14 15h2"/>',
    award: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14 7 22l5-3 5 3-1.5-8"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M7 6H4a2 2 0 0 0 0 4h3M17 6h3a2 2 0 0 1 0 4h-3"/>',
    spark: '<path d="M12 2v4M12 18v4M4.9 4.9l2.9 2.9M16.2 16.2l2.9 2.9M2 12h4M18 12h4M4.9 19.1l2.9-2.9M16.2 7.8l2.9-2.9"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowl: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
    rupee: '<path d="M6 3h12M6 8h12M9 13c6.7 0 6.7-10 0-10M6 13h3l8.5 8"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
    cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    bed: '<path d="M2 9v9M2 13h20v5M6 13V9h12a4 4 0 0 1 4 4"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>'
  };
  const icon = (n, cls) => `<svg class="ic ${cls || ""}" viewBox="0 0 24 24">${IC[n] || ""}</svg>`;

  /* ------------------- localStorage helpers ---------------------------- */
  const Users = {
    all: () => { try { return JSON.parse(localStorage.getItem("sw_users") || "[]"); } catch (e) { return []; } },
    saveAll: list => localStorage.setItem("sw_users", JSON.stringify(list)),
    current: () => { try { return JSON.parse(localStorage.getItem("sw_student") || "null"); } catch (e) { return null; } },
    setCurrent: u => u ? localStorage.setItem("sw_student", JSON.stringify(u)) : localStorage.removeItem("sw_student")
  };

  /* ------------------------------ TOAST -------------------------------- */
  function toast(msg, type) {
    let w = document.querySelector(".sw-toast-wrap");
    if (!w) { w = document.createElement("div"); w.className = "sw-toast-wrap"; w.innerHTML = ""; document.body.appendChild(w); }
    w.style.cssText = "position:fixed;top:16px;right:16px;z-index:120;display:flex;flex-direction:column;gap:8px";
    const t = document.createElement("div");
    t.style.cssText = `display:flex;align-items:center;gap:9px;background:${type === "bad" ? "#FEE2E2" : "var(--navy)"};color:${type === "bad" ? "#B91C1C" : "#fff"};border:2px solid ${type === "bad" ? "#FCA5A5" : "var(--gold)"};padding:11px 16px;border-radius:13px;font-size:.84rem;font-weight:600;box-shadow:0 14px 30px rgba(18,36,74,.28);max-width:330px`;
    t.innerHTML = (type === "bad" ? icon("x") : icon("checkcircle")) + "<span>" + msg + "</span>";
    w.appendChild(t);
    setTimeout(() => { t.style.opacity = "0"; t.style.transition = ".3s"; }, 2700);
    setTimeout(() => t.remove(), 3100);
  }

  /* -------------------- OTP WIDGET (email / mobile) --------------------
     cfg = { field, input, send, box, otpIn, verify, resend, kind }
     - Send click  → 6-digit demo OTP → bottom card-la kaatum (demo; real-la
       SendGrid/MSG91 API). 30s resend timer.
     - Verify click → sariya irundhaa field.side-la GREEN TICK (field.ok)   */
  function setupOtp(cfg) {
    const $ = s => document.querySelector(s);
    const field = $(cfg.field), input = $(cfg.input), send = $(cfg.send),
      box = $(cfg.box), otpIn = $(cfg.otpIn), verify = $(cfg.verify), resend = $(cfg.resend);
    let code = "", timer = null, ok = false;
    const isOk = () => ok;

    function showDemo(text) {
      document.querySelectorAll(".demo-otp").forEach(x => x.remove());
      const d = document.createElement("div");
      d.className = "demo-otp";
      d.innerHTML = icon(cfg.kind === "email" ? "mail" : "phone") +
        `<div><b>${text}</b><span class="code">${code}</span><small>Demo-la OTP inge kaaturen — real website-la ${cfg.kind === "email" ? "email inbox" : "SMS"}-ku varum (SendGrid / MSG91). Enter it in the box ▸</small></div>`;
      document.body.appendChild(d);
      setTimeout(() => d.remove(), 20000);
    }

    send.addEventListener("click", () => {
      if (ok) return;
      const v = input.value.trim();
      if (!cfg.validate(v)) {
        field.classList.add("bad");
        toast(cfg.kind === "email" ? "Sariyaana email ID podunga" : "10 digit mobile number podunga", "bad");
        return;
      }
      field.classList.remove("bad");
      code = String(100000 + Math.floor(Math.random() * 900000));
      box.classList.remove("hidden");
      otpIn.value = "";
      let n = 30; resend.disabled = true; resend.textContent = `Resend (${n}s)`;
      clearInterval(timer);
      timer = setInterval(() => {
        n--;
        if (n <= 0) { clearInterval(timer); resend.disabled = false; resend.textContent = "Resend OTP"; }
        else resend.textContent = `Resend (${n}s)`;
      }, 1000);
      showDemo(cfg.kind === "email" ? `OTP sent to <u>${v}</u>` : "OTP sent as SMS");
      toast("OTP sent — 30 seconds-kula verify pannunga");
      setTimeout(() => otpIn.focus(), 250);
    });

    resend.addEventListener("click", () => send.click());

    const tryVerify = () => {
      if (ok || !code) return;
      if (otpIn.value.trim() === code) {
        ok = true; clearInterval(timer);
        field.classList.remove("bad");
        field.classList.add("ok");            /* ← GREEN TICK besidela ✅ */
        send.textContent = "Verified";
        toast((cfg.kind === "email" ? "Email" : "Mobile") + " verified successfully");
        document.querySelectorAll(".demo-otp").forEach(x => x.remove());
      } else {
        toast("OTP thappu — shown number-a correct-a type pannunga", "bad");
        otpIn.select();
      }
    };
    verify.addEventListener("click", tryVerify);
    otpIn.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); tryVerify(); } });
    otpIn.addEventListener("input", () => { otpIn.value = otpIn.value.replace(/\D/g, "").slice(0, 6); });

    /* value maathinaa verification reset */
    input.addEventListener("input", () => {
      if (!ok && !code) return;
      ok = false; code = ""; clearInterval(timer);
      field.classList.remove("ok");
      box.classList.add("hidden");
      send.textContent = "Send OTP";
    });
    return { isOk };
  }

  window.SW = { icon, Users, toast, setupOtp };
})();
