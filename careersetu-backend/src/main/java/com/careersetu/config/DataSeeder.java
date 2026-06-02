package com.careersetu.config;

import com.careersetu.entity.*;
import com.careersetu.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final ExamRepository examRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final PasswordEncoder passwordEncoder;

    private static final ObjectMapper mapper = new ObjectMapper();

    private static String toJson(Object obj) {
        try { return mapper.writeValueAsString(obj); }
        catch (Exception e) { throw new RuntimeException(e); }
    }

    private static List<String> asList(String... items) {
        return new ArrayList<>(Arrays.asList(items));
    }

    private static Map<String, Object> asMap(Object... kv) {
        Map<String, Object> map = new LinkedHashMap<>();
        for (int i = 0; i < kv.length; i += 2) map.put((String) kv[i], kv[i + 1]);
        return map;
    }

    @Override
    public void run(String... args) {
        seedAdminUser();
        seedExams();
        seedCompanies();
        log.info("✅ CareerSetu data seeder completed.");
    }

    private void seedAdminUser() {
        if (userRepository.existsByEmail("admin@careersetu.in")) return;
        User admin = User.builder()
                .name("CareerSetu Admin").email("admin@careersetu.in")
                .passwordHash(passwordEncoder.encode("Admin@123"))
                .role(User.Role.ADMIN).isEmailVerified(true).build();
        admin = userRepository.save(admin);
        userProfileRepository.save(UserProfile.builder().user(admin).build());
        log.info("Admin user created — admin@careersetu.in / Admin@123");
    }

    private void seedExams() {
        if (examRepository.count() > 0) return;

        List<Exam> exams = List.of(
                Exam.builder()
                        .name("SSC CGL 2024").slug("ssc-cgl-2024")
                        .category(Exam.ExamCategory.SSC).conductingBody("Staff Selection Commission")
                        .minAge(18).maxAge(32).minQualification(UserProfile.Qualification.GRADUATE)
                        .vacancy(17727).formStart(LocalDate.of(2024, 6, 24)).formEnd(LocalDate.of(2024, 7, 24))
                        .examDate(LocalDate.of(2024, 9, 9)).status(Exam.ExamStatus.RESULT_OUT)
                        .officialApplyUrl("https://ssc.nic.in").logoUrl("/logos/ssc.png")
                        .salaryMin(25).salaryMax(142).applicationFeeGeneral("100").applicationFeeReserved("0")
                        .detail(ExamDetail.builder()
                                .syllabusJson(toJson(asMap(
                                        "Tier1", asList("General Intelligence", "General Awareness", "Quantitative Aptitude", "English"),
                                        "Tier2", asList("Paper-I: Maths & Reasoning", "Paper-II: English", "Paper-III: Stats/Finance"))))
                                .selectionProcessJson(toJson(asList("Tier I (CBT)", "Tier II (CBT)", "Document Verification")))
                                .preparationTips("Focus on Tier I first. Practice 50 quant questions daily.")
                                .build())
                        .build(),

                Exam.builder()
                        .name("IBPS PO 2024").slug("ibps-po-2024")
                        .category(Exam.ExamCategory.BANKING).conductingBody("Institute of Banking Personnel Selection")
                        .minAge(20).maxAge(30).minQualification(UserProfile.Qualification.GRADUATE)
                        .vacancy(4455).formStart(LocalDate.of(2024, 8, 1)).formEnd(LocalDate.of(2024, 8, 21))
                        .examDate(LocalDate.of(2024, 10, 19)).status(Exam.ExamStatus.FORM_CLOSED)
                        .officialApplyUrl("https://ibps.in").logoUrl("/logos/ibps.png")
                        .salaryMin(52).salaryMax(52).applicationFeeGeneral("850").applicationFeeReserved("175")
                        .detail(ExamDetail.builder()
                                .syllabusJson(toJson(asMap(
                                        "Prelims", asList("English Language", "Quantitative Aptitude", "Reasoning Ability"),
                                        "Mains", asList("Reasoning & Computer Aptitude", "General Economy & Banking Awareness", "English Language", "Data Analysis & Interpretation"),
                                        "Interview", asList("Personal Interview"))))
                                .selectionProcessJson(toJson(asList("Prelims (Online)", "Mains (Online)", "Interview", "Document Verification")))
                                .preparationTips("Practice sectional mock tests daily.")
                                .build())
                        .build(),

                Exam.builder()
                        .name("UPSC CSE 2025").slug("upsc-cse-2025")
                        .category(Exam.ExamCategory.UPSC).conductingBody("Union Public Service Commission")
                        .minAge(21).maxAge(32).minQualification(UserProfile.Qualification.GRADUATE)
                        .vacancy(979).formStart(LocalDate.of(2025, 1, 22)).formEnd(LocalDate.of(2025, 2, 11))
                        .examDate(LocalDate.of(2025, 5, 25)).status(Exam.ExamStatus.FORM_OPEN)
                        .officialApplyUrl("https://upsc.gov.in").logoUrl("/logos/upsc.png")
                        .salaryMin(56).salaryMax(250).applicationFeeGeneral("100").applicationFeeReserved("0")
                        .detail(ExamDetail.builder()
                                .syllabusJson(toJson(asMap(
                                        "Prelims", asList("GS Paper I", "CSAT Paper II"),
                                        "Mains", asList("Essay", "GS I", "GS II", "GS III", "GS IV", "Optional I", "Optional II"),
                                        "Interview", asList("Personality Test (275 marks)"))))
                                .selectionProcessJson(toJson(asList("Prelims", "Mains (9 papers)", "Personality Test / Interview")))
                                .preparationTips("Start with NCERT books (6th-12th). Read The Hindu daily.")
                                .build())
                        .build(),

                Exam.builder()
                        .name("RRB NTPC 2025").slug("rrb-ntpc-2025")
                        .category(Exam.ExamCategory.RAILWAY).conductingBody("Railway Recruitment Board")
                        .minAge(18).maxAge(33).minQualification(UserProfile.Qualification.CLASS_12)
                        .vacancy(11558).formEnd(LocalDate.of(2025, 3, 10)).status(Exam.ExamStatus.UPCOMING)
                        .officialApplyUrl("https://indianrailways.gov.in").logoUrl("/logos/rrb.png")
                        .salaryMin(19).salaryMax(35).applicationFeeGeneral("500").applicationFeeReserved("250")
                        .detail(ExamDetail.builder()
                                .syllabusJson(toJson(asMap(
                                        "CBT 1", asList("Mathematics", "General Awareness", "General Intelligence & Reasoning"),
                                        "CBT 2", asList("Mathematics", "General Awareness", "General Intelligence & Reasoning"))))
                                .selectionProcessJson(toJson(asList("CBT Stage 1", "CBT Stage 2", "Typing Skill Test", "Document Verification")))
                                .build())
                        .build(),

                Exam.builder()
                        .name("SBI PO 2025").slug("sbi-po-2025")
                        .category(Exam.ExamCategory.BANKING).conductingBody("State Bank of India")
                        .minAge(21).maxAge(30).minQualification(UserProfile.Qualification.GRADUATE)
                        .vacancy(600).status(Exam.ExamStatus.UPCOMING)
                        .officialApplyUrl("https://sbi.co.in/careers").logoUrl("/logos/sbi.png")
                        .salaryMin(41).salaryMax(65).applicationFeeGeneral("750").applicationFeeReserved("0")
                        .detail(ExamDetail.builder()
                                .syllabusJson(toJson(asMap(
                                        "Prelims", asList("English Language 30Q", "Quantitative Aptitude 35Q", "Reasoning Ability 35Q"),
                                        "Mains", asList("Reasoning & Computer Aptitude", "Data Analysis & Interpretation", "General Economy / Banking Awareness", "English Language"),
                                        "GD+PI", asList("Group Exercise", "Personal Interview"))))
                                .selectionProcessJson(toJson(asList("Prelims", "Mains", "Group Exercise + Interview")))
                                .preparationTips("SBI PO is highly competitive — focus heavily on DI and Reasoning for mains.")
                                .build())
                        .build(),

                Exam.builder()
                        .name("CTET December 2024").slug("ctet-dec-2024")
                        .category(Exam.ExamCategory.TEACHING).conductingBody("Central Board of Secondary Education")
                        .minAge(17).maxAge(null).minQualification(UserProfile.Qualification.GRADUATE)
                        .vacancy(null).formEnd(LocalDate.of(2024, 10, 5)).status(Exam.ExamStatus.RESULT_OUT)
                        .officialApplyUrl("https://ctet.nic.in").logoUrl("/logos/ctet.png")
                        .salaryMin(35).salaryMax(70).applicationFeeGeneral("1000").applicationFeeReserved("500")
                        .detail(ExamDetail.builder()
                                .syllabusJson(toJson(asMap(
                                        "Paper 1 (Class 1-5)", asList("Child Development & Pedagogy", "Language I", "Language II", "Mathematics", "EVS"),
                                        "Paper 2 (Class 6-8)", asList("Child Development & Pedagogy", "Language I", "Language II", "Maths/Science or Social Studies"))))
                                .selectionProcessJson(toJson(asList("Single Paper CBT Exam", "Certificate Valid for Lifetime")))
                                .build())
                        .build(),

                Exam.builder()
                        .name("NDA I 2025").slug("nda-1-2025")
                        .category(Exam.ExamCategory.DEFENCE).conductingBody("Union Public Service Commission")
                        .minAge(16).maxAge(19).minQualification(UserProfile.Qualification.CLASS_12)
                        .vacancy(404).formStart(LocalDate.of(2025, 1, 11)).formEnd(LocalDate.of(2025, 1, 31))
                        .examDate(LocalDate.of(2025, 4, 13)).status(Exam.ExamStatus.FORM_OPEN)
                        .officialApplyUrl("https://upsc.gov.in").logoUrl("/logos/nda.png")
                        .salaryMin(56).salaryMax(177).applicationFeeGeneral("100").applicationFeeReserved("0")
                        .detail(ExamDetail.builder()
                                .syllabusJson(toJson(asMap(
                                        "Mathematics (300 marks)", asList("Algebra", "Matrices", "Trigonometry", "Calculus", "Statistics"),
                                        "General Ability (600 marks)", asList("English", "GK: Physics, Chemistry, Social Studies, Geography, Current Affairs"))))
                                .selectionProcessJson(toJson(asList("Written Exam", "SSB Interview (5 days)", "Medical Examination")))
                                .build())
                        .build(),

                Exam.builder()
                        .name("SSC CHSL 2025").slug("ssc-chsl-2025")
                        .category(Exam.ExamCategory.SSC).conductingBody("Staff Selection Commission")
                        .minAge(18).maxAge(27).minQualification(UserProfile.Qualification.CLASS_12)
                        .vacancy(3712).status(Exam.ExamStatus.UPCOMING)
                        .officialApplyUrl("https://ssc.nic.in").logoUrl("/logos/ssc.png")
                        .salaryMin(19).salaryMax(63).applicationFeeGeneral("100").applicationFeeReserved("0")
                        .detail(ExamDetail.builder()
                                .syllabusJson(toJson(asMap(
                                        "Tier 1 CBT", asList("General Intelligence", "General Awareness", "Quantitative Aptitude", "English"))))
                                .selectionProcessJson(toJson(asList("Tier I (CBT)", "Tier II (CBT + Skill Test / Typing Test)")))
                                .build())
                        .build(),

                Exam.builder()
                        .name("IBPS Clerk 2024").slug("ibps-clerk-2024")
                        .category(Exam.ExamCategory.BANKING).conductingBody("Institute of Banking Personnel Selection")
                        .minAge(20).maxAge(28).minQualification(UserProfile.Qualification.GRADUATE)
                        .vacancy(6128).status(Exam.ExamStatus.RESULT_OUT)
                        .officialApplyUrl("https://ibps.in").logoUrl("/logos/ibps.png")
                        .salaryMin(19).salaryMax(47).applicationFeeGeneral("850").applicationFeeReserved("175")
                        .detail(ExamDetail.builder()
                                .syllabusJson(toJson(asMap(
                                        "Prelims", asList("English Language", "Numerical Ability", "Reasoning Ability"),
                                        "Mains", asList("General / Financial Awareness", "General English", "Reasoning Ability & Computer Aptitude", "Quantitative Aptitude"))))
                                .selectionProcessJson(toJson(asList("Prelims", "Mains", "Provisional Allotment")))
                                .build())
                        .build(),

                Exam.builder()
                        .name("UP Police Constable 2024").slug("up-police-constable-2024")
                        .category(Exam.ExamCategory.POLICE).conductingBody("Uttar Pradesh Police Recruitment and Promotion Board")
                        .minAge(18).maxAge(22).minQualification(UserProfile.Qualification.CLASS_12)
                        .vacancy(60244).status(Exam.ExamStatus.EXAM_SCHEDULED)
                        .officialApplyUrl("https://uppbpb.gov.in").logoUrl("/logos/uppolicee.png")
                        .salaryMin(21).salaryMax(40).applicationFeeGeneral("400").applicationFeeReserved("400")
                        .detail(ExamDetail.builder()
                                .syllabusJson(toJson(asMap(
                                        "Written Test", asList("General Hindi", "General Knowledge", "Numerical & Mental Ability", "Mental Aptitude / IQ / Reasoning Ability"))))
                                .selectionProcessJson(toJson(asList("Written Exam (300 marks)", "Physical Standard Test", "Physical Efficiency Test", "Medical Exam")))
                                .build())
                        .build()
        );

        for (Exam exam : exams) {
            if (exam.getDetail() != null) exam.getDetail().setExam(exam);
        }
        examRepository.saveAll(exams);
        log.info("Seeded {} exams", exams.size());
    }

    private void seedCompanies() {
        if (companyRepository.count() > 0) return;

        List<Company> companies = List.of(
                buildCompany("TCS", "tcs", "IT Services", 1968, "Mumbai",
                        "Tata Consultancy Services is India's largest IT company and a global leader in IT services, consulting and business solutions.",
                        3, "https://tcs.com", "/logos/tcs.png",
                        CompanyPrep.builder()
                                .aptitudeLevel("Easy").dsaLevel("Easy").codingRounds(1).hrRounds(1).hasSystemDesign(false)
                                .requiredSkills(toJson(asList("Java", "SQL", "C", "Problem Solving", "Communication")))
                                .interviewProcessJson(toJson(asMap("Rounds", asList("TCS NQT (Online)", "TR Round — Basic DSA, Java/C questions", "MR Round — Project and academics", "HR Round — Behavioural"))))
                                .salaryByRoleJson(toJson(asMap("Ninja", "3.36 LPA", "Digital", "7 LPA", "Prime", "9-11 LPA")))
                                .build()),

                buildCompany("Infosys", "infosys", "IT Services", 1981, "Bengaluru",
                        "Infosys is a global leader in next-generation digital services and consulting.",
                        3, "https://infosys.com", "/logos/infosys.png",
                        CompanyPrep.builder()
                                .aptitudeLevel("Medium").dsaLevel("Easy-Medium").codingRounds(1).hrRounds(1).hasSystemDesign(false)
                                .requiredSkills(toJson(asList("Java", "Python", "DBMS", "OOPs", "Reasoning")))
                                .interviewProcessJson(toJson(asMap("Rounds", asList("Infosys Hackwithinfy / InfyTQ (Online)", "Technical Interview — 2 rounds (DSA + Project)", "HR Interview"))))
                                .salaryByRoleJson(toJson(asMap("Systems Engineer", "3.6 LPA", "Specialist Programmer", "9.5 LPA", "DSE", "11 LPA")))
                                .build()),

                buildCompany("Wipro", "wipro", "IT Services", 1945, "Bengaluru",
                        "Wipro Limited is a leading global information technology, consulting and business process services company.",
                        3, "https://wipro.com", "/logos/wipro.png",
                        CompanyPrep.builder()
                                .aptitudeLevel("Easy-Medium").dsaLevel("Easy").codingRounds(1).hrRounds(1).hasSystemDesign(false)
                                .requiredSkills(toJson(asList("Java", "C++", "SQL", "Data Structures", "Aptitude")))
                                .interviewProcessJson(toJson(asMap("Rounds", asList("NLTH (Online Aptitude + Coding)", "Technical Interview (OOPs, DBMS, Projects)", "HR Interview"))))
                                .salaryByRoleJson(toJson(asMap("Turbo", "3.5 LPA", "Elite", "6.5 LPA", "PRO", "10 LPA")))
                                .build()),

                buildCompany("Amazon", "amazon", "E-Commerce / Cloud", 1994, "Seattle (India: Hyderabad)",
                        "Amazon is a global technology company focused on e-commerce, cloud computing (AWS), and AI.",
                        12, "https://amazon.jobs", "/logos/amazon.png",
                        CompanyPrep.builder()
                                .aptitudeLevel("Hard").dsaLevel("Hard").codingRounds(3).hrRounds(1).hasSystemDesign(true)
                                .requiredSkills(toJson(asList("DSA", "LeetCode Hard", "System Design", "Java/Python", "OOPs", "OS", "DBMS", "Leadership Principles")))
                                .interviewProcessJson(toJson(asMap("Rounds", asList("Online Assessment (2 coding + MCQ + Workstyle)", "Phone Screen (1 coding round)", "Virtual Onsite: 4-5 rounds (DSA + System Design + Behavioural)"))))
                                .salaryByRoleJson(toJson(asMap("SDE-I", "25-35 LPA", "SDE-II", "45-60 LPA", "SDE-III", "80+ LPA")))
                                .build()),

                buildCompany("Capgemini", "capgemini", "IT Services / Consulting", 1967, "Paris (India: Mumbai)",
                        "Capgemini is a global leader in partnering with companies to transform and manage their business by harnessing the power of technology.",
                        5, "https://capgemini.com", "/logos/capgemini.png",
                        CompanyPrep.builder()
                                .aptitudeLevel("Easy-Medium").dsaLevel("Easy").codingRounds(1).hrRounds(1).hasSystemDesign(false)
                                .requiredSkills(toJson(asList("Java", "Python", "SQL", "Pseudo Code", "Communication")))
                                .interviewProcessJson(toJson(asMap("Rounds", asList("InfraAI Test (Online: Pseudo Code, Behavioural, Technical MCQ, Coding)", "Technical Interview", "HR Interview"))))
                                .salaryByRoleJson(toJson(asMap("Analyst", "4.0 LPA", "Senior Analyst", "7-8 LPA")))
                                .build())
        );

        companyRepository.saveAll(companies);
        seedJobs(companies);
        log.info("Seeded {} companies", companies.size());
    }

    private void seedJobs(List<Company> companies) {
        if (jobRepository.count() > 0) return;

        List<Job> jobs = List.of(
                Job.builder().company(companies.get(0)).title("System Engineer").type(Job.JobType.PRIVATE)
                        .location("Pan India").salaryMin(3).salaryMax(4)
                        .skillsRequired(toJson(asList("Java", "SQL", "Communication"))).qualification("Any Graduate")
                        .experienceMin(0).experienceMax(0).applyLink("https://tcs.com/careers")
                        .status(Job.JobStatus.ACTIVE).build(),
                Job.builder().company(companies.get(1)).title("Systems Engineer").type(Job.JobType.PRIVATE)
                        .location("Bengaluru / Pune / Hyderabad").salaryMin(3).salaryMax(4)
                        .skillsRequired(toJson(asList("Java", "Python", "DBMS"))).qualification("B.E / B.Tech / MCA")
                        .experienceMin(0).experienceMax(0).applyLink("https://infosys.com/careers")
                        .status(Job.JobStatus.ACTIVE).build(),
                Job.builder().company(companies.get(3)).title("SDE Intern").type(Job.JobType.INTERNSHIP)
                        .location("Hyderabad").salaryMin(60).salaryMax(100)
                        .skillsRequired(toJson(asList("DSA", "Java or Python", "LeetCode"))).qualification("B.Tech CS/IT")
                        .experienceMin(0).experienceMax(0).applyLink("https://amazon.jobs")
                        .status(Job.JobStatus.ACTIVE).build(),
                Job.builder().company(companies.get(4)).title("Analyst").type(Job.JobType.PRIVATE)
                        .location("Mumbai / Pune / Chennai").salaryMin(4).salaryMax(5)
                        .skillsRequired(toJson(asList("Java", "SQL", "Communication"))).qualification("Any Graduate")
                        .experienceMin(0).experienceMax(0).applyLink("https://capgemini.com/careers")
                        .status(Job.JobStatus.ACTIVE).build()
        );
        jobRepository.saveAll(jobs);
    }

    private Company buildCompany(String name, String slug, String industry, int founded,
                                 String hq, String about, int avgPkg,
                                 String website, String logo, CompanyPrep prep) {
        Company company = Company.builder()
                .name(name).slug(slug).industry(industry).foundedYear(founded)
                .hq(hq).about(about).avgPackageFresher(avgPkg)
                .website(website).logoUrl(logo).build();
        prep.setCompany(company);
        company.setPrep(prep);
        return company;
    }
}