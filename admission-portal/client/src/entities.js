/**
 * AUTO-GENERATED FILE — do not edit by hand.
 * Source of truth: server/src/entities.js
 * Regenerate with:  cd server && npm run sync:entities
 */

export const ENTITIES = {
  "departments": {
    "label": "Department",
    "plural": "Departments",
    "icon": "🏛️",
    "order": 1,
    "description": "Academic departments, their heads, research areas and contact details.",
    "fields": [
      {
        "name": "name",
        "label": "Department name",
        "type": "text",
        "required": true,
        "list": true,
        "search": true
      },
      {
        "name": "code",
        "label": "Short code",
        "type": "text",
        "list": true,
        "hint": "e.g. CSE"
      },
      {
        "name": "established_year",
        "label": "Established year",
        "type": "number",
        "min": 1800,
        "max": 2100
      },
      {
        "name": "hod_name",
        "label": "Head of department",
        "type": "text",
        "list": true
      },
      {
        "name": "hod_designation",
        "label": "HOD designation",
        "type": "text"
      },
      {
        "name": "faculty_count",
        "label": "Faculty count",
        "type": "number",
        "list": true,
        "min": 0
      },
      {
        "name": "students_count",
        "label": "Students count",
        "type": "number",
        "min": 0
      },
      {
        "name": "programs_count",
        "label": "Programmes offered",
        "type": "number",
        "min": 0
      },
      {
        "name": "research_areas",
        "label": "Research areas",
        "type": "tags",
        "hint": "Comma separated"
      },
      {
        "name": "about",
        "label": "About the department",
        "type": "textarea"
      },
      {
        "name": "contact_email",
        "label": "Contact email",
        "type": "email"
      },
      {
        "name": "contact_phone",
        "label": "Contact phone",
        "type": "tel"
      },
      {
        "name": "image_url",
        "label": "Department image",
        "type": "image"
      }
    ]
  },
  "courses": {
    "label": "Course",
    "plural": "Courses & Admissions",
    "icon": "🎓",
    "order": 2,
    "description": "Programmes, eligibility, admission criteria, live seat availability and the application window.",
    "fields": [
      {
        "name": "name",
        "label": "Course / programme name",
        "type": "text",
        "required": true,
        "list": true,
        "search": true
      },
      {
        "name": "code",
        "label": "Course code",
        "type": "text",
        "list": true
      },
      {
        "name": "department_name",
        "label": "Department",
        "type": "text",
        "list": true,
        "search": true
      },
      {
        "name": "level",
        "label": "Level",
        "type": "select",
        "list": true,
        "options": [
          "UG",
          "PG",
          "Diploma",
          "Doctorate",
          "Certificate",
          "Integrated"
        ],
        "default": "UG"
      },
      {
        "name": "degree_type",
        "label": "Degree awarded",
        "type": "text",
        "hint": "e.g. B.E., B.Tech, B.Sc."
      },
      {
        "name": "stream",
        "label": "Stream / discipline",
        "type": "text",
        "hint": "e.g. Engineering, Management, Arts"
      },
      {
        "name": "duration",
        "label": "Duration",
        "type": "text",
        "list": true,
        "hint": "e.g. 4 Years"
      },
      {
        "name": "mode",
        "label": "Mode of study",
        "type": "select",
        "options": [
          "Full Time",
          "Part Time",
          "Online",
          "Hybrid"
        ],
        "default": "Full Time"
      },
      {
        "name": "intake_seats",
        "label": "Sanctioned intake",
        "type": "number",
        "list": true,
        "min": 0,
        "required": true
      },
      {
        "name": "filled_seats",
        "label": "Seats filled",
        "type": "number",
        "list": true,
        "min": 0,
        "default": 0
      },
      {
        "name": "reserved_seats",
        "label": "Reserved seats",
        "type": "number",
        "min": 0
      },
      {
        "name": "eligibility",
        "label": "Eligibility criteria",
        "type": "textarea",
        "required": true
      },
      {
        "name": "admission_criteria",
        "label": "Admission criteria",
        "type": "textarea"
      },
      {
        "name": "selection_process",
        "label": "Selection process",
        "type": "textarea"
      },
      {
        "name": "entrance_exams",
        "label": "Entrance exams accepted",
        "type": "tags"
      },
      {
        "name": "application_fee",
        "label": "Application fee",
        "type": "currency"
      },
      {
        "name": "tuition_fee",
        "label": "Tuition fee (per year)",
        "type": "currency",
        "list": true
      },
      {
        "name": "total_fee",
        "label": "Total course fee",
        "type": "currency"
      },
      {
        "name": "admission_start_date",
        "label": "Applications open",
        "type": "date"
      },
      {
        "name": "application_deadline",
        "label": "Application deadline",
        "type": "date",
        "list": true
      },
      {
        "name": "admission_status",
        "label": "Admission status",
        "type": "select",
        "list": true,
        "options": [
          "Open",
          "Closing Soon",
          "Few Seats Left",
          "Closed",
          "Coming Soon"
        ],
        "default": "Open"
      },
      {
        "name": "specializations",
        "label": "Specialisations",
        "type": "tags"
      },
      {
        "name": "highlights",
        "label": "Course highlights",
        "type": "textarea"
      },
      {
        "name": "avg_package",
        "label": "Average package (programme)",
        "type": "currency"
      },
      {
        "name": "syllabus_url",
        "label": "Syllabus link",
        "type": "url"
      },
      {
        "name": "brochure_url",
        "label": "Brochure link",
        "type": "url"
      },
      {
        "name": "accreditation",
        "label": "Accreditation (NBA etc.)",
        "type": "text"
      },
      {
        "name": "is_active",
        "label": "Currently offered",
        "type": "boolean",
        "default": 1
      }
    ]
  },
  "fees": {
    "label": "Fee record",
    "plural": "Fee Structure",
    "icon": "💰",
    "order": 3,
    "description": "Head-wise fee structure for each programme and academic year.",
    "fields": [
      {
        "name": "course_name",
        "label": "Course",
        "type": "text",
        "required": true,
        "list": true,
        "search": true
      },
      {
        "name": "academic_year",
        "label": "Academic year",
        "type": "text",
        "list": true,
        "hint": "e.g. 2026-27",
        "required": true
      },
      {
        "name": "tuition_fee",
        "label": "Tuition fee",
        "type": "currency",
        "list": true
      },
      {
        "name": "admission_fee",
        "label": "One-time admission fee",
        "type": "currency"
      },
      {
        "name": "exam_fee",
        "label": "Examination fee",
        "type": "currency"
      },
      {
        "name": "lab_fee",
        "label": "Laboratory fee",
        "type": "currency"
      },
      {
        "name": "library_fee",
        "label": "Library fee",
        "type": "currency"
      },
      {
        "name": "hostel_fee",
        "label": "Hostel fee",
        "type": "currency",
        "list": true
      },
      {
        "name": "transport_fee",
        "label": "Transport fee",
        "type": "currency"
      },
      {
        "name": "other_fee",
        "label": "Other charges",
        "type": "currency"
      },
      {
        "name": "total_fee",
        "label": "Total (per year)",
        "type": "currency",
        "list": true
      },
      {
        "name": "currency",
        "label": "Currency",
        "type": "select",
        "options": [
          "INR",
          "USD",
          "EUR",
          "GBP",
          "AED"
        ],
        "default": "INR"
      },
      {
        "name": "payment_terms",
        "label": "Payment terms / instalments",
        "type": "textarea"
      },
      {
        "name": "refund_policy",
        "label": "Refund policy",
        "type": "textarea"
      },
      {
        "name": "scholarship_note",
        "label": "Scholarship / concession note",
        "type": "textarea"
      },
      {
        "name": "is_current",
        "label": "Applicable for current admissions",
        "type": "boolean",
        "default": 1
      },
      {
        "name": "notes",
        "label": "Additional notes",
        "type": "textarea"
      }
    ]
  },
  "faculty": {
    "label": "Faculty member",
    "plural": "Faculty",
    "icon": "👩‍🏫",
    "order": 4,
    "description": "Teaching staff, qualifications, experience and research output.",
    "fields": [
      {
        "name": "name",
        "label": "Full name",
        "type": "text",
        "required": true,
        "list": true,
        "search": true
      },
      {
        "name": "designation",
        "label": "Designation",
        "type": "text",
        "list": true,
        "required": true
      },
      {
        "name": "department_name",
        "label": "Department",
        "type": "text",
        "list": true,
        "search": true
      },
      {
        "name": "qualification",
        "label": "Highest qualification",
        "type": "text",
        "list": true,
        "hint": "e.g. Ph.D."
      },
      {
        "name": "specialization",
        "label": "Specialisation",
        "type": "text",
        "search": true
      },
      {
        "name": "experience_years",
        "label": "Experience (years)",
        "type": "number",
        "list": true,
        "min": 0
      },
      {
        "name": "is_hod",
        "label": "Heads a department",
        "type": "boolean",
        "default": 0
      },
      {
        "name": "joined_year",
        "label": "Joined year",
        "type": "number",
        "min": 1900,
        "max": 2100
      },
      {
        "name": "email",
        "label": "Email",
        "type": "email"
      },
      {
        "name": "phone",
        "label": "Phone",
        "type": "tel"
      },
      {
        "name": "publications",
        "label": "Publications",
        "type": "number",
        "min": 0
      },
      {
        "name": "awards",
        "label": "Awards / recognitions",
        "type": "textarea"
      },
      {
        "name": "bio",
        "label": "Profile summary",
        "type": "textarea"
      },
      {
        "name": "photo_url",
        "label": "Photo",
        "type": "image"
      }
    ]
  },
  "placements": {
    "label": "Placement record",
    "plural": "Placements",
    "icon": "📈",
    "order": 5,
    "description": "Year-wise placement performance: students placed, offers, highest / average / median packages.",
    "fields": [
      {
        "name": "academic_year",
        "label": "Academic year",
        "type": "text",
        "required": true,
        "list": true,
        "hint": "e.g. 2025-26"
      },
      {
        "name": "programme_level",
        "label": "Programme level",
        "type": "select",
        "list": true,
        "options": [
          "Overall",
          "UG",
          "PG",
          "Diploma",
          "Management",
          "All Programmes"
        ],
        "default": "Overall"
      },
      {
        "name": "students_graduated",
        "label": "Students graduated",
        "type": "number",
        "list": true,
        "min": 0
      },
      {
        "name": "students_placed",
        "label": "Students placed",
        "type": "number",
        "list": true,
        "min": 0
      },
      {
        "name": "placement_percentage",
        "label": "Placement %",
        "type": "percent",
        "list": true,
        "min": 0,
        "max": 100
      },
      {
        "name": "offers_made",
        "label": "Total offers made",
        "type": "number",
        "list": true,
        "min": 0
      },
      {
        "name": "companies_visited",
        "label": "Companies visited",
        "type": "number",
        "min": 0
      },
      {
        "name": "highest_package",
        "label": "Highest package",
        "type": "currency",
        "list": true
      },
      {
        "name": "average_package",
        "label": "Average package",
        "type": "currency",
        "list": true
      },
      {
        "name": "median_package",
        "label": "Median package",
        "type": "currency"
      },
      {
        "name": "lowest_package",
        "label": "Lowest package",
        "type": "currency"
      },
      {
        "name": "currency",
        "label": "Currency",
        "type": "select",
        "options": [
          "INR",
          "USD",
          "EUR",
          "GBP",
          "AED"
        ],
        "default": "INR"
      },
      {
        "name": "package_unit",
        "label": "Package unit",
        "type": "select",
        "options": [
          "Per Annum",
          "Per Month",
          "Total CTC"
        ],
        "default": "Per Annum"
      },
      {
        "name": "top_recruiter",
        "label": "Top recruiter",
        "type": "text",
        "list": true
      },
      {
        "name": "international_offers",
        "label": "International offers",
        "type": "number",
        "min": 0
      },
      {
        "name": "higher_studies_count",
        "label": "Students opting higher studies",
        "type": "number",
        "min": 0
      },
      {
        "name": "notes",
        "label": "Notes",
        "type": "textarea"
      },
      {
        "name": "source_url",
        "label": "Source (placement report URL)",
        "type": "url"
      }
    ]
  },
  "recruiters": {
    "label": "Recruiter",
    "plural": "Recruiters",
    "icon": "🏢",
    "order": 6,
    "description": "Companies that recruit on campus, with offers and package details.",
    "fields": [
      {
        "name": "name",
        "label": "Company name",
        "type": "text",
        "required": true,
        "list": true,
        "search": true
      },
      {
        "name": "sector",
        "label": "Sector",
        "type": "select",
        "list": true,
        "options": [
          "IT & Software",
          "Core Engineering",
          "Manufacturing",
          "Consulting",
          "Banking & Finance",
          "Analytics",
          "Healthcare",
          "FMCG",
          "Education",
          "Government / PSU",
          "Other"
        ]
      },
      {
        "name": "academic_year",
        "label": "Academic year",
        "type": "text",
        "list": true
      },
      {
        "name": "offers_made",
        "label": "Offers made",
        "type": "number",
        "list": true,
        "min": 0
      },
      {
        "name": "avg_package",
        "label": "Average package offered",
        "type": "currency",
        "list": true
      },
      {
        "name": "highest_package",
        "label": "Highest package offered",
        "type": "currency"
      },
      {
        "name": "visit_type",
        "label": "Engagement type",
        "type": "select",
        "options": [
          "On-campus",
          "Off-campus",
          "Pooled campus",
          "Internship",
          "Virtual"
        ],
        "default": "On-campus"
      },
      {
        "name": "is_top",
        "label": "Top / dream recruiter",
        "type": "boolean",
        "default": 0,
        "list": true
      },
      {
        "name": "website",
        "label": "Website",
        "type": "url"
      },
      {
        "name": "logo_url",
        "label": "Logo",
        "type": "image"
      },
      {
        "name": "description",
        "label": "Roles offered / notes",
        "type": "textarea"
      }
    ]
  },
  "internships": {
    "label": "Internship",
    "plural": "Internships",
    "icon": "🧑‍💻",
    "order": 7,
    "description": "Internship and training opportunities offered to students.",
    "fields": [
      {
        "name": "company",
        "label": "Company / organisation",
        "type": "text",
        "required": true,
        "list": true,
        "search": true
      },
      {
        "name": "role",
        "label": "Role",
        "type": "text",
        "list": true
      },
      {
        "name": "sector",
        "label": "Sector",
        "type": "text"
      },
      {
        "name": "academic_year",
        "label": "Academic year",
        "type": "text",
        "list": true
      },
      {
        "name": "stipend",
        "label": "Stipend",
        "type": "currency",
        "list": true
      },
      {
        "name": "stipend_period",
        "label": "Stipend period",
        "type": "select",
        "options": [
          "Per Month",
          "Per Week",
          "Per Day",
          "One-time"
        ],
        "default": "Per Month"
      },
      {
        "name": "duration",
        "label": "Duration",
        "type": "text",
        "hint": "e.g. 6 months"
      },
      {
        "name": "mode",
        "label": "Mode",
        "type": "select",
        "options": [
          "On-site",
          "Remote",
          "Hybrid"
        ],
        "default": "On-site"
      },
      {
        "name": "students_count",
        "label": "Students selected",
        "type": "number",
        "list": true,
        "min": 0
      },
      {
        "name": "ppo_offers",
        "label": "PPO / PPI offers",
        "type": "number",
        "min": 0
      },
      {
        "name": "eligibility",
        "label": "Eligibility",
        "type": "textarea"
      },
      {
        "name": "description",
        "label": "Description",
        "type": "textarea"
      },
      {
        "name": "application_link",
        "label": "Application link",
        "type": "url"
      }
    ]
  },
  "hostels": {
    "label": "Hostel",
    "plural": "Hostels",
    "icon": "🛏️",
    "order": 8,
    "description": "Boys / girls hostels, capacity, room types, amenities and mess details.",
    "fields": [
      {
        "name": "name",
        "label": "Hostel name",
        "type": "text",
        "required": true,
        "list": true
      },
      {
        "name": "gender",
        "label": "For",
        "type": "select",
        "list": true,
        "options": [
          "Boys",
          "Girls",
          "Co-ed"
        ],
        "default": "Boys"
      },
      {
        "name": "total_rooms",
        "label": "Total rooms",
        "type": "number",
        "min": 0
      },
      {
        "name": "capacity",
        "label": "Total capacity",
        "type": "number",
        "list": true,
        "min": 0
      },
      {
        "name": "occupied",
        "label": "Currently occupied",
        "type": "number",
        "min": 0
      },
      {
        "name": "room_types",
        "label": "Room types",
        "type": "tags",
        "hint": "e.g. Single, Double, Triple"
      },
      {
        "name": "fees_per_year",
        "label": "Hostel fee (per year)",
        "type": "currency",
        "list": true
      },
      {
        "name": "mess_type",
        "label": "Mess",
        "type": "select",
        "options": [
          "Veg",
          "Veg & Non-Veg",
          "Multi-cuisine"
        ],
        "default": "Veg & Non-Veg"
      },
      {
        "name": "mess_details",
        "label": "Mess / food details",
        "type": "textarea"
      },
      {
        "name": "amenities",
        "label": "Amenities",
        "type": "tags",
        "hint": "Wi-Fi, Laundry, Gym, RO water…"
      },
      {
        "name": "timings",
        "label": "Timings / curfew",
        "type": "text"
      },
      {
        "name": "warden_name",
        "label": "Warden name",
        "type": "text"
      },
      {
        "name": "warden_phone",
        "label": "Warden contact",
        "type": "tel"
      },
      {
        "name": "distance_from_campus",
        "label": "Distance from campus",
        "type": "text"
      },
      {
        "name": "description",
        "label": "Description",
        "type": "textarea"
      },
      {
        "name": "image_url",
        "label": "Hostel image",
        "type": "image"
      }
    ]
  },
  "transport": {
    "label": "Transport route",
    "plural": "Transport",
    "icon": "🚌",
    "order": 9,
    "description": "Bus routes, stops, fleet and transport fees.",
    "fields": [
      {
        "name": "route_no",
        "label": "Route number",
        "type": "text",
        "list": true
      },
      {
        "name": "route_name",
        "label": "Route name",
        "type": "text",
        "required": true,
        "list": true,
        "search": true
      },
      {
        "name": "stops",
        "label": "Stops covered",
        "type": "textarea",
        "hint": "Comma or newline separated"
      },
      {
        "name": "vehicle_type",
        "label": "Vehicle type",
        "type": "text",
        "hint": "e.g. 52-seater bus"
      },
      {
        "name": "fleet_count",
        "label": "Buses on route",
        "type": "number",
        "min": 0
      },
      {
        "name": "capacity",
        "label": "Seating capacity",
        "type": "number",
        "min": 0
      },
      {
        "name": "daily_trips",
        "label": "Daily trips",
        "type": "number",
        "min": 0
      },
      {
        "name": "timings",
        "label": "Timings",
        "type": "text"
      },
      {
        "name": "fee_per_year",
        "label": "Transport fee (per year)",
        "type": "currency",
        "list": true
      },
      {
        "name": "contact_person",
        "label": "Contact person",
        "type": "text"
      },
      {
        "name": "contact_phone",
        "label": "Contact number",
        "type": "tel"
      },
      {
        "name": "gps_tracking",
        "label": "GPS tracking available",
        "type": "boolean",
        "default": 0,
        "list": true
      },
      {
        "name": "description",
        "label": "Description",
        "type": "textarea"
      }
    ]
  },
  "library": {
    "label": "Library",
    "plural": "Library",
    "icon": "📚",
    "order": 10,
    "description": "Library holdings, digital resources, timings and services.",
    "fields": [
      {
        "name": "name",
        "label": "Library name",
        "type": "text",
        "required": true,
        "list": true
      },
      {
        "name": "established_year",
        "label": "Established year",
        "type": "number",
        "min": 1800,
        "max": 2100
      },
      {
        "name": "total_books",
        "label": "Book volumes",
        "type": "number",
        "list": true,
        "min": 0
      },
      {
        "name": "total_titles",
        "label": "Titles",
        "type": "number",
        "min": 0
      },
      {
        "name": "journals",
        "label": "Print journals",
        "type": "number",
        "list": true,
        "min": 0
      },
      {
        "name": "e_journals",
        "label": "E-journals",
        "type": "number",
        "min": 0
      },
      {
        "name": "e_books",
        "label": "E-books",
        "type": "number",
        "min": 0
      },
      {
        "name": "digital_databases",
        "label": "Digital databases / e-resources",
        "type": "tags",
        "hint": "IEEE, Springer, Scopus…"
      },
      {
        "name": "seating_capacity",
        "label": "Seating capacity",
        "type": "number",
        "list": true,
        "min": 0
      },
      {
        "name": "area_sqft",
        "label": "Area (sq. ft.)",
        "type": "number",
        "min": 0
      },
      {
        "name": "timings",
        "label": "Working hours",
        "type": "text",
        "list": true
      },
      {
        "name": "membership",
        "label": "Membership / access",
        "type": "text"
      },
      {
        "name": "services",
        "label": "Services offered",
        "type": "tags",
        "hint": "Reference service, Book bank, Reprography…"
      },
      {
        "name": "automation_software",
        "label": "Library automation software",
        "type": "text"
      },
      {
        "name": "description",
        "label": "Description",
        "type": "textarea"
      },
      {
        "name": "image_url",
        "label": "Library image",
        "type": "image"
      }
    ]
  },
  "sports": {
    "label": "Sports facility",
    "plural": "Sports",
    "icon": "🏅",
    "order": 11,
    "description": "Indoor / outdoor sports facilities, coaches and achievements.",
    "fields": [
      {
        "name": "sport_name",
        "label": "Sport / game",
        "type": "text",
        "required": true,
        "list": true,
        "search": true
      },
      {
        "name": "category",
        "label": "Category",
        "type": "select",
        "list": true,
        "options": [
          "Outdoor",
          "Indoor",
          "Aquatics",
          "Adventure",
          "Gymnasium"
        ],
        "default": "Outdoor"
      },
      {
        "name": "facilities",
        "label": "Facilities available",
        "type": "textarea"
      },
      {
        "name": "courts_count",
        "label": "Courts / grounds",
        "type": "number",
        "min": 0
      },
      {
        "name": "coach_name",
        "label": "Coach / physical director",
        "type": "text"
      },
      {
        "name": "coach_qualification",
        "label": "Coach qualification",
        "type": "text"
      },
      {
        "name": "teams",
        "label": "College teams",
        "type": "tags"
      },
      {
        "name": "achievements",
        "label": "Achievements",
        "type": "textarea"
      },
      {
        "name": "timings",
        "label": "Practice timings",
        "type": "text"
      },
      {
        "name": "description",
        "label": "Description",
        "type": "textarea"
      },
      {
        "name": "image_url",
        "label": "Image",
        "type": "image"
      }
    ]
  },
  "infrastructure": {
    "label": "Infrastructure",
    "plural": "Infrastructure",
    "icon": "🏗️",
    "order": 12,
    "description": "Buildings, laboratories, research centres, auditoria and other physical infrastructure.",
    "fields": [
      {
        "name": "name",
        "label": "Name",
        "type": "text",
        "required": true,
        "list": true,
        "search": true
      },
      {
        "name": "category",
        "label": "Category",
        "type": "select",
        "list": true,
        "options": [
          "Academic Block",
          "Laboratory",
          "Research Centre",
          "Seminar Hall",
          "Auditorium",
          "Sports Complex",
          "Workshop",
          "Digital Classroom",
          "Hostel Block",
          "Other"
        ]
      },
      {
        "name": "area_sqft",
        "label": "Area (sq. ft.)",
        "type": "number",
        "min": 0
      },
      {
        "name": "capacity",
        "label": "Capacity",
        "type": "number",
        "min": 0
      },
      {
        "name": "year_built",
        "label": "Year established",
        "type": "number",
        "min": 1800,
        "max": 2100
      },
      {
        "name": "equipment",
        "label": "Key equipment / systems",
        "type": "textarea"
      },
      {
        "name": "green_building",
        "label": "Green / energy efficient",
        "type": "boolean",
        "default": 0
      },
      {
        "name": "description",
        "label": "Description",
        "type": "textarea"
      },
      {
        "name": "image_url",
        "label": "Image",
        "type": "image"
      }
    ]
  },
  "facilities": {
    "label": "Campus facility",
    "plural": "Campus Facilities",
    "icon": "🧭",
    "order": 13,
    "description": "Wi-Fi, medical, canteen, bank, security, counselling and other campus facilities.",
    "fields": [
      {
        "name": "name",
        "label": "Facility",
        "type": "text",
        "required": true,
        "list": true,
        "search": true
      },
      {
        "name": "category",
        "label": "Category",
        "type": "select",
        "list": true,
        "options": [
          "IT & Wi-Fi",
          "Laboratory",
          "Medical",
          "Canteen & Food",
          "Auditorium",
          "Security",
          "Bank & ATM",
          "Counselling",
          "Placement Cell",
          "Innovation / Incubation",
          "Transport",
          "Green Campus",
          "Other"
        ]
      },
      {
        "name": "available",
        "label": "Available",
        "type": "boolean",
        "default": 1,
        "list": true
      },
      {
        "name": "capacity",
        "label": "Capacity",
        "type": "number",
        "min": 0
      },
      {
        "name": "timings",
        "label": "Timings",
        "type": "text"
      },
      {
        "name": "description",
        "label": "Description",
        "type": "textarea"
      },
      {
        "name": "image_url",
        "label": "Image",
        "type": "image"
      }
    ]
  },
  "scholarships": {
    "label": "Scholarship",
    "plural": "Scholarships",
    "icon": "🎯",
    "order": 14,
    "description": "Merit, need-based, government and private scholarships available to students.",
    "fields": [
      {
        "name": "name",
        "label": "Scholarship name",
        "type": "text",
        "required": true,
        "list": true,
        "search": true
      },
      {
        "name": "provider_type",
        "label": "Provided by",
        "type": "select",
        "list": true,
        "options": [
          "College",
          "Government",
          "Private / Corporate",
          "Trust",
          "Alumni"
        ],
        "default": "College"
      },
      {
        "name": "category",
        "label": "Category",
        "type": "select",
        "list": true,
        "options": [
          "Merit",
          "Need-based",
          "SC / ST",
          "OBC",
          "Minority",
          "Sports",
          "Differently-abled",
          "First Graduate",
          "Girl Student",
          "Research"
        ]
      },
      {
        "name": "amount",
        "label": "Amount",
        "type": "currency",
        "list": true
      },
      {
        "name": "amount_type",
        "label": "Benefit type",
        "type": "select",
        "options": [
          "Fixed amount",
          "Percentage of tuition fee",
          "Full tuition waiver",
          "Part fee waiver",
          "Stipend"
        ],
        "default": "Percentage of tuition fee"
      },
      {
        "name": "percent_value",
        "label": "Percentage / concession",
        "type": "percent"
      },
      {
        "name": "eligibility",
        "label": "Eligibility",
        "type": "textarea",
        "required": true
      },
      {
        "name": "course_level",
        "label": "Applicable to",
        "type": "select",
        "options": [
          "All",
          "UG",
          "PG",
          "Diploma",
          "Doctorate"
        ],
        "default": "All"
      },
      {
        "name": "number_available",
        "label": "Number of scholarships",
        "type": "number",
        "min": 0
      },
      {
        "name": "deadline",
        "label": "Application deadline",
        "type": "date",
        "list": true
      },
      {
        "name": "documents_required",
        "label": "Documents required",
        "type": "tags"
      },
      {
        "name": "description",
        "label": "Description",
        "type": "textarea"
      },
      {
        "name": "application_link",
        "label": "Application link",
        "type": "url"
      },
      {
        "name": "is_active",
        "label": "Active",
        "type": "boolean",
        "default": 1
      }
    ]
  },
  "events": {
    "label": "Event",
    "plural": "Events",
    "icon": "🎉",
    "order": 15,
    "description": "Technical, cultural, sports and academic events hosted by the college.",
    "fields": [
      {
        "name": "title",
        "label": "Event title",
        "type": "text",
        "required": true,
        "list": true,
        "search": true
      },
      {
        "name": "category",
        "label": "Category",
        "type": "select",
        "list": true,
        "options": [
          "Technical",
          "Cultural",
          "Sports",
          "Workshop",
          "Conference",
          "Symposium",
          "Seminar",
          "Fest",
          "Orientation",
          "Other"
        ]
      },
      {
        "name": "start_date",
        "label": "Start date",
        "type": "date",
        "list": true
      },
      {
        "name": "end_date",
        "label": "End date",
        "type": "date"
      },
      {
        "name": "venue",
        "label": "Venue",
        "type": "text",
        "list": true
      },
      {
        "name": "chief_guest",
        "label": "Chief guest / speaker",
        "type": "text"
      },
      {
        "name": "participants_count",
        "label": "Participants",
        "type": "number",
        "min": 0
      },
      {
        "name": "status",
        "label": "Status",
        "type": "select",
        "list": true,
        "options": [
          "Upcoming",
          "Ongoing",
          "Completed"
        ],
        "default": "Upcoming"
      },
      {
        "name": "registration_link",
        "label": "Registration link",
        "type": "url"
      },
      {
        "name": "description",
        "label": "Description",
        "type": "textarea"
      },
      {
        "name": "image_url",
        "label": "Event image",
        "type": "image"
      }
    ]
  },
  "achievements": {
    "label": "Achievement",
    "plural": "Achievements",
    "icon": "🏆",
    "order": 16,
    "description": "Academic, research, sports, innovation and institutional achievements.",
    "fields": [
      {
        "name": "title",
        "label": "Achievement",
        "type": "text",
        "required": true,
        "list": true,
        "search": true
      },
      {
        "name": "category",
        "label": "Category",
        "type": "select",
        "list": true,
        "options": [
          "Academic",
          "Research",
          "Sports",
          "Innovation",
          "Institutional",
          "Ranking",
          "Alumni",
          "Placement",
          "Other"
        ]
      },
      {
        "name": "level",
        "label": "Level",
        "type": "select",
        "list": true,
        "options": [
          "International",
          "National",
          "State",
          "University",
          "College"
        ]
      },
      {
        "name": "year",
        "label": "Year",
        "type": "number",
        "list": true,
        "min": 1800,
        "max": 2100
      },
      {
        "name": "achieved_by",
        "label": "Achieved by",
        "type": "text",
        "list": true,
        "hint": "Student / team / department"
      },
      {
        "name": "department_name",
        "label": "Department",
        "type": "text"
      },
      {
        "name": "rank_position",
        "label": "Rank / position",
        "type": "text"
      },
      {
        "name": "award_organisation",
        "label": "Awarding organisation",
        "type": "text"
      },
      {
        "name": "description",
        "label": "Description",
        "type": "textarea"
      },
      {
        "name": "image_url",
        "label": "Image",
        "type": "image"
      }
    ]
  },
  "media": {
    "label": "Media item",
    "plural": "Photos & Videos",
    "icon": "🖼️",
    "order": 17,
    "description": "Campus photographs and videos shown to students in the gallery.",
    "fields": [
      {
        "name": "title",
        "label": "Title",
        "type": "text",
        "required": true,
        "list": true,
        "search": true
      },
      {
        "name": "type",
        "label": "Type",
        "type": "select",
        "list": true,
        "options": [
          "Image",
          "Video"
        ],
        "default": "Image"
      },
      {
        "name": "category",
        "label": "Category",
        "type": "select",
        "list": true,
        "options": [
          "Campus",
          "Gallery",
          "Academic",
          "Laboratory",
          "Library",
          "Hostel",
          "Sports",
          "Event",
          "Placement",
          "Transport",
          "Other"
        ],
        "default": "Campus"
      },
      {
        "name": "url",
        "label": "Image / video URL",
        "type": "image",
        "required": true,
        "list": true,
        "hint": "Upload an image or paste a YouTube / image URL"
      },
      {
        "name": "thumbnail_url",
        "label": "Thumbnail (optional)",
        "type": "image"
      },
      {
        "name": "caption",
        "label": "Caption",
        "type": "text"
      },
      {
        "name": "sort_order",
        "label": "Display order",
        "type": "number",
        "default": 0
      },
      {
        "name": "is_cover",
        "label": "Use as college cover photo",
        "type": "boolean",
        "default": 0
      }
    ]
  },
  "documents": {
    "label": "Document",
    "plural": "Documents & Brochures",
    "icon": "📄",
    "order": 18,
    "description": "Prospectus, brochures, fee structures, mandatory disclosures and reports.",
    "fields": [
      {
        "name": "title",
        "label": "Document title",
        "type": "text",
        "required": true,
        "list": true,
        "search": true
      },
      {
        "name": "category",
        "label": "Category",
        "type": "select",
        "list": true,
        "options": [
          "Prospectus",
          "Brochure",
          "Admission Form",
          "Fee Structure",
          "Academic Calendar",
          "Syllabus",
          "Mandatory Disclosure",
          "Placement Report",
          "Audit Report",
          "Other"
        ]
      },
      {
        "name": "year",
        "label": "Year",
        "type": "text",
        "list": true
      },
      {
        "name": "file_url",
        "label": "File / link",
        "type": "file",
        "required": true,
        "list": true
      },
      {
        "name": "file_size_kb",
        "label": "File size (KB)",
        "type": "number",
        "min": 0
      },
      {
        "name": "is_public",
        "label": "Visible to students",
        "type": "boolean",
        "default": 1
      },
      {
        "name": "description",
        "label": "Description",
        "type": "textarea"
      }
    ]
  }
};

