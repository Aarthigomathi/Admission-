/* =====================================================
   KalviPortal — app.js
   Common code: navbar, footer, reviews, favourites,
   compare, dark mode, toasts. (clean, icon-based UI)
   ===================================================== */

const $  = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];

/* ---------- user ---------- */
function getUser(){ try{ return JSON.parse(localStorage.getItem("edu_user")); }catch(e){ return null; } }
function signOut(){ localStorage.removeItem("edu_user"); location.href = "index.html"; }
function guard(){ if(!getUser()) location.href = "index.html"; }

/* ---------- toast ---------- */
function toast(msg){
  let tEl = $("#toast");
  if(!tEl){ tEl = document.createElement("div"); tEl.id = "toast"; document.body.appendChild(tEl); }
  tEl.textContent = msg;
  tEl.classList.add("show");
  clearTimeout(tEl._h);
  tEl._h = setTimeout(()=>tEl.classList.remove("show"), 2600);
}

/* ---------- favourites ---------- */
function getFavs(){ try{ return JSON.parse(localStorage.getItem("edu_favs")) || []; }catch(e){ return []; } }
function isFav(id){ return getFavs().includes(id); }
function toggleFav(id){
  let f = getFavs();
  if(f.includes(id)){ f = f.filter(x=>x!==id); toast(t("toast_fav_rm")); }
  else { f.push(id); toast(t("toast_fav_add")); }
  localStorage.setItem("edu_favs", JSON.stringify(f));
  $$(`[data-fav="${id}"]`).forEach(b=>{
    b.classList.toggle("on", f.includes(id));
    const ic = b.querySelector("i"); if(ic) ic.className = f.includes(id) ? "fa-solid fa-heart" : "fa-regular fa-heart";
  });
  return f.includes(id);
}

/* ---------- reviews ---------- */
function getReviews(id){
  const seed = (SEED_REVIEWS[id] || SEED_REVIEWS.default).map(r=>({...r, mine:false}));
  let mine = [];
  try{ mine = (JSON.parse(localStorage.getItem("edu_reviews_"+id))||[]).map(r=>({...r, mine:true})); }catch(e){}
  return [...mine.reverse(), ...seed];
}
function saveReview(id, review){
  let list = [];
  try{ list = JSON.parse(localStorage.getItem("edu_reviews_"+id))||[]; }catch(e){}
  list.push(review);
  localStorage.setItem("edu_reviews_"+id, JSON.stringify(list));
}
function starHTML(n){ let out=""; for(let i=1;i<=5;i++) out += i<=n ? "★" : "☆"; return out; }
function renderReviewList(id, container){
  const list = getReviews(id);
  container.innerHTML = list.map(r=>`
    <div class="card review reveal visible">
      <div class="who">
        <div class="avatar">${r.name.charAt(0).toUpperCase()}</div>
        <div><b>${r.name}${r.mine?` <small class="txt-orange">${t("you_label")}</small>`:''}</b>
        <div class="stars">${starHTML(r.stars)}</div></div>
      </div>
      <p>${r.text}</p>
    </div>`).join("");
}
function bindReviewForm(form, id, listEl){
  if(!form) return;
  let picked = 5;
  $$(".star-pick button", form).forEach((b,i)=>{
    b.addEventListener("click", ()=>{
      picked = i+1;
      $$(".star-pick button", form).forEach((x,j)=>x.classList.toggle("on", j<picked));
    });
  });
  form.addEventListener("submit", e=>{
    e.preventDefault();
    const user = getUser();
    const text = $("textarea", form).value.trim();
    if(!text){ toast(t("toast_review_empty")); return; }
    saveReview(id, {name: user ? user.name : "Guest", stars: picked, text, date: new Date().toLocaleDateString()});
    form.reset();
    $$(".star-pick button", form).forEach((x,j)=>x.classList.toggle("on", j<5));
    renderReviewList(id, listEl);
    toast(t("toast_review"));
  });
}

