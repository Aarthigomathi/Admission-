# 🎓 College Admissions & Direct Enrollment Portal (தமிழ்நாடு & இந்தியா கல்லூரி சேர்க்கை)

A modern, responsive web application for exploring premier colleges, inspecting official logos, viewing cutoff requirements, opening an interactive **Admission / Application UI**, and enrolling directly into the college's official website portal.

## 🚀 Key Features

1. **Top Colleges & Official Logos**:
   - 16+ premier institutions including Anna University (CEG Guindy), IIT Madras, PSG Tech Coimbatore, SSN College of Engineering, Vellore Institute of Technology (VIT), Loyola College Chennai, Thiagarajar College of Engineering (TCE), Coimbatore Institute of Technology (CIT), SASTRA University, SRM IST, Kumaraguru College of Technology (KCT), Madras Medical College (MMC), and more.
   - Distinctive official logos and authentic heraldic SVG crests that render crisply across all screens.

2. **Interactive Admission UI ("Apply பன்ன UI திறக்கும்")**:
   - Clicking **"Apply & Enroll Now"** on any college card opens a dedicated modal with:
     - College verification crest, affiliation, and NIRF rank
     - Course & Degree selection (e.g., B.E. Computer Science, B.Tech AI & Data Science, B.Tech IT, MBBS, B.Com, MBA)
     - Admission Quota selection (TNEA Single Window, Management, Sports, NRI)
     - Student Information Form (Name, Phone/WhatsApp, Email, 12th Cutoff Marks, Native District)
     - Live preview of the college's official admission URL

3. **Direct Enrollment & Portal Redirection ("Enroll குடுத்தா link வெச்சு உள்ள போகும்")**:
   - Clicking **"Enroll Now & Enter College Portal ↗"**:
     - Saves the student application locally with an authentic Reference ID (e.g., `ADM-CEG-849201`)
     - Fires celebration confetti
     - Directly navigates into the official college admission portal URL in a new window/tab
     - Provides a fallback button in case of browser popup blockers
     - Option for **Direct Quick Open** to skip straight to the college portal

4. **"My Applications" Tracking Drawer**:
   - Real-time tracker for all colleges enrolled by the student
   - Displays Reference ID, degree applied, cutoff marks, date and time
   - Direct button to re-visit the college portal at any time
   - Print / Save Application Slip

5. **Add Custom College Feature**:
   - Allows students/administrators to add any college with custom name, logo URL, courses, cutoff, and custom official website link.

6. **Search & Multi-Filter**:
   - Search by College Name, Code, City (Chennai, Coimbatore, Madurai, Vellore, Thanjavur), or Course (CSE, AI, Medical, Viscom)
   - Filter by Stream (Engineering, Arts & Science, Medical, Management)
   - Bookmark colleges for quick reference
   - English & Tamil (தமிழ்) language toggle

## 💻 Tech Stack

- **React 19**
- **Vite 8**
- **Tailwind CSS v4**
- **Lucide Icons**
- **Canvas-Confetti**

## 🛠️ How to Run Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
Server binds to `http://0.0.0.0:5173`.
