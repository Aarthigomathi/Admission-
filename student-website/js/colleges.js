/* ==========================================================================
   js/colleges.js — College listing + detail modal + nav
   Register panna student-ku full details; illainaa register banner varum.
   ========================================================================== */

/* top-nav right side (user chip / register button) */
function SW_NAV(page) {
  const u = SW.Users.current();
  const el = document.getElementById("navRight");
  if (!el) return;
  el.innerHTML = u
    ? `<span class="user-chip"><span class="av">${u.name.charAt(0).toUpperCase()}</span>${u.name.split(" ")[0].replace(/</g, "")}</span>
       <button class="btn btn-ghost btn-sm" id="swOut">${SW.icon("x")}Logout</button>`
    : `<a class="btn btn-gold btn-sm" href="register.html">${SW.icon("cap")}Register Free</a>`;
  const out = document.getElementById("swOut");
  if (out) out.onclick = () => { SW.Users.setCurrent(null); SW.toast("Logout aagiduchu"); setTimeout(() => location.href = "index.html", 700); };
}

/* ------------------------- college card ------------------------- */
function clgCard(c, locked) {
  return `
  <article class="clg-card">
    <div class="clg-top">
      <button class="fav" title="Rating ${c.rating}">${SW.icon("star")}</button>
      <span class="clg-logo">${c.short.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase()}</span>
    </div>
    <div class="clg-body">
      <h3>${c.name}</h3>
      <div class="loc">${SW.icon("pin")}${c.area}, ${c.district} · ${c.type} · Estd ${c.estd}</div>
      <div class="clg-stats">
        <div><b>${c.placement}</b><span>Placement</span></div>
        <div><b>${c.rating}</b><span>Rating</span></div>
        <div><b>${c.hostel ? "Yes" : "No"}</b><span>Hostel</span></div>
      </div>
      <div class="clg-tags">${c.courses.slice(0, 3).map(x => `<span>${x}</span>`).join("")}${c.courses.length > 3 ? `<span>+${c.courses.length - 3} more</span>` : ""}</div>
      <div class="clg-foot">
        <button class="btn btn-primary btn-sm" data-view="${c.id}">${SW.icon("eye")}${locked ? "Register to View" : "View Details"}</button>
      </div>
    </div>
  </article>`;
}

/* ------------------------- detail modal ------------------------- */
function clgModal(c, locked) {
  const back = document.createElement("div");
  back.className = "dlg-back";
  back.innerHTML = `
  <div class="dlg">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
        <div style="display:flex;gap:12px;align-items:center">
        <span class="clg-logo" style="position:static;border:0;width:46px;height:46px;border-radius:12px">${c.short.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase()}</span>
        <div><h3>${c.name}</h3><div class="small muted" style="display:flex;align-items:center;gap:4px">${SW.icon("pin")}<span>${c.area}, ${c.district}</span></div></div>
      </div>
      <button class="btn btn-ghost btn-sm" data-x>${SW.icon("x")}</button>
    </div>

    ${locked ? `
      <div class="dlg-sec" style="text-align:center;padding:26px 12px;background:var(--cream);border-radius:16px">
        <b style="font-size:1.02rem">Full details paaka — free-a register pannunga</b>
        <p class="small muted" style="margin:7px 0 15px">OTP verified student account create pannunga — fees, placement, courses details ellam theriyum.</p>
        <a class="btn btn-gold" href="register.html">${SW.icon("cap")}Student Registration</a>
      </div>` : `
      <div class="dlg-sec"><h4>About</h4><p class="small">${c.about}</p></div>
      <div class="dlg-sec"><h4>Key Details</h4>
        <dl class="dl">
          <dt>Type</dt><dd>${c.type}</dd>
          <dt>Established</dt><dd>${c.estd}</dd>
          <dt>Rating</dt><dd>${c.rating} / 5</dd>
          <dt>Hostel</dt><dd>${c.hostel ? "Available" : "Not available"}</dd>
        </dl></div>
      <div class="dlg-sec"><h4>Fees &amp; Placement</h4>
        <dl class="dl">
          <dt>Fees</dt><dd>${c.fee}</dd>
          <dt>Placement</dt><dd>${c.placement} placed</dd>
          <dt>Highest pkg</dt><dd>${c.highest}</dd>
        </dl></div>
      <div class="dlg-sec"><h4>Courses Offered</h4>
        <div class="clg-tags">${c.courses.map(x => `<span>${x}</span>`).join("")}</div></div>`}

    <div style="display:flex;justify-content:flex-end;margin-top:18px"><button class="btn btn-primary btn-sm" data-x>Close</button></div>
  </div>`;
  back.onclick = e => { if (e.target === back || e.target.closest("[data-x]")) back.remove(); };
  document.body.appendChild(back);
}

function bindClgCards(locked, scope) {
  (scope || document).querySelectorAll("[data-view]").forEach(b => b.onclick = () => {
    const c = COLLEGES.find(x => x.id === b.dataset.view);
    if (c) clgModal(c, locked);
  });
}

/* ------------------------- colleges page ------------------------- */
function CLG_PAGE() {
  const u = SW.Users.current();
  const locked = !u;
  const banner = document.getElementById("regBanner");

  if (locked) {
    banner.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;background:#FFF7E8;border:2px solid var(--gold);border-radius:16px;padding:13px 18px;margin-top:16px">
        ${SW.icon("shield")}
        <div style="flex:1;min-width:220px"><b>Card click panna — mudhalla register pannunga</b>
        <div class="small">College card-la "Register to View" click pannunga — free student account (OTP verified) create panni full details paakkalam.</div></div>
        <a class="btn btn-gold btn-sm" href="register.html">Register Free</a>
      </div>`;
  } else {
    document.getElementById("clgSub").innerHTML = `Vanakkam <b>${u.name.split(" ")[0].replace(/</g, "")}</b>! Ungal qualification: <b>${u.qualification.toUpperCase()}</b> — ell college details-um open.`,
    banner.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;background:var(--ok-bg);border:2px solid #A7F3D0;border-radius:16px;padding:12px 18px;margin-top:16px">
        <span style="color:var(--ok)">${SW.icon("checkcircle")}</span>
        <div class="small" style="color:#065F46"><b>OTP verified account</b> — ${u.email.replace(/</g, "")} · ${u.mobile} · Registered on ${new Date(u.createdAt).toLocaleDateString("en-IN")}</div>
      </div>`;
  }

  const grid = document.getElementById("clgGrid");
  const draw = list => { grid.innerHTML = list.map(c => clgCard(c, locked)).join(""); bindClgCards(locked, grid); };
  draw(COLLEGES);

  const inp = document.getElementById("clgSearch");
  inp.oninput = () => {
    const q = inp.value.trim().toLowerCase();
    draw(!q ? COLLEGES : COLLEGES.filter(c =>
      (c.name + " " + c.district + " " + c.type + " " + c.courses.join(" ")).toLowerCase().includes(q)));
  };
}