/* ---------- college card ---------- */
function collegeCardHTML(c){
  return `
  <div class="card col-card reveal">
    <button class="heart ${isFav(c.id)?'on':''}" data-fav="${c.id}" title="Save"><i class="${isFav(c.id)?'fa-solid':'fa-regular'} fa-heart"></i></button>
    <label class="cmp-check"><input type="checkbox" data-cmp="${c.id}"> ${t("card_compare")}</label>
    <img class="thumb" src="${c.img}" alt="${c.name}" loading="lazy" onerror="this.onerror=null;var m=(COLLEGES.find(x=>x.name===this.alt)||{}).category;this.src=(CAT_META[m]||{}).img||'images/hero.jpg'">
    <div class="body">
      <div class="badges">
        <span class="badge city"><i class="fa-solid fa-location-dot"></i> ${cityName(c.city)}</span>
        <span class="badge cat">${catName(c.category)}</span>
        ${c.featured?`<span class="badge feat"><i class="fa-solid fa-star"></i> ${t("card_featured")}</span>`:''}
      </div>
      <h3>${c.name}</h3>
      <p class="oner">${LANG==="ta" && c.ta ? c.ta : c.oneLiner}</p>
      <div class="tags">${c.tags.slice(0,3).map(tg=>`<span class="tag">${tg}</span>`).join("")}</div>
      <div class="rating-line"><span class="stars">${starHTML(Math.round(c.rating))}</span> ${c.rating} <small>(${c.reviewsCount} ${t("reviews_word")})</small></div>
      <div class="card-actions">
        <a class="btn sm" href="${c.page || ('college-view.html?id='+c.id)}"><i class="fa-solid fa-building-columns"></i> ${t("card_campus")}</a>
        <button class="btn sm ghost" data-view="${c.id}"><i class="fa-regular fa-eye"></i> ${t("card_quick")}</button>
        ${c.official ? `<a class="btn sm ghost" href="${c.official}" target="_blank" title="${t("card_official")}"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : ''}
      </div>
    </div>
  </div>`;
}
function wireCardActions(scope=document){
  $$("[data-fav]", scope).forEach(b=>{ b.onclick = ()=> toggleFav(b.dataset.fav); });
  $$("[data-view]", scope).forEach(b=>{ b.onclick = ()=> openCollegeModal(b.dataset.view); });
}

/* ---------- quick-view modal ---------- */
function openCollegeModal(id){
  const c = COLLEGES.find(x=>x.id===id);
  if(!c) return;
  $("#quickBody").innerHTML = `
    <img src="${c.img}" alt="${c.name}" style="width:100%;height:220px;object-fit:cover;border-radius:17px" onerror="this.src='images/hero.jpg'">
    <h2 style="margin-top:15px">${c.name}</h2>
    <div class="badges" style="margin:9px 0">
      <span class="badge city"><i class="fa-solid fa-location-dot"></i> ${cityName(c.city)}</span>
      <span class="badge cat">${catName(c.category)}</span>
      <span class="badge gold">${t("since_word")} ${c.founded}</span>
    </div>
    <p class="sub">${LANG==="ta" && c.ta ? c.ta : c.oneLiner}</p>
    <div class="fact-strip">
      <div class="fact"><b>${c.rating} ★</b><span>${c.reviewsCount} ${t("reviews_word")}</span></div>
      <div class="fact"><b>${c.seats}</b><span>${t("seats_word")}</span></div>
      <div class="fact"><b>${c.fee}</b><span>${t("fees_word")}</span></div>
    </div>
    <div class="tags" style="margin-top:15px">${c.tags.map(tg=>`<span class="tag">${tg}</span>`).join("")}</div>
    <h3 style="margin-top:20px"><i class="fa-solid fa-map-location-dot txt-orange"></i> ${t("map_title")}</h3>
    <div class="map-frame" style="margin-top:9px">
      <iframe src="https://www.google.com/maps?q=${encodeURIComponent(c.map)}&output=embed" loading="lazy"></iframe>
    </div>
    <a class="btn sm ghost" style="margin-top:11px" target="_blank"
       href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.map)}"><i class="fa-solid fa-diamond-turn-right"></i> ${t("directions")}</a>
    <h3 style="margin-top:20px">${t("rev_title")}</h3>
    <div id="qReviews" class="grid c2" style="margin-top:11px"></div>
    <form id="qRevForm" style="margin-top:15px">
      <div class="star-pick" style="margin-bottom:7px">
        ${[1,2,3,4,5].map(i=>`<button type="button" class="on">★</button>`).join("")}
      </div>
      <textarea rows="2" placeholder="${t("rev_ph")}" style="width:100%;padding:11px;border-radius:13px;border:2.5px solid var(--line);background:var(--cream);font-family:inherit;color:var(--ink);font-weight:600"></textarea>
      <button class="btn sm" style="margin-top:9px">${t("submit_review")}</button>
    </form>`;
  renderReviewList(id, $("#qReviews"));
  bindReviewForm($("#qRevForm"), id, $("#qReviews"));
  $("#quickOverlay").classList.add("show");
  document.body.style.overflow = "hidden";
}
function closeModals(){
  $$(".overlay").forEach(o=>o.classList.remove("show"));
  document.body.style.overflow = "";
}

/* ---------- compare ---------- */
let compareList = [];
function toggleCompare(id, checked){
  if(checked){
    if(compareList.length>=3){ toast(t("max_compare")); return false; }
    if(!compareList.includes(id)) compareList.push(id);
  } else compareList = compareList.filter(x=>x!==id);
  updateCompareBar();
  return true;
}
function updateCompareBar(){
  const bar = $("#compareBar");
  if(!bar) return;
  if(compareList.length>0){
    bar.classList.add("show");
    $("#cmpNames").innerHTML = compareList.map(id=>{
      const c = COLLEGES.find(x=>x.id===id);
      return `<span class="tag">${c?c.name:id}</span>`;
    }).join(" ");
  } else bar.classList.remove("show");
}
function openCompareModal(){
  const cols = compareList.map(id=>COLLEGES.find(x=>x.id===id)).filter(Boolean);
  if(cols.length<2){ toast(t("select_2")); return; }
  const rows = [
    [t("cmp_city"), c=>cityName(c.city)],
    [t("cmp_cat"), c=>catName(c.category)],
    [t("cmp_since"), c=>c.founded],
    [t("cmp_rating"), c=>`${starHTML(Math.round(c.rating))} ${c.rating}`],
    [t("cmp_reviews"), c=>c.reviewsCount],
    [t("cmp_seats"), c=>c.seats],
    [t("cmp_fees"), c=>c.fee],
    [t("cmp_courses"), c=>c.tags.slice(0,5).join(", ")],
  ];
  $("#compareBody").innerHTML = `
    <table class="compare-table">
      <tr><th></th>${cols.map(c=>`<th>${c.name}</th>`).join("")}</tr>
      ${rows.map(([label,fn])=>`<tr><td>${label}</td>${cols.map(c=>`<td>${fn(c)}</td>`).join("")}</tr>`).join("")}
    </table>
    <p class="sub" style="margin-top:15px;font-weight:600">${t("cmp_tip")}</p>`;
  $("#compareOverlay").classList.add("show");
  document.body.style.overflow = "hidden";
}

/* ---------- dark mode ---------- */
function initTheme(){ if(localStorage.getItem("edu_theme")==="dark") document.body.classList.add("dark"); }
function toggleTheme(){
  document.body.classList.toggle("dark");
  localStorage.setItem("edu_theme", document.body.classList.contains("dark") ? "dark" : "light");
  const b = $("#themeBtn");
  if(b) b.innerHTML = document.body.classList.contains("dark") ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
}

/* ---------- navbar + footer ---------- */
function renderNav(active){
  const u = getUser();
  const nav = document.createElement("nav");
  nav.className = "mainnav";
  nav.innerHTML = `
    <div class="topbar"></div>
    <div class="navwrap">
      <a class="logo" href="home.html"><i class="fa-solid fa-graduation-cap" style="color:var(--orange)"></i> <span>Kalvi<span class="cap">Portal</span></span></a>
      <div class="navlinks">
        <a href="home.html" class="${active==='home'?'active':''}"><i class="fa-solid fa-house"></i> ${t("nav_home")}</a>
        <a href="courses.html" class="${active==='courses'?'active':''}"><i class="fa-solid fa-book-open"></i> ${t("nav_courses")}</a>
        <a href="colleges.html" class="${active==='colleges'?'active':''}"><i class="fa-solid fa-building-columns"></i> ${t("nav_colleges")}</a>
        <a href="districts.html" class="${active==='atlas'?'active':''}"><i class="fa-solid fa-map"></i> ${t("nav_atlas")}</a>
        ${langToggleHTML()}
        <button class="icon-btn" id="themeBtn">${document.body.classList.contains('dark')?'<i class="fa-solid fa-sun"></i>':'<i class="fa-solid fa-moon"></i>'}</button>
        ${u ? `<span class="userchip"><span class="avatar">${u.name.charAt(0).toUpperCase()}</span>${u.name.split(" ")[0]} · ${cityName(u.city)}</span>
             <button class="signout" id="soBtn">${t("sign_out")}</button>` : ''}
      </div>
    </div>`;
  document.body.prepend(nav);
  $("#themeBtn").onclick = toggleTheme;
  if($("#soBtn")) $("#soBtn").onclick = ()=>{ if(confirm(t("confirm_signout"))) signOut(); };
}
function renderFooter(){
  const f = document.createElement("footer");
  f.className = "mainfoot";
  f.innerHTML = `
    <div class="foot-strip"></div>
    <div class="wrap">
      <div>
        <div class="logo" style="color:#fff"><i class="fa-solid fa-graduation-cap" style="color:#d9b45b"></i> Kalvi<span style="color:#d9b45b">Portal</span></div>
        <p style="font-size:.86rem;margin-top:9px;max-width:330px;font-weight:600">${t("foot_tag")}</p>
      </div>
      <div>
        <h4>${t("foot_quick")}</h4>
        <a href="home.html">${t("foot_home")}</a>
        <a href="courses.html?level=10">${t("foot_c10")}</a>
        <a href="courses.html?level=12">${t("foot_c12")}</a>
        <a href="courses.html?level=pg">${t("foot_pg")}</a>
        <a href="colleges.html">${t("foot_all")}</a>
        <a href="districts.html">${t("foot_atlas")}</a>
      </div>
      <div>
        <h4>${t("foot_feat")}</h4>
        <a href="anna-university.html">Anna University</a>
        <a href="iit-madras.html">IIT Madras</a>
        <a href="loyola-college.html">Loyola College</a>
      </div>
    </div>
    <div class="foot-bottom">${t("foot_made")}</div>`;
  document.body.appendChild(f);
}

/* ---------- reveal + counters ---------- */
function initReveal(){
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("visible"); obs.unobserve(e.target); } });
  }, {threshold:.12});
  $$(".reveal:not(.visible)").forEach(el=>obs.observe(el));
}
function animateCounters(){
  $$("[data-count]").forEach(el=>{
    const target = +el.dataset.count;
    let cur = 0;
    const step = Math.max(1, Math.ceil(target/50));
    const tmo = setInterval(()=>{
      cur += step;
      if(cur>=target){ cur = target; clearInterval(tmo); }
      el.textContent = cur.toLocaleString("en-IN") + (el.dataset.suffix||"");
    }, 26);
  });
}

document.addEventListener("DOMContentLoaded", ()=>{ initTheme(); });
