# StudentSite — Separate Student Website

Student register pannunga → **email & mobile OTP verify** (green tick ✅) →
markers save → **college details free-a paakkalam.**

Separate, standalone website — `student-website/` folder mattum. Pure HTML + CSS +
JavaScript; framework illa, backend illa, build step illa. Browser-la direct-a run aagum.

## Run pannurathu

```bash
# folder-kulla poi, edhavadhu static server:
cd student-website
python3 -m http.server 5173        # → http://localhost:5173
# illa VS Code "Live Server" extension use pannunga
# illa direct-a index.html file-a browser-la open pannunga
```

## Files (separate codes)

| File | Enna irukku |
|---|---|
| `index.html` | Home — hero, 3-step flow, sample college cards |
| `register.html` | **Student Registration** — the main page |
| `colleges.html` | College details (register panna students-ku full details) |
| `css/style.css` | Design — navy `#1A3263` + gold `#FAB95B` theme, cards, OTP ticks |
| `js/data.js` | Demo data — TN districts, states, courses, 10 demo colleges |
| `js/app.js` | Shared helpers — SVG icons, OTP widget, storage, toast |
| `js/register.js` | Registration logic — validation, education blocks, save |
| `js/colleges.js` | College cards + detail modal + nav |

## Student registration-la irukura details

- **Full name**
- **Email ID** — "Send OTP" → demo OTP → verify → 🟩 **green tick** beside field
- **Mobile number** — same OTP flow + green tick
- **Password** + confirm
- **Address** (door no, street, area)
- **City / District** (20 TN districts) · **State** · **Pincode**
- **Education** — qualification select pannaa levels varum:
  - 10th — board + **percentage / expected percentage**
  - 12th — group + **percentage / expected**
  - Diploma — specialization + **percentage / expected**
  - UG — degree + **CGPA / expected CGPA**
  - PG (optional checkbox) — degree + **CGPA / expected**
- Interested course (optional)

Ovvo education block-layum **Completed / Expected** toggle pill irukku — label
automatically "Expected Percentage" nu maarum.

## Flow

1. `register.html` — fields fill + 2 OTP verify (green ticks) → **Register**
2. Account browser `localStorage`-la save aagum (`sw_users`, `sw_student`)
3. Auto redirect → `colleges.html` — full college details open

## Demo notes

- OTP demo: real-la SendGrid/MSG91 API venum; ippo generated OTP screen-la
  (bottom card-la) kaaturen.
- Data, fees, placement — illustrative demo values.
