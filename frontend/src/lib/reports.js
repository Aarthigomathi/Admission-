/**
 * PDF Report Generation for Platform Admin
 * Generates College-wise Student Interest Reports
 */

export function generateCollegeInterestReport(college, activityData, period = "September 2026") {
  const report = {
    college: {
      name: college.name,
      logo: college.branding.logo,
      shortName: college.shortName,
      district: college.district,
      type: college.type
    },
    period,
    generatedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
    generatedTime: new Date().toLocaleTimeString('en-IN'),
    summary: {
      totalStudentsViewed: activityData.totalStudentsViewed,
      totalViews: activityData.totalViews,
      totalCourseViews: activityData.totalCourseViews,
      saved: activityData.saved,
      compared: activityData.compared,
      enquiries: activityData.enquiries
    },
    breakdown: {
      byEducation: activityData.byEducation,
      byDistrict: activityData.byDistrict,
      byCourse: activityData.byCourse,
      byActivityType: activityData.byActivityType,
      byDate: activityData.byDate
    },
    platform: {
      name: "Tamil Nadu College Discovery Platform",
      logo: "T",
      colors: {
        bg: "#E8E2DB",
        primary: "#1A3263",
        secondary: "#547792",
        accent: "#FAB95B"
      }
    },
    privacyNote: "Student personal information protected. Individual browsing behavior NOT shared to college unless enquiry with consent. Aggregated data only.",
    pageNumber: 1
  }

  return report
}

