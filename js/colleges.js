/* =====================================================
   KalviPortal — colleges.js
   All TN colleges page: search, city filter, compare,
   favourites + user city priority. (bilingual)
   ===================================================== */
document.addEventListener("DOMContentLoaded", ()=>{
  guard();
  initTheme();
  renderNav("colleges");
  renderFooter();
  applyI18n();

  const user = getUser();
  const params = new URLSearchParams(location.search);

  /* city dropdown (Tamil names in Tamil mode) */
  const citySel = $("#fCity");
  citySel.innerHTML = `<option value="">${t("all_cities")}</option>` +
    CITIES.map(c=>`<option value="${c}">${cityName(c)}</option>`).join("") +
    `<option value="Other">${cityName("Other")}</option>`;

  const catSel = $("#fCat");
  catSel.innerHTML = `<option value="">${t("all_cats")}</option>` +
    CATEGORIES.map(c=>`<option value="${c}">${catName(c)}</option>`).join("");

  /* URL params / user city pre-select */
  $("#fSearch").value = params.get("q") || "";
  const urlCity = params.get("city");
  if(urlCity) citySel.value = urlCity;
  else if(user.city && user.city!=="Other") citySel.value = user.city;   /* user ooru default! */

  function filtered(){
    const q = $("#fSearch").value.trim().toLowerCase();
    const city = citySel.value;
    const cat = catSel.value;
    const onlyFav = $("#fOnlyFav").checked;
    return COLLEGES.filter(c=>{
      if(city && c.city!==city) return false;
      if(cat && c.category!==cat) return false;
      if(onlyFav && !isFav(c.id)) return false;
      if(q){
        const hay = (c.name+" "+c.city+" "+(CITY_TA[c.city]||"")+" "+c.category+" "+c.tags.join(" ")+" "+c.oneLiner+" "+(c.ta||"")).toLowerCase();
        if(!hay.includes(q)) return false;
      }
      return true;
    }).sort((a,b)=>{
      /* user ooru colleges always first */
      if(user.city){
        if(a.city===user.city && b.city!==user.city) return -1;
        if(b.city===user.city && a.city!==user.city) return 1;
      }
      return b.rating - a.rating;
    });
  }

  function render(){
    const list = filtered();
    $("#countNote").textContent = tt("count_note", {n: list.length});
    $("#grid").innerHTML = list.length ? list.map(collegeCardHTML).join("") :
      `<div class="empty-note card">${t("empty_note")}</div>`;
    wireCardActions($("#grid"));

    /* city banner */
    const banner = $("#cityBanner");
    const myCount = COLLEGES.filter(c=>c.city===user.city).length;
    if(user.city!=="Other" && myCount>0 && !citySel.value){
      banner.style.display = "flex";
      $("#bannerText").innerHTML = tt("banner_text", {name:user.name.split(" ")[0], city:cityName(user.city), n:myCount});
    } else banner.style.display = "none";

    /* compare checkboxes */
    $$("[data-cmp]").forEach(cb=>{
      cb.checked = compareList.includes(cb.dataset.cmp);
      cb.onchange = ()=>{ if(!toggleCompare(cb.dataset.cmp, cb.checked)) cb.checked = false; };
    });
    initReveal();
  }

  $("#fSearch").addEventListener("input", render);
  citySel.addEventListener("change", render);
  catSel.addEventListener("change", render);
  $("#fOnlyFav").addEventListener("change", render);

  /* compare bar */
  $("#cmpLabel").innerHTML = t("compare_lbl");
  $("#cmpGo").textContent = t("compare_now");
  $("#cmpClear").textContent = t("clear");
  $("#cmpGo").onclick = openCompareModal;
  $("#cmpClear").onclick = ()=>{ compareList = []; updateCompareBar(); render(); };

  render();
});
