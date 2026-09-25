/**
 * Schema-driven entity registry.
 *
 * Every "manageable section" of a college profile (departments, courses, fees,
 * faculty, hostels, transport, library, sports, events, achievements,
 * scholarships, placements, recruiters, internships, facilities,
 * infrastructure, media, documents) is declared ONCE here as a list of fields.
 *
 * The same declaration is used to:
 *   1. generate the SQLite DDL (see schema.js)
 *   2. validate + coerce API writes (see routes/entities.routes.js)
 *   3. render the college dashboard forms/tables on the client
 *      (mirrored to client/src/entities.js)
 *
 * Field types: text | textarea | number | currency | percent | date | select |
 *              url | email | tel | boolean | tags | image | file
 */

const F = (name, label, type = 'text', extra = {}) => ({ name, label, type, ...extra });

export const ENTITIES = {
  departments: {
    label: 'Department',
    plural: 'Departments',
    icon: '🏛️',
    order: 1,
    description: 'Academic departments, their heads, research areas and contact details.',
    fields: [
      F('name', 'Department name', 'text', { required: true, list: true, search: true }),
      F('code', 'Short code', 'text', { list: true, hint: 'e.g. CSE' }),
      F('established_year', 'Established year', 'number', { min: 1800, max: 2100 }),
      F('hod_name', 'Head of department', 'text', { list: true }),
      F('hod_designation', 'HOD designation', 'text'),
      F('faculty_count', 'Faculty count', 'number', { list: true, min: 0 }),
      F('students_count', 'Students count', 'number', { min: 0 }),
      F('programs_count', 'Programmes offered', 'number', { min: 0 }),
      F('research_areas', 'Research areas', 'tags', { hint: 'Comma separated' }),
      F('about', 'About the department', 'textarea'),
      F('contact_email', 'Contact email', 'email'),
      F('contact_phone', 'Contact phone', 'tel'),
      F('image_url', 'Department image', 'image'),
    ],
  },

  courses: {
    label: 'Course',
    plural: 'Courses & Admissions',
    icon: '🎓',
    order: 2,
    description:
      'Programmes, eligibility, admission criteria, live seat availability and the application window.',
    fields: [
      F('name', 'Course / programme name', 'text', { required: true, list: true, search: true }),
      F('code', 'Course code', 'text', { list: true }),
      F('department_name', 'Department', 'text', { list: true, search: true }),
      F('level', 'Level', 'select', {
        list: true,
        options: ['UG', 'PG', 'Diploma', 'Doctorate', 'Certificate', 'Integrated'],
        default: 'UG',
      }),
      F('degree_type', 'Degree awarded', 'text', { hint: 'e.g. B.E., B.Tech, B.Sc.' }),
      F('stream', 'Stream / discipline', 'text', { hint: 'e.g. Engineering, Management, Arts' }),
      F('duration', 'Duration', 'text', { list: true, hint: 'e.g. 4 Years' }),
      F('mode', 'Mode of study', 'select', { options: ['Full Time', 'Part Time', 'Online', 'Hybrid'], default: 'Full Time' }),
      F('intake_seats', 'Sanctioned intake', 'number', { list: true, min: 0, required: true }),
      F('filled_seats', 'Seats filled', 'number', { list: true, min: 0, default: 0 }),
      F('reserved_seats', 'Reserved seats', 'number', { min: 0 }),
      F('eligibility', 'Eligibility criteria', 'textarea', { required: true }),
      F('admission_criteria', 'Admission criteria', 'textarea'),
      F('selection_process', 'Selection process', 'textarea'),
      F('entrance_exams', 'Entrance exams accepted', 'tags'),
      F('application_fee', 'Application fee', 'currency'),
      F('tuition_fee', 'Tuition fee (per year)', 'currency', { list: true }),
      F('total_fee', 'Total course fee', 'currency'),
      F('admission_start_date', 'Applications open', 'date'),
      F('application_deadline', 'Application deadline', 'date', { list: true }),
      F('admission_status', 'Admission status', 'select', {
        list: true,
        options: ['Open', 'Closing Soon', 'Few Seats Left', 'Closed', 'Coming Soon'],
        default: 'Open',
      }),
      F('specializations', 'Specialisations', 'tags'),
      F('highlights', 'Course highlights', 'textarea'),
      F('avg_package', 'Average package (programme)', 'currency'),
      F('syllabus_url', 'Syllabus link', 'url'),
      F('brochure_url', 'Brochure link', 'url'),
      F('accreditation', 'Accreditation (NBA etc.)', 'text'),
      F('is_active', 'Currently offered', 'boolean', { default: 1 }),
    ],
  },

  fees: {
    label: 'Fee record',
    plural: 'Fee Structure',
    icon: '💰',
    order: 3,
    description: 'Head-wise fee structure for each programme and academic year.',
    fields: [
      F('course_name', 'Course', 'text', { required: true, list: true, search: true }),
      F('academic_year', 'Academic year', 'text', { list: true, hint: 'e.g. 2026-27', required: true }),
      F('tuition_fee', 'Tuition fee', 'currency', { list: true }),
      F('admission_fee', 'One-time admission fee', 'currency'),
      F('exam_fee', 'Examination fee', 'currency'),
      F('lab_fee', 'Laboratory fee', 'currency'),
      F('library_fee', 'Library fee', 'currency'),
      F('hostel_fee', 'Hostel fee', 'currency', { list: true }),
      F('transport_fee', 'Transport fee', 'currency'),
      F('other_fee', 'Other charges', 'currency'),
      F('total_fee', 'Total (per year)', 'currency', { list: true }),
      F('currency', 'Currency', 'select', { options: ['INR', 'USD', 'EUR', 'GBP', 'AED'], default: 'INR' }),
      F('payment_terms', 'Payment terms / instalments', 'textarea'),
      F('refund_policy', 'Refund policy', 'textarea'),
      F('scholarship_note', 'Scholarship / concession note', 'textarea'),
      F('is_current', 'Applicable for current admissions', 'boolean', { default: 1 }),
      F('notes', 'Additional notes', 'textarea'),
    ],
  },

  faculty: {
    label: 'Faculty member',
    plural: 'Faculty',
    icon: '👩‍🏫',
    order: 4,
    description: 'Teaching staff, qualifications, experience and research output.',
    fields: [
      F('name', 'Full name', 'text', { required: true, list: true, search: true }),
      F('designation', 'Designation', 'text', { list: true, required: true }),
      F('department_name', 'Department', 'text', { list: true, search: true }),
      F('qualification', 'Highest qualification', 'text', { list: true, hint: 'e.g. Ph.D.' }),
      F('specialization', 'Specialisation', 'text', { search: true }),
      F('experience_years', 'Experience (years)', 'number', { list: true, min: 0 }),
      F('is_hod', 'Heads a department', 'boolean', { default: 0 }),
      F('joined_year', 'Joined year', 'number', { min: 1900, max: 2100 }),
      F('email', 'Email', 'email'),
      F('phone', 'Phone', 'tel'),
      F('publications', 'Publications', 'number', { min: 0 }),
      F('awards', 'Awards / recognitions', 'textarea'),
      F('bio', 'Profile summary', 'textarea'),
      F('photo_url', 'Photo', 'image'),
    ],
  },

  placements: {
    label: 'Placement record',
    plural: 'Placements',
    icon: '📈',
    order: 5,
    description:
      'Year-wise placement performance: students placed, offers, highest / average / median packages.',
    fields: [
      F('academic_year', 'Academic year', 'text', { required: true, list: true, hint: 'e.g. 2025-26' }),
      F('programme_level', 'Programme level', 'select', {
        list: true,
        options: ['Overall', 'UG', 'PG', 'Diploma', 'Management', 'All Programmes'],
        default: 'Overall',
      }),
      F('students_graduated', 'Students graduated', 'number', { list: true, min: 0 }),
      F('students_placed', 'Students placed', 'number', { list: true, min: 0 }),
      F('placement_percentage', 'Placement %', 'percent', { list: true, min: 0, max: 100 }),
      F('offers_made', 'Total offers made', 'number', { list: true, min: 0 }),
      F('companies_visited', 'Companies visited', 'number', { min: 0 }),
      F('highest_package', 'Highest package', 'currency', { list: true }),
      F('average_package', 'Average package', 'currency', { list: true }),
      F('median_package', 'Median package', 'currency'),
      F('lowest_package', 'Lowest package', 'currency'),
      F('currency', 'Currency', 'select', { options: ['INR', 'USD', 'EUR', 'GBP', 'AED'], default: 'INR' }),
      F('package_unit', 'Package unit', 'select', { options: ['Per Annum', 'Per Month', 'Total CTC'], default: 'Per Annum' }),
      F('top_recruiter', 'Top recruiter', 'text', { list: true }),
      F('international_offers', 'International offers', 'number', { min: 0 }),
      F('higher_studies_count', 'Students opting higher studies', 'number', { min: 0 }),
      F('notes', 'Notes', 'textarea'),
      F('source_url', 'Source (placement report URL)', 'url'),
    ],
  },

  recruiters: {
    label: 'Recruiter',
    plural: 'Recruiters',
    icon: '🏢',
    order: 6,
    description: 'Companies that recruit on campus, with offers and package details.',
    fields: [
      F('name', 'Company name', 'text', { required: true, list: true, search: true }),
      F('sector', 'Sector', 'select', {
        list: true,
        options: ['IT & Software', 'Core Engineering', 'Manufacturing', 'Consulting', 'Banking & Finance', 'Analytics', 'Healthcare', 'FMCG', 'Education', 'Government / PSU', 'Other'],
      }),
      F('academic_year', 'Academic year', 'text', { list: true }),
      F('offers_made', 'Offers made', 'number', { list: true, min: 0 }),
      F('avg_package', 'Average package offered', 'currency', { list: true }),
      F('highest_package', 'Highest package offered', 'currency'),
      F('visit_type', 'Engagement type', 'select', { options: ['On-campus', 'Off-campus', 'Pooled campus', 'Internship', 'Virtual'], default: 'On-campus' }),
      F('is_top', 'Top / dream recruiter', 'boolean', { default: 0, list: true }),
      F('website', 'Website', 'url'),
      F('logo_url', 'Logo', 'image'),
      F('description', 'Roles offered / notes', 'textarea'),
    ],
  },

  internships: {
    label: 'Internship',
    plural: 'Internships',
    icon: '🧑‍💻',
    order: 7,
    description: 'Internship and training opportunities offered to students.',
    fields: [
      F('company', 'Company / organisation', 'text', { required: true, list: true, search: true }),
      F('role', 'Role', 'text', { list: true }),
      F('sector', 'Sector', 'text'),
      F('academic_year', 'Academic year', 'text', { list: true }),
      F('stipend', 'Stipend', 'currency', { list: true }),
      F('stipend_period', 'Stipend period', 'select', { options: ['Per Month', 'Per Week', 'Per Day', 'One-time'], default: 'Per Month' }),
      F('duration', 'Duration', 'text', { hint: 'e.g. 6 months' }),
      F('mode', 'Mode', 'select', { options: ['On-site', 'Remote', 'Hybrid'], default: 'On-site' }),
      F('students_count', 'Students selected', 'number', { list: true, min: 0 }),
      F('ppo_offers', 'PPO / PPI offers', 'number', { min: 0 }),
      F('eligibility', 'Eligibility', 'textarea'),
      F('description', 'Description', 'textarea'),
      F('application_link', 'Application link', 'url'),
    ],
  },

  hostels: {
    label: 'Hostel',
    plural: 'Hostels',
    icon: '🛏️',
    order: 8,
    description: 'Boys / girls hostels, capacity, room types, amenities and mess details.',
    fields: [
      F('name', 'Hostel name', 'text', { required: true, list: true }),
      F('gender', 'For', 'select', { list: true, options: ['Boys', 'Girls', 'Co-ed'], default: 'Boys' }),
      F('total_rooms', 'Total rooms', 'number', { min: 0 }),
      F('capacity', 'Total capacity', 'number', { list: true, min: 0 }),
      F('occupied', 'Currently occupied', 'number', { min: 0 }),
      F('room_types', 'Room types', 'tags', { hint: 'e.g. Single, Double, Triple' }),
      F('fees_per_year', 'Hostel fee (per year)', 'currency', { list: true }),
      F('mess_type', 'Mess', 'select', { options: ['Veg', 'Veg & Non-Veg', 'Multi-cuisine'], default: 'Veg & Non-Veg' }),
      F('mess_details', 'Mess / food details', 'textarea'),
      F('amenities', 'Amenities', 'tags', { hint: 'Wi-Fi, Laundry, Gym, RO water…' }),
      F('timings', 'Timings / curfew', 'text'),
      F('warden_name', 'Warden name', 'text'),
      F('warden_phone', 'Warden contact', 'tel'),
      F('distance_from_campus', 'Distance from campus', 'text'),
      F('description', 'Description', 'textarea'),
      F('image_url', 'Hostel image', 'image'),
    ],
  },

  transport: {
    label: 'Transport route',
    plural: 'Transport',
    icon: '🚌',
    order: 9,
    description: 'Bus routes, stops, fleet and transport fees.',
    fields: [
      F('route_no', 'Route number', 'text', { list: true }),
      F('route_name', 'Route name', 'text', { required: true, list: true, search: true }),
      F('stops', 'Stops covered', 'textarea', { hint: 'Comma or newline separated' }),
      F('vehicle_type', 'Vehicle type', 'text', { hint: 'e.g. 52-seater bus' }),
      F('fleet_count', 'Buses on route', 'number', { min: 0 }),
      F('capacity', 'Seating capacity', 'number', { min: 0 }),
      F('daily_trips', 'Daily trips', 'number', { min: 0 }),
      F('timings', 'Timings', 'text'),
      F('fee_per_year', 'Transport fee (per year)', 'currency', { list: true }),
      F('contact_person', 'Contact person', 'text'),
      F('contact_phone', 'Contact number', 'tel'),
      F('gps_tracking', 'GPS tracking available', 'boolean', { default: 0, list: true }),
      F('description', 'Description', 'textarea'),
    ],
  },

  library: {
    label: 'Library',
    plural: 'Library',
    icon: '📚',
    order: 10,
    description: 'Library holdings, digital resources, timings and services.',
    fields: [
      F('name', 'Library name', 'text', { required: true, list: true }),
      F('established_year', 'Established year', 'number', { min: 1800, max: 2100 }),
      F('total_books', 'Book volumes', 'number', { list: true, min: 0 }),
      F('total_titles', 'Titles', 'number', { min: 0 }),
      F('journals', 'Print journals', 'number', { list: true, min: 0 }),
      F('e_journals', 'E-journals', 'number', { min: 0 }),
      F('e_books', 'E-books', 'number', { min: 0 }),
      F('digital_databases', 'Digital databases / e-resources', 'tags', { hint: 'IEEE, Springer, Scopus…' }),
      F('seating_capacity', 'Seating capacity', 'number', { list: true, min: 0 }),
      F('area_sqft', 'Area (sq. ft.)', 'number', { min: 0 }),
      F('timings', 'Working hours', 'text', { list: true }),
      F('membership', 'Membership / access', 'text'),
      F('services', 'Services offered', 'tags', { hint: 'Reference service, Book bank, Reprography…' }),
      F('automation_software', 'Library automation software', 'text'),
      F('description', 'Description', 'textarea'),
      F('image_url', 'Library image', 'image'),
    ],
  },

  sports: {
    label: 'Sports facility',
    plural: 'Sports',
    icon: '🏅',
    order: 11,
    description: 'Indoor / outdoor sports facilities, coaches and achievements.',
    fields: [
      F('sport_name', 'Sport / game', 'text', { required: true, list: true, search: true }),
      F('category', 'Category', 'select', { list: true, options: ['Outdoor', 'Indoor', 'Aquatics', 'Adventure', 'Gymnasium'], default: 'Outdoor' }),
      F('facilities', 'Facilities available', 'textarea'),
      F('courts_count', 'Courts / grounds', 'number', { min: 0 }),
      F('coach_name', 'Coach / physical director', 'text'),
      F('coach_qualification', 'Coach qualification', 'text'),
      F('teams', 'College teams', 'tags'),
      F('achievements', 'Achievements', 'textarea'),
      F('timings', 'Practice timings', 'text'),
      F('description', 'Description', 'textarea'),
      F('image_url', 'Image', 'image'),
    ],
  },

  infrastructure: {
    label: 'Infrastructure',
    plural: 'Infrastructure',
    icon: '🏗️',
    order: 12,
    description: 'Buildings, laboratories, research centres, auditoria and other physical infrastructure.',
    fields: [
      F('name', 'Name', 'text', { required: true, list: true, search: true }),
      F('category', 'Category', 'select', {
        list: true,
        options: ['Academic Block', 'Laboratory', 'Research Centre', 'Seminar Hall', 'Auditorium', 'Sports Complex', 'Workshop', 'Digital Classroom', 'Hostel Block', 'Other'],
      }),
      F('area_sqft', 'Area (sq. ft.)', 'number', { min: 0 }),
      F('capacity', 'Capacity', 'number', { min: 0 }),
      F('year_built', 'Year established', 'number', { min: 1800, max: 2100 }),
      F('equipment', 'Key equipment / systems', 'textarea'),
      F('green_building', 'Green / energy efficient', 'boolean', { default: 0 }),
      F('description', 'Description', 'textarea'),
      F('image_url', 'Image', 'image'),
    ],
  },

  facilities: {
    label: 'Campus facility',
    plural: 'Campus Facilities',
    icon: '🧭',
    order: 13,
    description: 'Wi-Fi, medical, canteen, bank, security, counselling and other campus facilities.',
    fields: [
      F('name', 'Facility', 'text', { required: true, list: true, search: true }),
      F('category', 'Category', 'select', {
        list: true,
        options: ['IT & Wi-Fi', 'Laboratory', 'Medical', 'Canteen & Food', 'Auditorium', 'Security', 'Bank & ATM', 'Counselling', 'Placement Cell', 'Innovation / Incubation', 'Transport', 'Green Campus', 'Other'],
      }),
      F('available', 'Available', 'boolean', { default: 1, list: true }),
      F('capacity', 'Capacity', 'number', { min: 0 }),
      F('timings', 'Timings', 'text'),
      F('description', 'Description', 'textarea'),
      F('image_url', 'Image', 'image'),
    ],
  },

  scholarships: {
    label: 'Scholarship',
    plural: 'Scholarships',
    icon: '🎯',
    order: 14,
    description: 'Merit, need-based, government and private scholarships available to students.',
    fields: [
      F('name', 'Scholarship name', 'text', { required: true, list: true, search: true }),
      F('provider_type', 'Provided by', 'select', { list: true, options: ['College', 'Government', 'Private / Corporate', 'Trust', 'Alumni'], default: 'College' }),
      F('category', 'Category', 'select', {
        list: true,
        options: ['Merit', 'Need-based', 'SC / ST', 'OBC', 'Minority', 'Sports', 'Differently-abled', 'First Graduate', 'Girl Student', 'Research'],
      }),
      F('amount', 'Amount', 'currency', { list: true }),
      F('amount_type', 'Benefit type', 'select', { options: ['Fixed amount', 'Percentage of tuition fee', 'Full tuition waiver', 'Part fee waiver', 'Stipend'], default: 'Percentage of tuition fee' }),
      F('percent_value', 'Percentage / concession', 'percent'),
      F('eligibility', 'Eligibility', 'textarea', { required: true }),
      F('course_level', 'Applicable to', 'select', { options: ['All', 'UG', 'PG', 'Diploma', 'Doctorate'], default: 'All' }),
      F('number_available', 'Number of scholarships', 'number', { min: 0 }),
      F('deadline', 'Application deadline', 'date', { list: true }),
      F('documents_required', 'Documents required', 'tags'),
      F('description', 'Description', 'textarea'),
      F('application_link', 'Application link', 'url'),
      F('is_active', 'Active', 'boolean', { default: 1 }),
    ],
  },

  events: {
    label: 'Event',
    plural: 'Events',
    icon: '🎉',
    order: 15,
    description: 'Technical, cultural, sports and academic events hosted by the college.',
    fields: [
      F('title', 'Event title', 'text', { required: true, list: true, search: true }),
      F('category', 'Category', 'select', {
        list: true,
        options: ['Technical', 'Cultural', 'Sports', 'Workshop', 'Conference', 'Symposium', 'Seminar', 'Fest', 'Orientation', 'Other'],
      }),
      F('start_date', 'Start date', 'date', { list: true }),
      F('end_date', 'End date', 'date'),
      F('venue', 'Venue', 'text', { list: true }),
      F('chief_guest', 'Chief guest / speaker', 'text'),
      F('participants_count', 'Participants', 'number', { min: 0 }),
      F('status', 'Status', 'select', { list: true, options: ['Upcoming', 'Ongoing', 'Completed'], default: 'Upcoming' }),
      F('registration_link', 'Registration link', 'url'),
      F('description', 'Description', 'textarea'),
      F('image_url', 'Event image', 'image'),
    ],
  },

  achievements: {
    label: 'Achievement',
    plural: 'Achievements',
    icon: '🏆',
    order: 16,
    description: 'Academic, research, sports, innovation and institutional achievements.',
    fields: [
      F('title', 'Achievement', 'text', { required: true, list: true, search: true }),
      F('category', 'Category', 'select', {
        list: true,
        options: ['Academic', 'Research', 'Sports', 'Innovation', 'Institutional', 'Ranking', 'Alumni', 'Placement', 'Other'],
      }),
      F('level', 'Level', 'select', { list: true, options: ['International', 'National', 'State', 'University', 'College'] }),
      F('year', 'Year', 'number', { list: true, min: 1800, max: 2100 }),
      F('achieved_by', 'Achieved by', 'text', { list: true, hint: 'Student / team / department' }),
      F('department_name', 'Department', 'text'),
      F('rank_position', 'Rank / position', 'text'),
      F('award_organisation', 'Awarding organisation', 'text'),
      F('description', 'Description', 'textarea'),
      F('image_url', 'Image', 'image'),
    ],
  },

  media: {
    label: 'Media item',
    plural: 'Photos & Videos',
    icon: '🖼️',
    order: 17,
    description: 'Campus photographs and videos shown to students in the gallery.',
    fields: [
      F('title', 'Title', 'text', { required: true, list: true, search: true }),
      F('type', 'Type', 'select', { list: true, options: ['Image', 'Video'], default: 'Image' }),
      F('category', 'Category', 'select', {
        list: true,
        options: ['Campus', 'Gallery', 'Academic', 'Laboratory', 'Library', 'Hostel', 'Sports', 'Event', 'Placement', 'Transport', 'Other'],
        default: 'Campus',
      }),
      F('url', 'Image / video URL', 'image', { required: true, list: true, hint: 'Upload an image or paste a YouTube / image URL' }),
      F('thumbnail_url', 'Thumbnail (optional)', 'image'),
      F('caption', 'Caption', 'text'),
      F('sort_order', 'Display order', 'number', { default: 0 }),
      F('is_cover', 'Use as college cover photo', 'boolean', { default: 0 }),
    ],
  },

  documents: {
    label: 'Document',
    plural: 'Documents & Brochures',
    icon: '📄',
    order: 18,
    description: 'Prospectus, brochures, fee structures, mandatory disclosures and reports.',
    fields: [
      F('title', 'Document title', 'text', { required: true, list: true, search: true }),
      F('category', 'Category', 'select', {
        list: true,
        options: ['Prospectus', 'Brochure', 'Admission Form', 'Fee Structure', 'Academic Calendar', 'Syllabus', 'Mandatory Disclosure', 'Placement Report', 'Audit Report', 'Other'],
      }),
      F('year', 'Year', 'text', { list: true }),
      F('file_url', 'File / link', 'file', { required: true, list: true }),
      F('file_size_kb', 'File size (KB)', 'number', { min: 0 }),
      F('is_public', 'Visible to students', 'boolean', { default: 1 }),
      F('description', 'Description', 'textarea'),
    ],
  },
};

