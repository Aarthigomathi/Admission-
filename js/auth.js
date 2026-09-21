/* =====================================================
   KalviPortal — auth.js
   Signup / Sign In logic + language toggle on auth page.
   ===================================================== */
document.addEventListener("DOMContentLoaded", ()=>{
  initTheme();
  applyI18n();

  /* Already logged-in ah iruntha direct ah home ku poiduvanga */
  if(getUser()) location.href = "home.html";

  const tabIn = $("#tabSignin"), tabUp = $("#tabSignup");
  const formIn = $("#signinForm"), formUp = $("#signupForm");

  function showTab(which){
    tabIn.classList.toggle("on", which==="in");
    tabUp.classList.toggle("on", which==="up");
    formIn.style.display = which==="in" ? "block" : "none";
    formUp.style.display = which==="up" ? "block" : "none";
  }
  tabIn.onclick = ()=>showTab("in");
  tabUp.onclick = ()=>showTab("up");

  /* city dropdown fill (language-aware names) */
  const citySel = $("#suCity");
  CITIES.forEach(c=>{
    const o = document.createElement("option");
    o.value = c; o.textContent = cityName(c);
    citySel.appendChild(o);
  });
  const other = document.createElement("option");
  other.value = "Other"; other.textContent = cityName("Other");
  citySel.appendChild(other);

  function msg(el, text, ok=false){
    el.textContent = text;
    el.className = "auth-msg " + (ok ? "ok" : "err");
  }

  /* ---------- SIGN UP ---------- */
  formUp.addEventListener("submit", e=>{
    e.preventDefault();
    const out = $("#suMsg");
    const name = $("#suName").value.trim();
    const email = $("#suEmail").value.trim().toLowerCase();
    const pass = $("#suPass").value;
    const city = citySel.value;
    const level = $("input[name=suLevel]:checked")?.value;

    if(name.length < 2) return msg(out, t("err_name"));
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return msg(out, t("err_email"));
    if(pass.length < 6) return msg(out, t("err_pass"));
    if(!city) return msg(out, t("err_city"));
    if(!level) return msg(out, t("err_level"));

    let users = [];
    try{ users = JSON.parse(localStorage.getItem("edu_users")) || []; }catch(e){}
    if(users.some(u=>u.email===email)) return msg(out, t("err_exists"));

    const user = {name, email, pass, city, level, joined:new Date().toLocaleDateString("en-IN")};
    users.push(user);
    localStorage.setItem("edu_users", JSON.stringify(users));
    localStorage.setItem("edu_user", JSON.stringify({name, email, city, level}));
    msg(out, t("ok_signup"), true);
    toast(tt("vanakkam", {name: name.split(" ")[0]}));
    setTimeout(()=>location.href="home.html", 900);
  });

  /* ---------- SIGN IN ---------- */
  formIn.addEventListener("submit", e=>{
    e.preventDefault();
    const out = $("#siMsg");
    const email = $("#siEmail").value.trim().toLowerCase();
    const pass = $("#siPass").value;
    let users = [];
    try{ users = JSON.parse(localStorage.getItem("edu_users")) || []; }catch(e){}
    const u = users.find(x=>x.email===email && x.pass===pass);
    if(!u) return msg(out, t("err_login"));
    localStorage.setItem("edu_user", JSON.stringify({name:u.name, email:u.email, city:u.city, level:u.level}));
    msg(out, t("ok_signin"), true);
    setTimeout(()=>location.href="home.html", 700);
  });
});
