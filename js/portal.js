/* ==========================================================================
   5. js/portal.js  —  STUDENT PORTAL-ODA BRAIN (v2)
   --------------------------------------------------------------------------
   CORE IDEA: ithu oru COLLEGE-ODA OWN student portal (eg: Thiagarajar
   College). Student first visit-la unga college select pannuvanga → portal
   adha college name + colour-la branded-aagum.
   Tabs: Dashboard · My Profile (personal details) · My Marks · Attendance ·
   Timetable · Fees · Announcements · College Info — ellam ORE page-la,
   reload illama switch aagum (#hash router).
   Login pannirundhaa → unga per; illainaa → demo view.
   ========================================================================== */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const A = window.ADM; if (!A || typeof PORTAL === "undefined") return;
    const { toast, modal, DB, esc } = A;
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
    const inr = n => "₹" + Number(n).toLocaleString("en-IN");

    /* ==================== STUDENT (LOGIN / DEMO) ======================== */
    const user = A.getUser();
    const demo = !user;
    const S = PORTAL.student;
    const profKey = "portalProfile_" + (user ? user.email : "demo");
    const saved = DB.get(profKey, {});
    /* Editable personal details — data.js base + user edit pannathu merge */
    const P = {
      ...PORTAL.profile,
      address: { ...PORTAL.profile.address, ...(saved.address || {}) },
      parent:  { ...PORTAL.profile.parent,  ...(saved.parent  || {}) },
      stay:    { ...PORTAL.profile.stay,    ...(saved.stay    || {}) },
      email: user ? user.email : (saved.email || PORTAL.profile.email),
      phone: saved.phone || PORTAL.profile.phone,
      dob: saved.dob || PORTAL.profile.dob,
      gender: saved.gender || PORTAL.profile.gender,
      blood: saved.blood || PORTAL.profile.blood
    };
    const studentName = user ? user.name : (saved.name || S.name);
    const firstName = studentName.split(" ")[0];

    /* ==================== COLLEGE (BRAND & PICKER) ====================== */
    let college = COLLEGES.find(c => c.id === DB.get("portalCollege", "")) || null;

    function applyBrand() {
      const th = THEMES[college.theme] || {};
      document.documentElement.style.setProperty("--pc1", th.c1 || "#0E9F8A");
      document.documentElement.style.setProperty("--pc2", th.c2 || "#19376D");
      $("#pLogo").textContent = college.short.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase() || "🏫";
      $("#pCollegeShort").textContent = college.short;
      $("#pCollegeName").textContent = college.district + " · Student Portal";
      document.title = "Student Portal — " + college.name;
    }

    function drawPickList(q) {
      const term = (q || "").trim().toLowerCase();
      let list = COLLEGES.filter(c => !term ||
        (c.name + " " + c.short + " " + c.district + " " + c.type).toLowerCase().includes(term));
      list = list.slice().sort((a, b) =>
        (b.id === S.collegeId) - (a.id === S.collegeId));
      $("#pickList").innerHTML = list.length ? list.map(c => {
        const th = THEMES[c.theme] || { c1: "#0E9F8A", c2: "#19376D" };
        return `<div class="p-pick-item" data-pick="${esc(c.id)}">
          <span class="p-ci" style="background:linear-gradient(135deg,${th.c1},${th.c2})">${esc(c.short.slice(0, 2).toUpperCase())}</span>
          <div><b>${esc(c.name)}</b><small>📍 ${esc(c.area)}, ${esc(c.district)} · ${esc(c.type)} · ★ ${c.rating}</small></div>
          ${c.id === S.collegeId ? `<span class="p-sug">⭐ Suggested</span>` : ""}
        </div>`;
      }).join("") : `<div style="padding:26px;text-align:center;color:#7B8BA5">College kidaikkala — vera per try pannunga</div>`;
      $$("[data-pick]").forEach(el => el.onclick = () => {
        DB.set("portalCollege", el.dataset.pick);
        college = COLLEGES.find(c => c.id === el.dataset.pick);
        $("#pickOverlay").classList.add("hidden");
        applyBrand(); render();
        toast(college.short + " portal ready! 🏫", "ok");
      });
    }

    function openPicker() {
      $("#pickOverlay").classList.remove("hidden");
      const inp = $("#pickSearch"); inp.value = ""; drawPickList("");
      inp.oninput = () => drawPickList(inp.value);
      setTimeout(() => inp.focus(), 150);
    }

    /* ========================== CALCULATIONS ============================ */
    let paidNow = new Set(DB.get("portalPaid", []));
    const isPaid = it => it.paid || paidNow.has(it.name);
    const feeDue = () => PORTAL.fees.items.filter(it => !isPaid(it)).reduce((s, it) => s + it.amount, 0);

    const totP = PORTAL.subjects.reduce((s, x) => s + x.present, 0);
    const totT = PORTAL.subjects.reduce((s, x) => s + x.total, 0);
    const attPct = Math.round((totP / totT) * 1000) / 10;

    const GP = PORTAL.results.gradePts;
    const semGPA = sem => {
      const cr = sem.subjects.reduce((s, x) => s + x.cr, 0);
      const pts = sem.subjects.reduce((s, x) => s + x.cr * (GP[x.grade] || 0), 0);
      return { cr, gpa: pts / cr };
    };
    const totCr = PORTAL.results.sems.reduce((s, x) => s + semGPA(x).cr, 0);
    const cgpa = (PORTAL.results.sems.reduce((s, x) => s + semGPA(x).gpa * semGPA(x).cr, 0) / totCr);
    const standing = cgpa >= 8.5 ? "First Class with Distinction ✨" : cgpa >= 7.5 ? "First Class 🎓" : "Second Class";

    const dayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const ttDay = PORTAL.timetable.days[dayName] ? dayName : "Monday";
    const dateStr = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" });
    const nowMin = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };
    const perMin = t => {
      const m = t.match(/(\d+):(\d+)\D+(\d+):(\d+)/); if (!m) return null;
      return [+m[1] * 60 + +m[2], +m[3] * 60 + +m[4]];
    };
    const subOf = code => PORTAL.subjects.find(x => x.code === String(code).split(" ")[0]);

    const M = PORTAL.attMonth;
    const mWorked = Array.from({ length: M.today }, (_, i) => i + 1).filter(d => !M.holidays.includes(d)).length;
    const mAbsent = M.absent.filter(d => d <= M.today).length;
    const mPct = Math.round(((mWorked - mAbsent) / mWorked) * 1000) / 10;

    function ciaGrade(cia) {
      const done = cia.filter(v => v != null);
      if (!done.length) return ["—", "g-n"];
      const avg = done.reduce((a, b) => a + b, 0) / done.length;
      if (avg >= 40) return ["O", "g-o"];
      if (avg >= 30) return ["A", "g-a"];
      return ["B+", "g-b"];
    }
    const FEE_ICON = ["🎓", "🏠", "📝", "🚌", "📚"];
    const gChip = g => `<span class="p-grade ${g === "O" || g === "A+" ? "g-o" : g === "A" ? "g-a" : "g-b"}">${esc(g)}</span>`;

    const demoStrip = () => demo ? `<div class="p-strip">💡 <b>Demo view</b> — sample student data. Sign up / sign in panninaa unga per-oda portal theriyum.
      <a class="p-btn p-btn-teal p-btn-sm" href="signup.html">Sign up free</a></div>` : "";

    /* ========================= SHARED PARTIALS ========================== */
    const heroBlock = () => `
      <section class="p-hero">
        <span class="p-avatar big">${esc(firstName.charAt(0).toUpperCase())}</span>
        <div class="p-who">
          <h2>Vanakkam, ${esc(firstName)}! 👋</h2>
          <p>${esc(S.roll)} · ${esc(S.dept)}</p>
          <div class="p-tags">
            <span>🏫 ${esc(college.name)}</span>
            <span>🎓 ${esc(S.year)} · ${esc(S.sem)}</span>
            <span>📚 Section ${esc(S.section)} · Batch ${esc(S.batch)}</span>
            <span>👩‍🏫 Mentor: ${esc(S.mentor)}</span>
          </div>
        </div>
        <div class="p-exam">
          <b>${PORTAL.nextExam.days}</b>
          <small>naal-la ${esc(PORTAL.nextExam.name)}</small>
          <small>🗓 ${esc(PORTAL.nextExam.start)}</small>
        </div>
      </section>`;

    const statsGrid = () => `
      <section class="p-stats">
        <a class="p-stat" href="#attendance"><span class="p-icbox p-teal-i">🗓️</span>
          <div><small>Attendance</small><b>${attPct}%</b><span class="p-sub">${totP}/${totT} classes</span></div></a>
        <a class="p-stat" href="#marks"><span class="p-icbox p-blue-i">🎓</span>
          <div><small>CGPA</small><b>${cgpa.toFixed(2)}</b><span class="p-sub">${PORTAL.results.sems.map(x => x.name.split(" ")[1] + ": " + semGPA(x).gpa.toFixed(2)).join(" · ")}</span></div></a>
        <a class="p-stat" href="#marks"><span class="p-icbox p-amber-i">⭐</span>
          <div><small>Credits done</small><b>${totCr}</b><span class="p-sub">${standing.split(" ")[0]} ${standing.split(" ")[1] || ""}</span></div></a>
        <a class="p-stat" href="#fees"><span class="p-icbox ${feeDue() ? "p-rose-i" : "p-teal-i"}">💳</span>
          <div><small>Fee due</small><b>${feeDue() ? inr(feeDue()) : "₹0 🎉"}</b><span class="p-sub">${feeDue() ? "Fees tab-la pay pannunga" : "ellaam clear"}</span></div></a>
      </section>`;

    const profileChipLink = () => `
      <div class="row" style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap">
        <a class="p-btn p-btn-ghost p-btn-sm" href="#profile">🪪 My personal details</a>
        <a class="p-btn p-btn-ghost p-btn-sm" href="#marks">📝 My marks</a>
        <a class="p-btn p-btn-ghost p-btn-sm" href="#timetable">🕐 Week timetable</a>
      </div>`;

    const ttToday = () => `
      <section class="p-card">
        <div class="p-head"><h3>🕐 Innikki classes — ${esc(ttDay)}</h3><small>${PORTAL.timetable.days[ttDay].filter(x => x && x !== "—").length} periods</small></div>
        ${PORTAL.timetable.days[ttDay].map((code, i) => {
          const t = PORTAL.timetable.times[i]; if (!code || code === "—") return "";
          const sub = subOf(code);
          const mm = perMin(t); const live = mm && ttDay === dayName && nowMin() >= mm[0] && nowMin() < mm[1];
          const pill = live ? `<span class="p-pill live">● LIVE</span>`
            : /\(Lab\)|Club|Training|Project/.test(code) ? `<span class="p-pill lb">${code.includes("(") ? "Lab" : esc(code.split(" ")[0])}</span>`
            : sub ? `<span class="p-pill th">${esc(sub.type)}</span>` : `<span class="p-pill fr">Free</span>`;
          return `<div class="p-tt-row ${live ? "now" : ""}">
            <span class="p-t">P${i + 1} · ${esc(t)}</span>
            <span><b>${esc(sub ? sub.name : code)}</b><small>${esc(code)}${sub ? " · " + esc(sub.staff) : ""}</small></span>
            ${pill}</div>`;
        }).join("")}
        <a class="p-btn p-btn-ghost p-btn-sm" href="#timetable" style="margin-top:8px">Full week timetable →</a>
      </section>`;

    const annList = (limit) => `
      ${PORTAL.announce.slice(0, limit || 99).map(a => {
        const [dd, mm2] = a.date.split(" ");
        return `<div class="p-ann">
          <span class="p-datebox"><b>${esc(dd)}</b><small>${esc(mm2 || "")}</small></span>
          <div><span class="p-tag ${esc(a.tag)}">${a.pin ? '<span class="p-pin">📌</span> ' : ""}${esc(a.tag)}</span>
            <b>${esc(a.title)}</b><p>${esc(a.text)}</p></div></div>`;
      }).join("")}`;

    const attBars = (limit) => PORTAL.subjects.slice(0, limit || 99).map(s => {
      const p = Math.round((s.present / s.total) * 100);
      const cls = p < 75 ? "danger" : p < 85 ? "warn" : "";
      return `<div class="p-att-row ${cls}">
        <b>${esc(s.name)}</b><span class="p-pct" style="color:${p < 75 ? "var(--p-bad)" : p < 85 ? "var(--p-warn)" : "var(--p-teal2)"}">${p}%</span>
        <small>${esc(s.code)} · ${esc(s.staff)} · ${s.present}/${s.total} classes</small>
        <div class="p-bar"><i data-w="${p}"></i></div></div>`;
    }).join("");

    const ciaTable = () => `
      <div style="overflow-x:auto"><table class="p-table">
        <tr><th>Subject</th><th>CIA-1</th><th>CIA-2</th><th>CIA-3</th><th>Grade</th></tr>
        ${PORTAL.subjects.map(s => {
          const [g, gc] = ciaGrade(s.cia);
          return `<tr><td><b>${esc(s.code)}</b><br><small style="color:#7B8BA5">${esc(s.name)}</small></td>
            ${s.cia.map(v => `<td class="p-mono">${v == null ? "—" : v}</td>`).join("")}
            <td><span class="p-grade ${gc}">${g}</span></td></tr>`;
        }).join("")}
      </table></div>`;

    const feeRows = () => PORTAL.fees.items.map((it, i) => `
      <div class="p-fee-row">
        <span class="p-fic ${isPaid(it) ? "p-teal-i" : "p-rose-i"}">${FEE_ICON[i % FEE_ICON.length]}</span>
        <div><b>${esc(it.name)}</b>
          <small>${isPaid(it) ? (it.receipt ? "Receipt " + esc(it.receipt) + " · " + esc(it.date || "") : "Paid ✓ (ippo thaan)") : "Due by " + esc(it.due)}</small></div>
        <span class="p-amt">${inr(it.amount)}<br>
          <span class="${isPaid(it) ? "p-paid" : "p-due"}">${isPaid(it) ? "✓ PAID" : "● PENDING"}</span></span>
      </div>`).join("");

    const feeTotal = () => `
      <div class="p-fee-total">
        <div><small>Total due</small><b>${inr(feeDue())}</b></div>
        ${feeDue() > 0 ? `<button class="p-btn p-btn-teal" id="payNow">💳 Pay now (demo)</button>` : `<span style="font-weight:700;color:var(--p-teal2)">Ella fee-um clear! 🎉</span>`}
      </div>`;

    /* ============================== VIEWS =============================== */
    let semTab = PORTAL.results.sems.length;   /* marks tab — default: current CIA */

    const VIEWS = {

      /* -------------------------- DASHBOARD ---------------------------- */
      dashboard: () => `
        ${demoStrip()}
        ${heroBlock()}
        ${statsGrid()}
        ${profileChipLink()}
        <div class="p-grid">
          ${ttToday()}
          <section class="p-card">
            <div class="p-head"><h3>📢 Announcements</h3><small><a href="#announce">view all →</a></small></div>
            ${annList(3)}
          </section>
        </div>
        <div class="p-grid even">
          <section class="p-card">
            <div class="p-head"><h3>🗓️ Attendance glance</h3><small><a href="#attendance">full →</a></small></div>
            ${attBars(4)}
          </section>
          <section class="p-card">
            <div class="p-head"><h3>📝 CIA marks (this sem)</h3><small><a href="#marks">results →</a></small></div>
            ${ciaTable()}
          </section>
        </div>
        <section class="p-card">
          <div class="p-head"><h3>💳 Fees — ${esc(PORTAL.fees.year)}</h3><small><a href="#fees">details →</a></small></div>
          ${feeTotal()}
        </section>`,

      /* ------------------------- MY PROFILE ---------------------------- */
      profile: () => `
        ${demoStrip()}
        <div class="p-prof">
          <div class="p-idcard">
            <div class="p-id-top">🎓 ${esc(college.name)}<small>${esc(college.area)}, ${esc(college.district)} · Estd ${college.estd}</small></div>
            <div class="p-id-body">
              <span class="p-id-avatar">${esc(firstName.charAt(0).toUpperCase())}</span>
              <h3>${esc(studentName)}</h3>
              <span class="p-id-roll">${esc(S.roll)}</span>
              <div class="p-id-dept">${esc(S.dept)}<br>${esc(S.year)} · ${esc(S.sem)} · Section ${esc(S.section)}</div>
              <div class="p-id-bar"></div>
              <small>REG ${esc(S.regNo)} · VALID ${esc(S.batch)}</small>
            </div>
          </div>
          <div>
            <div style="display:flex;justify-content:flex-end;margin-bottom:12px">
              <button class="p-btn p-btn-teal p-btn-sm" id="editProf">✏️ Edit my details</button>
            </div>
            <section class="p-card" style="margin-bottom:16px">
              <div class="p-head"><h3>🪪 Personal details</h3></div>
              <dl class="p-dl">
                <div class="p-dl-row"><dt>Full name</dt><dd>${esc(studentName)}</dd></div>
                <div class="p-dl-row"><dt>Date of birth</dt><dd>${esc(P.dob)}</dd></div>
                <div class="p-dl-row"><dt>Gender</dt><dd>${esc(P.gender)}</dd></div>
                <div class="p-dl-row"><dt>Blood group</dt><dd>${esc(P.blood)}</dd></div>
                <div class="p-dl-row"><dt>Nationality</dt><dd>${esc(P.nationality)}</dd></div>
                <div class="p-dl-row"><dt>Stay</dt><dd>${esc(P.stay.type)}${P.stay.bus ? " · 🚌 " + esc(P.stay.bus) : ""}</dd></div>
              </dl>
            </section>
            <section class="p-card" style="margin-bottom:16px">
              <div class="p-head"><h3>📞 Contact &amp; address</h3></div>
              <dl class="p-dl">
                <div class="p-dl-row"><dt>Email id</dt><dd>${esc(P.email)}</dd></div>
                <div class="p-dl-row"><dt>Contact number</dt><dd>${esc(P.phone)}</dd></div>
                <div class="p-dl-row full"><dt>Address</dt><dd>${esc(P.address.door)}, ${esc(P.address.area)},<br>${esc(P.address.city)} — ${esc(P.address.pin)}</dd></div>
              </dl>
            </section>
            <section class="p-card" style="margin-bottom:16px">
              <div class="p-head"><h3>👨‍👩‍👧 Parent / Guardian</h3></div>
              <dl class="p-dl">
                <div class="p-dl-row"><dt>Name</dt><dd>${esc(P.parent.name)}</dd></div>
                <div class="p-dl-row"><dt>Relation</dt><dd>${esc(P.parent.relation)}</dd></div>
                <div class="p-dl-row"><dt>Contact</dt><dd>${esc(P.parent.phone)}</dd></div>
                <div class="p-dl-row"><dt>Occupation</dt><dd>${esc(P.parent.occupation)}</dd></div>
              </dl>
            </section>
            <section class="p-card">
              <div class="p-head"><h3>🎓 Academic &amp; admission</h3></div>
              <dl class="p-dl">
                <div class="p-dl-row"><dt>Roll no</dt><dd>${esc(S.roll)}</dd></div>
                <div class="p-dl-row"><dt>Register no</dt><dd>${esc(S.regNo)}</dd></div>
                <div class="p-dl-row"><dt>Programme</dt><dd>${esc(S.dept)}</dd></div>
                <div class="p-dl-row"><dt>Class</dt><dd>${esc(S.year)} · ${esc(S.sem)} · Sec ${esc(S.section)}</dd></div>
                <div class="p-dl-row"><dt>Mentor</dt><dd>${esc(S.mentor)} · ${esc(S.proctorRoom)}</dd></div>
                <div class="p-dl-row"><dt>Admission year</dt><dd>${esc(P.admission.year)} · ${esc(P.admission.mode)}</dd></div>
                <div class="p-dl-row"><dt>12th cut-off</dt><dd>${esc(P.admission.cutoff)}</dd></div>
                <div class="p-dl-row"><dt>Quota</dt><dd>${esc(P.admission.quota)}${P.admission.firstGrad ? `<span class="p-flag">🎓 First Graduate</span>` : ""}</dd></div>
              </dl>
            </section>
          </div>
        </div>`,

      /* --------------------------- MY MARKS ------------------------------ */
      marks: () => `
        ${heroBlock()}
        <section class="p-card" style="margin-bottom:16px">
          <div class="p-cgpa">
            <div class="p-ring">
              <svg width="130" height="130" viewBox="0 0 130 130">
                <defs><linearGradient id="pRingGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" style="stop-color:var(--pc1)"/><stop offset="100%" style="stop-color:var(--pc2)"/>
                </linearGradient></defs>
                <circle class="r-bg" cx="65" cy="65" r="54"></circle>
                <circle class="r-fg" id="ringFg" cx="65" cy="65" r="54" stroke-dasharray="339.3" stroke-dashoffset="339.3"></circle>
              </svg>
              <div class="p-rin"><div><b>${cgpa.toFixed(2)}</b><small>CGPA / 10</small></div></div>
            </div>
            <div class="p-stand">
              <h3 style="margin-bottom:4px">${esc(studentName)}</h3>
              <p style="font-size:.84rem">${esc(S.dept)} · ${esc(S.batch)}</p>
              <p style="margin-top:8px;font-size:.88rem">Credits completed: <b>${totCr}</b> · Programme standing:<br><b>${standing}</b></p>
            </div>
          </div>
        </section>
        <div class="p-tabs">
          ${PORTAL.results.sems.map((s, i) => `<button class="${i === semTab ? "on" : ""}" data-sem="${i}">${esc(s.name)} · GPA ${semGPA(s).gpa.toFixed(2)}</button>`).join("")}
          <button class="${semTab === PORTAL.results.sems.length ? "on" : ""}" data-sem="${PORTAL.results.sems.length}">Sem 3 · CIA (current)</button>
        </div>
        <section class="p-card" id="semCard">
          ${semView()}
        </section>`,

      /* -------------------------- ATTENDANCE --------------------------- */
      attendance: () => `
        ${heroBlock()}
        <section class="p-stats" style="grid-template-columns:repeat(4,1fr)">
          <div class="p-stat"><span class="p-icbox p-teal-i">🗓️</span><div><small>Overall</small><b>${attPct}%</b><span class="p-sub">${totP}/${totT}</span></div></div>
          <div class="p-stat"><span class="p-icbox p-blue-i">📅</span><div><small>This month</small><b>${mPct}%</b><span class="p-sub">${mWorked - mAbsent}/${mWorked} days</span></div></div>
          <div class="p-stat"><span class="p-icbox p-amber-i">🏆</span><div><small>Best subject</small><b style="font-size:1rem">${esc(PORTAL.subjects.reduce((a, b) => (b.present / b.total > a.present / a.total ? b : a)).code)}</b><span class="p-sub">${Math.round(Math.max(...PORTAL.subjects.map(x => x.present / x.total)) * 100)}%</span></div></div>
          <div class="p-stat"><span class="p-icbox p-rose-i">⚠️</span><div><small>Below 75%</small><b>${PORTAL.subjects.filter(s => s.present / s.total < 0.75).length}</b><span class="p-sub">${PORTAL.subjects.filter(s => s.present / s.total < 0.75).map(s => s.code).join(", ") || "—"}</span></div></div>
        </section>
        <div class="p-grid">
          <section class="p-card">
            <div class="p-head"><h3>🗓️ Subject-wise attendance</h3><small>75% kammina danger</small></div>
            ${attBars()}
            ${PORTAL.subjects.some(s => s.present / s.total < 0.75)
              ? `<div class="p-notewarn">⚠️ ${PORTAL.subjects.filter(s => s.present / s.total < 0.75).map(s => esc(s.code)).join(", ")} — 75%-ku kammi. Sem exam eligibility-ku class attend pannunga!</div>` : ""}
          </section>
          <section class="p-card">
            <div class="p-head"><h3>📅 ${esc(M.title)}</h3><small>${mAbsent} absent</small></div>
            <div class="p-cal">
              ${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => `<span class="p-cd">${d}</span>`).join("")}
              ${"<span></span>".repeat({ Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 }[M.start])}
              ${Array.from({ length: M.days }, (_, i) => i + 1).map(d => {
                const cls = M.holidays.includes(d) ? "hol" : d > M.today ? "fut" : M.absent.includes(d) ? "abs" : "pre";
                return `<span class="p-cx ${cls} ${d === M.today ? "tod" : ""}" ${cls === "abs" ? 'title="Leave"' : cls === "hol" ? 'title="Holiday"' : ""}>${d}</span>`;
              }).join("")}
            </div>
            <div class="p-legend">
              <span><i style="background:var(--p-mint)"></i>Present</span>
              <span><i style="background:#FDECEC"></i>Absent</span>
              <span><i style="background:#EEF1F6"></i>Holiday</span>
              <span><i style="background:#fff;border:2px solid var(--p-teal);width:11px;height:11px"></i>Today</span>
            </div>
          </section>
        </div>`,

      /* --------------------------- TIMETABLE --------------------------- */
      timetable: () => `
        ${heroBlock()}
        <section class="p-card">
          <div class="p-head"><h3>🕐 Week timetable — ${esc(S.dept)} · Sec ${esc(S.section)}</h3><small>${esc(S.sem)}</small></div>
          <div class="p-week-wrap"><table class="p-week">
            <tr><th>Day</th>${PORTAL.timetable.times.map((t, i) => `<th>P${i + 1}<br><small style="font-weight:400">${esc(t)}</small></th>`).join("")}</tr>
            ${Object.keys(PORTAL.timetable.days).map(day => `
              <tr class="${day === dayName ? "today" : ""}">
                <th class="${day === dayName ? "day-today" : ""}">${day.slice(0, 3)}${day === dayName ? " ●" : ""}</th>
                ${PORTAL.timetable.days[day].map(code => {
                  if (!code || code === "—") return `<td class="free">—</td>`;
                  const sub = subOf(code);
                  const lab = /\(Lab\)|Club|Training|Project/.test(code);
                  return `<td class="${lab ? "lab" : ""}">${esc(code)}${sub ? `<small>${esc(sub.name)}</small>` : `<small>${esc(code)}</small>`}</td>`;
                }).join("")}
              </tr>`).join("")}
          </table></div>
          <p class="small muted" style="margin-top:10px">● = today · Purple = lab / special class · Breaks: 10:25–10:45 ☕ · 12:25–01:20 🍽</p>
        </section>`,

      /* ------------------------------ FEES ------------------------------- */
      fees: () => `
        ${heroBlock()}
        <section class="p-card">
          <div class="p-head"><h3>💳 Fees — ${esc(PORTAL.fees.year)}</h3><small>demo payment · card illa 😄</small></div>
          ${feeRows()}
          ${feeTotal()}
          <p class="small muted" style="margin-top:12px">Fee related doubt-na accounts office 📞 0452-2482240 · office@${esc(college.website ? college.website.replace(/https?:\/\/(www\.)?/, "") : "college.edu")} (demo)</p>
        </section>`,

      /* -------------------------- ANNOUNCEMENTS -------------------------- */
      announce: () => `
        ${heroBlock()}
        <section class="p-card">
          <div class="p-head"><h3>📢 All announcements</h3><small>${PORTAL.announce.length} updates</small></div>
          ${annList()}
        </section>`,

      /* --------------------------- COLLEGE INFO -------------------------- */
      college: () => {
        const rel = COURSES.filter(x => x.kinds && x.kinds.some(k => college.kinds.includes(k)));
        return `
        ${heroBlock()}
        <section class="p-card" style="margin-bottom:16px">
          <div style="display:grid;grid-template-columns:230px 1fr;gap:20px;align-items:start" class="p-coll">
            <img src="${esc(college.img)}" alt="${esc(college.short)}" style="width:100%;height:170px;object-fit:cover;border-radius:14px">
            <div>
              <h3 style="margin-bottom:6px">🏫 ${esc(college.name)}</h3>
              <p class="small" style="margin-bottom:10px">📍 ${esc(college.area)}, ${esc(college.district)} · ${esc(college.type)} · Estd ${college.estd}</p>
              <p style="font-size:.88rem;margin-bottom:12px">${esc(college.about)}</p>
              <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">
                <span class="p-tag Placement">★ ${college.rating} rating</span>
                <span class="p-tag Library">${college.hostel ? "🏠 Hostel available" : "No hostel"}</span>
                <span class="p-tag Culturals">${college.reviews.toLocaleString("en-IN")}+ reviews</span>
              </div>
              <div style="display:flex;gap:10px;flex-wrap:wrap">
                <a class="p-btn p-btn-teal p-btn-sm" href="${esc(college.website)}" target="_blank" rel="noopener">🌐 College website ↗</a>
                <a class="p-btn p-btn-ghost p-btn-sm" href="college.html?id=${esc(college.id)}">Admission+ full page ↗</a>
                <a class="p-btn p-btn-ghost p-btn-sm" href="https://www.google.com/maps/search/?api=1&query=${college.lat},${college.lng}" target="_blank" rel="noopener">📍 Map ↗</a>
              </div>
            </div>
          </div>
        </section>
        <section class="p-card">
          <div class="p-head"><h3>📚 Intha college-la related courses</h3><small>${rel.length} courses</small></div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${rel.slice(0, 12).map(x => `<a class="p-btn p-btn-ghost p-btn-sm" href="course.html?id=${esc(x.id)}">${esc(x.name)}</a>`).join("")}
          </div>
        </section>`;
      }
    };

    function semView() {
      if (semTab < PORTAL.results.sems.length) {
        const s = PORTAL.results.sems[semTab];
        const g = semGPA(s);
        return `
          <div class="p-head"><h3>📝 ${esc(s.name)} results</h3><small>${esc(s.when)} · ${esc(s.status)}</small></div>
          <div style="overflow-x:auto"><table class="p-table">
            <tr><th>Code</th><th>Subject</th><th>Credits</th><th>Grade</th><th>Points</th></tr>
            ${s.subjects.map(x => `<tr><td class="p-mono">${esc(x.code)}</td><td>${esc(x.name)}</td>
              <td class="p-mono">${x.cr}</td><td>${gChip(x.grade)}</td><td class="p-mono">${(GP[x.grade] || 0)}</td></tr>`).join("")}
            <tr style="background:var(--p-mint)"><td colspan="2"><b>Semester GPA</b></td><td class="p-mono"><b>${g.cr}</b></td><td colspan="2"><b style="color:var(--p-teal2);font-size:1.1rem">${g.gpa.toFixed(2)}</b></td></tr>
          </table></div>`;
      }
      return `
        <div class="p-head"><h3>📝 Semester 3 — CIA internals (in progress)</h3><small>out of 50 · ${esc(PORTAL.nextExam.name)} ${esc(PORTAL.nextExam.start)}-la start</small></div>
        ${ciaTable()}
        <p class="small muted" style="margin-top:10px">CIA average + semester exam sera GPA kaatum. Final result COE portal-la publish aagum (demo).</p>`;
    }

    /* ============================ RENDER ================================ */
    const TAB_TITLES = { dashboard: "Dashboard", profile: "My Profile", marks: "My Marks", attendance: "Attendance", timetable: "Timetable", fees: "Fees", announce: "Announcements", college: "College Info" };
    let tab = TAB_TITLES[location.hash.slice(1)] ? location.hash.slice(1) : "dashboard";

    function render() {
      if (!college) return;
      $("#pTitle").textContent = TAB_TITLES[tab];
      $("#pDate").textContent = dateStr + (tab === "dashboard" && ttDay !== dayName ? " · Monday timetable preview" : "");
      $$("#pMenu a[data-tab]").forEach(a => a.classList.toggle("on", a.dataset.tab === tab));
      const root = $("#portalRoot");
      root.innerHTML = `<div class="p-view">${VIEWS[tab]()}</div>`;
      setTimeout(() => $$(".p-bar i", root).forEach(b => b.style.width = b.dataset.w + "%"), 200);
      const ring = $("#ringFg");
      if (ring) setTimeout(() => { ring.style.strokeDashoffset = (339.3 * (1 - cgpa / 10)).toFixed(1); }, 250);
      bindView(); window.scrollTo({ top: 0 });
    }

    function bindView() {
      $$("[data-sem]").forEach(b => b.onclick = () => { semTab = +b.dataset.sem; render(); });
      const ep = $("#editProf"); if (ep) ep.onclick = openEdit;
      const pay = $("#payNow"); if (pay) pay.onclick = openPay;
    }

    /* ---------------------- EDIT PROFILE MODAL ------------------------- */
    function openEdit() {
      const back = modal("✏️ Edit my details", `
        ${demo ? `<p class="small" style="margin-bottom:10px;color:#8A5A00">Demo student — changes browser-la mattum save aagum.</p>` : ""}
        <div class="field"><label>Contact number</label><input class="input" id="efPhone" value="${esc(P.phone)}"></div>
        <div class="field"><label>Email ${demo ? "" : "(account-la irundhu — change panna mudiyaadhu)"}</label><input class="input" id="efEmail" value="${esc(P.email)}" ${demo ? "" : "disabled"}></div>
        <div class="row" style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div class="field"><label>Date of birth</label><input class="input" id="efDob" value="${esc(P.dob)}"></div>
          <div class="field"><label>Gender</label><select class="select" id="efGender">${["Female", "Male", "Other"].map(g => `<option ${P.gender === g ? "selected" : ""}>${g}</option>`).join("")}</select></div>
        </div>
        <div class="row" style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div class="field"><label>Blood group</label><input class="input" id="efBlood" value="${esc(P.blood)}"></div>
          <div class="field"><label>Stay</label><select class="select" id="efStay">${["Day Scholar", "Hosteller"].map(g => `<option ${P.stay.type === g ? "selected" : ""}>${g}</option>`).join("")}</select></div>
        </div>
        <div class="field"><label>Address (door &amp; street)</label><input class="input" id="efDoor" value="${esc(P.address.door)}"></div>
        <div class="row" style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div class="field"><label>Area</label><input class="input" id="efArea" value="${esc(P.address.area)}"></div>
          <div class="field"><label>Pincode</label><input class="input" id="efPin" value="${esc(P.address.pin)}"></div>
        </div>
        <div class="row" style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div class="field"><label>Parent / Guardian name</label><input class="input" id="efPname" value="${esc(P.parent.name)}"></div>
          <div class="field"><label>Parent contact</label><input class="input" id="efPphone" value="${esc(P.parent.phone)}"></div>
        </div>`,
        `<button class="btn btn-ghost" data-x>Cancel</button><button class="p-btn p-btn-teal" id="efSave">Save changes</button>`);
      back.querySelector("#efSave").onclick = () => {
        const q = s => back.querySelector(s).value.trim();
        P.phone = q("#efPhone") || P.phone;
        if (demo) P.email = q("#efEmail") || P.email;
        P.dob = q("#efDob") || P.dob;
        P.gender = q("#efGender"); P.blood = q("#efBlood") || P.blood;
        P.stay.type = q("#efStay"); P.address.door = q("#efDoor") || P.address.door;
        P.address.area = q("#efArea") || P.address.area; P.address.pin = q("#efPin") || P.address.pin;
        P.parent.name = q("#efPname") || P.parent.name; P.parent.phone = q("#efPphone") || P.parent.phone;
        DB.set(profKey, { email: P.email, phone: P.phone, dob: P.dob, gender: P.gender, blood: P.blood,
          address: { door: P.address.door, area: P.address.area, pin: P.address.pin },
          parent: { name: P.parent.name, phone: P.parent.phone }, stay: { type: P.stay.type } });
        back.remove(); toast("Details save aagiduchu ✓", "ok"); render();
      };
    }

    /* ------------------------- PAY NOW MODAL --------------------------- */
    function openPay() {
      const due = PORTAL.fees.items.filter(it => !isPaid(it));
      const back = modal("💳 Fee Payment (Demo)", `
        <p class="small" style="margin-bottom:10px">Intha pending items pay panna poreenga:</p>
        ${due.map(it => `<div class="p-rc"><span>${esc(it.name)}</span><b>${inr(it.amount)}</b></div>`).join("")}
        <div class="p-rc" style="border-bottom:0;font-size:1.02rem"><b>Total</b><b style="color:var(--p-teal2)">${inr(due.reduce((s, x) => s + x.amount, 0))}</b></div>
        <p class="small" style="margin-top:12px;color:#7B8BA5">⚠️ Ithu demo — nijha portal-la ithu payment gateway (UPI / card) kku connect aagum.</p>`,
        `<button class="btn btn-ghost" data-x>Cancel</button><button class="p-btn p-btn-teal" id="payOk">✓ Confirm pay</button>`);
      back.querySelector("#payOk").onclick = () => {
        due.forEach(it => paidNow.add(it.name));
        DB.set("portalPaid", [...paidNow]);
        back.remove(); toast("Payment success! Receipt mail-la varum (demo) 🎉", "ok");
        render();
      };
    }

    /* ============================ NAV WIRING ============================ */
    $$("#pMenu a[data-tab]").forEach(a => a.onclick = () => {
      tab = a.dataset.tab; location.hash = tab;
      document.body.classList.remove("p-menu-open"); render();
    });
    window.addEventListener("hashchange", () => {
      const t = location.hash.slice(1);
      if (TAB_TITLES[t] && t !== tab) { tab = t; render(); }
    });
    $("#changeCollege").onclick = () => openPicker();
    const burger = $("#pBurger"); if (burger) burger.onclick = () => document.body.classList.toggle("p-menu-open");
    const dim = $("#pDim"); if (dim) dim.onclick = () => document.body.classList.remove("p-menu-open");

    /* Top bar right — demo chip / avatar */
    $("#pTopRight").innerHTML = demo
      ? `<span class="p-chip-demo">👀 Demo view</span><a class="p-btn p-btn-teal p-btn-sm" href="login.html?next=portal.html">Sign in</a>`
      : `<span class="p-avatar" title="${esc(studentName)}">${esc(firstName.charAt(0).toUpperCase())}</span>
         <button class="p-btn p-btn-ghost p-btn-sm" id="pLogout">Logout</button>`;
    const lo = $("#pLogout");
    if (lo) lo.onclick = () => { DB.del("session"); toast("Portal-la irundhu logout aagiduchu!", "ok"); setTimeout(() => location.href = "index.html", 600); };

    $("#pDate").textContent = dateStr;

    /* ============================== START =============================== */
    if (!college) openPicker(); else { applyBrand(); render(); }
  });
})();
