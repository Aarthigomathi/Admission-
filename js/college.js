/* =====================================================
   KalviPortal — college.js
   Featured campus pages (Anna Univ / IIT-M / Loyola).
   body data-college attribute use pannum. (bilingual)
   ===================================================== */
document.addEventListener("DOMContentLoaded", ()=>{
  guard();
  initTheme();
  const navType = document.body.dataset.nav || "colleges";
  renderNav(navType);
  renderFooter();
  applyI18n();

  const id = new URLSearchParams(location.search).get("id") || document.body.dataset.college;
  const c = COLLEGES.find(x=>x.id===id);
  const det = COLLEGE_DETAILS[id] || {};
  const evs = COLLEGE_EVENTS[id] || [];
  if(!c){ location.href = "colleges.html"; return; }

  const TA = LANG === "ta";

  /* ---------- fill common fields ---------- */
  $$("[data-fill=name]").forEach(e=>e.textContent = c.name);
  $$("[data-fill=oneliner]").forEach(e=>e.textContent = TA && c.ta ? c.ta : c.oneLiner);
  $$("[data-fill=about]").forEach(e=>e.textContent = TA && det.aboutTa ? det.aboutTa : (det.about || c.oneLiner));
  $$("[data-fill=city]").forEach(e=>e.textContent = cityName(c.city));
  $$("[data-fill=founded]").forEach(e=>e.textContent = c.founded);
  $$("[data-fill=seats]").forEach(e=>e.textContent = c.seats);
  $$("[data-fill=fee]").forEach(e=>e.textContent = c.fee);
  $$("[data-fill=rating]").forEach(e=>e.textContent = c.rating + " ★");
  $$("[data-fill=reviewscount]").forEach(e=>e.textContent = c.reviewsCount + " " + t("reviews_word"));
  $$("[data-fill=img]").forEach(e=>{ e.src = c.img; e.onerror = ()=>{ e.src=(CAT_META[c.category]||{}).img||"images/hero.jpg"; }; });
  $$("[data-fill=tags]").forEach(e=>e.innerHTML = c.tags.map(tg=>`<span class="tag">${tg}</span>`).join(""));

  /* highlights (language-aware) */
  const hl = $("[data-fill=highlights]");
  if(hl && det.highlights){
    const arr = TA && det.highlightsTa ? det.highlightsTa : det.highlights;
    hl.innerHTML = arr.map(h=>`<div class="card fact reveal"><b><i class="fa-solid fa-circle-check"></i></b><span>${h}</span></div>`).join("");
  }

  /* departments */
  const dp = $("[data-fill=departments]");
  if(dp && det.departments){
    dp.innerHTML = det.departments.map(d=>`
      <div class="card dept-card reveal">
        <div class="ic"><i class="${d.ic}"></i></div>
        <div><h4>${TA && d.nameTa ? d.nameTa : d.name}</h4><p>${TA && d.descTa ? d.descTa : d.desc}</p></div>
      </div>`).join("");
  }

  /* department pills (loyola style) */
  const pp = $("[data-fill=pills]");
  if(pp && det.departments){
    pp.innerHTML = det.departments.map(d=>`<span class="pill"><i class="${d.ic}"></i> ${TA && d.nameTa ? d.nameTa : d.name}</span>`).join("");
  }

  /* events (hide section when none) */
  const ev = $("[data-fill=events]");
  if(ev){
    ev.innerHTML = evs.map(e=>`
      <div class="card event-card reveal">
        <div class="event-date"><b>${e.d}</b><span>${TA && e.mTa ? e.mTa : e.m}</span></div>
        <div><h4>${TA && e.titleTa ? e.titleTa : e.title}</h4><p>${TA && e.descTa ? e.descTa : e.desc}</p></div>
      </div>`).join("");
    if(!evs.length){ const sec = ev.closest("section"); if(sec) sec.style.display = "none"; }
  }

  /* gallery (strings OR {src,cap,capTa} objects) */
  const gal = $("[data-fill=gallery]");
  if(gal){
    const imgs = det.gallery || ["images/hero.jpg","images/college-red.jpg","images/college-orange.jpg","images/college-yellow.jpg","images/events.jpg","images/campus-life.jpg"];
    gal.innerHTML = imgs.map((im,i)=>{
      const src = typeof im === "string" ? im : im.src;
      const cap = typeof im === "string" ? "" : (TA && im.capTa ? im.capTa : im.cap);
      return `<figure><img src="${src}?v=16" alt="${cap || ('Campus photo '+(i+1))}" loading="lazy">${cap?`<figcaption><i class="fa-solid fa-camera"></i> ${cap}</figcaption>`:""}</figure>`;
    }).join("");
  }

  /* official website link (footer of featured campus pages) */
  const offUrl = c.official || det.official;
  $$( "[data-fill=official]" ).forEach(a=>{
    if(offUrl){ a.href = offUrl; } else { a.style.display = "none"; }
  });
  if(!offUrl){ $$(".psg-official").forEach(s=>s.style.display="none"); }

  /* page title */
  document.title = c.name + " — KalviPortal";

  /* map */
  const mf = $("[data-fill=mapframe]");
  if(mf){
    mf.innerHTML = `<iframe src="https://www.google.com/maps?q=${encodeURIComponent(c.map)}&output=embed" loading="lazy"></iframe>`;
  }
  $$("[data-fill=maplink]").forEach(a=>{
    a.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.map)}`;
  });

  /* map subtitle (per-page key with city) */
  const mapSub = $("[data-fill=mapsub]");
  if(mapSub){
    mapSub.innerHTML = tt(mapSub.dataset.mapsubKey || "map_sub_anna", {city: cityName(c.city)});
  }

  /* reviews */
  renderReviewList(id, $("#revList"));
  bindReviewForm($("#revForm"), id, $("#revList"));

  /* favourite button */
  const favBtn = $("[data-favbtn]");
  if(favBtn){
    const paint = ()=>{ favBtn.innerHTML = isFav(id) ? `<i class="fa-solid fa-heart"></i> ${t("saved")}` : `<i class="fa-regular fa-heart"></i> ${t("save_college")}`; };
    favBtn.onclick = ()=>{ toggleFav(id); paint(); };
    paint();
  }

  initReveal();
  animateCounters();
});