/** Sections used to compute the profile-completeness score. */
export const COMPLETENESS_SECTIONS = [
  { key: 'base', label: 'Basic information', weight: 16 },
  { key: 'about', label: 'About, vision & mission', weight: 8 },
  { key: 'contact', label: 'Contact & location', weight: 8 },
  { key: 'branding', label: 'Logo & cover photo', weight: 6 },
  { key: 'departments', label: 'Departments', weight: 8, entity: 'departments', min: 1 },
  { key: 'courses', label: 'Courses & eligibility', weight: 12, entity: 'courses', min: 1 },
  { key: 'fees', label: 'Fee structure', weight: 6, entity: 'fees', min: 1 },
  { key: 'faculty', label: 'Faculty details', weight: 6, entity: 'faculty', min: 1 },
  { key: 'placements', label: 'Placement records', weight: 8, entity: 'placements', min: 1 },
  { key: 'recruiters', label: 'Recruiters', weight: 4, entity: 'recruiters', min: 1 },
  { key: 'campus', label: 'Hostel / transport / library / sports', weight: 6, entity: 'hostels|transport|library|sports', min: 1 },
  { key: 'media', label: 'Photos & videos', weight: 6, entity: 'media', min: 2 },
  { key: 'student_life', label: 'Events, achievements & scholarships', weight: 6, entity: 'events|achievements|scholarships', min: 1 },
];

