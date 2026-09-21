/* =====================================================
   KalviPortal — home.js (professional home page)
   ===================================================== */
document.addEventListener("DOMContentLoaded", ()=>{
  guard();
  initTheme();
  renderNav("home");
  renderFooter();
  applyI18n();

  const user = getUser();
  const TA = LANG === "ta";

  /* personalised greeting line */
  $("#greetLine").textContent = tt("vanakkam", {name: user.name.split(" ")[0]});

  /* ---------- stats ---------- */
  $("#statColleges").dataset.count = COLLEGES.length;
  $("#statCourses").dataset.count = COURSES["10"].length + COURSES["12"].length + COURSES["pg"].length;
  $("#statCities").dataset.count = CITIES.length;
  $("#statReviews").dataset.count = COLLEGES.reduce((s,c)=>s+c.reviewsCount,0);
  animateCounters();

  /* ---------- MARQUEE: all college names scrolling ---------- */
  const items = COLLEGES.map(c=>`<span>★ ${c.name}</span>`).join("");
  $("#marqueeTrack").innerHTML = items + items; /* duplicate for seamless loop */

  /* ---------- LEADERBOARD: top 5 by rating ---------- */
  const top = [...COLLEGES].sort((a,b)=>b.rating-a.rating).slice(0,5);
  $("#leadGrid").innerHTML = top.map((c,i)=>`
    <div class="card rank-card reveal">
      <span class="rk ${i===0?'rk1':i===1?'rk2':i===2?'rk3':'rkx'}">#${i+1}</span>
      <div class="info">
        <b>${c.name}</b>
        <small>📍 ${cityName(c.city)} · ${catName(c.category)}</small>
      </div>
      <div class="sc">
        <b>${c.rating}★</b>
        <small>${c.reviewsCount} ${t("reviews_word")}</small>
      </div>
      ${c.featured?`<a class="btn sm" href="${c.page}">→</a>`:`<button class="btn sm ghost" data-view="${c.id}"><i class="fa-regular fa-eye"></i></button>`}
    </div>`).join("");

  /* ---------- EVENTS: aggregate from featured colleges ---------- */
  const evs = [];
  for(const id in COLLEGE_EVENTS){
    const col = COLLEGES.find(c=>c.id===id);
    COLLEGE_EVENTS[id].slice(0,2).forEach(e=>evs.push({col, e}));
  }
  $("#evGrid").innerHTML = evs.slice(0,4).map(({col,e})=>`
    <div class="card event-card reveal">
      <div class="event-date"><b>${e.d}</b><span>${TA && e.mTa ? e.mTa : e.m}</span></div>
      <div style="flex:1"><h4>${TA && e.titleTa ? e.titleTa : e.title}</h4><p>${col.name} · ${cityName(col.city)}</p></div>
    </div>`).join("");

  /* ---------- TESTIMONIALS ---------- */
  const testi = [
    {n:"Karthik R.", c:"Anna University", s:5, tx: TA ? "என் வாழ்க்கையின் சிறந்த முடிவு — வளாக வாழ்க்கை வேற லெவல்!" : "Best decision in my life — campus life is next level!"},
    {n:"Priyanka V.", c:"IIT Madras", s:5, tx: TA ? "உலகத் தரம் வாய்ந்த ஆய்வகங்கள் — கனவு நிஜமானது!" : "World-class labs — my dream came true!"},
    {n:"Arjun M.", c:"Loyola College", s:5, tx: TA ? "Loyola ஒழுக்கம் + வேலைவாய்ப்பு = சிறந்த எதிர்காலம்!" : "Loyola discipline + placements = bright future!"}
  ];
  $("#testiGrid").innerHTML = testi.map(r=>`
    <div class="card review reveal">
      <div class="who">
        <div class="avatar">${r.n.charAt(0)}</div>
        <div><b>${r.n}</b><small class="txt-orange" style="font-weight:700">${r.c}</small>
        <div class="stars">${starHTML(r.s)}</div></div>
      </div>
      <p>“${r.tx}”</p>
    </div>`).join("");

  /* ---------- NEARBY COLLEGES ---------- */
  const nearWrap = $("#nearbyGrid");
  const myCity = COLLEGES.filter(c=>c.city===user.city);
  const others = COLLEGES.filter(c=>c.city!==user.city).slice(0, 6 - Math.min(myCity.length,3));
  if(myCity.length){
    $("#nearbyTitle").innerHTML = tt("nearby_city", {city: cityName(user.city)});
    nearWrap.innerHTML = (myCity.concat(others)).slice(0,6).map(collegeCardHTML).join("");
  } else {
    $("#nearbyTitle").innerHTML = tt("nearby_other", {city: cityName(user.city)});
    nearWrap.innerHTML = COLLEGES.slice(0,6).map(collegeCardHTML).join("");
  }
  wireCardActions(nearWrap);

  /* ---------- FEATURED 3 ---------- */
  $("#featuredGrid").innerHTML = COLLEGES.filter(c=>c.featured).map(c=>`
    <a class="card col-card reveal" href="${c.page}" style="overflow:hidden">
      <img class="thumb" src="${c.img}" alt="${c.name}">
      <div class="body">
        <div class="badges"><span class="badge city">📍 ${cityName(c.city)}</span><span class="badge feat">${t("card_featured")}</span></div>
        <h3>${c.name}</h3>
        <p class="oner">${TA && c.ta ? c.ta : c.oneLiner}</p>
        <div class="rating-line"><span class="stars">${starHTML(Math.round(c.rating))}</span> ${c.rating}</div>
        <span class="go txt-orange" style="font-weight:800;font-size:.9rem">${t("full_tour")}</span>
      </div>
    </a>`).join("");

  /* ---------- district band ---------- */
  $("#cityStrip").innerHTML = CITIES.map(c=>{
    const n = COLLEGES.filter(x=>x.city===c).length;
    return `<a class="card city-chip reveal" href="colleges.html?city=${encodeURIComponent(c)}">
      <span class="em"><i class="fa-solid fa-city"></i></span><b>${cityName(c)}</b><small>${n} ${t("colleges_word")}</small></a>`;
  }).join("");

  initReveal();
  /* leaderboard quick-view buttons only (nearby already wired) */
  $$("#leadGrid [data-view]").forEach(b=>{ b.onclick = ()=>openCollegeModal(b.dataset.view); });

  /* ---------- QUIZ ---------- */
  $("#quizOpen").onclick = ()=>{ $("#quizOverlay").classList.add("show"); };
  $("#quizForm").addEventListener("submit", e=>{
    e.preventDefault();
    const interest = $("input[name=qInterest]:checked")?.value;
    const style = $("input[name=qStyle]:checked")?.value;
    const time = $("input[name=qTime]:checked")?.value;
    if(!interest || !style || !time){ toast(t("quiz_answer_all")); return; }
    const map = {
      tech:   {lvl:"12", name:"Engineering (BE/B.Tech)", search:"engineering"},
      med:    {lvl:"12", name:"MBBS / BSc Nursing / Allied Health", search:"medical"},
      arts:   {lvl:"12", name:"BA / BSc / Visual Comm / Law", search:"arts"},
      biz:    {lvl:"12", name:"BCom / BBA / MBA path", search:"commerce"}
    };
    const r = map[interest];
    let extra = "";
    if(time==="short") extra = t("quiz_short_extra");
    if(style==="practical") extra += t("quiz_practical");
    if(style==="research") extra += t("quiz_research");
    $("#quizResult").style.display = "block";
    $("#quizResult").innerHTML = `
      <h3>${t("quiz_result_t")}</h3>
      <p style="margin:9px 0"><b class="txt-orange" style="font-size:1.1rem">${r.name}</b></p>
      <p style="font-size:.9rem;font-weight:600">${extra}</p>
      <div style="display:flex;gap:10px;margin-top:15px;flex-wrap:wrap">
        <a class="btn sm" href="courses.html?level=${r.lvl}">${t("quiz_btn_courses")}</a>
        <a class="btn sm ghost" href="colleges.html?q=${encodeURIComponent(r.search)}">${t("quiz_btn_colleges")}</a>
      </div>`;
  });
});
