export const privateJobs = [
  { id: 1, companyName: 'TCS', title: 'System Engineer', type: 'FULL_TIME', location: 'Pan India', salaryMin: 350000, salaryMax: 700000, skillsRequired: ['Java', 'Python', 'SQL'], qualification: 'B.Tech/MCA', experienceMin: 0, experienceMax: 2, applyLink: 'https://www.tcs.com/careers' },
  { id: 2, companyName: 'Infosys', title: 'Associate Consultant', type: 'FULL_TIME', location: 'Bangalore', salaryMin: 400000, salaryMax: 800000, skillsRequired: ['Java', 'Spring Boot'], qualification: 'B.Tech/MBA', experienceMin: 0, experienceMax: 2, applyLink: 'https://career.infosys.com' },
  { id: 3, companyName: 'Wipro', title: 'Project Engineer', type: 'FULL_TIME', location: 'Hyderabad', salaryMin: 350000, salaryMax: 600000, skillsRequired: ['React', 'Node.js'], qualification: 'B.Tech', experienceMin: 0, experienceMax: 1, applyLink: 'https://careers.wipro.com' },
  { id: 4, companyName: 'Accenture', title: 'Associate Software Eng.', type: 'FULL_TIME', location: 'Mumbai', salaryMin: 650000, salaryMax: 700000, skillsRequired: ['Python', 'AI/ML'], qualification: 'B.Tech', experienceMin: 0, experienceMax: 2, applyLink: 'https://www.accenture.com/in-en/careers' },
  { id: 5, companyName: 'Capgemini', title: 'Analyst', type: 'FULL_TIME', location: 'Pune', salaryMin: 300000, salaryMax: 600000, skillsRequired: ['Java', 'Testing'], qualification: 'B.Tech', experienceMin: 0, experienceMax: 2, applyLink: 'https://www.capgemini.com/in-en/careers' },
];

export const internships = [
  { id: 1, companyName: 'Google', title: 'SWE Intern', type: 'INTERNSHIP', location: 'Bangalore', salaryMin: 80000, salaryMax: 100000, skillsRequired: ['Python', 'Algorithms'], experienceMin: 0 },
  { id: 2, companyName: 'Microsoft', title: 'Product Management Intern', type: 'INTERNSHIP', location: 'Hyderabad', salaryMin: 70000, salaryMax: 90000, skillsRequired: ['Analytics', 'Product'], experienceMin: 0 },
  { id: 3, companyName: 'Flipkart', title: 'Data Science Intern', type: 'INTERNSHIP', location: 'Bangalore', salaryMin: 50000, salaryMax: 70000, skillsRequired: ['Python', 'ML'], experienceMin: 0 },
];

export const roadmaps = [
  { id: 1, title: 'Data Analyst Roadmap', slug: 'data-analyst', examName: null, durationWeeks: 6, difficulty: 'MEDIUM', successRate: 85 },
  { id: 2, title: 'Full Stack Dev Roadmap', slug: 'full-stack', examName: null, durationWeeks: 8, difficulty: 'HARD', successRate: 80 },
  { id: 3, title: 'Java Backend Roadmap', slug: 'java-backend', examName: null, durationWeeks: 10, difficulty: 'MEDIUM', successRate: 82 },
  { id: 4, title: 'AI/ML Engineer Roadmap', slug: 'ai-ml-engineer', examName: null, durationWeeks: 14, difficulty: 'HARD', successRate: 75 },
];

export const companies = [
  { id: 1, name: 'TCS', slug: 'tcs', industry: 'IT Services', avgPackageFresher: 350000, readinessScore: 90, label: 'Excellent', color: '#059669', about: 'Tata Consultancy Services is an IT services, consulting and business solutions company.' },
  { id: 2, name: 'Infosys', slug: 'infosys', industry: 'IT Services', avgPackageFresher: 400000, readinessScore: 85, label: 'Very Good', color: '#059669' },
  { id: 3, name: 'Wipro', slug: 'wipro', industry: 'IT Services', avgPackageFresher: 350000, readinessScore: 78, label: 'Good', color: '#0ea5e9' },
  { id: 4, name: 'Accenture', slug: 'accenture', industry: 'Consulting', avgPackageFresher: 450000, readinessScore: 65, label: 'Average', color: '#f59e0b' },
  { id: 5, name: 'Amazon', slug: 'amazon', industry: 'E-commerce', avgPackageFresher: 2000000, readinessScore: 45, label: 'Needs Work', color: '#ef4444' },
];

export const studyMaterials = [
  { id: 1, title: 'Full Stack Development Video Course', type: 'VIDEO', exam: null, subject: 'Web Development', downloads: 15600, isPremium: true },
  { id: 2, title: 'Data Structures & Algorithms Notes', type: 'NOTES', exam: null, subject: 'DSA', downloads: 32100, isPremium: false },
  { id: 3, title: 'System Design Interview Guide', type: 'NOTES', exam: null, subject: 'System Design', downloads: 19800, isPremium: true },
  { id: 4, title: 'SQL Interview Questions', type: 'NOTES', exam: null, subject: 'Database', downloads: 28500, isPremium: false },
];

export const successStories = [
  { id: 1, name: 'Rahul Verma', exam: 'TCS Digital 2023', rank: 'Package 7 LPA', initials: 'RV', color: '#0e9f6e', quote: 'Company readiness score aur interview prep ne meri confidence badhi.' },
  { id: 2, name: 'Ankit Kumar', exam: 'Infosys 2023', rank: 'Package 9.5 LPA', initials: 'AK', color: '#1a56db', quote: 'CareerSetu ke roadmap aur mock tests ne bahut help kiya. Thank you!' },
  { id: 3, name: 'Priya Singh', exam: 'Wipro 2023', rank: 'Package 6.5 LPA', initials: 'PS', color: '#7e3af2', quote: 'Study material aur daily targets ne meri preparation ko easy bana diya.' },
  { id: 4, name: 'Neha Sharma', exam: 'Amazon SDE 2023', rank: 'Package 28 LPA', initials: 'NS', color: '#ff6b35', quote: 'AI advisor ne sahi direction di aur main apna goal achieve kar payi.' },
];

export const quickLinksData = [
  { label: 'Salary Explorer', icon: '💰', path: '/salary-explorer', color: '#10b981' },
  { label: 'Career Roadmaps', icon: '🗺️', path: '/roadmaps', color: '#7e3af2' },
  { label: 'Company Explorer', icon: '🏢', path: '/companies', color: '#1a56db' },
  { label: 'AI Advisor', icon: '🤖', path: '/ai-advisor', color: '#f59e0b' },
  { label: 'Study Material', icon: '📖', path: '/study-material', color: '#0ea5e9' },
  { label: 'Lectures', icon: '▶️', path: '/lectures', color: '#ef4444' },
];