/** Columns a college may edit directly on its own profile row. */
export const COLLEGE_PROFILE_FIELDS = [
  F('name', 'College name', 'text', { required: true }),
  F('short_name', 'Short name / abbreviation', 'text'),
  F('type', 'Institution type', 'select', {
    options: ['Government', 'Government Aided', 'Private', 'Private Aided', 'Deemed University', 'Autonomous', 'Trust', 'Minority Institution'],
  }),
  F('ownership', 'Ownership / trust', 'text'),
  F('established_year', 'Established year', 'number', { min: 1000, max: 2100 }),
  F('affiliation', 'Affiliated to', 'text', { hint: 'e.g. Anna University, Chennai' }),
  F('accreditation', 'Accreditation', 'text', { hint: 'e.g. NAAC A+ (CGPA 3.5)' }),
  F('accreditation_valid_till', 'Accreditation valid till', 'text'),
  F('approval_body', 'Approval bodies', 'text', { hint: 'AICTE, UGC, NCTE…' }),
  F('nirf_rank', 'NIRF / other ranking', 'text', { hint: 'e.g. NIRF Engineering #67 (2025)' }),
  F('ranking_source', 'Ranking source', 'url'),
  F('motto', 'Motto', 'text'),
  F('about', 'About the college', 'textarea', { required: true }),
  F('vision', 'Vision', 'textarea'),
  F('mission', 'Mission', 'textarea'),
  F('highlights', 'Key highlights', 'tags', { hint: 'Short points shown as chips on the public page' }),
  F('address', 'Address', 'textarea', { required: true }),
  F('city', 'City', 'text', { required: true }),
  F('state', 'State', 'text', { required: true }),
  F('pincode', 'PIN code', 'text'),
  F('country', 'Country', 'text', { default: 'India' }),
  F('latitude', 'Latitude', 'number'),
  F('longitude', 'Longitude', 'number'),
  F('phone', 'Phone', 'tel', { required: true }),
  F('alt_phone', 'Alternate phone', 'tel'),
  F('email', 'Official email', 'email', { required: true }),
  F('admission_email', 'Admission office email', 'email'),
  F('website', 'Official website', 'url', { required: true }),
  F('admissions_url', 'Admissions page URL', 'url'),
  F('facebook', 'Facebook page', 'url'),
  F('instagram', 'Instagram', 'url'),
  F('linkedin', 'LinkedIn', 'url'),
  F('youtube', 'YouTube channel', 'url'),
  F('logo_url', 'Logo', 'image'),
  F('cover_url', 'Cover image', 'image'),
  F('campus_area', 'Campus area', 'text', { hint: 'e.g. 45 acres' }),
  F('campus_area_acres', 'Campus area (acres)', 'number'),
  F('total_students', 'Total students', 'number'),
  F('total_faculty', 'Total faculty', 'number'),
  F('student_faculty_ratio', 'Student : faculty ratio', 'text'),
  F('gender_ratio', 'Gender ratio', 'text'),
  F('hostel_available', 'Hostel available', 'boolean'),
  F('transport_available', 'Transport available', 'boolean'),
  F('source_url', 'Data source (official website page)', 'url'),
];

