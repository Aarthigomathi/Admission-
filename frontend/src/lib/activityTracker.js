/**
 * Student Activity Tracking - Core Feature - Updated with Full Visitor Details for Admin
 * Records: student_id, college_id, course_id, date, time, activity_type + full student details
 * Admin can see: yar yaru entha college visit pananga - name, mail, address, district, etc and download
 * Platform Admin: sees all colleges visitors
 * College Admin: sees only own college visitors (college_id isolation)
 */

const ACTIVITY_TYPES = {
  COLLEGE_VIEW: 'COLLEGE_VIEW',
  COURSE_VIEW: 'COURSE_VIEW',
  SAVE: 'SAVE',
  COMPARE: 'COMPARE',
  ENQUIRY: 'ENQUIRY',
  SEARCH: 'SEARCH',
  PROFILE_VIEW: 'PROFILE_VIEW'
}

class ActivityTracker {
  constructor() {
    this.storageKey = 'tn_student_activities'
    this.recentlyViewedKey = 'tn_recently_viewed'
  }

  getCurrentStudent() {
    try {
      const student = JSON.parse(localStorage.getItem('tn_current_student') || 'null')
      return student
    } catch {
      return null
    }
  }

  // Get all students for admin view
  getAllStudents() {
    try {
      return JSON.parse(localStorage.getItem('tn_students') || '[]')
    } catch {
      return []
    }
  }

  // Record activity with full student details - for admin to see who visited which college
  recordActivity({ collegeId, courseId, activityType, metadata = {}, personalInfoShared = false }) {
    const student = this.getCurrentStudent()
    if (!student) {
      // For demo, create anonymous activity with demo student if not logged in - so admin can see data
      const demoStudent = {
        id: 999,
        fullName: 'Guest Student',
        email: 'guest@demo.com',
        mobile: '9876543210',
        district: 'Coimbatore',
        city: 'Coimbatore',
        educationLevel: '12th',
        schoolCollege: 'Demo School',
        percentage: '85%',
        groupStream: 'Computer Science',
        interestedCourse: 'B.E Computer Science',
        preferredDistrict: 'Coimbatore',
        address: 'Coimbatore, Tamil Nadu'
      }
      const activity = {
        id: Date.now() + Math.random(),
        student_id: demoStudent.id,
        student_name: demoStudent.fullName,
        student_email: demoStudent.email,
        student_mobile: demoStudent.mobile,
        student_district: demoStudent.district,
        student_city: demoStudent.city,
        student_address: `${demoStudent.city}, ${demoStudent.district}, Tamil Nadu`,
        student_educationLevel: demoStudent.educationLevel,
        student_schoolCollege: demoStudent.schoolCollege,
        student_percentage: demoStudent.percentage,
        student_groupStream: demoStudent.groupStream,
        student_interestedCourse: demoStudent.interestedCourse,
        college_id: collegeId,
        course_id: courseId || null,
        activity_type: activityType,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0],
        timestamp: new Date().toISOString(),
        district: demoStudent.district,
        educationLevel: demoStudent.educationLevel,
        interestedCourse: demoStudent.interestedCourse,
        metadata,
        personalInfoShared: activityType === ACTIVITY_TYPES.ENQUIRY ? true : personalInfoShared
      }
      const activities = this.getAllActivities()
      activities.unshift(activity)
      localStorage.setItem(this.storageKey, JSON.stringify(activities.slice(0, 2000)))
      if (activityType === ACTIVITY_TYPES.COLLEGE_VIEW && collegeId) {
        this.addToRecentlyViewed(collegeId)
      }
      return activity
    }

