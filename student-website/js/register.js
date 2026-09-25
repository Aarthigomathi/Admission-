/* ==========================================================================
   js/register.js — Student Registration logic (register.html)
   Flow: Personal (email+mobile OTP ✅) → Address → Education → Register
   Register aana udane colleges.html-kku povanga.
   ========================================================================== */
(function () {
  "use strict";
  const { icon, Users, toast, setupOtp } = window.SW;
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  /* icons inject pannurathu */
  $$("[data-ic]").forEach(el => el.insertAdjacentHTML("afterbegin", icon(el.dataset.ic)));
  $("#pi1").innerHTML = icon("shield"); $("#pi2").innerHTML = icon("award");
  $("#pi3").innerHTML = icon("build"); $("#pi4").innerHTML = icon("lock");
  $("#backHome").innerHTML = icon("arrowl") + "Home";

  $("#regForm").onsubmit = e => e.preventDefault();

  /* ---------------------- selects fill ---------------------- */
  $("#rgCity").innerHTML = `<option value="">Select city / district…</option>` + TN_DISTRICTS.map(d => `<option>${d}</option>`).join("");
  $("#rgState").innerHTML = IN_STATES.map((s, i) => `<option ${i === 0 ? "selected" : ""}>${s}</option>`).join("");
  $("#rgCourse").innerHTML = `<option value="">Select course…</option>` + COURSES_LIST.map(c => `<option>${c}</option>`).join("");

  /* ---------------------- validators ------------------------ */
  const fBad = (sel, on) => $(sel).closest(".field").classList.toggle("bad", !!on);
  const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
  const mobOf = v => { const d = v.replace(/\D/g, "").replace(/^91(\d{10})$/, "$1"); return /^\d{10}$/.test(d) ? d : ""; };
  const numOk = (v, max) => /^\d{1,3}(\.\d{1,2})?$/.test(v.trim()) && +v >= 1 && +v <= max;

  /* ---------------------- OTP (email + mobile) -------------- */
  const otpEmail = setupOtp({
    kind: "email", field: "#fEmail", input: "#rgEmail", send: "#rgEmailSend",
    box: "#rgEmailBox", otpIn: "#rgEmailOtp", verify: "#rgEmailVerify", resend: "#rgEmailResend",
    validate: emailOk
  });
  const otpPhone = setupOtp({
    kind: "mobile", field: "#fPhone", input: "#rgPhone", send: "#rgPhoneSend",
    box: "#rgPhoneBox", otpIn: "#rgPhoneOtp", verify: "#rgPhoneVerify", resend: "#rgPhoneResend",
    validate: v => !!mobOf(v)
  });

  /* ==================== EDUCATION BLOCKS =====================
     Qualification-ku etta blocks: marks stored as { pct/cgpa, mode }
     mode = completed | expected ("Expected Percentage/CGPA" label)      */
  const mode = { tenth: "completed", twelfth: "completed", diploma: "completed", ug: "completed", pg: "completed" };
  const LBL = {
    tenth: ["10th Percentage", "10th Expected Percentage"],
    twelfth: ["12th Percentage", "12th Expected Percentage"],
    diploma: ["Diploma Percentage", "Diploma Expected Percentage"],
    ug: ["UG CGPA (out of 10)", "UG Expected CGPA"],
    pg: ["PG CGPA (out of 10)", "PG Expected CGPA"]
  };
  const LBL_ID = { tenth: "lblTen", twelfth: "lblTwe", diploma: "lblDip", ug: "lblUg", pg: "lblPg" };

  const pill = k => `<span class="mode-pill" data-block="${k}">
    <button type="button" data-m="completed" class="${mode[k] === "completed" ? "on" : ""}">Completed</button>
    <button type="button" data-m="expected" class="${mode[k] === "expected" ? "on" : ""}">Expected</button></span>`;

  const markInput = (k, id, ph, suf) => `
    <div class="field">
      <label id="${LBL_ID[k]}">${LBL[k][0]} <span class="req">*</span></label>
      <div class="mark-wrap"><input class="input" id="${id}" inputmode="decimal" placeholder="${ph}"><span class="suf">${suf}</span></div>
      <div class="err">${suf === "/ 10" ? "1–10 CGPA podunga" : "1–100 madhiri podunga"}</div>
    </div>`;

  const BLOCKS = {
    tenth: () => `
      <div class="edu-block">
        <div class="edu-head"><span class="ei" data-ei="book"></span><div><b>10th (SSLC)</b><small>board + percentage</small></div>${pill("tenth")}</div>
        <div class="grid2">
          <div class="field"><label>Board</label>
            <select class="select" id="rgTenBoard">${["Tamil Nadu State Board", "CBSE", "ICSE", "Other"].map(x => `<option>${x}</option>`).join("")}</select></div>
          ${markInput("tenth", "rgTenPct", "eg: 92.4", "/ 100")}
        </div>
      </div>`,
    twelfth: () => `
      <div class="edu-block">
        <div class="edu-head"><span class="ei" data-ei="build"></span><div><b>12th (HSC)</b><small>group + percentage</small></div>${pill("twelfth")}</div>
        <div class="grid2">
          <div class="field"><label>Group</label>
            <select class="select" id="rgTweGroup">${["CS-Maths", "Bio-Maths", "Pure Science", "Commerce", "Vocational", "Other"].map(x => `<option>${x}</option>`).join("")}</select></div>
          ${markInput("twelfth", "rgTwePct", "eg: 88.6", "/ 100")}
        </div>
      </div>`,
    diploma: () => `
      <div class="edu-block">
        <div class="edu-head"><span class="ei" data-ei="spark"></span><div><b>Diploma</b><small>specialization + percentage</small></div>${pill("diploma")}</div>
        <div class="grid2">
          <div class="field"><label>Specialization <span class="req">*</span></label>
            <input class="input" id="rgDipName" placeholder="eg: Diploma in ECE">
            <div class="err">Specialization podunga</div></div>
          ${markInput("diploma", "rgDipPct", "eg: 85.2", "/ 100")}
        </div>
      </div>`,
    ug: () => `
      <div class="edu-block">
        <div class="edu-head"><span class="ei" data-ei="cap"></span><div><b>UG Degree</b><small>degree + CGPA</small></div>${pill("ug")}</div>
        <div class="grid2">
          <div class="field"><label>Degree <span class="req">*</span></label>
            <input class="input" id="rgUgDeg" placeholder="eg: B.E CSE / B.Sc CS / B.Com">
            <div class="err">Degree podunga</div></div>
          ${markInput("ug", "rgUgCgpa", "eg: 8.4", "/ 10")}
        </div>
      </div>`,
    pg: () => `
      <div class="edu-block">
        <div class="edu-head"><span class="ei" data-ei="award"></span><div><b>PG Degree</b><small>degree + CGPA</small></div>${pill("pg")}</div>
        <div class="grid2">
          <div class="field"><label>Degree <span class="req">*</span></label>
            <input class="input" id="rgPgDeg" placeholder="eg: MBA / M.E / M.Sc">
            <div class="err">Degree podunga</div></div>
          ${markInput("pg", "rgPgCgpa", "eg: 8.1", "/ 10")}
        </div>
      </div>`
  };

  const VIS = { "10th": ["tenth"], "12th": ["tenth", "twelfth"], diploma: ["tenth", "diploma"], ug: ["tenth", "twelfth", "ug"] };

  function drawEdu() {
    const q = $("#rgQual").value, box = $("#eduBlocks");
    if (!q) {
      box.innerHTML = `<p class="small muted center" style="padding:15px 12px;border:2px dashed var(--line);border-radius:14px">Mudhalla qualification select pannunga — mark blocks approm varum</p>`;
      return;
    }
    box.innerHTML = VIS[q].map(k => BLOCKS[k]()).join("") +
      (q === "ug" ? `
        <label class="check-line"><input type="checkbox" id="rgHasPg"> <b>PG-um mudinjitten / padichikittu irukken</b> — PG CGPA-um add pannuren (optional)</label>
        <div id="pgWrap" class="hidden">${BLOCKS.pg()}</div>` : "");
    $$("#eduBlocks [data-ei]").forEach(el => el.innerHTML = icon(el.dataset.ei));
    const pgc = $("#rgHasPg");
    if (pgc) pgc.onchange = () => $("#pgWrap").classList.toggle("hidden", !pgc.checked);
    $$("#eduBlocks .mode-pill").forEach(p => p.onclick = e => {
      const b = e.target.closest("button"); if (!b) return;
      const k = p.dataset.block; mode[k] = b.dataset.m;
      p.querySelectorAll("button").forEach(x => x.classList.toggle("on", x === b));
      const el = document.getElementById(LBL_ID[k]);
      if (el) el.innerHTML = (mode[k] === "expected" ? LBL[k][1] : LBL[k][0]) + ' <span class="req">*</span>';
    });
  }
  $("#rgQual").addEventListener("change", drawEdu);
  drawEdu();

  /* ----------------- read & validate education ----------------- */
  function readEdu() {
    const q = $("#rgQual").value, req = VIS[q] || [], edu = {};
    let ok = true;
    const num = (sel, max) => {
      const el = $(sel); if (!el) return null;
      const good = numOk(el.value, max);
      el.closest(".field").classList.toggle("bad", !good);
      if (!good) { ok = false; return null; } return +el.value.trim();
    };
    const txt = (sel, min = 3) => {
      const el = $(sel); if (!el) return null;
      const v = el.value.trim(); const good = v.length >= min;
      el.closest(".field").classList.toggle("bad", !good);
      if (!good) { ok = false; return null; } return v;
    };
    if (req.includes("tenth"))   { const p = num("#rgTenPct", 100); if (p != null) edu.tenth = { board: $("#rgTenBoard").value, pct: p, mode: mode.tenth }; }
    if (req.includes("twelfth")) { const p = num("#rgTwePct", 100); if (p != null) edu.twelfth = { group: $("#rgTweGroup").value, pct: p, mode: mode.twelfth }; }
    if (req.includes("diploma")) { const n = txt("#rgDipName"); const p = num("#rgDipPct", 100); if (n && p != null) edu.diploma = { name: n, pct: p, mode: mode.diploma }; }
    if (req.includes("ug"))      { const d = txt("#rgUgDeg", 2); const c = num("#rgUgCgpa", 10); if (d && c != null) edu.ug = { degree: d, cgpa: c, mode: mode.ug }; }
    if (q === "ug" && $("#rgHasPg") && $("#rgHasPg").checked) {
      const d = txt("#rgPgDeg", 2); const c = num("#rgPgCgpa", 10);
      if (d && c != null) edu.pg = { degree: d, cgpa: c, mode: mode.pg };
    }
    return ok ? edu : null;
  }

  /* ========================= REGISTER ======================== */
  $("#rgGo").onclick = () => {
    let ok = true;
    const name = $("#rgName").value.trim();
    fBad("#rgName", name.length < 3); ok = ok && name.length >= 3;

    const email = $("#rgEmail").value.trim().toLowerCase();
    const eValid = emailOk(email) && otpEmail.isOk();
    fBad("#fEmail", !eValid); ok = ok && eValid;
    if (emailOk(email) && !otpEmail.isOk()) toast("Email OTP verify pannunga — green tick varanum", "bad");

    const mob = mobOf($("#rgPhone").value);
    const mValid = !!mob && otpPhone.isOk();
    fBad("#fPhone", !mValid); ok = ok && mValid;
    if (mob && !otpPhone.isOk()) toast("Mobile OTP verify pannunga — green tick varanum", "bad");

    const pass = $("#rgPass").value, pass2 = $("#rgPass2").value;
    fBad("#rgPass", pass.length < 6); ok = ok && pass.length >= 6;
    fBad("#rgPass2", pass2 !== pass || !pass2); ok = ok && pass2 === pass && !!pass2;

    const addr = $("#rgAddr").value.trim();
    fBad("#rgAddr", addr.length < 6); ok = ok && addr.length >= 6;

    const city = $("#rgCity").value, state = $("#rgState").value;
    fBad("#rgCity", !city); ok = ok && !!city;

    const pin = $("#rgPin").value.trim();
    fBad("#rgPin", !/^\d{6}$/.test(pin)); ok = ok && /^\d{6}$/.test(pin);

    const qual = $("#rgQual").value;
    fBad("#rgQual", !qual); ok = ok && !!qual;
    const education = qual ? readEdu() : null;
    ok = ok && !!education;

    if (!ok) {
      toast("Konjam fields sari pannunga — red-la kaatura field paarunga", "bad");
      const f = $(".field.bad"); if (f && f.scrollIntoView) f.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const users = Users.all();
    if (users.some(u => u.email === email)) {
      fBad("#fEmail", true);
      toast("Intha email already register aagirukku — vera email podunga", "bad"); return;
    }

    const user = {
      id: Date.now(), name, email, password: pass, mobile: "+91 " + mob,
      address: { line: addr, city, state, pin },
      qualification: qual, education, interestedCourse: $("#rgCourse").value,
      emailVerified: true, mobileVerified: true,
      createdAt: new Date().toISOString()
    };
    users.push(user); Users.saveAll(users); Users.setCurrent(user);

    toast("Registration complete, " + name.split(" ")[0] + "! College details-kku povom…");
    setTimeout(() => { location.href = "colleges.html"; }, 1300);
  };
})();
