/* =====================================================
   KalviPortal — courses.js
   courses.html?level=10 | 12 | pg  (bilingual)
   ===================================================== */
document.addEventListener("DOMContentLoaded", ()=>{
  guard();
  initTheme();
  renderNav("courses");
  renderFooter();
  applyI18n();

  const params = new URLSearchParams(location.search);
  let level = params.get("level") || "12";
  if(!COURSES[level]) level = "12";

  const META = {
    "10":{title:"courses_t10", sub:"courses_s10"},
    "12":{title:"courses_t12", sub:"courses_s12"},
    "pg":{title:"courses_tpg", sub:"courses_spg"}
  };
  const m = META[level];

  $("#levelTabs").innerHTML = ["10","12","pg"].map(l=>`
    <a href="courses.html?level=${l}" class="btn sm ${l===level?'':'ghost'}" style="margin:4px">
      ${t(l==="10"?"tab_10":l==="12"?"tab_12":"tab_pg")}</a>`).join("");

  $("#pageTitle").innerHTML = t(m.title);
  $("#pageSub").textContent = t(m.sub);

  const user = getUser();
  const recommended = (user.level==="10th done" && level==="10") || (user.level==="12th done" && level==="12") || (user.level==="PG / Degree" && level==="pg");
  $("#recoNote").style.display = recommended ? "flex" : "none";

  const TA = LANG === "ta";
  $("#courseGrid").innerHTML = COURSES[level].map((c,i)=>`
    <div class="card course-card reveal" style="transition-delay:${(i%6)*60}ms">
      <div class="ic"><i class="${c.ic}"></i></div>
      <h3>${c.name}</h3>
      <div class="meta"><span>⏱️ ${TA && c.durTa ? c.durTa : c.dur}</span><span>✅ ${TA && c.eligTa ? c.eligTa : c.elig}</span></div>
      <p>${TA && c.descTa ? c.descTa : c.desc}</p>
      <div class="jobs"><b>${t("jobs_label")}</b> ${TA && c.jobsTa ? c.jobsTa : c.jobs}</div>
      <a class="btn sm ghost" style="margin-top:13px" href="colleges.html?q=${encodeURIComponent(c.search)}">${t("view_colleges")}</a>
    </div>`).join("");

  initReveal();
});
