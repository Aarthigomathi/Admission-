/* =====================================================
   KalviPortal — districts.js
   District Atlas: per-district college counts with a
   category breakdown (eng / arts / med / poly). (bilingual)
   ===================================================== */
document.addEventListener("DOMContentLoaded", ()=>{
  guard();
  initTheme();
  renderNav("atlas");
  renderFooter();
  applyI18n();

  const rows = Object.entries(DISTRICT_STATS || {});
  if(!rows.length) return;

  /* state-wide totals */
  const sum = [1,2,3,4].map(i=>rows.reduce((s,[,d])=>s+(d[i]||0),0));
  const stateTot = rows.reduce((s,[,d])=>s+(d[0]||0),0);
  const st = document.getElementById("stateTotal");
  if(st) st.textContent = stateTot.toLocaleString("en-IN");

  const max = Math.max(...rows.map(([,d])=>d[0]));

  const grid = document.getElementById("atlasGrid");
  grid.innerHTML = rows.sort((a,b)=>b[1][0]-a[1][0]).map(([city,d],i)=>{
    const [tot,eng,arts,med,poly] = d;
    const seg = n => tot ? Math.max(1.5, (n/tot)*100) : 0;
    const nm  = cityName(city);
    const sub = nm===city ? "" : city;
    return `
    <article class="dcard reveal" style="transition-delay:${Math.min(i*35,420)}ms">
      <div class="dcard-top">
        <div>
          <h3 class="dcard-city">${nm}</h3>
          ${sub ? `<span class="dcard-en">${city}</span>` : ""}
        </div>
        <div class="dcard-total"><b data-count="${tot}">0</b><span>${t("total_word")}</span></div>
      </div>

      <div class="dbar" role="img" aria-label="${city} breakdown">
        <span class="seg seg-eng"  style="width:${seg(eng)}%"></span>
        <span class="seg seg-arts" style="width:${seg(arts)}%"></span>
        <span class="seg seg-med"  style="width:${seg(med)}%"></span>
        <span class="seg seg-poly" style="width:${seg(poly)}%"></span>
      </div>

      <div class="drows">
        <div class="drow"><span class="lg-dot dot-eng"></span><i class="fa-solid fa-gears"></i><span>${t("eng_word")}</span><b>${eng}</b></div>
        <div class="drow"><span class="lg-dot dot-arts"></span><i class="fa-solid fa-book-open"></i><span>${t("arts_word")}</span><b>${arts}</b></div>
        <div class="drow"><span class="lg-dot dot-med"></span><i class="fa-solid fa-stethoscope"></i><span>${t("med_word")}</span><b>${med}</b></div>
        <div class="drow"><span class="lg-dot dot-poly"></span><i class="fa-solid fa-screwdriver-wrench"></i><span>${t("poly_word")}</span><b>${poly}</b></div>
      </div>

      <a class="btn sm btn-atlas" href="colleges.html?city=${encodeURIComponent(city)}">${t("view_colleges_btn")} <i class="fa-solid fa-arrow-right"></i></a>
    </article>`;
  }).join("");

  applyI18n();
  initReveal();
  animateCounters();
});
