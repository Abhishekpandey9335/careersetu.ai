export const govtExams = [
  { id: 1, name: 'SSC CGL 2024', slug: 'ssc-cgl-2024', category: 'SSC', conductingBody: 'Staff Selection Commission', vacancy: 17727, formEnd: '2024-05-24', examDate: '2024-09-15', status: 'ACTIVE', salaryMin: 44900, salaryMax: 142400, minQualification: 'GRADUATION', logoUrl: null, applicationFeeGeneral: '100' },
  { id: 2, name: 'Railway NTPC 2024', slug: 'railway-ntpc-2024', category: 'RAILWAY', conductingBody: 'Railway Recruitment Board', vacancy: 11558, formEnd: '2024-05-31', examDate: '2024-10-20', status: 'ACTIVE', salaryMin: 19900, salaryMax: 63200, minQualification: 'GRADUATION', logoUrl: null, applicationFeeGeneral: '500' },
  { id: 3, name: 'IBPS PO 2024', slug: 'ibps-po-2024', category: 'BANKING', conductingBody: 'IBPS', vacancy: 4455, formEnd: '2024-05-21', examDate: '2024-10-19', status: 'ACTIVE', salaryMin: 48480, salaryMax: 85920, minQualification: 'GRADUATION', logoUrl: null, applicationFeeGeneral: '175' },
  { id: 4, name: 'UPSC CSE 2024', slug: 'upsc-cse-2024', category: 'UPSC', conductingBody: 'UPSC', vacancy: 1056, formEnd: '2024-06-04', examDate: '2024-11-17', status: 'ACTIVE', salaryMin: 56100, salaryMax: 250000, minQualification: 'GRADUATION', logoUrl: null, applicationFeeGeneral: '100' },
  { id: 5, name: 'UPPSC RO/ARO', slug: 'uppsc-ro-aro', category: 'STATE_PSC', conductingBody: 'UPPSC', vacancy: 411, formEnd: '2024-06-20', examDate: '2024-12-08', status: 'ACTIVE', salaryMin: 44900, salaryMax: 142000, minQualification: 'GRADUATION', logoUrl: null, applicationFeeGeneral: '80' },
  { id: 6, name: 'SSC CHSL 2024', slug: 'ssc-chsl-2024', category: 'SSC', conductingBody: 'Staff Selection Commission', vacancy: 3712, formEnd: '2024-06-10', examDate: '2024-11-01', status: 'ACTIVE', salaryMin: 25500, salaryMax: 81100, minQualification: 'CLASS_12', logoUrl: null, applicationFeeGeneral: '100' },
  { id: 7, name: 'NDA 2024', slug: 'nda-2024', category: 'DEFENCE', conductingBody: 'UPSC', vacancy: 395, formEnd: '2024-06-25', examDate: '2024-09-01', status: 'UPCOMING', salaryMin: 56100, salaryMax: 177500, minQualification: 'CLASS_12', logoUrl: null, applicationFeeGeneral: '100' },
  { id: 8, name: 'CTET 2024', slug: 'ctet-2024', category: 'TEACHING', conductingBody: 'CBSE', vacancy: 5000, formEnd: '2024-07-05', examDate: '2024-12-15', status: 'UPCOMING', salaryMin: 35000, salaryMax: 85000, minQualification: 'GRADUATION', logoUrl: null, applicationFeeGeneral: '1000' },
  { id: 9, name: 'SBI PO 2024', slug: 'sbi-po-2024', category: 'BANKING', conductingBody: 'SBI', vacancy: 2000, formEnd: '2024-07-15', examDate: '2024-11-30', status: 'UPCOMING', salaryMin: 52000, salaryMax: 90000, minQualification: 'GRADUATION', logoUrl: null, applicationFeeGeneral: '750' },
  { id: 10, name: 'UP Police Constable', slug: 'up-police-constable', category: 'POLICE', conductingBody: 'UPPRPB', vacancy: 60244, formEnd: '2024-06-30', examDate: '2024-12-20', status: 'ACTIVE', salaryMin: 21700, salaryMax: 69100, minQualification: 'CLASS_12', logoUrl: null, applicationFeeGeneral: '400' },
];

