/* ==========================================================================
   5. js/portal.js  —  STUDENT PORTAL-ODA BRAIN
   --------------------------------------------------------------------------
   Ithu portal.html-la mattum load aagum. app.js-la irundhu window.ADM helpers
   (toast, modal, DB, getUser, esc) eduthukkum.
   - Login pannirundhaa  → unga PER varum
   - Illainaa            → DEMO view (sign in panna button-oda)
   Ella data-um js/data.js-la PORTAL object-la irundhu varum.
   Pudhu subject / fee / announcement add panna → data.js-la oru line pothum!
   ========================================================================== */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const A = window.ADM; if (!A || typeof PORTAL === "undefined") return;
    const { toast, modal, DB, esc } = A;
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
    const inr = n => "₹" + Number(n).toLocaleString("en-IN");

    const user = A.getUser();
    const demo = !user;
    const S = PORTAL.student;
    const studentName = user ? user.name : S.name;
    const firstName = studentName.split(" ")[0];

    /* Fee — user "pay now" click panna item-ngal browser-la save aagum */
    const portalPaid = DB.get("portalPaid", []);
    const isPaid = it => it.paid || portalPaid.includes(it.name);
    const feeDue = PORTAL.fees.items.filter(it => !isPaid(it)).reduce((s, it) => s + it.amount, 0);

    /* Overall attendance + CGPA kanakku */
    const totP = PORTAL.subjects.reduce((s, x) => s + x.present, 0);
    const totT = PORTAL.subjects.reduce((s, x) => s + x.total, 0);
    const attPct = Math.round((totP / totT) * 1000) / 10;
    const cgCredits = PORTAL.sems.reduce((s, x) => s + x.credits, 0);
    const cgpa = (PORTAL.sems.reduce((s, x) => s + x.gpa * x.credits, 0) / cgCredits).toFixed(2);

    /* Inniki enna vaaram? (Sunday-naa Monday timetable kaatum) */
    const dayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const ttDay = PORTAL.timetable.days[dayName] ? dayName : "Monday";
    const dateStr = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" });

    /* Ipo ethanaavadhu period? (live highlight-ku) */
    const nowMin = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };
    const perMin = t => {
      const m = t.match(/(\d+):(\d+)\D+(\d+):(\d+)/); if (!m) return null;
      return [+m[1] * 60 + +m[2], +m[3] * 60 + +m[4]];
    };

    /* Subject code mathiri "CS305 (Lab)" → data-la irukkura subject */
    const subOf = code => PORTAL.subjects.find(x => x.code === code.split(" ")[0]);

    /* CIA average → grade chip */
    function ciaGrade(cia) {
      const done = cia.filter(v => v != null);
      if (!done.length) return ["—", "g-n"];
      const avg = done.reduce((a, b) => a + b, 0) / done.length;
      if (avg >= 40) return ["O", "g-o"];
      if (avg >= 30) return ["A", "g-a"];
      return ["B+", "g-b"];
    }

    const FEE_ICON = ["🎓", "🏠", "📝", "🚌", "📚"];

    /* ============================ RENDER ================================ */
    $("#pDate").textContent = dateStr + (ttDay !== dayName ? " · (Monday timetable preview)" : "");
    $("#pCollegeName").textContent = "CSE · Sem 3";
    $("#pTopRight").innerHTML = demo
      ? `<span class="p-chip-demo">👀 Demo view</span><a class="p-btn p-btn-teal p-btn-sm" href="login.html?next=portal.html">Sign in</a>`
      : `<span class="p-avatar" title="${esc(studentName)}">${esc(firstName.charAt(0).toUpperCase())}</span>
         <button class="p-btn p-btn-ghost p-btn-sm" id="pLogout">Logout</button>`;
    const lo = $("#pLogout");
    if (lo) lo.onclick = () => { DB.del("session"); toast("Portal-la irundhu logout aagiduchu!", "ok"); setTimeout(() => location.href = "index.html", 600); };

    const root = $("#portalRoot");
    root.innerHTML = `
      ${demo ? `<div class="p-strip">💡 <b>Demo view</b> — ithu oru sample student data. Sign up / sign in panninaa unga per-oda portal theriyum.
        <a class="p-btn p-btn-teal p-btn-sm" href="signup.html">Sign up free</a></div>` : ""}

      <!-- WELCOME -->
      <section class="p-hero">
        <span class="p-avatar big">${esc(firstName.charAt(0).toUpperCase())}</span>
        <div class="p-who">
          <h2>Vanakkam, ${esc(firstName)}! 👋</h2>
          <p>${esc(S.roll)} · ${esc(S.dept)}</p>
          <div class="p-tags">
            <span>🎓 ${esc(S.year)} · ${esc(S.sem)}</span>
            <span>📚 Section ${esc(S.section)} · Batch ${esc(S.batch)}</span>
            <span>👩‍🏫 Mentor: ${esc(S.mentor)}</span>
            <span>🏫 ${esc(S.college)}</span>
          </div>
        </div>
        <div class="p-exam">
          <b>${PORTAL.nextExam.days}</b>
          <small>naal-la ${esc(PORTAL.nextExam.name)}</small>
          <small>🗓 ${esc(PORTAL.nextExam.start)}</small>
        </div>
      </section>

      <!-- STATS -->
      <section class="p-stats">
        <div class="p-stat"><span class="p-icbox p-teal-i">🗓️</span>
          <div><small>Attendance</small><b>${attPct}%</b><span class="p-sub">${totP}/${totT} classes</span></div></div>
        <div class="p-stat"><span class="p-icbox p-blue-i">🎓</span>
          <div><small>CGPA (Sem 1–2)</small><b>${cgpa}</b><span class="p-sub">${PORTAL.sems.map(x => x.sem.split(" ")[1] + ": " + x.gpa).join(" · ")}</span></div></div>
        <div class="p-stat"><span class="p-icbox p-amber-i">⭐</span>
          <div><small>Credits done</small><b>${cgCredits}</b><span class="p-sub">Anna Univ pattern</span></div></div>
        <div class="p-stat"><span class="p-icbox ${feeDue ? "p-rose-i" : "p-teal-i"}">💳</span>
          <div><small>Fee due</small><b>${feeDue ? inr(feeDue) : "₹0 🎉"}</b><span class="p-sub">${feeDue ? "keezha pay pannunga" : "ellaam clear"}</span></div></div>
      </section>

      <!-- TODAY TIMETABLE + LIVE -->
      <div class="p-grid">
        <section class="p-card">
          <div class="p-head"><h3>🕐 Innikki classes — ${esc(ttDay)}</h3><small>${PORTAL.timetable.days[ttDay].length} periods</small></div>
          ${PORTAL.timetable.days[ttDay].map((code, i) => {
            const t = PORTAL.timetable.times[i]; if (!code || code === "—") return "";
            const sub = subOf(code);
            const mm = perMin(t); const live = mm && ttDay === dayName && nowMin() >= mm[0] && nowMin() < mm[1];
            const pill = live ? `<span class="p-pill live">● LIVE</span>`
              : /Lab|Project|Club|Training/.test(code) ? `<span class="p-pill lb">${esc(code.includes("(") ? "Lab" : code.split(" ")[0])}</span>`
              : sub ? `<span class="p-pill th">${esc(sub.type)}</span>` : `<span class="p-pill fr">Free</span>`;
            return `<div class="p-tt-row ${live ? "now" : ""}">
              <span class="p-t">P${i + 1} · ${esc(t)}</span>
              <span><b>${esc(sub ? sub.name : code)}</b><small>${esc(code)}${sub ? " · " + esc(sub.staff) : ""}</small></span>
              ${pill}</div>`;
          }).join("")}
        </section>

        <!-- ANNOUNCEMENTS -->
        <section class="p-card">
          <div class="p-head"><h3>📢 Announcements</h3><small>${PORTAL.announce.length} pudhusu</small></div>
          ${PORTAL.announce.map(a => {
            const [dd, mm2] = a.date.split(" ");
            return `<div class="p-ann">
              <span class="p-datebox"><b>${esc(dd)}</b><small>${esc(mm2 || "")}</small></span>
              <div><span class="p-tag ${esc(a.tag)}">${a.pin ? '<span class="p-pin">📌</span> ' : ""}${esc(a.tag)}</span>
                <b>${esc(a.title)}</b><p>${esc(a.text)}</p></div></div>`;
          }).join("")}
        </section>
      </div>

      <div class="p-grid even">
        <!-- ATTENDANCE BY SUBJECT -->
        <section class="p-card">
          <div class="p-head"><h3>🗓️ Subject-wise attendance</h3><small>75% kammina danger ⚠️</small></div>
          ${PORTAL.subjects.map(s => {
            const p = Math.round((s.present / s.total) * 100);
            const cls = p < 75 ? "danger" : p < 85 ? "warn" : "";
            return `<div class="p-att-row ${cls}">
              <b>${esc(s.name)}</b><span class="p-pct" style="color:${p < 75 ? "var(--p-bad)" : p < 85 ? "var(--p-warn)" : "var(--p-teal2)"}">${p}%</span>
              <small>${esc(s.code)} · ${esc(s.staff)} · ${s.present}/${s.total} classes</small>
              <div class="p-bar"><i data-w="${p}"></i></div></div>`;
          }).join("")}
          ${PORTAL.subjects.some(s => s.present / s.total < 0.75)
            ? `<div class="p-notewarn">⚠️ ${PORTAL.subjects.filter(s => s.present / s.total < 0.75).map(s => esc(s.code)).join(", ")} — 75%-ku kammi. Sem exam eligibility-ku class attend pannunga!</div>` : ""}
        </section>

        <!-- CIA MARKS -->
        <section class="p-card">
          <div class="p-head"><h3>📝 CIA marks (internal)</h3><small>out of 50</small></div>
          <div style="overflow-x:auto">
          <table class="p-table">
            <tr><th>Subject</th><th>CIA-1</th><th>CIA-2</th><th>CIA-3</th><th>Grade</th></tr>
            ${PORTAL.subjects.map(s => {
              const [g, gc] = ciaGrade(s.cia);
              return `<tr><td><b>${esc(s.code)}</b><br><small style="color:#7B8BA5">${esc(s.name)}</small></td>
                ${s.cia.map(v => `<td class="p-mono">${v == null ? "—" : v}</td>`).join("")}
                <td><span class="p-grade ${gc}">${g}</span></td></tr>`;
            }).join("")}
          </table></div>
        </section>
      </div>

      <!-- FEES -->
      <section class="p-card">
        <div class="p-head"><h3>💳 Fees — ${esc(PORTAL.fees.year)}</h3><small>demo payment · card illa 😄</small></div>
        ${PORTAL.fees.items.map((it, i) => `
          <div class="p-fee-row">
            <span class="p-fic ${isPaid(it) ? "p-teal-i" : "p-rose-i"}">${FEE_ICON[i % FEE_ICON.length]}</span>
            <div><b>${esc(it.name)}</b>
              <small>${isPaid(it) ? (it.receipt ? "Receipt " + esc(it.receipt) + " · " + esc(it.date || "") : "Paid ✓ (ippo thaan)") : "Due by " + esc(it.due)}</small></div>
            <span class="p-amt">${inr(it.amount)}<br>
              <span class="${isPaid(it) ? "p-paid" : "p-due"}">${isPaid(it) ? "✓ PAID" : "● PENDING"}</span></span>
          </div>`).join("")}
        <div class="p-fee-total">
          <div><small>Total due</small><b>${inr(feeDue)}</b></div>
          ${feeDue > 0 ? `<button class="p-btn p-btn-teal" id="payNow">💳 Pay now (demo)</button>` : `<span style="font-weight:700;color:var(--p-teal2)">Ella fee-um clear! 🎉</span>`}
        </div>
      </section>`;

    /* Progress bars animate */
    setTimeout(() => $$(".p-bar i", root).forEach(b => b.style.width = b.dataset.w + "%"), 250);

    /* ------------------- PAY NOW (DEMO) MODAL ------------------- */
    const payBtn = $("#payNow");
    if (payBtn) payBtn.onclick = () => {
      const due = PORTAL.fees.items.filter(it => !isPaid(it));
      const back = modal("💳 Fee Payment (Demo)", `
        <p class="small" style="margin-bottom:10px">Intha pending items pay panna poreenga:</p>
        ${due.map(it => `<div class="p-rc"><span>${esc(it.name)}</span><b>${inr(it.amount)}</b></div>`).join("")}
        <div class="p-rc" style="border-bottom:0;font-size:1.02rem"><b>Total</b><b style="color:var(--p-teal2)">${inr(due.reduce((s, x) => s + x.amount, 0))}</b></div>
        <p class="small" style="margin-top:12px;color:#7B8BA5">⚠️ Ithu demo — sathiyamaana payment illa. Nijha portal-la ithu payment gateway (UPI/card) kku connect aagum.</p>`,
        `<button class="btn btn-ghost" data-x>Cancel</button><button class="p-btn p-btn-teal" id="payOk">✓ Confirm pay</button>`);
      back.querySelector("#payOk").onclick = () => {
        DB.set("portalPaid", portalPaid.concat(due.map(it => it.name)));
        back.remove(); toast("Payment success! Receipt mail-la varum (demo) 🎉", "ok");
        setTimeout(() => location.reload(), 900);
      };
    };

    /* ------------------- SIDEBAR / SOON LINKS ------------------- */
    const burger = $("#pBurger");
    if (burger) burger.onclick = () => document.body.classList.toggle("p-menu-open");
    const dim = $("#pDim");
    if (dim) dim.onclick = () => document.body.classList.remove("p-menu-open");
    $$("[data-soon]").forEach(a => a.onclick = () => {
      document.body.classList.remove("p-menu-open");
      const name = a.textContent.replace(/soon/gi, "").trim();
      toast(name + " page — next update-la varum 🚧 (un vote-a sollunga!)", "");
    });
  });
})();