export function downloadReportAsPDF(report) {
  // In real app, use jsPDF or call backend /api/reports/{collegeId}/pdf
  // For demo, create a printable HTML and use window.print
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>College Interest Report - ${report.college.name}</title>
      <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #E8E2DB; color: #1A3263; padding: 40px; }
        .header { background: #1A3263; color: white; padding: 24px; border-radius: 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 4px solid #FAB95B; }
        .logo { width: 60px; height: 60px; background: #FAB95B; color: #1A3263; border-radius: 12px; display: grid; place-items: center; font-weight: bold; font-size: 24px; }
        .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 24px 0; }
        .summary-card { background: white; border: 2px solid #E8E2DB; border-radius: 16px; padding: 20px; border-left: 4px solid #FAB95B; }
        .summary-card h3 { margin: 0; font-size: 12px; text-transform: uppercase; color: #547792; }
        .summary-card .value { font-size: 28px; font-weight: bold; color: #1A3263; margin-top: 8px; }
        .section { background: white; border-radius: 16px; padding: 24px; margin: 16px 0; border: 2px solid #E8E2DB; }
        .chart-bar { display: flex; align-items: center; gap: 12px; margin: 8px 0; }
        .bar { height: 24px; background: linear-gradient(90deg, #1A3263, #547792); border-radius: 12px; display: flex; align-items: center; justify-content: flex-end; padding-right: 12px; color: white; font-size: 11px; font-weight: bold; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #E8E2DB; color: #547792; font-size: 11px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div style="display: flex; gap: 16px; align-items: center;">
          <div class="logo">T</div>
          <div>
            <div style="font-size: 18px; font-weight: bold;">${report.platform.name}</div>
            <div style="font-size: 11px; opacity: 0.8; letter-spacing: 0.1em; text-transform: uppercase;">College Student Interest Report</div>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 12px; opacity: 0.8;">Report Period</div>
          <div style="font-weight: bold;">${report.period}</div>
          <div style="font-size: 11px; margin-top: 8px; opacity: 0.7;">Generated: ${report.generatedDate}</div>
        </div>
      </div>

      <div style="background: white; border-radius: 16px; padding: 24px; margin: 24px 0; border: 2px solid #E8E2DB; display: flex; gap: 20px; align-items: center;">
        <img src="${report.college.logo}" style="width: 80px; height: 80px; border-radius: 16px; object-fit: cover; border: 2px solid #FAB95B;" />
        <div>
          <div style="font-size: 24px; font-weight: bold; color: #1A3263;">${report.college.name}</div>
          <div style="color: #547792; margin-top: 4px;">${report.college.district} • ${report.college.type} • ${report.college.shortName}</div>
          <div style="margin-top: 8px; display: flex; gap: 8px;">
            <span style="background: #E8E2DB; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; color: #1A3263;">Verified College</span>
            <span style="background: #FAB95B; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; color: #1A3263;">Report ID: ${report.college.shortName}-${Date.now()}</span>
          </div>
        </div>
      </div>

      <div class="summary-grid">
        <div class="summary-card"><h3>Total Students Viewed</h3><div class="value">${report.summary.totalStudentsViewed}</div><div style="font-size: 11px; color: #547792; margin-top: 4px;">Unique students</div></div>
        <div class="summary-card"><h3>Total Profile Views</h3><div class="value">${report.summary.totalViews}</div><div style="font-size: 11px; color: #547792; margin-top: 4px;">College views</div></div>
        <div class="summary-card"><h3>Course Views</h3><div class="value">${report.summary.totalCourseViews}</div><div style="font-size: 11px; color: #547792; margin-top: 4px;">Course interest</div></div>
        <div class="summary-card"><h3>Saved</h3><div class="value">${report.summary.saved}</div><div style="font-size: 11px; color: #547792; margin-top: 4px;">Students saved</div></div>
        <div class="summary-card"><h3>Compared</h3><div class="value">${report.summary.compared}</div><div style="font-size: 11px; color: #547792; margin-top: 4px;">In comparisons</div></div>
        <div class="summary-card" style="background: #1A3263; color: white; border-color: #1A3263;"><h3 style="color: #FAB95B;">Enquiries</h3><div class="value" style="color: #FAB95B;">${report.summary.enquiries}</div><div style="font-size: 11px; color: #E8E2DB; margin-top: 4px;">With consent</div></div>
      </div>

      <div class="section">
        <h3 style="color: #1A3263; margin: 0 0 16px 0;">Student Interest by Education Level</h3>
        ${Object.entries(report.breakdown.byEducation).map(([level, count]) => `
          <div class="chart-bar">
            <div style="width: 120px; font-size: 12px; font-weight: 600;">${level}</div>
            <div class="bar" style="width: ${Math.min(count * 20, 300)}px;">${count}</div>
          </div>
        `).join('') || '<div style="color: #547792; font-size: 12px;">No data yet - students will appear as they view</div>'}
      </div>

      <div class="section">
        <h3 style="color: #1A3263; margin: 0 0 16px 0;">Student Interest by District</h3>
        ${Object.entries(report.breakdown.byDistrict).map(([district, count]) => `
          <div class="chart-bar">
            <div style="width: 120px; font-size: 12px; font-weight: 600;">${district}</div>
            <div class="bar" style="width: ${Math.min(count * 20, 300)}px; background: linear-gradient(90deg, #547792, #1A3263);">${count}</div>
          </div>
        `).join('') || '<div style="color: #547792; font-size: 12px;">No district data yet</div>'}
      </div>

      <div class="section">
        <h3 style="color: #1A3263; margin: 0 0 16px 0;">Course Interest</h3>
        ${Object.entries(report.breakdown.byCourse).map(([course, count]) => `
          <div class="chart-bar">
            <div style="width: 200px; font-size: 12px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${course}</div>
            <div class="bar" style="width: ${Math.min(count * 30, 300)}px; background: #FAB95B; color: #1A3263;">${count}</div>
          </div>
        `).join('') || '<div style="color: #547792; font-size: 12px;">No course interest yet - will appear as students view courses</div>'}
      </div>

      <div class="section" style="background: #1A3263; color: white;">
        <h3 style="color: #FAB95B; margin: 0 0 12px 0;"> Privacy Note - Important</h3>
        <p style="font-size: 12px; line-height: 1.6; color: #E8E2DB; margin: 0;">${report.privacyNote} This report shows ONLY aggregated data. Individual student browsing history is NOT shared with colleges. Personal information (name, phone, email) is shared ONLY when student explicitly clicks ENQUIRE NOW and gives consent. Student data belongs to platform and is protected.</p>
      </div>

      <div class="footer">
        <div>Generated by Tamil Nadu College Discovery Platform • ${report.generatedDate} ${report.generatedTime} • Page ${report.pageNumber}</div>
        <div style="margin-top: 8px;">Platform Colors: #E8E2DB Background, #1A3263 Primary, #547792 Secondary, #FAB95B Accent • Secure • Premium • Production Ready</div>
        <div style="margin-top: 8px; display: flex; justify-content: center; gap: 8px;">
          <span style="width: 16px; height: 16px; background: #E8E2DB; border-radius: 50%; display: inline-block; border: 1px solid #1A3263;"></span>
          <span style="width: 16px; height: 16px; background: #FAB95B; border-radius: 50%; display: inline-block;"></span>
          <span style="width: 16px; height: 16px; background: #547792; border-radius: 50%; display: inline-block;"></span>
          <span style="width: 16px; height: 16px; background: #1A3263; border-radius: 50%; display: inline-block;"></span>
        </div>
      </div>
    </body>
    </html>
  `

  const blob = new Blob([htmlContent], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `College-Interest-Report-${report.college.shortName}-${report.period.replace(/\s+/g, '-')}.html`
  a.click()
  URL.revokeObjectURL(url)

  // Also open printable version
  const win = window.open('', '_blank')
  if (win) {
    win.document.write(htmlContent)
    win.document.close()
  }

  return report
}
