# CampusConnect - College Events & Admission Portal

Modern college events management system with **category-wise** organization.

> Ithu maathiri thani thani category la events add pannalam - details ellam college neenga odd pannalam!

### 🌟 Features Implemented

#### 📂 Tani Tani Category System
- **🌱 Social / Awareness** (Your Example):
  - Teachers' Day Celebration
  - Women's Day Celebration
  - World Environment Day
  - National Energy Conservation Day
  - International Plastic Bag Free Day
  - Education Development Day
  - Blood Donation Camps
  - Tree Planting Activities
  - Coastal Cleaning Drives
  - NCC / NSS Awareness Programmes
- **💻 Technical**: Hackathons, Workshops, Symposium
- **🎭 Cultural**: Music, Dance, Fest
- **⚽ Sports**: Tournaments, Sports Meet
- **📚 Academic**: Seminars, Conferences
- **💼 Placement & Career**: Drives, Career Guidance
- **+ Custom Categories**: College can add unlimited new categories with icon & color

#### 🏫 College-wise Customization
- Add unlimited colleges (Name, Location, Type, Courses, Contact)
- Each event linked to college
- Filter events by college
- College-wise event count & dashboard
- Details ellam college neenga customize pannalam!

#### ✨ Event Management
- Add / Edit / Delete / Duplicate events
- Fields: Title, Description, Date, Time, Venue, Organizer (NCC/NSS/Dept), Participants, Contact, Image, Status (Upcoming/Ongoing/Completed)
- Search across all fields
- Sort by Latest / Date / Popular
- Category pills with live counts

#### 🔐 Admin & Data
- Admin mode (password: `admin123`) for protected editing
- LocalStorage persistence (no backend needed)
- Export / Import JSON for backup
- Admission enquiry module linked with events
- Responsive - Mobile + Desktop

### 🚀 How to Use

1. Open `index.html` (Live preview running on port 8000)
2. Default view = Social / Awareness Events
3. Click **+ Add Event** → Select College → Select Category → Fill details → Save
4. **Manage Categories** button → Add new category like "Alumni Events" with icon
5. **Colleges** tab → Add New College → Then add events for that college
6. **Admission** tab → Manage admission enquiries + courses

### 🎨 Tech Stack
- HTML5 + TailwindCSS + Vanilla JS
- FontAwesome Icons
- No build step - runs directly
- LocalStorage for DB

### 📸 Screens
- Home: Hero + Category Grid + College Quick List
- Events Grid: Card layout with status, participants, venue
- Admin Table: Full table view with export/import
- Colleges: College cards with courses & event counts
- Admission: Enquiries + stats

Made for Tamil Nadu colleges - Tamil + English mixed UI support.

---
**Repo**: Aarthigomathi/Admission-
**Branch**: arena/01a0cd9a-admission