    const activity = {
      id: Date.now() + Math.random(),
      student_id: student.id,
      student_name: student.fullName || student.name || 'Student',
      student_email: student.email,
      student_mobile: student.mobile || student.phone || 'Not provided',
      student_district: student.district || '',
      student_city: student.city || '',
      student_address: `${student.city || ''}, ${student.district || ''}, ${student.address || ''}, Tamil Nadu`.replace(/^, |, ,/g, ''),
      student_educationLevel: student.educationLevel || '',
      student_schoolCollege: student.schoolCollege || '',
      student_marks: student.marks || '',
      student_percentage: student.percentage || '',
      student_groupStream: student.groupStream || '',
      student_interestedSubject: student.interestedSubject || '',
      student_interestedCourse: student.interestedCourse || '',
      student_preferredDistrict: student.preferredDistrict || '',
      student_collegeType: student.collegeType || '',
      student_hostelRequired: student.hostelRequired || 'No',
      student_transportRequired: student.transportRequired || 'No',
      college_id: collegeId,
      course_id: courseId || null,
      activity_type: activityType,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0],
      timestamp: new Date().toISOString(),
      district: student.district,
      educationLevel: student.educationLevel,
      interestedCourse: student.interestedCourse,
      metadata,
      // For admin view: always store full details, but flag if shared to college
      personalInfoShared: activityType === ACTIVITY_TYPES.ENQUIRY ? true : personalInfoShared,
      // Admin can see all, college admin sees only own college visitors
      visibleToPlatformAdmin: true,
      visibleToCollegeAdmin: true
    }

    const activities = this.getAllActivities()
    activities.unshift(activity)
    const trimmed = activities.slice(0, 5000)
    localStorage.setItem(this.storageKey, JSON.stringify(trimmed))

    if (activityType === ACTIVITY_TYPES.COLLEGE_VIEW && collegeId) {
      this.addToRecentlyViewed(collegeId)
    }

    console.log(`[ActivityTracker] Recorded ${activityType} - Student: ${activity.student_name} (${activity.student_email}) - College ${collegeId} - Date ${activity.date} Time ${activity.time}`)
    
    return activity
  }

  getAllActivities() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || '[]')
    } catch {
      return []
    }
  }

  getActivitiesForCollege(collegeId) {
    return this.getAllActivities().filter(a => String(a.college_id) === String(collegeId))
  }

  // For admin: get detailed visitors list with name, mail, address, etc
  getDetailedVisitorsForCollege(collegeId) {
    const activities = this.getActivitiesForCollege(collegeId)
    // Group by student to show unique visitors with their details and visit history
    const studentMap = new Map()
    activities.forEach(act => {
      const key = act.student_id
      if (!studentMap.has(key)) {
        studentMap.set(key, {
          student_id: act.student_id,
          student_name: act.student_name,
          student_email: act.student_email,
          student_mobile: act.student_mobile,
          student_district: act.student_district,
          student_city: act.student_city,
          student_address: act.student_address,
          student_educationLevel: act.student_educationLevel,
          student_schoolCollege: act.student_schoolCollege,
          student_percentage: act.student_percentage,
          student_groupStream: act.student_groupStream,
          student_interestedCourse: act.student_interestedCourse,
          total_visits: 0,
          college_views: 0,
          course_views: 0,
          saves: 0,
          compares: 0,
          enquiries: 0,
          last_visit_date: act.date,
          last_visit_time: act.time,
          last_activity: act.activity_type,
          activities: []
        })
      }
      const entry = studentMap.get(key)
      entry.total_visits++
      if (act.activity_type === 'COLLEGE_VIEW') entry.college_views++
      if (act.activity_type === 'COURSE_VIEW') entry.course_views++
      if (act.activity_type === 'SAVE') entry.saves++
      if (act.activity_type === 'COMPARE') entry.compares++
      if (act.activity_type === 'ENQUIRY') entry.enquiries++
      entry.activities.push(act)
      // Update last visit to most recent
      if (act.timestamp > (entry.last_timestamp || '')) {
        entry.last_visit_date = act.date
        entry.last_visit_time = act.time
        entry.last_activity = act.activity_type
        entry.last_timestamp = act.timestamp
      }
    })
    return Array.from(studentMap.values()).sort((a,b) => (b.last_timestamp || '').localeCompare(a.last_timestamp || ''))
  }

  // For platform admin: get all visitors across all colleges
  getAllDetailedVisitors() {
    const activities = this.getAllActivities()
    const studentMap = new Map()
    activities.forEach(act => {
      const key = `${act.student_id}-${act.college_id}`
      if (!studentMap.has(key)) {
        studentMap.set(key, {
          id: act.id,
          student_id: act.student_id,
          student_name: act.student_name,
          student_email: act.student_email,
          student_mobile: act.student_mobile,
          student_district: act.student_district,
          student_city: act.student_city,
          student_address: act.student_address,
          student_educationLevel: act.student_educationLevel,
          student_interestedCourse: act.student_interestedCourse,
          college_id: act.college_id,
          college_name: act.metadata?.collegeName || `College ID ${act.college_id}`,
          course_name: act.metadata?.courseName || '',
          activity_type: act.activity_type,
          date: act.date,
          time: act.time,
          timestamp: act.timestamp,
          personalInfoShared: act.personalInfoShared
        })
      }
    })
    return Array.from(studentMap.values()).sort((a,b) => (b.timestamp || '').localeCompare(a.timestamp || ''))
  }

  getAggregatedInterestForCollege(collegeId) {
    const activities = this.getActivitiesForCollege(collegeId)
    const uniqueStudents = new Set(activities.map(a => a.student_id))
    
    const byEducation = {}
    const byDistrict = {}
    const byCourse = {}
    const byActivityType = {}
    const byDate = {}

    activities.forEach(a => {
      byEducation[a.educationLevel || a.student_educationLevel] = (byEducation[a.educationLevel || a.student_educationLevel] || 0) + 1
      byDistrict[a.district || a.student_district] = (byDistrict[a.district || a.student_district] || 0) + 1
      if (a.metadata.courseName || a.course_id) {
        const courseName = a.metadata.courseName || `Course ${a.course_id}`
        byCourse[courseName] = (byCourse[courseName] || 0) + 1
      }
      byActivityType[a.activity_type] = (byActivityType[a.activity_type] || 0) + 1
      byDate[a.date] = (byDate[a.date] || 0) + 1
    })

    return {
      collegeId,
      totalStudentsViewed: uniqueStudents.size,
      totalViews: activities.filter(a => a.activity_type === ACTIVITY_TYPES.COLLEGE_VIEW).length,
      totalCourseViews: activities.filter(a => a.activity_type === ACTIVITY_TYPES.COURSE_VIEW).length,
      saved: activities.filter(a => a.activity_type === ACTIVITY_TYPES.SAVE).length,
      compared: activities.filter(a => a.activity_type === ACTIVITY_TYPES.COMPARE).length,
      enquiries: activities.filter(a => a.activity_type === ACTIVITY_TYPES.ENQUIRY).length,
      byEducation,
      byDistrict,
      byCourse,
      byActivityType,
      byDate,
      detailedVisitors: this.getDetailedVisitorsForCollege(collegeId),
      privacyNote: "Admin can see who visited which college with name, email, address - Platform Admin sees all, College Admin sees only own college - Download CSV/PDF available"
    }
  }

  // Download visitors as CSV - for admin
  downloadVisitorsAsCSV(collegeId, collegeName) {
    const visitors = collegeId ? this.getDetailedVisitorsForCollege(collegeId) : this.getAllDetailedVisitors()
    const isDetailed = collegeId ? true : false
    
    let csv = ''
    if (isDetailed) {
      csv = 'Student ID,Name,Email,Mobile,District,City,Address,Education Level,School/College,Percentage,Group/Stream,Interested Course,Total Visits,College Views,Course Views,Saves,Compares,Enquiries,Last Visit Date,Last Visit Time,Last Activity\n'
      visitors.forEach(v => {
        csv += `"${v.student_id}","${(v.student_name||'').replace(/"/g,'""')}","${v.student_email||''}","${v.student_mobile||''}","${v.student_district||''}","${v.student_city||''}","${(v.student_address||'').replace(/"/g,'""')}","${v.student_educationLevel||''}","${(v.student_schoolCollege||'').replace(/"/g,'""')}","${v.student_percentage||''}","${v.student_groupStream||''}","${v.student_interestedCourse||''}","${v.total_visits}","${v.college_views}","${v.course_views}","${v.saves}","${v.compares}","${v.enquiries}","${v.last_visit_date}","${v.last_visit_time}","${v.last_activity}"\n`
      })
    } else {
      csv = 'Student ID,Student Name,Email,Mobile,District,City,Address,Education Level,Interested Course,College ID,College Name,Course Name,Activity Type,Date,Time,Personal Info Shared\n'
      visitors.forEach(v => {
        csv += `"${v.student_id}","${(v.student_name||'').replace(/"/g,'""')}","${v.student_email||''}","${v.student_mobile||''}","${v.student_district||''}","${v.student_city||''}","${(v.student_address||'').replace(/"/g,'""')}","${v.student_educationLevel||''}","${v.student_interestedCourse||''}","${v.college_id}","${(v.college_name||'').replace(/"/g,'""')}","${v.course_name||''}","${v.activity_type}","${v.date}","${v.time}","${v.personalInfoShared}"\n`
      })
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', collegeId ? `visitors_${collegeName || collegeId}_${new Date().toISOString().split('T')[0]}.csv` : `all_visitors_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  addToRecentlyViewed(collegeId) {
    const recent = this.getRecentlyViewed()
    const filtered = recent.filter(id => String(id) !== String(collegeId))
    filtered.unshift(collegeId)
    const trimmed = filtered.slice(0, 20)
    localStorage.setItem(this.recentlyViewedKey, JSON.stringify(trimmed))
  }

  getRecentlyViewed() {
    try {
      return JSON.parse(localStorage.getItem(this.recentlyViewedKey) || '[]')
    } catch {
      return []
    }
  }

  clearRecentlyViewed() {
    localStorage.removeItem(this.recentlyViewedKey)
  }

  removeFromRecentlyViewed(collegeId) {
    const recent = this.getRecentlyViewed().filter(id => String(id) !== String(collegeId))
    localStorage.setItem(this.recentlyViewedKey, JSON.stringify(recent))
  }

  // Seed demo data for admin to see visitors - for testing
  seedDemoVisitors() {
    const existing = this.getAllActivities()
    if (existing.length > 5) return // Already has data

    const demoStudents = [
      { id: 1, fullName: 'Arjun Kumar', email: 'arjun.kumar@gmail.com', mobile: '9876543210', district: 'Coimbatore', city: 'Coimbatore', address: 'Gandhipuram, Coimbatore', educationLevel: '12th', schoolCollege: 'PSG Higher Secondary School', percentage: '92%', groupStream: 'Computer Science', interestedCourse: 'B.E Computer Science' },
      { id: 2, fullName: 'Priya Sharma', email: 'priya.sharma@gmail.com', mobile: '9876543211', district: 'Chennai', city: 'Chennai', address: 'T Nagar, Chennai', educationLevel: '12th', schoolCollege: 'DAV School Chennai', percentage: '88%', groupStream: 'Biology', interestedCourse: 'MBBS' },
      { id: 3, fullName: 'Karthik Raj', email: 'karthik.raj@gmail.com', mobile: '9876543212', district: 'Madurai', city: 'Madurai', address: 'Anna Nagar, Madurai', educationLevel: 'Diploma', schoolCollege: 'Government Polytechnic Madurai', percentage: '85%', groupStream: 'Mechanical', interestedCourse: 'B.E Mechanical' },
      { id: 4, fullName: 'Divya Lakshmi', email: 'divya.lakshmi@gmail.com', mobile: '9876543213', district: 'Tiruppur', city: 'Tiruppur', address: 'Kangeyam Road, Tiruppur', educationLevel: '12th', schoolCollege: 'Avila School Tiruppur', percentage: '90%', groupStream: 'Commerce', interestedCourse: 'B.Com' },
      { id: 5, fullName: 'Suresh Babu', email: 'suresh.babu@gmail.com', mobile: '9876543214', district: 'Salem', city: 'Salem', address: 'Fairlands, Salem', educationLevel: 'UG', schoolCollege: 'Salem Arts College', percentage: '78%', groupStream: 'Computer Science', interestedCourse: 'MBA' },
    ]

    const demoActivities = []
    const colleges = [101, 102, 103]
    const activityTypes = ['COLLEGE_VIEW', 'COURSE_VIEW', 'SAVE', 'COMPARE', 'ENQUIRY']
    
    demoStudents.forEach((student, idx) => {
      const numActivities = 2 + Math.floor(Math.random() * 3)
      for (let i = 0; i < numActivities; i++) {
        const collegeId = colleges[Math.floor(Math.random() * colleges.length)]
        const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)]
        const date = new Date()
        date.setDate(date.getDate() - Math.floor(Math.random() * 7))
        demoActivities.push({
          id: Date.now() + Math.random() + idx * 100 + i,
          student_id: student.id,
          student_name: student.fullName,
          student_email: student.email,
          student_mobile: student.mobile,
          student_district: student.district,
          student_city: student.city,
          student_address: student.address,
          student_educationLevel: student.educationLevel,
          student_schoolCollege: student.schoolCollege,
          student_percentage: student.percentage,
          student_groupStream: student.groupStream,
          student_interestedCourse: student.interestedCourse,
          college_id: collegeId,
          course_id: null,
          activity_type: activityType,
          date: date.toISOString().split('T')[0],
          time: `${String(9 + Math.floor(Math.random()*10)).padStart(2,'0')}:${String(Math.floor(Math.random()*60)).padStart(2,'0')}:00`,
          timestamp: date.toISOString(),
          district: student.district,
          educationLevel: student.educationLevel,
          interestedCourse: student.interestedCourse,
          metadata: { collegeName: `College ID ${collegeId}`, courseName: student.interestedCourse },
          personalInfoShared: activityType === 'ENQUIRY',
          visibleToPlatformAdmin: true,
          visibleToCollegeAdmin: true
        })
      }
    })

    localStorage.setItem(this.storageKey, JSON.stringify(demoActivities))
    console.log(`[ActivityTracker] Seeded ${demoActivities.length} demo visitor activities for admin view`)
  }
}

export const activityTracker = new ActivityTracker()
export { ACTIVITY_TYPES }

// Auto seed demo data on load for admin to see
if (typeof window !== 'undefined') {
  setTimeout(() => {
    activityTracker.seedDemoVisitors()
  }, 1000)
}
