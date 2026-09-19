/* ==========================================================================
   3. js/app.js  —  IDHU THAAN WEBSITE-ODA "BRAIN"
   --------------------------------------------------------------------------
   Signup / Login / Search / Filter / Map / Review / Dashboard — ellaa
   velaiyum inge thaan nadakkum. data.js-la irukkira college details-ai
   eduthu HTML page-la kaatum.
   ========================================================================== */
(function () {
  "use strict";

  /* ---------------------- 3.1 CHINNA HELPER FUNCTIONS ------------------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const qs = (k) => new URLSearchParams(location.search).get(k) || "";
  const stars = n => "★★★★★".slice(0, Math.round(n)) + "☆☆☆☆☆".slice(0, 5 - Math.round(n));
  const inr = n => "₹" + Number(n).toLocaleString("en-IN");

  /* ------------------------- 3.2 LOCAL STORAGE -------------------------- */
  const MEM = {};               /* localStorage block aanaal ithu use aagum */
  let STORAGE_OK = true;
  try { localStorage.setItem("adm_test", "1"); localStorage.removeItem("adm_test"); } catch (e) { STORAGE_OK = false; }
  const DB = {
    get(k, d) {
      try { const v = localStorage.getItem("adm_" + k); return v == null ? (k in MEM ? MEM[k] : d) : JSON.parse(v); }
      catch (e) { return k in MEM ? MEM[k] : d; }
    },
    set(k, v) {
      MEM[k] = v;
      try { localStorage.setItem("adm_" + k, JSON.stringify(v)); } catch (e) {}
    },
    del(k) { delete MEM[k]; try { localStorage.removeItem("adm_" + k); } catch (e) {} },
    ok: () => STORAGE_OK
  };
  const getUser = () => DB.get("session", null);
  const allUsers = () => DB.get("users", []);
  const savedIds = () => DB.get("saved", []);
  const compareIds = () => DB.get("compare", []);

  /* ---------------------------- 3.3 TOAST ------------------------------ */
  function toast(msg, type = "") {
    let w = $(".toast-wrap");
    if (!w) { w = document.createElement("div"); w.className = "toast-wrap"; document.body.appendChild(w); }
    const t = document.createElement("div");
    t.className = "toast " + type;
    t.innerHTML = (type === "ok" ? "✅ " : type === "bad" ? "⚠️ " : "💡 ") + esc(msg);
    w.appendChild(t);
    setTimeout(() => { t.style.opacity = "0"; t.style.transform = "translateX(30px)"; t.style.transition = ".35s"; }, 2600);
    setTimeout(() => t.remove(), 3100);
  }

  function modal(title, html, footerHtml) {
    const back = document.createElement("div");
    back.className = "modal-back";
    back.innerHTML = `<div class="modal"><div class="row-between" style="margin-bottom:14px">
        <h3>${title}</h3><button class="btn btn-ghost btn-sm" data-x>✕</button></div>
        <div>${html}</div>${footerHtml ? `<div class="row" style="margin-top:18px;justify-content:flex-end;gap:10px">${footerHtml}</div>` : ""}</div>`;
    back.addEventListener("click", e => { if (e.target === back || e.target.hasAttribute("data-x")) back.remove(); });
    document.body.appendChild(back);
    return back;
  }

  /* ---------------------------- 3.4 GMAP -------------------------------- */
  /* Google Maps connect. Geoapify API key irundhaa adha use pannum, illainaa
     key illaamal work aagura Google Maps embed use pannum.                  */
  const gkey = () => DB.get("geoapify_key", "") || window.GEOAPIFY_KEY || "";
  function mapEmbed(lat, lng, zoom = 15) {
    const k = gkey();
    if (k) return `<img alt="map" style="width:100%;height:380px;object-fit:cover;display:block"
      src="https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=900&height=520&center=lonlat:${lng},${lat}&zoom=${zoom}&marker=lonlat:${lng},${lat};color:%23E2372B;size:large&apiKey=${k}">`;
    return `<iframe title="Google Map" src="https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&hl=ta&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
  }
  const mapLink = (lat, lng) => `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const dirLink = (lat, lng) => `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;

  /* --------------------------- 3.5 NAVBAR ------------------------------ */
  const NAV = [
    ["index.html", "Home"], ["colleges.html", "Colleges"], ["courses.html", "Courses"],
    ["districts.html", "Districts"], ["map.html", "Map"], ["events.html", "Events"]
  ];
  function renderNav() {
    const root = $("#nav-root"); if (!root) return;
    const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    const u = getUser();
    root.innerHTML = `
    <header class="nav">
      <div class="wrap nav-in">
        <a class="brand" href="index.html">
          <span class="brand-mark">Aa</span>
          <span>Admission<span style="color:var(--c1)">+</span><small>Tamil Nadu College Guide</small></span>
        </a>
        <nav class="nav-links" id="navLinks">
          ${NAV.map(([h, t]) => `<a href="${h}" class="${page === h ? "on" : ""}">${t}</a>`).join("")}
          ${u ? `<a href="dashboard.html" class="${page === "dashboard.html" ? "on" : ""}">Dashboard</a>` : ""}
        </nav>
        <div class="nav-right">
          ${u ? `<a class="nav-user" href="dashboard.html" title="My dashboard">
                  <span class="avatar">${esc(u.name.charAt(0).toUpperCase())}</span>
                  <span class="uname">${esc(u.name.split(" ")[0])}</span></a>
                 <button class="btn btn-ghost btn-sm" id="logoutBtn">Logout</button>`
               : `<a class="btn btn-ghost btn-sm" href="login.html">Sign in</a>
                  <a class="btn btn-primary btn-sm" href="signup.html">Sign up free</a>`}
          <button class="burger" id="burger" aria-label="Menu"><span></span><span></span><span></span></button>
        </div>
      </div>
    </header>`;
    const b = $("#burger"), links = $("#navLinks");
    if (b) b.onclick = () => links.classList.toggle("open");
    const lo = $("#logoutBtn");
    if (lo) lo.onclick = () => { DB.del("session"); toast("Logout aagiduchu. Meendum varunga!", "ok"); setTimeout(() => location.href = "index.html", 600); };
  }

  function renderFooter() {
    const root = $("#foot-root"); if (!root) return;
    root.innerHTML = `
    <footer class="foot">
      <div class="wrap">
        <div class="foot-grid">
          <div>
            <a class="brand" href="index.html" style="margin-bottom:12px">
              <span class="brand-mark">Aa</span><span style="color:#fff">Admission+<small>Tamil Nadu College Guide</small></span>
            </a>
            <p style="color:#A9B1C2;font-size:.88rem">Tamil Nadu-la 10th mudicha pillaikku diploma, 12th mudicha pillaikku degree,
            PG padikka poravangalukku university — ovvoru district-lum irukkira college details, courses, fees, placement,
            student reviews ellame oru idathula.</p>
            <div class="social" style="margin-top:16px">
              <a href="#" title="Instagram">IG</a><a href="#" title="WhatsApp">WA</a>
              <a href="#" title="YouTube">YT</a><a href="#" title="Telegram">TG</a>
            </div>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul class="foot-list">
              ${NAV.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join("")}
              <li><a href="compare.html">Compare Colleges</a></li>
            </ul>
          </div>
          <div>
            <h4>By Level</h4>
            <ul class="foot-list">
              <li><a href="courses.html?level=10th">After 10th — Diploma / ITI</a></li>
              <li><a href="courses.html?level=12th">After 12th — Degree</a></li>
              <li><a href="courses.html?level=PG">PG Courses</a></li>
              <li><a href="colleges.html?kinds=engineering">Engineering Colleges</a></li>
              <li><a href="colleges.html?kinds=medical">Medical Colleges</a></li>
            </ul>
          </div>
          <div>
            <h4>Ungal Ooru</h4>
            <p style="color:#A9B1C2;font-size:.86rem;margin-bottom:10px">District-a select pannunga — pakkathula irukkira colleges distance-oda kaattum.</p>
            <select class="select" id="footDistrict" style="background:#1D2029;color:#fff;border-color:#2A2F3B">
              <option value="">Ooru / District select pannunga</option>
              ${DISTRICTS.map(d => `<option value="${esc(d.name)}">${esc(d.name)} (${esc(d.ta)})</option>`).join("")}
            </select>
            <button class="btn btn-accent btn-sm" style="margin-top:10px" id="footNear">Nearby Colleges காட்டு</button>
          </div>
        </div>
        <div class="foot-bot">
          <span>© ${new Date().getFullYear()} Admission+ · Tamil Nadu Education Research Portal · Student project (demo data)</span>
          <span>College fees, cut-off, dates edhuvum official website-la verify pannunga.</span>
        </div>
      </div>
    </footer>`;
    const fd = $("#footDistrict"), fb = $("#footNear");
    if (fd && fb) fb.onclick = () => {
      if (!fd.value) return toast("Mudhalla district select pannunga", "bad");
      location.href = "colleges.html?district=" + encodeURIComponent(fd.value) + "&sort=nearby";
    };
  }

  /* ---------------------- 3.6 CARD RENDER FUNCTIONS -------------------- */
  function collegeCard(c, dist) {
    const lvls = [...new Set(coursesForCollege(c).map(x => x.level))];
    const saved = savedIds().includes(c.id), cmp = compareIds().includes(c.id);
    return `<article class="card reveal" data-college="${esc(c.id)}">
      <a class="card-img" href="college.html?id=${esc(c.id)}">
        <img src="${esc(c.img)}" alt="${esc(c.name)} campus" loading="lazy">
        ${c.featured ? `<span class="badge-pick">${c.featured.toUpperCase()} CAMPUS · Featured</span>` : ""}
        <span class="badge-type">${esc(c.type)}</span>
        ${dist != null ? `<span class="dist-pill" style="position:absolute;bottom:12px;left:12px">${dist} km away</span>` : ""}
      </a>
      <div class="card-body">
        <a href="college.html?id=${esc(c.id)}"><h3 class="card-title">${esc(c.name)}</h3></a>
        <div class="card-meta">
          <span class="rating"><span class="star">★</span> ${c.rating.toFixed(1)}</span>
          <span class="dot"></span><span>${c.reviews.toLocaleString("en-IN")} reviews</span>
          <span class="dot"></span><span>${esc(c.area)}, ${esc(c.district)}</span>
        </div>
        <div class="wrapflex" style="margin-top:12px">
          ${c.kinds.slice(0, 3).map(k => `<span class="chip">${esc(KIND_LABEL[k])}</span>`).join("")}
          ${lvls.map(l => `<span class="chip chip-outline">${l === "10th" ? "After 10th" : l === "12th" ? "After 12th" : "PG"}</span>`).join("")}
        </div>
        <div class="mini" style="margin-top:12px">Established ${c.estd} · ${coursesForCollege(c).length} courses · ${c.hostel ? "Hostel available" : "No hostel"}</div>
      </div>
      <div class="card-foot">
        <div class="row" style="gap:8px">
          <button class="btn btn-soft btn-sm" data-save="${esc(c.id)}">${saved ? "★ Saved" : "☆ Save"}</button>
          <button class="btn btn-ghost btn-sm" data-cmp="${esc(c.id)}">${cmp ? "✓ Comparing" : "⇄ Compare"}</button>
        </div>
        <a class="btn btn-primary btn-sm" href="college.html?id=${esc(c.id)}">Details →</a>
      </div>
    </article>`;
  }

  function courseTile(c) {
    const cols = collegesForCourse(c);
    return `<article class="tile reveal">
      <a class="tile-img" href="course.html?id=${esc(c.id)}">
        <img src="${esc(c.img)}" alt="${esc(c.name)}" loading="lazy">
        <span class="lvl">${c.level === "10th" ? "After 10th" : c.level === "12th" ? "After 12th" : "PG"}</span>
      </a>
      <div class="tile-body">
        <h3><a href="course.html?id=${esc(c.id)}">${esc(c.name)}</a></h3>
        <div class="mini">${esc(c.stream)} · ${esc(c.years)} · ${cols.length} colleges</div>
        <div class="mini">🎓 ${esc(c.elig)}</div>
        <div class="mini">💰 ${esc(c.fee)}</div>
        ${c.popular ? `<span class="chip chip-warn" style="align-self:flex-start">🔥 Most asked</span>` : ""}
      </div>
      <div class="tile-foot">
        <span class="mini">💼 ${esc(c.jobs[0])}</span>
        <a class="btn btn-primary btn-sm" href="course.html?id=${esc(c.id)}">Colleges →</a>
      </div>
    </article>`;
  }

  /* Save / Compare buttons — ella page-lum work aagum */
  function bindCardActions(scope = document) {
    $$("[data-save]", scope).forEach(b => b.onclick = (e) => {
      e.preventDefault();
      const id = b.dataset.save, list = savedIds(), i = list.indexOf(id);
      if (i > -1) { list.splice(i, 1); toast("Saved list-la irundhu neekkiyachu"); }
      else { list.push(id); toast("Saved! Dashboard-la paakkalaam", "ok"); }
      DB.set("saved", list);
      b.textContent = i > -1 ? "☆ Save" : "★ Saved";
    });
    $$("[data-cmp]", scope).forEach(b => b.onclick = (e) => {
      e.preventDefault();
      const id = b.dataset.cmp, list = compareIds(), i = list.indexOf(id);
      if (i > -1) { list.splice(i, 1); }
      else { if (list.length >= 3) return toast("3 college mattum compare panna mudiyum", "bad"); list.push(id); }
      DB.set("compare", list);
      b.textContent = i > -1 ? "⇄ Compare" : "✓ Comparing";
      drawCompareBar();
    });
  }

  function drawCompareBar() {
    let bar = $(".compare-bar");
    const list = compareIds();
    if (!list.length) { if (bar) bar.remove(); return; }
    if (!bar) { bar = document.createElement("div"); bar.className = "compare-bar"; document.body.appendChild(bar); }
    bar.innerHTML = `<span>⇄ ${list.length} college selected</span>
      <a class="btn btn-primary btn-sm" href="compare.html?ids=${list.join(",")}">Compare பண்ணு</a>
      <button class="btn btn-ghost btn-sm" id="cmpClear">Clear</button>`;
    $("#cmpClear").onclick = () => { DB.set("compare", []); drawCompareBar(); $$("[data-cmp]").forEach(b => b.textContent = "⇄ Compare"); };
  }

  /* --------------------------- 3.7 HOME PAGE --------------------------- */
  function initHome() {
    /* Featured 3 colleges — RED / ORANGE / YELLOW */
    const feat = $("#featuredRow");
    if (feat) {
      feat.innerHTML = COLLEGES.filter(c => c.featured).map(c => {
        const col = findCollege(c.id);
        const pl = placementFor(col);
        const tag = c.featured === "red" ? "Red Campus" : c.featured === "orange" ? "Orange Campus" : "Yellow Campus";
        return `<a class="feat feat-${c.featured}" href="college.html?id=${esc(c.id)}">
          <img src="${esc(c.img)}" alt="${esc(c.name)}">
          <span class="feat-tag">${tag}</span>
          <h3>${esc(c.name)}</h3>
          <div class="feat-sub">${esc(c.area)}, ${esc(c.district)} · ${esc(c.type)}</div>
          <div class="feat-stats">
            <div><b>★ ${c.rating.toFixed(1)}</b><span>RATING</span></div>
            <div><b>${coursesForCollege(c).length}</b><span>COURSES</span></div>
            <div><b>${pl.avgPackage}</b><span>AVG PACKAGE</span></div>
            <div><b>${c.estd}</b><span>ESTD</span></div>
          </div>
        </a>`;
      }).join("");
    }

    /* Popular courses (level tabs) */
    const tabRow = $("#homeLevelTabs"), grid = $("#homeCourseGrid");
    function drawCourses(level) {
      grid.innerHTML = COURSES.filter(c => c.level === level)
        .sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0))
        .slice(0, 6).map(courseTile).join("");
      revealInit();
    }
    if (tabRow && grid) {
      $$("a", tabRow).forEach(a => a.onclick = e => {
        e.preventDefault();
        $$("a", tabRow).forEach(x => x.classList.remove("on")); a.classList.add("on");
        drawCourses(a.dataset.level);
      });
      drawCourses("12th");
    }

    /* Nearby colleges — ooru select pannaal pakkathu college */
    const nd = $("#nearDistrict"), nl = $("#nearList"), useMe = $("#useMyLoc");
    const state = DB.get("place", null);
    if (nd) {
      nd.innerHTML = `<option value="">Ooru / District select pannunga…</option>` +
        DISTRICTS.map(d => `<option ${state && state.district === d.name ? "selected" : ""} value="${esc(d.name)}">${esc(d.name)} (${esc(d.ta)})</option>`).join("");
      nd.onchange = () => showNearby(nd.value, null, null);
      if (state) showNearby(state.district, state.lat, state.lng);
    }
    function showNearby(district, lat, lng) {
      if (!district) { nl.innerHTML = ""; return; }
      const d = districtInfo(district);
      const useLat = lat != null ? lat : d.lat, useLng = lng != null ? lng : d.lng;
      const list = searchColleges({ district: district, level: "", sort: "nearby", userLat: useLat, userLng: useLng });
      nl.innerHTML = `<div class="row-between" style="margin-bottom:14px">
          <div><b>${esc(district)} pakkathula irukkira colleges</b>
          <div class="mini">${esc(district)}-லிருந்து distance kanakku panni order pannirukkom</div></div>
          <a class="btn btn-ghost btn-sm" href="colleges.html?district=${encodeURIComponent(district)}&sort=nearby">Ellathaiyum paaru →</a>
        </div>
        <div class="grid g3">${list.slice(0, 3).map(c => collegeCard(c, c._dist)).join("")}</div>`;
      bindCardActions(nl); revealInit();
    }
    if (useMe) useMe.onclick = () => {
      if (!navigator.geolocation) return toast("Ungal browser location support pannala", "bad");
      useMe.textContent = "Location theduren…";
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        let best = DISTRICTS[0], bd = 1e9;
        DISTRICTS.forEach(dd => { const x = distanceKm(lat, lng, dd.lat, dd.lng); if (x < bd) { bd = x; best = dd; } });
        DB.set("place", { district: best.name, lat, lng });
        if (nd) nd.value = best.name;
        showNearby(best.name, lat, lng);
        useMe.textContent = "📍 En location use பண்ணு";
        toast("Ungal pakkathu ooru: " + best.name, "ok");
      }, () => { useMe.textContent = "📍 En location use பண்ணு"; toast("Location permission kidaikkala — district-a select pannunga", "bad"); });
    };

    /* Hero search */
    const hs = $("#heroSearch");
    if (hs) hs.onsubmit = e => {
      e.preventDefault();
      const p = new URLSearchParams();
      const d = $("#hsDistrict").value, l = $("#hsLevel").value, q = $("#hsQuery").value.trim();
      if (d) p.set("district", d); if (l) p.set("level", l); if (q) p.set("q", q);
      location.href = "colleges.html?" + p.toString();
    };
    const hsd = $("#hsDistrict");
    if (hsd) hsd.innerHTML = `<option value="">Ellaa district-um</option>` + DISTRICTS.map(d => `<option>${esc(d.name)}</option>`).join("");

    /* Counters */
    const counters = $$("[data-count]");
    counters.forEach(el => {
      const to = +el.dataset.count; let n = 0;
      const t = setInterval(() => { n += Math.max(1, Math.round(to / 28)); if (n >= to) { n = to; clearInterval(t); } el.textContent = n.toLocaleString("en-IN"); }, 32);
    });
    bindCardActions(); revealInit();
  }

  /* ------------------------ 3.8 COLLEGES LIST PAGE --------------------- */
  function initCollegesPage() {
    const grid = $("#results"), count = $("#resultCount");
    const st = {
      q: qs("q"), district: qs("district"), level: qs("level"),
      kinds: (qs("kinds") ? qs("kinds").split(",") : []),
      sort: qs("sort") || "rating", minRating: 0, hostel: false, maxFee: 0,
      userLat: null, userLng: null
    };
    const place = DB.get("place", null);
    if (place) { st.userLat = place.lat; st.userLng = place.lng; }

    /* filter UI build */
    const dSel = $("#fDistrict");
    dSel.innerHTML = `<option value="">Ellaa district-um (38)</option>` + DISTRICTS.map(d => `<option ${st.district === d.name ? "selected" : ""}>${esc(d.name)}</option>`).join("");
    const kBox = $("#fKinds");
    kBox.innerHTML = Object.keys(KIND_LABEL).map(k => `<label class="check"><input type="checkbox" value="${k}" ${st.kinds.includes(k) ? "checked" : ""}> ${esc(KIND_LABEL[k])}</label>`).join("");
    if (st.q) $("#fQuery").value = st.q;
    if (st.level) { const el = $("#fLevel"); if (el) el.value = st.level; }
    $("#fSort").value = st.sort;

    function readUI() {
      st.q = $("#fQuery").value.trim();
      st.district = dSel.value;
      st.kinds = $$("#fKinds input:checked").map(i => i.value);
      st.level = $("#fLevel").value;
      st.sort = $("#fSort").value;
      st.minRating = +$("#fRating").value;
      $("#fRatingOut").textContent = st.minRating ? st.minRating + "★ & above" : "Ellathaiyum";
      st.hostel = $("#fHostel").checked;
      st.maxFee = +$("#fFee").value;
      $("#fFeeOut").textContent = st.maxFee ? FEE_LABEL[st.maxFee] : "Ellathaiyum";
    }

    function render() {
      readUI();
      const list = searchColleges(st);
      count.textContent = list.length;
      $("#sortNote").textContent = st.sort === "nearby" && st.userLat != null ? "Ooru distance-லிருந்து (nearest first)" : "";
      if (!list.length) {
        grid.innerHTML = `<div class="empty" style="grid-column:1/-1"><div class="em">🔎</div>
          <h3>Oru college-um kidaikkala</h3>
          <p>Filter konjam maathi paarunga — illainaa district-a "Ellaa district-um" nu vaingaa.</p>
          <button class="btn btn-primary" id="clearF" style="margin-top:14px">Filters Clear பண்ணு</button></div>`;
        $("#clearF").onclick = () => { location.href = "colleges.html"; };
        return;
      }
      grid.innerHTML = list.slice(0, 120).map(c => collegeCard(c, c._dist)).join("");
      bindCardActions(grid); revealInit();
    }

    let timer;
    const debounce = (fn) => { clearTimeout(timer); timer = setTimeout(fn, 260); };
    ["fQuery", "fLevel", "fSort", "fRating", "fFee", "fHostel"].forEach(id => {
      const el = $("#" + id); if (!el) return;
      el.addEventListener("input", () => debounce(render));
      el.addEventListener("change", render);
    });
    dSel.addEventListener("change", render);
    kBox.addEventListener("change", render);
    $("#fReset").onclick = () => { location.href = "colleges.html"; };
    render();
  }

  /* ------------------------- 3.9 COLLEGE DETAIL ------------------------ */
  function initCollegePage() {
    const c = findCollege(qs("id")) || COLLEGES[0];
    const t = themeOf(c);
    document.body.className = "theme-" + c.theme;
    const layouts = ["classic", "royal", "modern", "heritage", "eco", "tech"];
    document.body.dataset.layout = layouts[c.id.length % layouts.length];

    const lvls = [...new Set(coursesForCollege(c).map(x => x.level))];
    const pl = placementFor(c);
    const fac = facilitiesFor(c);
    const revs = myReviews(c.id).concat(reviewsFor(c));
    const avg = (revs.reduce((s, r) => s + r.rating, 0) / revs.length).toFixed(1);
    const d = districtInfo(c.district);
    const place = DB.get("place", null);
    const dist = place ? distanceKm(place.lat, place.lng, c.lat, c.lng) : null;
    const similar = COLLEGES.filter(x => x.district === c.district && x.id !== c.id).slice(0, 3);
    const nearBy = searchColleges({ level: "", sort: "nearby", userLat: c.lat, userLng: c.lng }).filter(x => x.id !== c.id).slice(0, 4);
    const galleryImgs = [c.img, "images/events/event-culturals.jpg", "images/events/event-techfest.jpg",
      "images/events/event-sports.jpg", "images/events/event-graduation.jpg", "images/programmes/prog-arts.jpg"];

    document.title = c.name + " — Courses, Fees, Placement, Reviews | Admission+";
    $("#collegeRoot").innerHTML = `
    <section class="c-hero">
      <div class="c-hero-bg"><img src="${esc(c.img)}" alt="${esc(c.name)}"></div>
      <div class="wrap c-hero-in">
        <div class="crumb"><a href="index.html">Home</a> › <a href="colleges.html">Colleges</a> ›
          <a href="colleges.html?district=${encodeURIComponent(c.district)}">${esc(c.district)}</a> › <span>${esc(c.short)}</span></div>
        <h1>${esc(c.name)}</h1>
        <div class="c-sub">
          <span>📍 ${esc(c.area)}, ${esc(c.district)} district ${dist != null ? `<b style="color:var(--accent)">· ${dist} km from ${esc(place.district)}</b>` : ""}</span>
          <span>🏛️ ${esc(c.type)}</span><span>📅 Estd ${c.estd}</span>
          <span class="rating" style="color:#fff"><span class="star" style="color:var(--accent)">★</span> ${c.rating.toFixed(1)} (${c.reviews.toLocaleString("en-IN")})</span>
        </div>
        <div class="c-badges">
          ${c.kinds.map(k => `<span class="chip">${esc(KIND_LABEL[k])}</span>`).join("")}
          ${lvls.map(l => `<span class="chip">${l === "10th" ? "After 10th courses" : l === "12th" ? "After 12th degree" : "PG / Research"}</span>`).join("")}
          ${c.hostel ? `<span class="chip">🏠 Hostel</span>` : ""}
        </div>
        <div class="c-actions">
          <a class="btn btn-accent btn-lg" href="#admission">🎓 Admission Details</a>
          <button class="btn btn-ghost btn-lg" data-save="${esc(c.id)}" id="saveTop">★ Save College</button>
          <a class="btn btn-ghost btn-lg" target="_blank" rel="noopener" href="${esc(c.website)}">🌐 Official Website</a>
          <a class="btn btn-ghost btn-lg" target="_blank" rel="noopener" href="${dirLink(c.lat, c.lng)}">🧭 Directions (Google Maps)</a>
        </div>
        <div class="c-key-stats">
          <div><b>${coursesForCollege(c).length}</b><span>COURSES OFFERED</span></div>
          <div><b>${pl.avgPackage}</b><span>AVG PACKAGE</span></div>
          <div><b>${pl.placementRate}%</b><span>PLACEMENT RATE</span></div>
          <div><b>${fac.length}</b><span>FACILITIES</span></div>
        </div>
      </div>
    </section>

    <div class="tabs" id="cTabs">
      <a href="#about" class="on">About</a><a href="#courses">Courses</a><a href="#admission">Admission</a>
      <a href="#placement">Placement</a><a href="#facilities">Campus & Facilities</a>
      <a href="#reviews">Reviews (${revs.length})</a><a href="#events">Events</a><a href="#location">Location</a>
    </div>

    <div class="wrap">

      <section class="panel" id="about">
        <div class="split" style="grid-template-columns:1fr 330px">
          <div>
            <span class="eyebrow" style="display:inline-block;font-size:.74rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--c1);background:var(--soft);padding:5px 12px;border-radius:99px;margin-bottom:10px">College Profile</span>
            <h2>${esc(c.short)} பத்தி</h2>
            <p class="ta" style="margin-top:12px;font-size:.97rem">${esc(aboutFor(c))}</p>
            <div class="grid g2" style="margin-top:22px">
              <div class="card card-pad">
                <h3 style="margin-bottom:10px">Quick Info</h3>
                <div class="kv"><b>College Type</b><span>${esc(c.type)}</span></div>
                <div class="kv"><b>Established</b><span>${c.estd}</span></div>
                <div class="kv"><b>District</b><span>${esc(c.district)} (${esc(d ? d.ta : "")})</span></div>
                <div class="kv"><b>Hostel</b><span>${c.hostel ? "Boys & Girls hostel available" : "Hostel illa"}</span></div>
                <div class="kv"><b>Departments</b><span>${c.kinds.map(k => KIND_LABEL[k]).join(", ")}</span></div>
                <div class="kv"><b>Rating</b><span>${c.rating.toFixed(1)} / 5 ⭐</span></div>
              </div>
              <div class="card card-pad">
                <h3 style="margin-bottom:10px">Campus Highlights</h3>
                <ul class="timeline" style="margin-top:6px">
                  <li><span class="yr">${c.estd}</span><b>College Start</b><span class="mini">${esc(c.area)}-la thuvakkam</span></li>
                  <li><span class="yr">TODAY</span><b>${coursesForCollege(c).length} Courses</b><span class="mini">${lvls.length} level-la programme</span></li>
                  <li><span class="yr">PLACEMENT</span><b>${pl.placementRate}% students placed</b><span class="mini">Top recruiters: ${esc(pl.topRecruiters.slice(0, 3).join(", "))}</span></li>
                </ul>
              </div>
            </div>
          </div>
          <aside style="display:grid;gap:16px">
            <div class="score-card">
              <div class="small" style="color:rgba(255,255,255,.85);font-weight:600">STUDENT RATING</div>
              <b>${avg}</b><div class="stars">${stars(+avg)}</div>
              <div class="small" style="color:rgba(255,255,255,.85)">${revs.length} verified reviews</div>
            </div>
            <div class="map-shell">
              ${mapEmbed(c.lat, c.lng)}
              <div class="map-info">
                <div class="small"><b>${esc(c.area)}</b><br>${esc(c.district)}, Tamil Nadu ${d ? `<br><button class="btn btn-ghost btn-sm" id="useDist" style="margin-top:6px">📍 ${esc(c.district)}-லிருந்து distance</button>` : ""}</div>
              </div>
            </div>
            <div class="card card-pad">
              <h3 style="margin-bottom:10px">Ithu onnum illa... ithellam irukku!</h3>
              <div class="wrapflex">
                ${c.kinds.map(k => `<span class="chip">${esc(KIND_LABEL[k])}</span>`).join("")}
              </div>
              <div class="disclaimer small" style="margin-top:14px">ℹ️ Idhu student project demo data. Fees, seats, dates official website-la verify pannunga.</div>
            </div>
          </aside>
        </div>
      </section>

      <section class="panel" id="courses">
        <div class="section-head">
          <div><span class="eyebrow">Courses</span>
            <h2>${esc(c.short)}-la padikka koodiya courses</h2>
            <p>10th mudicha diploma, 12th mudicha degree, PG — ${esc(c.name)}-la enna enna programme irukku paaru.</p></div>
          <a class="btn btn-ghost" href="courses.html?q=${encodeURIComponent(c.short)}">Ellaa course-um →</a>
        </div>
        <div class="pill-row" id="cLvlTabs" style="margin-bottom:18px">
          ${lvls.map((l, i) => `<a href="#" data-lvl="${l}" class="${i === 0 ? "on" : ""}">${l === "10th" ? "After 10th" : l === "12th" ? "After 12th" : "PG Courses"}</a>`).join("")}
        </div>
        <div class="grid g3" id="cCourseGrid"></div>
      </section>

      <section class="panel" id="admission">
        <div class="section-head"><div><span class="eyebrow">Admission</span>
          <h2>Yaaru apply pannalaam? Eppadi apply pannanum?</h2>
          <p>Eligibility, entrance exam, counselling process, fees — ellame inge.</p></div></div>
        <div class="grid g2">
          <div class="card card-pad">
            <h3 style="margin-bottom:14px">Eligibility & Entrance</h3>
            ${coursesForCollege(c).slice(0, 6).map(x => `
              <div class="kv"><b>${esc(x.level === "10th" ? "After 10th" : x.level === "12th" ? "After 12th" : "PG")}</b>
                <span><b style="font-weight:600">${esc(x.name)}</b><br><span class="mini">${esc(x.elig)}</span></span></div>`).join("")}
          </div>
          <div class="card card-pad">
            <h3 style="margin-bottom:14px">Counselling Process (Step by Step)</h3>
            <ul class="timeline">
              <li><span class="yr">STEP 1</span><b>Online Registration</b><span class="mini">${esc(coursesForCollege(c)[0] ? coursesForCollege(c)[0].via : "Counselling portal")} — website-la register pannunga</span></li>
              <li><span class="yr">STEP 2</span><b>Documents Upload</b><span class="mini">10th/12th marksheet, TC, community certificate, nativity certificate</span></li>
              <li><span class="yr">STEP 3</span><b>Choice Filling</b><span class="mini">College + course preference order-la select pannunga</span></li>
              <li><span class="yr">STEP 4</span><b>Seat Allotment</b><span class="mini">Rank/cutoff paathu seat kidaikkum</span></li>
              <li><span class="yr">STEP 5</span><b>College Reporting</b><span class="mini">Original certificates-oda college-ku ponga, fees kattunga</span></li>
            </ul>
            <div class="disclaimer small" style="margin-top:14px">⚠️ Counselling dates & cut-off year-a year-a maarum. Official portal-la confirm pannunga.</div>
          </div>
        </div>
      </section>

      <section class="panel" id="placement">
        <div class="section-head"><div><span class="eyebrow">Placement</span>
          <h2>Placement & Career Support</h2>
          <p>Average package, placement percentage, top recruiters — idhu ${esc(c.short)}-oda track record.</p></div></div>
        <div class="stat-grid" style="margin-bottom:20px">
          <div class="stat-box"><b>${pl.avgPackage}</b><span>AVERAGE PACKAGE</span></div>
          <div class="stat-box"><b>${pl.highPackage}</b><span>HIGHEST PACKAGE</span></div>
          <div class="stat-box"><b>${pl.placementRate}%</b><span>PLACEMENT RATE</span></div>
          <div class="stat-box"><b>${pl.topRecruiters.length}+</b><span>TOP RECRUITERS</span></div>
        </div>
        <div class="card card-pad">
          <h3>Placement Rate</h3>
          <div class="bar-track"><div class="bar-fill" data-bar="${Math.min(100, pl.placementRate)}"></div></div>
          <div class="row-between small"><span>Students placed in last drive</span><b>${pl.placementRate}%</b></div>
          <h3 style="margin:20px 0 12px">Top Recruiters</h3>
          <div class="wrapflex">${pl.topRecruiters.map(r => `<span class="chip">🏢 ${esc(r)}</span>`).join("")}</div>
        </div>
      </section>

      <section class="panel" id="facilities">
        <div class="section-head"><div><span class="eyebrow">Campus Life</span>
          <h2>Campus & Facilities</h2><p>Library, lab, hostel, sports, wifi — college-la enna ellam irukku.</p></div></div>
        <ul class="facility">
          ${fac.map(f => `<li><span class="ic">✔</span> ${esc(f)}</li>`).join("")}
        </ul>
        <h3 style="margin:28px 0 14px">Campus Gallery</h3>
        <div class="gallery">
          ${galleryImgs.map((g, i) => `<img src="${esc(g)}" alt="${esc(c.short)} gallery ${i + 1}" loading="lazy">`).join("")}
        </div>
      </section>

      <section class="panel" id="reviews">
        <div class="section-head">
          <div><span class="eyebrow">Student Reviews</span><h2>Padicha student-ngal enna solranga?</h2>
          <p>Unmaiaana student experience — faculty, hostel, placement, campus life.</p></div>
          <button class="btn btn-primary" id="writeRev">✍️ Ungal Review எழுதுங்க</button>
        </div>
        <div class="grid g2">
          <div class="card card-pad" style="display:flex;gap:24px;align-items:center;flex-wrap:wrap">
            <div style="text-align:center">
              <div style="font-size:2.6rem;font-weight:800;color:var(--c1);line-height:1">${avg}</div>
              <div class="stars">${stars(+avg)}</div>
              <div class="small muted">${revs.length} reviews</div>
            </div>
            <div style="flex:1;min-width:200px">
              ${[5, 4, 3, 2, 1].map(n => {
                const pc = Math.round(revs.filter(r => r.rating === n).length / revs.length * 100);
                return `<div class="row" style="gap:10px"><span class="mini" style="width:34px">${n}★</span>
                  <div class="bar-track" style="flex:1;margin:0"><div class="bar-fill" data-bar="${pc}"></div></div>
                  <span class="mini" style="width:38px;text-align:right">${pc}%</span></div>`;
              }).join("")}
            </div>
          </div>
          <div class="grid" style="gap:14px">
            ${revs.slice(0, 3).map(r => reviewCard(r)).join("")}
          </div>
        </div>
        <div class="grid g2" style="margin-top:18px">
          ${revs.slice(3).map(r => `<div class="card card-pad">${reviewInner(r)}</div>`).join("")}
        </div>
      </section>

      <section class="panel" id="events">
        <div class="section-head"><div><span class="eyebrow">Events</span>
          <h2>${esc(c.short)}-la nadakkura events & fests</h2>
          <p>Cultural, technical, sports, graduation — campus life full-a enjoy pannalaam.</p></div>
          <a class="btn btn-ghost" href="events.html">Ellaa events →</a></div>
        <div class="grid g4">
          ${EVENTS.map(e => `<article class="card">
            <div class="card-img"><img src="${esc(e.img)}" alt="${esc(e.title)}" loading="lazy"><span class="badge-type">${esc(e.tag)}</span></div>
            <div class="card-body"><h3 class="card-title" style="font-size:.98rem">${esc(e.title)}</h3>
            <div class="mini">📅 ${esc(e.date)} · ${esc(e.college)}</div></div></article>`).join("")}
        </div>
      </section>

      <section class="panel" id="location">
        <div class="section-head"><div><span class="eyebrow">Location</span>
          <h2>Map-la college-ai paarunga</h2>
          <p>Google Maps-la direct-a open pannunga, direction edukkunga.</p></div></div>
        <div class="split" style="grid-template-columns:1fr 340px">
          <div class="map-shell">${mapEmbed(c.lat, c.lng, 15)}
            <div class="map-info">
              <div><b>${esc(c.name)}</b><div class="mini">${esc(c.area)}, ${esc(c.district)}, Tamil Nadu</div></div>
              <div class="row">
                <a class="btn btn-primary btn-sm" target="_blank" rel="noopener" href="${dirLink(c.lat, c.lng)}">🧭 Direction</a>
                <a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="${dirLink(c.lat, c.lng).replace("/dir/?api=1&destination=", "/search/?api=1&query=").replace("&travelmode=driving", "")}">Google-ல திற</a>
              </div>
            </div>
          </div>
          <div class="card card-pad">
            <h3 style="margin-bottom:12px">Pakkathula irukkira colleges</h3>
            <div class="grid" style="gap:10px">
              ${nearBy.map(n => {
                const dd = distanceKm(c.lat, c.lng, n.lat, n.lng);
                return `<a class="near-item" href="college.html?id=${esc(n.id)}">
                  <img src="${esc(n.img)}" alt="${esc(n.short)}">
                  <div><h4>${esc(n.short)}</h4>
                  <div class="mini">${esc(n.district)} · ${dd} km</div>
                  <div class="mini">★ ${n.rating.toFixed(1)}</div></div></a>`;
              }).join("")}
            </div>
            <a class="btn btn-ghost btn-block" style="margin-top:14px" href="colleges.html?district=${encodeURIComponent(c.district)}">${esc(c.district)} district colleges →</a>
          </div>
        </div>
        ${similar.length ? `<h3 style="margin:28px 0 14px">${esc(c.district)}-la vera colleges</h3>
        <div class="grid g3">${similar.map(x => collegeCard(x)).join("")}</div>` : ""}
      </section>
    </div>`;

    /* level tabs for courses */
    const cg = $("#cCourseGrid");
    function drawCL(level) {
      const list = coursesForCollege(c, level);
      cg.innerHTML = list.length
        ? list.map(courseTile).join("")
        : `<div class="empty" style="grid-column:1/-1"><div class="em">📘</div><p>Intha level-la ippo course illa.</p></div>`;
      revealInit();
    }
    $$("#cLvlTabs a").forEach(a => a.onclick = e => {
      e.preventDefault(); $$("#cLvlTabs a").forEach(x => x.classList.remove("on")); a.classList.add("on");
      drawCL(a.dataset.lvl);
    });
    if (lvls.length) drawCL(lvls.includes("12th") ? "12th" : lvls[0]);

    /* tabs active on scroll */
    const secs = $$(".panel");
    window.addEventListener("scroll", () => {
      let cur = "";
      secs.forEach(s => { if (s.getBoundingClientRect().top < 160) cur = s.id; });
      $$("#cTabs a").forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + cur));
      $$(".bar-fill").forEach(b => { if (b.getBoundingClientRect().top < window.innerHeight - 40) b.style.width = b.dataset.bar + "%"; });
    }, { passive: true });

    const ud = $("#useDist");
    if (ud) ud.onclick = () => {
      const dd = districtInfo(c.district);
      toast(`${c.short}-க்கு ${c.district} center-லிருந்து ${distanceKm(dd.lat, dd.lng, c.lat, c.lng)} km`, "ok");
    };

    /* review form */
    $("#writeRev").onclick = () => {
      const u = getUser();
      if (!u) { toast("Mudhalla sign up / login pannunga", "bad"); return setTimeout(() => location.href = "login.html?next=" + encodeURIComponent(location.pathname + location.search), 700); }
      const back = modal("Ungal Review எழுதுங்க", `
        <div class="field"><label>Rating <span>*</span></label>
          <select class="select" id="rvRate"><option value="5">★★★★★ Excellent</option><option value="4">★★★★ Good</option>
          <option value="3">★★★ Average</option><option value="2">★★ Poor</option><option value="1">★ Bad</option></select></div>
        <div class="field"><label>Title <span>*</span></label><input class="input" id="rvTitle" placeholder="eg: Placement super, hostel konjam improve pannanum"></div>
        <div class="field"><label>Ungal experience <span>*</span></label>
          <textarea class="textarea" id="rvText" placeholder="Faculty, hostel, lab, placement, campus life pathi sollunga…"></textarea></div>
        <div class="field"><label>Padicha course</label><input class="input" id="rvCourse" placeholder="eg: B.E. CSE, 2025"></div>`,
        `<button class="btn btn-ghost" data-x>Cancel</button><button class="btn btn-primary" id="rvSave">Review Publish</button>`);
      back.querySelector("#rvSave").onclick = () => {
        const title = back.querySelector("#rvTitle").value.trim(), text = back.querySelector("#rvText").value.trim();
        if (!title || !text) return toast("Title & review rendum venum", "bad");
        const all = DB.get("reviews", {});
        all[c.id] = (all[c.id] || []).concat([{
          name: u.name, course: back.querySelector("#rvCourse").value.trim() || (u.level ? "After " + u.level : "Student"),
          rating: +back.querySelector("#rvRate").value, title, text, mine: true, at: Date.now()
        }]);
        DB.set("reviews", all);
        back.remove(); toast("Nandri! Ungal review publish aagiduchu", "ok");
        setTimeout(() => location.reload(), 800);
      };
    };

    bindCardActions(); revealInit();
    $("#saveTop").dataset.save = c.id;
    bindCardActions();
  }
  const myReviews = (id) => (DB.get("reviews", {})[id] || []);
  function reviewCard(r) { return `<div class="review-card">${reviewInner(r)}</div>`; }
  function reviewInner(r) {
    return `<div class="review-top">
        <span class="avatar">${esc((r.name || "S").charAt(0).toUpperCase())}</span>
        <div style="flex:1"><b>${esc(r.name)}</b>${r.mine ? ` <span class="chip chip-ok" style="font-size:.68rem">Ungal review</span>` : ""}
          <div class="mini">${esc(r.course || "Student")}</div></div>
        <div class="stars">${stars(r.rating)}</div>
      </div>
      <b style="display:block;margin-bottom:5px">${esc(r.title)}</b>
      <p class="small" style="color:var(--ink-2)">${esc(r.text)}</p>`;
  }

  /* --------------------------- 3.10 COURSES PAGE ----------------------- */
  function initCoursesPage() {
    const grid = $("#courseGrid"), tabs = $("#lvlTabs"), count = $("#cCount");
    let level = qs("level") || "";
    let q = qs("q").toLowerCase();

    function render() {
      let list = COURSES.filter(c => (!level || c.level === level) &&
        (!q || (c.name + c.stream + c.jobs.join(" ")).toLowerCase().includes(q)));
      count.textContent = list.length;
      grid.innerHTML = list.length ? list.map(courseTile).join("")
        : `<div class="empty" style="grid-column:1/-1"><div class="em">📚</div><h3>Course kidaikkala</h3><p>Vera word-la search pannunga.</p></div>`;
      revealInit();
    }
    $$("#lvlTabs a").forEach(a => {
      if (a.dataset.level === level) { $$("#lvlTabs a").forEach(x => x.classList.remove("on")); a.classList.add("on"); }
      a.onclick = e => { e.preventDefault(); level = a.dataset.level; $$("#lvlTabs a").forEach(x => x.classList.remove("on")); a.classList.add("on"); render(); };
    });
    const qi = $("#cQuery");
    if (qi) qi.oninput = () => { q = qi.value.trim().toLowerCase(); render(); };

    /* Eligibility checker — marks % podunga, eligible course kaattum */
    const ec = $("#eligBtn");
    if (ec) ec.onclick = () => {
      const v = +$("#eligInput").value;
      if (!v || v < 1 || v > 100) return toast("1-100 madhiri percentage podunga", "bad");
      const ok = COURSES.filter(c => {
        const m = /min (\d+)%/.exec(c.elig);
        return !m || v >= +m[1];
      });
      $("#eligOut").innerHTML = `<div class="callout" style="margin-top:14px">
        <b>${v}% marks-oda neenga apply panna koodiya courses: ${ok.length}</b>
        <div class="wrapflex" style="margin-top:10px">${ok.filter(c => !level || c.level === level).slice(0, 18)
          .map(c => `<a class="chip chip-outline" href="course.html?id=${esc(c.id)}">${esc(c.name)}</a>`).join("")}</div>
        <div class="small" style="margin-top:10px">⚠️ Idhu rough guide mattum. Community reservation, cut-off, seat availability-a paathu exact eligibility maarum.</div></div>`;
    };
    render();
  }

  /* ------------------------- 3.11 COURSE DETAIL PAGE ------------------- */
  function initCoursePage() {
    const c = COURSES.find(x => x.id === qs("id")) || COURSES.find(x => x.level === "12th");
    document.title = c.name + " — Colleges, Eligibility, Fees | Admission+";
    const cols = collegesForCourse(c);
    const byDist = {};
    cols.forEach(x => byDist[x.district] = (byDist[x.district] || 0) + 1);
    $("#courseRoot").innerHTML = `
      <section class="c-hero" style="background:#171A21">
        <div class="c-hero-bg"><img src="${esc(c.img)}" alt="${esc(c.name)}"></div>
        <div class="wrap c-hero-in">
          <div class="crumb"><a href="index.html">Home</a> › <a href="courses.html">Courses</a> ›
            <a href="courses.html?level=${encodeURIComponent(c.level)}">${c.level === "10th" ? "After 10th" : c.level === "12th" ? "After 12th" : "PG"}</a> › <span>${esc(c.name)}</span></div>
          <h1>${esc(c.name)}</h1>
          <div class="c-badges">
            <span class="chip">${c.level === "10th" ? "✅ After 10th" : c.level === "12th" ? "✅ After 12th" : "🎓 After UG (PG)"}</span>
            <span class="chip">${esc(c.stream)}</span><span class="chip">⏳ ${esc(c.years)}</span>
            <span class="chip">🏫 ${cols.length} colleges offer pannuthu</span>
          </div>
          <div class="c-key-stats">
            <div><b>${esc(c.years)}</b><span>DURATION</span></div>
            <div><b>${cols.length}</b><span>COLLEGES IN TN</span></div>
            <div><b>${esc(c.salary)}</b><span>STARTING SALARY</span></div>
            <div><b>${Object.keys(byDist).length}</b><span>DISTRICTS</span></div>
          </div>
        </div>
      </section>
      <div class="wrap section">
        <div class="split" style="grid-template-columns:1fr 340px">
          <div>
            <div class="card card-pad">
              <h2 style="margin-bottom:14px">Course Details</h2>
              <div class="kv"><b>Full Name</b><span>${esc(c.name)}</span></div>
              <div class="kv"><b>Level</b><span>${c.level === "10th" ? "10th mudicha pinnadi" : c.level === "12th" ? "12th mudicha pinnadi" : "UG mudicha pinnadi (PG)"}</span></div>
              <div class="kv"><b>Duration</b><span>${esc(c.years)}</span></div>
              <div class="kv"><b>Eligibility</b><span>${esc(c.elig)}</span></div>
              <div class="kv"><b>Admission Via</b><span>${esc(c.via)}</span></div>
              <div class="kv"><b>Fee Range</b><span>${esc(c.fee)}</span></div>
              <div class="kv"><b>Stream</b><span>${esc(c.stream)}</span></div>
              <div class="kv"><b>Starting Salary</b><span>${esc(c.salary)}</span></div>
            </div>
            <div class="card card-pad" style="margin-top:20px">
              <h2 style="margin-bottom:14px">Ithu padicha enna velai kidaikkum?</h2>
              <div class="grid g3">
                ${c.jobs.map(j => `<div class="stat-box" style="background:var(--soft);border-color:transparent">
                  <b style="font-size:1rem">💼</b><b style="font-size:.98rem;display:block;margin-top:4px">${esc(j)}</b>
                  <span>Job role</span></div>`).join("")}
              </div>
              <div class="callout" style="margin-top:18px">
                <b>Career path tips:</b> Intha course mudicha pinnadi ${esc(c.jobs.join(", "))} maathiri role-la start pannalaam.
                Mel padikka venumna ${c.level === "PG" ? "Ph.D / research" : "PG degree (M.E / MBA / M.Sc / M.Com)"} option irukku.
              </div>
            </div>
            <section style="margin-top:26px">
              <div class="section-head"><div><span class="eyebrow">Colleges</span>
                <h2>${esc(c.name)} — Tamil Nadu-vil ${cols.length} colleges</h2>
                <p>District-wise-a paathu ungal oor pakkathula irukkira college-a therndhu edunga.</p></div></div>
              <div class="grid g3">${cols.slice(0, 24).map(x => collegeCard(x)).join("")}</div>
            </section>
          </div>
          <aside style="display:grid;gap:16px">
            <div class="card card-pad">
              <h3 style="margin-bottom:0px">Ungalukku ithu set aaguma?</h3>
              <div class="kv"><b>10th mudicha?</b><span>${c.level === "10th" ? "✅ Aamaa, ithu unga course" : "❌ Ithu 10th-ku illa"}</span></div>
              <div class="kv"><b>12th mudicha?</b><span>${c.level === "12th" ? "✅ Aamaa, ithu unga course" : c.level === "10th" ? "✅ Ithu 10th mudichavangalukku" : "❌ PG course"}</span></div>
              <div class="kv"><b>UG mudicha?</b><span>${c.level === "PG" ? "✅ Aamaa, ithu unga course" : "❌ PG illa"}</span></div>
            </div>
            <div class="card card-pad">
              <h3>District-wise colleges</h3>
              <div class="wrapflex" style="margin-top:10px">
                ${Object.entries(byDist).sort((a, b) => b[1] - a[1]).map(([d, n]) =>
                  `<a class="chip chip-outline" href="colleges.html?district=${encodeURIComponent(d)}&level=${encodeURIComponent(c.level)}">${esc(d)} (${n})</a>`).join("")}
              </div>
            </div>
            <div class="card card-pad">
              <h3>Ithu pola vera courses</h3>
              <div class="grid" style="gap:8px;margin-top:10px">
                ${COURSES.filter(x => x.stream === c.stream && x.id !== c.id).slice(0, 5)
                  .map(x => `<a class="row" style="gap:8px" href="course.html?id=${esc(x.id)}"><span>▪️</span><span style="font-weight:500;font-size:.9rem">${esc(x.name)}</span></a>`).join("")}
              </div>
            </div>
            <a class="btn btn-primary btn-block" href="colleges.html?level=${encodeURIComponent(c.level)}">Intha level-la colleges பார் →</a>
          </aside>
        </div>
      </div>`;
    bindCardActions(); revealInit();
  }

  /* ------------------------- 3.12 DISTRICTS PAGE ----------------------- */
  function initDistrictsPage() {
    const g = $("#districtGrid"); if (!g) return;
    const REGIONS = {
      "North": ["Chennai", "Chengalpattu", "Kanchipuram", "Tiruvallur", "Ranipet", "Vellore", "Tirupathur", "Tiruvannamalai", "Viluppuram", "Kallakurichi", "Cuddalore", "Krishnagiri", "Dharmapuri"],
      "Central (Delta)": ["Tiruchirappalli", "Thanjavur", "Tiruvarur", "Nagapattinam", "Mayiladuthurai", "Ariyalur", "Perambalur", "Pudukkottai", "Karur", "Namakkal", "Salem", "Erode", "Tiruppur", "Coimbatore", "Nilgiris"],
      "South": ["Madurai", "Dindigul", "Theni", "Virudhunagar", "Sivaganga", "Ramanathapuram", "Thoothukudi", "Tirunelveli", "Tenkasi", "Kanyakumari"]
    };
    let region = "";
    const rw = $("#regionRow");
    rw.innerHTML = `<button class="on" data-r="">Ellaa district (38)</button>` +
      Object.keys(REGIONS).map(r => `<button data-r="${r}">${r}</button>`).join("");
    function draw() {
      const list = DISTRICTS.filter(d => !region || REGIONS[region].includes(d.name));
      g.innerHTML = list.map(d => {
        const cols = COLLEGES.filter(c => c.district === d.name);
        const top = cols.sort((a, b) => b.rating - a.rating)[0];
        return `<a class="dist-card reveal" href="colleges.html?district=${encodeURIComponent(d.name)}&sort=nearby">
          <div><b>${esc(d.name)}</b><span class="ta">${esc(d.ta)}</span>
          ${top ? `<div class="mini">Top: ${esc(top.short)}</div>` : ""}</div>
          <i>${cols.length} college${cols.length === 1 ? "" : "s"}</i></a>`;
      }).join("");
      revealInit();
    }
    rw.onclick = e => {
      const b = e.target.closest("button"); if (!b) return;
      $$("button", rw).forEach(x => x.classList.remove("on")); b.classList.add("on");
      region = b.dataset.r; draw();
    };
    draw();
    const dm = $("#districtMap");
    if (dm) dm.onchange = () => {
      const d = districtInfo(dm.value); if (!d) return;
      $("#districtMapShell").innerHTML = mapEmbed(d.lat, d.lng, 11);
      $("#districtColleges").innerHTML = `<div class="grid g2" style="margin-top:16px">` +
        COLLEGES.filter(c => c.district === d.name).map(c => collegeCard(c)).join("") + `</div>`;
      bindCardActions($("#districtColleges")); revealInit();
    };
    if (dm) dm.innerHTML = `<option value="">District select பண்ணு…</option>` + DISTRICTS.map(d => `<option>${esc(d.name)}</option>`).join("");
  }

  /* --------------------------- 3.13 MAP PAGE --------------------------- */
  function initMapPage() {
    const list = $("#nearList"); if (!list) return;
    const dSel = $("#mapDistrict"), kSel = $("#mapKind");
    dSel.innerHTML = DISTRICTS.map(d => `<option>${esc(d.name)}</option>`).join("");
    kSel.innerHTML = `<option value="">Ellaa type-um</option>` + Object.keys(KIND_LABEL).map(k => `<option value="${k}">${esc(KIND_LABEL[k])}</option>`).join("");
    const place = DB.get("place", null);
    if (place) dSel.value = place.district;

    function draw() {
      const d = dSel.value, k = kSel.value;
      const useLat = d === place?.district && place ? place.lat : districtInfo(d).lat;
      const useLng = d === place?.district && place ? place.lng : districtInfo(d).lng;
      let cols = searchColleges({ district: d, kinds: k ? [k] : [], sort: "nearby", userLat: useLat, userLng: useLng });
      if (!cols.length) cols = searchColleges({ district: d, sort: "nearby", userLat: useLat, userLng: useLng });
      list.innerHTML = cols.map((c, i) => `<button class="near-item ${i === 0 ? "on" : ""}" data-i="${i}">
          <img src="${esc(c.img)}" alt="${esc(c.short)}">
          <div><h4>${esc(c.short)}</h4>
          <div class="mini">📍 ${esc(c.area)}, ${esc(c.district)} · <b>${c._dist} km</b></div>
          <div class="mini">★ ${c.rating.toFixed(1)} · ${esc(c.type)}</div></div></button>`).join("");
      if (cols.length) setMap(cols[0], useLat, useLng);
      $$(".near-item", list).forEach(b => b.onclick = () => {
        $$(".near-item", list).forEach(x => x.classList.remove("on")); b.classList.add("on");
        setMap(cols[+b.dataset.i], useLat, useLng);
      });
    }
    function setMap(c, fromLat, fromLng) {
      const dist = distanceKm(fromLat, fromLng, c.lat, c.lng);
      $("#mapShell").innerHTML = mapEmbed(c.lat, c.lng, 13);
      $("#mapInfo").innerHTML = `<div style="flex:1">
          <b>${esc(c.name)}</b>
          <div class="mini">📍 ${esc(c.area)}, ${esc(c.district)} · ${dSel.value} center-லிருந்து <b>${dist} km</b></div>
          <div class="mini">🚗 Car-la approx ${Math.max(5, Math.round(dist / 40 * 60))} nimisham</div>
        </div>
        <div class="row">
          <a class="btn btn-primary btn-sm" target="_blank" rel="noopener" href="${dirLink(c.lat, c.lng)}">🧭 Direction</a>
          <a class="btn btn-ghost btn-sm" href="college.html?id=${esc(c.id)}">Details →</a>
        </div>`;
    }
    dSel.onchange = draw; kSel.onchange = draw;
    const geo = $("#mapGeo");
    if (geo) geo.onclick = () => {
      navigator.geolocation.getCurrentPosition(p => {
        const { latitude: lat, longitude: lng } = p.coords;
        let best = DISTRICTS[0], bd = 1e9;
        DISTRICTS.forEach(dd => { const x = distanceKm(lat, lng, dd.lat, dd.lng); if (x < bd) { bd = x; best = dd; } });
        DB.set("place", { district: best.name, lat, lng });
        dSel.value = best.name; draw(); toast("Ungal pakkathu ooru: " + best.name, "ok");
      }, () => toast("Location kidaikkala — district-a select pannunga", "bad"));
    };
    draw();
  }

  /* -------------------------- 3.14 EVENTS PAGE ------------------------- */
  function initEventsPage() {
    const root = $("#eventsRoot"); if (!root) return;
    const TYPE = [
      { t: "Cultural Fest", img: "images/events/event-culturals.jpg", d: "Dance, music, drama, fashion show, food stalls. TN colleges-la cultural season Jan-Mar.",
        who: "Ellaa college students-um participate pannalaam" },
      { t: "Technical Symposium", img: "images/events/event-techfest.jpg", d: "Paper presentation, coding contest, robotics, project expo, hackathon.",
        who: "Engineering & science students" },
      { t: "Sports Meet", img: "images/events/event-sports.jpg", d: "Athletics, kabaddi, volleyball, cricket, chess. Inter-college tournaments.",
        who: "Sports quota students" },
      { t: "Graduation / Convocation", img: "images/events/event-graduation.jpg", d: "Degree distribution, gold medal, alumni meet, group photos.",
        who: "Final year students" }
    ];
    root.innerHTML = `
      <div class="grid g2">
        ${TYPE.map(e => `<article class="card">
          <div class="card-img"><img src="${esc(e.img)}" alt="${esc(e.t)}" loading="lazy"><span class="badge-type">Campus Event</span></div>
          <div class="card-body"><h3 class="card-title">${esc(e.t)}</h3><p class="small">${esc(e.d)}</p>
          <div class="mini" style="margin-top:10px">👥 ${esc(e.who)}</div></div></article>`).join("")}
      </div>
      <div class="section">
        <div class="section-head"><div><span class="eyebrow">Monthly Calendar</span>
          <h2>Tamil Nadu college event calendar (2026)</h2>
          <p>Ithu oru guide mattum — exact date college website-la paarunga.</p></div></div>
        <div class="card card-pad">
          <ul class="timeline">
            <li><span class="yr">JAN 2026</span><b>Pongal Vizha & Sports Meet</b><span class="mini">Ellaa college-லும் Pongal celebration + annual sports day</span></li>
            <li><span class="yr">FEB 2026</span><b>Cultural Fest Season</b><span class="mini">IIT Saarang, NIT Festember, College culturals</span></li>
            <li><span class="yr">MAR 2026</span><b>Technical Symposiums</b><span class="mini">Paper presentation, hackathon, project expo</span></li>
            <li><span class="yr">APR-MAY 2026</span><b>University Exams & Convocation</b><span class="mini">Semester exams + graduation day</span></li>
            <li><span class="yr">JUN 2026</span><b>Admission Counselling Starts</b><span class="mini">TNEA / TANCET / NEET counselling notification</span></li>
            <li><span class="yr">JUL-AUG 2026</span><b>Fresher's Day & Orientation</b><span class="mini">New students welcome, induction programme</span></li>
            <li><span class="yr">SEP-OCT 2026</span><b>Placement Drive Season</b><span class="mini">Final year students-ku company interviews</span></li>
            <li><span class="yr">NOV-DEC 2026</span><b>Study Tour, NSS Camp, Inter-college Meets</b><span class="mini">Industrial visits + social service camps</span></li>
          </ul>
        </div>
      </div>`;
  }

  /* ------------------------- 3.15 DASHBOARD PAGE ----------------------- */
  function initDashboard() {
    const u = getUser(); const root = $("#dashRoot"); if (!root) return;
    if (!u) { location.href = "login.html?next=dashboard.html"; return; }
    const place = DB.get("place", null);
    const lat = place ? place.lat : (districtInfo(u.district) || {}).lat;
    const lng = place ? place.lng : (districtInfo(u.district) || {}).lng;
    const recommended = searchColleges({
      district: u.district, level: u.level, kinds: u.stream ? [u.stream] : [], sort: "nearby",
      userLat: lat, userLng: lng
    });
    const fallback = recommended.length ? recommended :
      searchColleges({ district: u.district, level: u.level, sort: "nearby", userLat: lat, userLng: lng });
    const final = fallback.length ? fallback : searchColleges({ level: u.level, sort: "nearby", userLat: lat, userLng: lng });
    const saved = savedIds().map(findCollege).filter(Boolean);
    const myR = DB.get("reviews", {});
    const myRevCount = Object.values(myR).flat().filter(r => r.name === u.name).length;
    const levelLabel = u.level === "10th" ? "After 10th (Diploma / ITI)" : u.level === "12th" ? "After 12th (Degree)" : "PG / Research";

    document.title = "My Dashboard — " + u.name;
    root.innerHTML = `
      <div class="profile-hero" style="margin-bottom:24px">
        <span class="avatar">${esc(u.name.charAt(0).toUpperCase())}</span>
        <div style="flex:1">
          <h1>Vanakkam, ${esc(u.name.split(" ")[0])}! 👋</h1>
          <p>${esc(u.email)} ${u.phone ? "· " + esc(u.phone) : ""} · 📍 ${esc(u.district || "District set pannala")}</p>
          <div class="wrapflex" style="margin-top:10px">
            <span class="chip" style="background:rgba(255,255,255,.2);color:#fff">🎯 ${levelLabel}</span>
            ${u.stream ? `<span class="chip" style="background:rgba(255,255,255,.2);color:#fff">📘 ${esc(KIND_LABEL[u.stream] || u.stream)}</span>` : ""}
            <span class="chip" style="background:rgba(255,255,255,.2);color:#fff">⭐ ${saved.length} saved</span>
          </div>
        </div>
        <button class="btn btn-accent" id="editProf">✏️ Profile Edit</button>
      </div>

      <div class="stat-grid" style="margin-bottom:26px">
        <div class="stat-box"><b>${final.length}</b><span>UNGAKku MATCH AAGUM COLLEGES</span></div>
        <div class="stat-box"><b>${saved.length}</b><span>SAVED COLLEGES</span></div>
        <div class="stat-box"><b>${coursesForLevelCount(u)}</b><span>COURSES UNGA LEVEL-ல</span></div>
        <div class="stat-box"><b>${myRevCount}</b><span>UNGA REVIEWS</span></div>
      </div>

      <section style="margin-bottom:30px">
        <div class="section-head"><div><span class="eyebrow">Recommendation</span>
          <h2>Unga ooru & choice-ku match aagura colleges</h2>
          <p>${esc(u.district || "Tamil Nadu")} pakkathula, ${levelLabel} level-ku — nearest first-a arrange pannirukkom.</p></div>
          <a class="btn btn-ghost" href="colleges.html?district=${encodeURIComponent(u.district || "")}&level=${encodeURIComponent(u.level || "")}&sort=nearby">Ellathaiyum paaru →</a>
        </div>
        <div class="grid g3">${final.slice(0, 6).map(c => collegeCard(c, c._dist)).join("")}</div>
      </section>

      <section style="margin-bottom:30px">
        <div class="section-head"><div><span class="eyebrow">My List</span><h2>Saved colleges</h2>
        <p>Nee save panna college-ngal — compare panna easy.</p></div>
        ${saved.length > 1 ? `<a class="btn btn-primary" href="compare.html?ids=${saved.map(s => s.id).join(",")}">⇄ Compare pannu</a>` : ""}</div>
        ${saved.length ? `<div class="grid g3">${saved.map(c => collegeCard(c)).join("")}</div>`
          : `<div class="empty card" style="padding:40px"><div class="em">☆</div><h3>Innum onnum save pannala</h3>
             <p>College card-la "☆ Save" button-a click pannunga.</p>
             <a class="btn btn-primary" style="margin-top:14px" href="colleges.html">Colleges paaru →</a></div>`}
      </section>

      <section>
        <div class="section-head"><div><span class="eyebrow">Career Plan</span><h2>Next steps checklist</h2></div></div>
        <div class="grid g2">
          ${(u.level === "10th" ? [
        ["Diploma / ITI counselling register pannunga", "TN Polytechnic counselling (DoTE) website-la online registration"],
        ["Community & nativity certificate ready pannunga", "Counselling-la ithu kandippa venum"],
        ["10th marksheet + TC scan pannunga", "PDF/JPG 200KB-ku kammi size-la"],
        ["Top 3 diploma college select pannunga", "Pakkathu college + hostel facility paarunga"]
      ] : u.level === "12th" ? [
        ["TNEA / TANCET / NEET counselling notification follow pannunga", "June-la notification varum"],
        ["Cut-off kanakku pannunga", "Maths+Physics+Chemistry marks"],
        ["Choice list 50+ college fill pannunga", "Safety, target, dream — moonu category-a"],
        ["Original certificates ready vaingaa", "Marksheet, TC, community, income, nativity, Aadhaar"]
      ] : [
        ["TANCET / university entrance exam register pannunga", "PG admission-ku entrance venum"],
        ["UG consolidated marksheet + degree certificate ready", "Counselling-la venum"],
        ["Specialization decide pannunga", "MBA-ku Finance/HR/Marketing, M.E-ku branch"],
        ["Placement record paarunga", "Avg package + recruiter list paarunga"]
      ]).map(([t, s]) => `<div class="card card-pad row" style="gap:14px;align-items:flex-start">
            <span class="ic" style="width:26px;height:26px;border-radius:8px;background:var(--soft);color:var(--c1);display:grid;place-items:center;font-weight:800;flex:0 0 auto">✓</span>
            <div><b>${esc(t)}</b><div class="mini">${esc(s)}</div></div></div>`).join("")}
        </div>
      </section>`;

    $("#editProf").onclick = () => {
      const back = modal("Profile Edit", `
        <div class="field"><label>Name</label><input class="input" id="epName" value="${esc(u.name)}"></div>
        <div class="field"><label>Phone</label><input class="input" id="epPhone" value="${esc(u.phone || "")}"></div>
        <div class="field"><label>Ooru / District</label><select class="select" id="epDist">${DISTRICTS.map(d => `<option ${u.district === d.name ? "selected" : ""}>${esc(d.name)}</option>`).join("")}</select></div>
        <div class="field"><label>Level</label><select class="select" id="epLevel">
          ${["10th", "12th", "PG"].map(l => `<option value="${l}" ${u.level === l ? "selected" : ""}>${l === "10th" ? "10th mudinjirukku" : l === "12th" ? "12th mudinjirukku" : "UG mudinjirukku (PG)"}</option>`).join("")}</select></div>`,
        `<button class="btn btn-ghost" data-x>Cancel</button><button class="btn btn-primary" id="epSave">Save</button>`);
      back.querySelector("#epSave").onclick = () => {
        u.name = back.querySelector("#epName").value.trim() || u.name;
        u.phone = back.querySelector("#epPhone").value.trim();
        u.district = back.querySelector("#epDist").value;
        u.level = back.querySelector("#epLevel").value;
        const users = allUsers(); const i = users.findIndex(x => x.email === u.email);
        if (i > -1) users[i] = u; DB.set("users", users); DB.set("session", u);
        back.remove(); toast("Profile update aagiduchu", "ok"); setTimeout(() => location.reload(), 600);
      };
    };
    bindCardActions(); revealInit();
  }
  const coursesForLevelCount = (u) => COURSES.filter(c => c.level === u.level).length;

  /* --------------------------- 3.16 COMPARE PAGE ----------------------- */
  function initComparePage() {
    const root = $("#compareRoot"); if (!root) return;
    const ids = (qs("ids") || compareIds().join(",")).split(",").filter(Boolean).map(findCollege).filter(Boolean);
    if (!ids.length) {
      root.innerHTML = `<div class="empty"><div class="em">⇄</div><h2>Compare panna college select pannala</h2>
        <p>Colleges page-la "⇄ Compare" click panni 2-3 college select pannunga.</p>
        <a class="btn btn-primary" style="margin-top:14px" href="colleges.html">Colleges paaru →</a></div>`;
      return;
    }
    const rows = [
      ["College", c => c.name], ["District", c => c.district + " (" + c.area + ")"], ["Type", c => c.type],
      ["Established", c => c.estd], ["Rating", c => "★ " + c.rating.toFixed(1) + " (" + c.reviews.toLocaleString("en-IN") + ")"],
      ["Courses count", c => coursesForCollege(c).length + " courses"],
      ["After 10th courses", c => coursesForCollege(c, "10th").length],
      ["After 12th courses", c => coursesForCollege(c, "12th").length],
      ["PG courses", c => coursesForCollege(c, "PG").length],
      ["Avg package", c => placementFor(c).avgPackage], ["Highest package", c => placementFor(c).highPackage],
      ["Placement rate", c => placementFor(c).placementRate + "%"],
      ["Hostel", c => c.hostel ? "✅ Available" : "❌ Illa"],
      ["Fee band", c => FEE_LABEL[feeBand(c)]],
      ["Facilities", c => facilitiesFor(c).length + " facilities"],
      ["Map", c => `<a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="${dirLink(c.lat, c.lng)}">🧭 Directions</a>`]
    ];
    root.innerHTML = `
      <div class="section-head"><div><span class="eyebrow">Comparison</span>
        <h2>${ids.length} college — side by side compare</h2>
        <p>Fees, courses, placement, hostel, rating ellathaiyum oru table-la paarunga.</p></div>
        <button class="btn btn-ghost" id="cmpReset">Clear</button></div>
      <div style="overflow-x:auto" class="card">
        <table style="width:100%;border-collapse:collapse;min-width:${ids.length * 260 + 200}px">
          <thead><tr style="background:var(--soft)">
            <th style="padding:14px;text-align:left;font-size:.85rem">FEATURE</th>
            ${ids.map(c => `<th style="padding:14px;text-align:left;border-left:1px solid var(--line)">
              <img src="${esc(c.img)}" style="width:100%;height:96px;object-fit:cover;border-radius:10px;margin-bottom:10px">
              <a href="college.html?id=${esc(c.id)}" style="font-size:.95rem">${esc(c.name)}</a></th>`).join("")}
          </tr></thead>
          <tbody>
            ${rows.map((r, i) => `<tr style="border-top:1px solid var(--line);${i % 2 ? "background:#FCFCFE" : ""}">
              <td style="padding:12px 14px;font-weight:600;font-size:.86rem;color:var(--ink-3)">${esc(r[0])}</td>
              ${ids.map(c => `<td style="padding:12px 14px;border-left:1px solid var(--line);font-size:.9rem">${r[1](c)}</td>`).join("")}
            </tr>`).join("")}
          </tbody>
        </table>
      </div>
      <div class="disclaimer" style="margin-top:16px">ℹ️ Package & placement data approximate guide. Official placement report paarunga.</div>`;
    $("#cmpReset").onclick = () => { DB.set("compare", []); location.href = "colleges.html"; };
  }

  /* ---------------------------- 3.17 AUTH ----------------------------- */
  function initSignup() {
    const form = $("#signupForm"); if (!form) return;
    let step = 1;
    const chipsBox = $("#prefChips");
    const kinds = Object.keys(KIND_LABEL);
    chipsBox.innerHTML = kinds.map(k => `<button type="button" class="chip chip-outline" data-k="${k}">${esc(KIND_LABEL[k])}</button>`).join("");
    chipsBox.onclick = e => {
      const b = e.target.closest("button"); if (!b) return;
      b.classList.toggle("on");
      b.style.background = b.classList.contains("on") ? "var(--soft)" : "";
      b.style.borderColor = b.classList.contains("on") ? "var(--c1)" : "";
    };
    const gb = $("#googleBtn");
    if (gb) gb.onclick = () => modal("Google Sign-in (Demo)",
      `<p class="small">Idhu oru front-end student project. Google OAuth venumna backend server (Node + Express + Google API key) venum.
      <br><br>Ippo demo-ku <b>email + password</b>-la sign up pannunga — 30 second-la mudinjidum! 🙂</p>`);

    const dSel = $("#suDistrict");
    dSel.innerHTML = `<option value="">Ooru / District select பண்ணு</option>` + DISTRICTS.map(d => `<option>${esc(d.name)}</option>`).join("");
    const lvSel = $("#suLevel");
    lvSel.onchange = () => {
      const hints = { "10th": "Diploma, ITI, Paramedical — 10th mudicha course-ngal kaattum", "12th": "B.E, B.Sc, B.Com, BBA, Nursing — degree course-ngal kaattum", "PG": "M.E, MBA, MCA, M.Sc, M.Com — PG course-ngal kaattum" };
      $("#suLevelHint").textContent = hints[lvSel.value] || "";
    };

    function go(n) {
      step = n;
      $("#suStep1").classList.toggle("hidden", n !== 1);
      $("#suStep2").classList.toggle("hidden", n !== 2);
      $("#suStep3").classList.toggle("hidden", n !== 3);
      $$("#suDots i").forEach((d, i) => d.classList.toggle("on", i < n));
      $("#suStepTxt").textContent = n === 1 ? "Step 1 / 3 — Account" : n === 2 ? "Step 2 / 3 — Ungal Ooru & Goal" : "Step 3 / 3 — Matches ready!";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    $("#suNext").onclick = () => {
      let ok = true;
      const checks = [["#suName", v => v.length > 2], ["#suEmail", v => /^\S+@\S+\.\S+$/.test(v)], ["#suPhone", v => v.length >= 10], ["#suPass", v => v.length >= 6]];
      checks.forEach(([sel, fn]) => {
        const f = $(sel).closest(".field"); const good = fn($(sel).value.trim());
        f.classList.toggle("bad", !good); if (!good) ok = false;
      });
      if ($("#suPass").value !== $("#suPass2").value) { $("#suPass2").closest(".field").classList.add("bad"); ok = false; toast("Password rendum same-a illa", "bad"); }
      if (!ok) return toast("Fields-a sariya fill pannunga", "bad");
      setTimeout(() => toast("Nalla irukku! Adutha step-ku ponga 👍", "ok"), 100);
      go(2);
    };
    $("#suBack").onclick = () => go(1);
    form.onsubmit = e => {
      e.preventDefault();
      const district = dSel.value, level = lvSel.value;
      const kindsSel = $$("#prefChips button.on").map(b => b.dataset.k);
      if (!district) return toast("Ungal ooru / district select pannunga", "bad");
      if (!level) return toast("Level select pannunga (10th / 12th / PG)", "bad");
      const user = {
        name: $("#suName").value.trim(), email: $("#suEmail").value.trim().toLowerCase(),
        phone: $("#suPhone").value.trim(), password: $("#suPass").value.trim(),
        district, level, stream: kindsSel[0] || "", prefs: kindsSel, placed: $("#suArea").value.trim(),
        createdAt: Date.now()
      };
      const users = allUsers();
      if (users.some(u => u.email === user.email)) { toast("Intha email already register aagirukku — login pannunga", "bad"); return; }
      users.push(user); DB.set("users", users); DB.set("session", user);
      const d = districtInfo(district);
      DB.set("place", { district, lat: d.lat, lng: d.lng, area: user.placed });

      /* Match computation — pakkathu ooru + course preference */
      const matches = searchColleges({ district, level, kinds: kindsSel, sort: "nearby", userLat: d.lat, userLng: d.lng });
      const list = matches.length ? matches : searchColleges({ district, level, sort: "nearby", userLat: d.lat, userLng: d.lng });
      const top = (list.length ? list : searchColleges({ level, sort: "nearby", userLat: d.lat, userLng: d.lng })).slice(0, 3);
      $("#suMatch").innerHTML = top.map((c, i) => `
        <a class="card" href="college.html?id=${esc(c.id)}" style="display:grid;grid-template-columns:104px 1fr;gap:12px;padding:10px;align-items:center">
          <img src="${esc(c.img)}" style="width:104px;height:84px;object-fit:cover;border-radius:10px" alt="${esc(c.short)}">
          <div><span class="chip chip-warn" style="font-size:.68rem">${i === 0 ? "🥇 Best match" : i === 1 ? "🥈 2nd match" : "🥉 3rd match"}</span>
            <b style="display:block;margin-top:6px;font-size:.95rem">${esc(c.name)}</b>
            <div class="mini">📍 ${esc(c.area)}, ${esc(c.district)} · <b>${c._dist} km</b> from you</div>
            <div class="mini">★ ${c.rating.toFixed(1)} · ${coursesForCollege(c, level).length} courses unga level-ல</div></div>
        </a>`).join("");
      $("#suCourses").innerHTML = COURSES.filter(x => x.level === level)
        .slice(0, 10).map(x => `<a class="chip chip-outline" href="course.html?id=${esc(x.id)}">${esc(x.name)}</a>`).join("");
      go(3);
    };
  }

  function initLogin() {
    const form = $("#loginForm"); if (!form) return;
    form.onsubmit = e => {
      e.preventDefault();
      const email = $("#liEmail").value.trim().toLowerCase(), pass = $("#liPass").value;
      const u = allUsers().find(x => x.email === email && x.password === pass);
      if (!u) { toast("Email / password thappu. Illainaa mudhalla sign up pannunga.", "bad"); return; }
      DB.set("session", u);
      if (u.district && !DB.get("place", null)) { const d = districtInfo(u.district); DB.set("place", { district: u.district, lat: d.lat, lng: d.lng }); }
      toast("Vanakkam " + u.name.split(" ")[0] + "! Login success 🎉", "ok");
      setTimeout(() => location.href = qs("next") || "dashboard.html", 700);
    };
    const demo = $("#demoFill");
    if (demo) demo.onclick = () => {
      const users = allUsers();
      if (!users.length) return toast("Innum yaarum sign up pannala — mudhalla sign up pannunga", "bad");
      $("#liEmail").value = users[users.length - 1].email; $("#liPass").value = users[users.length - 1].password;
      toast("Last signup details fill panniten — Login click pannunga", "ok");
    };
    $("#googleBtn").onclick = () => modal("Google Sign-in (Demo)",
      `<p class="small">Ithu oru front-end student project — Google OAuth venumna backend server (Node + Express + Google API) venum.
      <br><br>Ippo demo-ku <b>email + password sign up</b> use pannunga. Ella data-um ungal browser-la (localStorage) safe-a save aagum.</p>`);
  }

  /* --------------------------- 3.18 PASSWORD TOGGLE -------------------- */
  function initPwToggles() {
    $$("[data-pw]").forEach(b => b.onclick = () => {
      const i = $("#" + b.dataset.pw);
      i.type = i.type === "password" ? "text" : "password";
      b.textContent = i.type === "password" ? "Show" : "Hide";
    });
  }

  /* ------------------------ 3.19 SCROLL / REVEAL ----------------------- */
  let io;
  function revealInit() {
    if (!("IntersectionObserver" in window)) { $$(".reveal").forEach(e => e.classList.add("in")); return; }
    if (!io) io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .08 });
    $$(".reveal:not(.in)").forEach(e => io.observe(e));
  }

  /* ---------------------------- 3.20 BOOT ------------------------------ */
  function boot() {
    renderNav(); renderFooter(); drawCompareBar();
    if (!DB.ok()) setTimeout(() => toast("Browser-la storage block aagirukku — signup data save aagaadhu. VS Code-la Live Server illa `python -m http.server` use pannunga.", ""), 1200);
    const page = document.body.dataset.page;
    ({ home: initHome, colleges: initCollegesPage, college: initCollegePage, courses: initCoursesPage,
       course: initCoursePage, districts: initDistrictsPage, map: initMapPage, events: initEventsPage,
       dashboard: initDashboard, compare: initComparePage, signup: initSignup, login: initLogin }[page] || function () {})();
    initPwToggles();
    /* Loader off */
    const l = $(".loader"); if (l) setTimeout(() => l.classList.add("off"), 350);
    /* Back to top */
    const tt = $(".to-top");
    if (tt) { window.addEventListener("scroll", () => tt.classList.toggle("on", window.scrollY > 700), { passive: true });
      tt.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" }); }
    /* Accordion */
    $$(".acc-head").forEach(h => h.onclick = () => h.parentElement.classList.toggle("on"));
    /* Search shortcut: Ctrl+K */
    document.addEventListener("keydown", e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); location.href = "colleges.html#fQuery";
      }
    });
    revealInit();
  }
  document.addEventListener("DOMContentLoaded", boot);

  /* Vere page-ngal use panna vendi export */
  window.ADM = { toast, modal, DB, mapEmbed, stars, esc, getUser, distanceKm, searchColleges, collegeCard, courseTile };
})();