export const COLLEGE_FIELD_MAP = Object.fromEntries(COLLEGE_PROFILE_FIELDS.map((f) => [f.name, f]));

/** SQL column type for a field definition. */
export function sqlTypeFor(field) {
  switch (field.type) {
    case 'number':
    case 'currency':
    case 'percent':
      return 'REAL';
    case 'boolean':
      return 'INTEGER DEFAULT 0';
    case 'tags':
      return 'TEXT'; // JSON encoded array
    default:
      return 'TEXT';
  }
}

/** Coerce an incoming JSON value into the storage representation. */
export function coerceValue(field, value) {
  if (value === undefined || value === null || value === '') {
    return field.type === 'boolean' ? 0 : null;
  }
  switch (field.type) {
    case 'number':
    case 'currency':
    case 'percent': {
      const n = Number(value);
      if (!Number.isFinite(n)) throw new ApiFieldError(`${field.label} must be a number`);
      return n;
    }
    case 'boolean':
      return value === true || value === 1 || value === '1' || value === 'true' ? 1 : 0;
    case 'tags': {
      if (Array.isArray(value)) return JSON.stringify(value.map((v) => String(v).trim()).filter(Boolean));
      if (typeof value === 'object') return JSON.stringify(value);
      return JSON.stringify(
        String(value)
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean),
      );
    }
    default: {
      const s = String(value).trim();
      return s.length ? s : null;
    }
  }
}