export const privateJobs = [
  { id: 1, companyName: 'TCS', title: 'System Engineer', type: 'FULL_TIME', location: 'Pan India', salaryMin: 350000, salaryMax: 700000, skillsRequired: ['Java', 'Python', 'SQL'], qualification: 'B.Tech/MCA', experienceMin: 0, experienceMax: 2 },
  { id: 2, companyName: 'Infosys', title: 'Associate Consultant', type: 'FULL_TIME', location: 'Bangalore', salaryMin: 400000, salaryMax: 800000, skillsRequired: ['Java', 'Spring Boot'], qualification: 'B.Tech/MBA', experienceMin: 0, experienceMax: 2 },
  { id: 3, companyName: 'Wipro', title: 'Project Engineer', type: 'FULL_TIME', location: 'Hyderabad', salaryMin: 350000, salaryMax: 600000, skillsRequired: ['React', 'Node.js'], qualification: 'B.Tech', experienceMin: 0, experienceMax: 1 },
  { id: 4, companyName: 'Accenture', title: 'Associate Software Eng.', type: 'FULL_TIME', location: 'Mumbai', salaryMin: 650000, salaryMax: 700000, skillsRequired: ['Python', 'AI/ML'], qualification: 'B.Tech', experienceMin: 0, experienceMax: 2 },
  { id: 5, companyName: 'Capgemini', title: 'Analyst', type: 'FULL_TIME', location: 'Pune', salaryMin: 300000, salaryMax: 600000, skillsRequired: ['Java', 'Testing'], qualification: 'B.Tech', experienceMin: 0, experienceMax: 2 },
];

export const internships = [
  { id: 1, companyName: 'Google', title: 'SWE Intern', type: 'INTERNSHIP', location: 'Bangalore', salaryMin: 80000, salaryMax: 100000, skillsRequired: ['Python', 'Algorithms'], experienceMin: 0 },
  { id: 2, companyName: 'Microsoft', title: 'Product Management Intern', type: 'INTERNSHIP', location: 'Hyderabad', salaryMin: 70000, salaryMax: 90000, skillsRequired: ['Analytics', 'Product'], experienceMin: 0 },
  { id: 3, companyName: 'Flipkart', title: 'Data Science Intern', type: 'INTERNSHIP', location: 'Bangalore', salaryMin: 50000, salaryMax: 70000, skillsRequired: ['Python', 'ML'], experienceMin: 0 },
];

export const roadmaps = [
  { id: 1, title: 'SSC CGL Roadmap', slug: 'ssc-cgl', examName: 'SSC CGL', durationWeeks: 12, difficulty: 'MEDIUM', successRate: 78 },
  { id: 2, title: 'Bank PO Roadmap', slug: 'bank-po', examName: 'IBPS PO', durationWeeks: 9, difficulty: 'MEDIUM', successRate: 72 },
  { id: 3, title: 'Data Analyst Roadmap', slug: 'data-analyst', examName: null, durationWeeks: 6, difficulty: 'MEDIUM', successRate: 85 },
  { id: 4, title: 'Full Stack Dev Roadmap', slug: 'full-stack', examName: null, durationWeeks: 8, difficulty: 'HARD', successRate: 80 },
  { id: 5, title: 'UPSC CSE Roadmap', slug: 'upsc-cse', examName: 'UPSC CSE', durationWeeks: 52, difficulty: 'HARD', successRate: 65 },
  { id: 6, title: 'Railway NTPC Roadmap', slug: 'railway-ntpc', examName: 'Railway NTPC', durationWeeks: 8, difficulty: 'EASY', successRate: 82 },
];

export const companies = [
  { id: 1, name: 'TCS', slug: 'tcs', industry: 'IT Services', avgPackageFresher: 350000, readinessScore: 90, label: 'Excellent', color: '#059669', about: 'Tata Consultancy Services is an IT services, consulting and business solutions company.' },
  { id: 2, name: 'Infosys', slug: 'infosys', industry: 'IT Services', avgPackageFresher: 400000, readinessScore: 85, label: 'Very Good', color: '#059669' },
  { id: 3, name: 'Wipro', slug: 'wipro', industry: 'IT Services', avgPackageFresher: 350000, readinessScore: 78, label: 'Good', color: '#0ea5e9' },
  { id: 4, name: 'Accenture', slug: 'accenture', industry: 'Consulting', avgPackageFresher: 450000, readinessScore: 65, label: 'Average', color: '#f59e0b' },
  { id: 5, name: 'Amazon', slug: 'amazon', industry: 'E-commerce', avgPackageFresher: 2000000, readinessScore: 45, label: 'Needs Work', color: '#ef4444' },
];