export const COLLEGE_PROFILE_FIELDS = [
  {
    "name": "name",
    "label": "College name",
    "type": "text",
    "required": true
  },
  {
    "name": "short_name",
    "label": "Short name / abbreviation",
    "type": "text"
  },
  {
    "name": "type",
    "label": "Institution type",
    "type": "select",
    "options": [
      "Government",
      "Government Aided",
      "Private",
      "Private Aided",
      "Deemed University",
      "Autonomous",
      "Trust",
      "Minority Institution"
    ]
  },
  {
    "name": "ownership",
    "label": "Ownership / trust",
    "type": "text"
  },
  {
    "name": "established_year",
    "label": "Established year",
    "type": "number",
    "min": 1000,
    "max": 2100
  },
  {
    "name": "affiliation",
    "label": "Affiliated to",
    "type": "text",
    "hint": "e.g. Anna University, Chennai"
  },
  {
    "name": "accreditation",
    "label": "Accreditation",
    "type": "text",
    "hint": "e.g. NAAC A+ (CGPA 3.5)"
  },
  {
    "name": "accreditation_valid_till",
    "label": "Accreditation valid till",
    "type": "text"
  },
  {
    "name": "approval_body",
    "label": "Approval bodies",
    "type": "text",
    "hint": "AICTE, UGC, NCTE…"
  },
  {
    "name": "nirf_rank",
    "label": "NIRF / other ranking",
    "type": "text",
    "hint": "e.g. NIRF Engineering #67 (2025)"
  },
  {
    "name": "ranking_source",
    "label": "Ranking source",
    "type": "url"
  },
  {
    "name": "motto",
    "label": "Motto",
    "type": "text"
  },
  {
    "name": "about",
    "label": "About the college",
    "type": "textarea",
    "required": true
  },
  {
    "name": "vision",
    "label": "Vision",
    "type": "textarea"
  },
  {
    "name": "mission",
    "label": "Mission",
    "type": "textarea"
  },
  {
    "name": "highlights",
    "label": "Key highlights",
    "type": "tags",
    "hint": "Short points shown as chips on the public page"
  },
  {
    "name": "address",
    "label": "Address",
    "type": "textarea",
    "required": true
  },
  {
    "name": "city",
    "label": "City",
    "type": "text",
    "required": true
  },
  {
    "name": "state",
    "label": "State",
    "type": "text",
    "required": true
  },
  {
    "name": "pincode",
    "label": "PIN code",
    "type": "text"
  },
  {
    "name": "country",
    "label": "Country",
    "type": "text",
    "default": "India"
  },
  {
    "name": "latitude",
    "label": "Latitude",
    "type": "number"
  },
  {
    "name": "longitude",
    "label": "Longitude",
    "type": "number"
  },
  {
    "name": "phone",
    "label": "Phone",
    "type": "tel",
    "required": true
  },
  {
    "name": "alt_phone",
    "label": "Alternate phone",
    "type": "tel"
  },
  {
    "name": "email",
    "label": "Official email",
    "type": "email",
    "required": true
  },
  {
    "name": "admission_email",
    "label": "Admission office email",
    "type": "email"
  },
  {
    "name": "website",
    "label": "Official website",
    "type": "url",
    "required": true
  },
  {
    "name": "admissions_url",
    "label": "Admissions page URL",
    "type": "url"
  },
  {
    "name": "facebook",
    "label": "Facebook page",
    "type": "url"
  },
  {
    "name": "instagram",
    "label": "Instagram",
    "type": "url"
  },
  {
    "name": "linkedin",
    "label": "LinkedIn",
    "type": "url"
  },
  {
    "name": "youtube",
    "label": "YouTube channel",
    "type": "url"
  },
  {
    "name": "logo_url",
    "label": "Logo",
    "type": "image"
  },
  {
    "name": "cover_url",
    "label": "Cover image",
    "type": "image"
  },
  {
    "name": "campus_area",
    "label": "Campus area",
    "type": "text",
    "hint": "e.g. 45 acres"
  },
  {
    "name": "campus_area_acres",
    "label": "Campus area (acres)",
    "type": "number"
  },
  {
    "name": "total_students",
    "label": "Total students",
    "type": "number"
  },
  {
    "name": "total_faculty",
    "label": "Total faculty",
    "type": "number"
  },
  {
    "name": "student_faculty_ratio",
    "label": "Student : faculty ratio",
    "type": "text"
  },
  {
    "name": "gender_ratio",
    "label": "Gender ratio",
    "type": "text"
  },
  {
    "name": "hostel_available",
    "label": "Hostel available",
    "type": "boolean"
  },
  {
    "name": "transport_available",
    "label": "Transport available",
    "type": "boolean"
  },
  {
    "name": "source_url",
    "label": "Data source (official website page)",
    "type": "url"
  }
];

export const SECTION_ORDER = ["departments","courses","fees","faculty","placements","recruiters","internships","hostels","transport","library","sports","infrastructure","facilities","scholarships","events","achievements","media","documents"];

export const SECTION_GROUPS = [
  { label: 'Academics', sections: ['departments', 'courses', 'fees', 'faculty'] },
  { label: 'Placements & Careers', sections: ['placements', 'recruiters', 'internships'] },
  { label: 'Campus Life', sections: ['hostels', 'transport', 'library', 'sports', 'infrastructure', 'facilities'] },
  { label: 'Students & Recognition', sections: ['scholarships', 'events', 'achievements'] },
  { label: 'Media & Documents', sections: ['media', 'documents'] },
];