export class ApiFieldError extends Error {}

/** Validate a payload against an entity definition; returns storage-ready object. */
export function validatePayload(fields, body, { partial = false } = {}) {
  const source = body && typeof body === 'object' ? body : {};
  const out = {};
  const errors = [];
  const provided = (name) => Object.prototype.hasOwnProperty.call(source, name);
  const isEmpty = (v) => v === null || v === undefined || v === '';

  for (const field of fields) {
    if (!provided(field.name)) {
      if (partial) continue;
      if (field.required) {
        errors.push(`${field.label} is required`);
      } else if (field.default !== undefined) {
        out[field.name] = coerceValue(field, field.default);
      }
      continue;
    }
    let value;
    try {
      value = coerceValue(field, source[field.name]);
    } catch (err) {
      errors.push(err.message);
      continue;
    }
    if (field.required && isEmpty(value)) {
      errors.push(`${field.label} is required`);
      continue;
    }
    out[field.name] = value;
  }

  if (errors.length) {
    const err = new ApiFieldError(errors.join('. '));
    err.status = 400;
    throw err;
  }
  return out;
}

/** Normalise a row for API responses, decoding tags/booleans. */
export function serializeRow(row, entity) {
  return decodeRow(row, entity.fields);
}

/** Storage-ready object from an entity definition. */
export function buildEntityPayload(entityName, body, opts = {}) {
  const entity = ENTITIES[entityName];
  if (!entity) throw new ApiFieldError(`Unknown section "${entityName}"`);
  return validatePayload(entity.fields, body, opts);
}

/** Decode tags/boolean columns when reading rows out of SQLite. */
export function decodeRow(row, fields) {
  if (!row) return row;
  const byName = Object.fromEntries(fields.map((f) => [f.name, f]));
  const out = { ...row };
  for (const [key, value] of Object.entries(out)) {
    const field = byName[key];
    if (!field) continue;
    if (field.type === 'tags') {
      try {
        out[key] = value ? JSON.parse(value) : [];
      } catch {
        out[key] = value ? String(value).split(',').map((s) => s.trim()) : [];
      }
    } else if (field.type === 'boolean') {
      out[key] = value ? 1 : 0;
    }
  }
  return out;
}