export const studyMaterials = [
  { id: 1, title: 'SSC CGL Complete Syllabus 2024', type: 'SYLLABUS', exam: 'SSC CGL', subject: 'All Subjects', downloads: 45230, isPremium: false },
  { id: 2, title: 'IBPS PO Previous Year Papers (2018-2023)', type: 'PYQS', exam: 'IBPS PO', subject: 'All', downloads: 32100, isPremium: false },
  { id: 3, title: 'Quant Shortcut Tricks - Handwritten Notes', type: 'NOTES', exam: 'SSC/Banking', subject: 'Quantitative Aptitude', downloads: 28500, isPremium: false },
  { id: 4, title: 'UPSC Current Affairs Monthly Compilation', type: 'CURRENT_AFFAIRS', exam: 'UPSC CSE', subject: 'GS', downloads: 19800, isPremium: false },
  { id: 5, title: 'Full Stack Development Video Course', type: 'VIDEO', exam: null, subject: 'Web Development', downloads: 15600, isPremium: true },
  { id: 6, title: 'Reasoning Bible - Premium Notes', type: 'NOTES', exam: 'All Exams', subject: 'Logical Reasoning', downloads: 42000, isPremium: true },
];

export const successStories = [
  { id: 1, name: 'Ankit Kumar', exam: 'SSC CGL 2023', rank: 'AIR 245', initials: 'AK', color: '#1a56db', quote: 'CareerSetu ne mera roadmap aur mock tests ne mujhe bahut help kiya. Thank you!' },
  { id: 2, name: 'Priya Singh', exam: 'IBPS PO 2023', rank: 'AIR 98', initials: 'PS', color: '#7e3af2', quote: 'Study material daily targets ne meri preparation ko easy bana diya.' },
  { id: 3, name: 'Rahul Verma', exam: 'TCS Digital 2023', rank: 'Package 7 LPA', initials: 'RV', color: '#0e9f6e', quote: 'Company readiness score aur interview prep ne meri confidence badhi.' },
  { id: 4, name: 'Neha Sharma', exam: 'UPSC 2022', rank: 'AIR 156', initials: 'NS', color: '#ff6b35', quote: 'AI advisor ne sahi direction di aur main apna goal achieve kar payi.' },
];

export const upcomingDates = [
  { exam: 'SSC CGL 2024 Notification', date: '24 May 2024', type: 'notification' },
  { exam: 'IBPS PO 2024 Notification', date: '21 May 2024', type: 'notification' },
  { exam: 'Railway NTPC Exam Date', date: '15 June 2024', type: 'exam' },
  { exam: 'UPSC CSE Prelims', date: '16 June 2024', type: 'exam' },
  { exam: 'UP Police Constable', date: '20 June 2024', type: 'exam' },
];

export const quickLinksData = [
  { label: 'Eligibility Checker', icon: '✅', path: '/eligibility-checker', color: '#1a56db' },
  { label: 'Exam Calendar', icon: '📅', path: '/exam-calendar', color: '#0e9f6e' },
  { label: 'Admit Cards', icon: '🪪', path: '/admit-cards', color: '#ff6b35' },
  { label: 'Results', icon: '📊', path: '/results', color: '#7e3af2' },
  { label: 'Syllabus', icon: '📖', path: '/study-material', color: '#0ea5e9' },
  { label: 'Previous Papers', icon: '📝', path: '/study-material', color: '#f59e0b' },
  { label: 'Salary Explorer', icon: '💰', path: '/salary-explorer', color: '#10b981' },
  { label: 'Career Roadmaps', icon: '🗺️', path: '/roadmaps', color: '#7e3af2' },
];

export const examCategories = ['All', 'SSC', 'UPSC', 'BANKING', 'RAILWAY', 'STATE_PSC', 'DEFENCE', 'TEACHING', 'POLICE', 'INSURANCE'];
