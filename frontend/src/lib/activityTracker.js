/**
 * Student Activity Tracking - Core Feature
 * Records: student_id, college_id, course_id, date, time, activity_type
 * Privacy: Does NOT automatically share personal info to college
 * Only when ENQUIRE NOW with consent, info shared
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

  // Get current student from localStorage (simulated auth)
  getCurrentStudent() {
    try {
      const student = JSON.parse(localStorage.getItem('tn_current_student') || 'null')
      return student
    } catch {
      return null
    }
  }

  // Record activity securely - platform stores, college does NOT automatically get personal info
  recordActivity({ collegeId, courseId, activityType, metadata = {} }) {
    const student = this.getCurrentStudent()
    if (!student) return // Only track logged in students

    const activity = {
      id: Date.now() + Math.random(),
      student_id: student.id,
      student_email: student.email, // For platform admin only, NOT shared to college automatically
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
      // Privacy flag: personal info NOT shared to college unless enquiry with consent
      personalInfoShared: activityType === ACTIVITY_TYPES.ENQUIRY && metadata.consentGiven
    }

    // Store in localStorage (in real app, POST to /api/activities)
    const activities = this.getAllActivities()
    activities.unshift(activity)
    // Keep only last 1000 activities per student locally
    const trimmed = activities.slice(0, 1000)
    localStorage.setItem(this.storageKey, JSON.stringify(trimmed))

    // Update recently viewed for COLLEGE_VIEW
    if (activityType === ACTIVITY_TYPES.COLLEGE_VIEW && collegeId) {
      this.addToRecentlyViewed(collegeId)
    }

    console.log(`[ActivityTracker] Recorded ${activityType} for student ${student.id} college ${collegeId} - Personal info shared to college: ${activity.personalInfoShared}`)
    
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
    return this.getAllActivities().filter(a => a.college_id === collegeId)
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
      byEducation[a.educationLevel] = (byEducation[a.educationLevel] || 0) + 1
      byDistrict[a.district] = (byDistrict[a.district] || 0) + 1
      if (a.metadata.courseName) {
        byCourse[a.metadata.courseName] = (byCourse[a.metadata.courseName] || 0) + 1
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
      // Do NOT expose individual browsing behavior to colleges - only aggregated
      privacyNote: "Aggregated data only - individual student browsing NOT shared to college unless enquiry with consent"
    }
  }

  addToRecentlyViewed(collegeId) {
    const recent = this.getRecentlyViewed()
    const filtered = recent.filter(id => id !== collegeId)
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
    const recent = this.getRecentlyViewed().filter(id => id !== collegeId)
    localStorage.setItem(this.recentlyViewedKey, JSON.stringify(recent))
  }
}

export const activityTracker = new ActivityTracker()
export { ACTIVITY_TYPES }
