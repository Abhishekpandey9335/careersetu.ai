package com.careersetu.config;

import com.careersetu.entity.*;
import com.careersetu.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final PasswordEncoder passwordEncoder;

    private static final ObjectMapper mapper = new ObjectMapper();

    // Below this, any salaryMin/Max value is treated as an "old buggy" raw
    // LPA/stipend number (e.g. 3, 60) and gets converted to real rupees.
    // Real rupee salaries are always well above this, so it's safe.
    private static final int UNFIXED_SALARY_THRESHOLD = 1000;
    private static final int LPA_TO_RUPEES = 100_000;
    private static final int STIPEND_UNIT_TO_RUPEES = 1_000;

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
        List<Company> companies = seedCompanies();
        fixAndSeedJobs(companies);
        log.info("CareerSetu data seeder completed.");
    }

    private void seedAdminUser() {
        if (userRepository.existsByEmail("admin@careersetu.in")) return;
        User admin = User.builder()
                .name("CareerSetu Admin").email("admin@careersetu.in")
                .passwordHash(passwordEncoder.encode("Admin@123"))
                .role(User.Role.ADMIN).isEmailVerified(true).build();
        admin = userRepository.save(admin);
        userProfileRepository.save(UserProfile.builder().user(admin).build());
        log.info("Admin user created - admin@careersetu.in / Admin@123");
    }

    /**
     * Returns the list of companies — either freshly seeded (first run ever)
     * or fetched from the DB (every run after that). Job seeding needs this
     * list either way, so it can no longer be a void method.
     */
    private List<Company> seedCompanies() {
        if (companyRepository.count() > 0) {
            return companyRepository.findAll();
        }

        List<Company> companies = List.of(
                buildCompany("TCS", "tcs", "IT Services", 1968, "Mumbai",
                        "Tata Consultancy Services is India's largest IT company and a global leader in IT services, consulting and business solutions.",
                        3, "https://tcs.com", "/logos/tcs.png",
                        CompanyPrep.builder()
                                .aptitudeLevel("Easy").dsaLevel("Easy").codingRounds(1).hrRounds(1).hasSystemDesign(false)
                                .requiredSkills(toJson(asList("Java", "SQL", "C", "Problem Solving", "Communication")))
                                .interviewProcessJson(toJson(asMap("Rounds", asList("TCS NQT (Online)", "TR Round - Basic DSA, Java/C questions", "MR Round - Project and academics", "HR Round - Behavioural"))))
                                .salaryByRoleJson(toJson(asMap("Ninja", "3.36 LPA", "Digital", "7 LPA", "Prime", "9-11 LPA")))
                                .build()),

                buildCompany("Infosys", "infosys", "IT Services", 1981, "Bengaluru",
                        "Infosys is a global leader in next-generation digital services and consulting.",
                        3, "https://infosys.com", "/logos/infosys.png",
                        CompanyPrep.builder()
                                .aptitudeLevel("Medium").dsaLevel("Easy-Medium").codingRounds(1).hrRounds(1).hasSystemDesign(false)
                                .requiredSkills(toJson(asList("Java", "Python", "DBMS", "OOPs", "Reasoning")))
                                .interviewProcessJson(toJson(asMap("Rounds", asList("Infosys Hackwithinfy / InfyTQ (Online)", "Technical Interview - 2 rounds (DSA + Project)", "HR Interview"))))
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
        log.info("Seeded {} companies", companies.size());
        return companies;
    }

    /**
     * Replaces the old seedJobs(). Runs on EVERY startup, safely:
     *  1. Fixes any job whose salaryMin/Max is still in the old buggy
     *     raw-number format (e.g. 3, 60) by converting it to real rupees.
     *  2. Inserts only the jobs that don't already exist yet
     *     (matched by company + title), so re-running never duplicates.
     */
    private void fixAndSeedJobs(List<Company> companies) {
        Map<String, Company> bySlug = new HashMap<>();
        for (Company c : companies) {
            bySlug.put(c.getSlug(), c);
        }

        fixBadSalaryValues();
        seedMissingJobs(bySlug);
    }

    private void fixBadSalaryValues() {
        List<Job> allJobs = jobRepository.findAll();
        List<Job> toFix = new ArrayList<>();

        for (Job job : allJobs) {
            Integer min = job.getSalaryMin();
            Integer max = job.getSalaryMax();
            boolean looksUnfixed = (min != null && min < UNFIXED_SALARY_THRESHOLD)
                    || (max != null && max < UNFIXED_SALARY_THRESHOLD);

            if (looksUnfixed) {
                int multiplier = job.getType() == Job.JobType.INTERNSHIP
                        ? STIPEND_UNIT_TO_RUPEES
                        : LPA_TO_RUPEES;
                if (min != null) job.setSalaryMin(min * multiplier);
                if (max != null) job.setSalaryMax(max * multiplier);
                toFix.add(job);
            }
        }

        if (!toFix.isEmpty()) {
            jobRepository.saveAll(toFix);
            log.info("Fixed salary values for {} existing job(s) — converted to real rupee amounts.", toFix.size());
        }
    }

    private void seedMissingJobs(Map<String, Company> bySlug) {
        List<Job> existingJobs = jobRepository.findAll();
        Set<String> existingKeys = new HashSet<>();
        for (Job j : existingJobs) {
            if (j.getCompany() != null) {
                existingKeys.add(j.getCompany().getId() + "::" + j.getTitle());
            }
        }

        List<Job> candidates = buildNewJobs(bySlug);
        List<Job> toInsert = new ArrayList<>();
        for (Job job : candidates) {
            String key = job.getCompany().getId() + "::" + job.getTitle();
            if (!existingKeys.contains(key)) {
                toInsert.add(job);
            }
        }

        if (!toInsert.isEmpty()) {
            jobRepository.saveAll(toInsert);
            log.info("Seeded {} new job(s).", toInsert.size());
        }
    }

    /**
     * All values here are already REAL RUPEES — no further conversion needed.
     */
    private List<Job> buildNewJobs(Map<String, Company> bySlug) {
        Company tcs = bySlug.get("tcs");
        Company infosys = bySlug.get("infosys");
        Company wipro = bySlug.get("wipro");
        Company amazon = bySlug.get("amazon");
        Company capgemini = bySlug.get("capgemini");

        return new ArrayList<>(List.of(
                Job.builder().company(tcs).title("Java Developer").type(Job.JobType.PRIVATE)
                        .location("Chennai").salaryMin(400000).salaryMax(600000)
                        .skillsRequired(toJson(asList("Java", "Spring Boot", "REST API"))).qualification("B.Tech/MCA")
                        .experienceMin(0).experienceMax(2).applyLink("https://tcs.com/careers")
                        .status(Job.JobStatus.ACTIVE).build(),

                Job.builder().company(tcs).title("Business Analyst").type(Job.JobType.PRIVATE)
                        .location("Mumbai").salaryMin(400000).salaryMax(600000)
                        .skillsRequired(toJson(asList("SQL", "Excel", "Communication"))).qualification("Any Graduate")
                        .experienceMin(0).experienceMax(1).applyLink("https://tcs.com/careers")
                        .status(Job.JobStatus.ACTIVE).build(),

                Job.builder().company(tcs).title("QA / Test Engineer").type(Job.JobType.PRIVATE)
                        .location("Kolkata").salaryMin(300000).salaryMax(500000)
                        .skillsRequired(toJson(asList("Manual Testing", "Selenium", "SQL"))).qualification("B.Tech/BCA")
                        .experienceMin(0).experienceMax(2).applyLink("https://tcs.com/careers")
                        .status(Job.JobStatus.ACTIVE).build(),

                Job.builder().company(infosys).title("Full Stack Developer").type(Job.JobType.PRIVATE)
                        .location("Pune").salaryMin(500000).salaryMax(800000)
                        .skillsRequired(toJson(asList("React", "Node.js", "MongoDB"))).qualification("B.Tech")
                        .experienceMin(1).experienceMax(3).applyLink("https://career.infosys.com")
                        .status(Job.JobStatus.ACTIVE).build(),

                Job.builder().company(infosys).title("Cloud Support Engineer").type(Job.JobType.PRIVATE)
                        .location("Bengaluru").salaryMin(500000).salaryMax(700000)
                        .skillsRequired(toJson(asList("AWS", "Azure", "Linux"))).qualification("B.Tech")
                        .experienceMin(0).experienceMax(2).applyLink("https://career.infosys.com")
                        .status(Job.JobStatus.ACTIVE).build(),

                Job.builder().company(infosys).title("Data Analyst").type(Job.JobType.PRIVATE)
                        .location("Hyderabad").salaryMin(400000).salaryMax(600000)
                        .skillsRequired(toJson(asList("SQL", "Power BI", "Python"))).qualification("B.Tech/B.Sc")
                        .experienceMin(0).experienceMax(2).applyLink("https://career.infosys.com")
                        .status(Job.JobStatus.ACTIVE).build(),

                Job.builder().company(wipro).title("Project Engineer").type(Job.JobType.PRIVATE)
                        .location("Noida").salaryMin(300000).salaryMax(500000)
                        .skillsRequired(toJson(asList("Java", "SQL", "Problem Solving"))).qualification("B.E/B.Tech")
                        .experienceMin(0).experienceMax(1).applyLink("https://careers.wipro.com")
                        .status(Job.JobStatus.ACTIVE).build(),

                Job.builder().company(wipro).title("DevOps Engineer").type(Job.JobType.PRIVATE)
                        .location("Bengaluru").salaryMin(600000).salaryMax(900000)
                        .skillsRequired(toJson(asList("Docker", "Kubernetes", "CI/CD"))).qualification("B.Tech")
                        .experienceMin(1).experienceMax(3).applyLink("https://careers.wipro.com")
                        .status(Job.JobStatus.ACTIVE).build(),

                Job.builder().company(wipro).title("Network Engineer").type(Job.JobType.PRIVATE)
                        .location("Chennai").salaryMin(300000).salaryMax(500000)
                        .skillsRequired(toJson(asList("Networking", "CCNA", "Troubleshooting"))).qualification("B.Tech/Diploma")
                        .experienceMin(0).experienceMax(2).applyLink("https://careers.wipro.com")
                        .status(Job.JobStatus.ACTIVE).build(),

                Job.builder().company(amazon).title("Data Engineer").type(Job.JobType.PRIVATE)
                        .location("Bengaluru").salaryMin(1200000).salaryMax(2000000)
                        .skillsRequired(toJson(asList("Python", "Spark", "SQL", "AWS"))).qualification("B.Tech")
                        .experienceMin(1).experienceMax(4).applyLink("https://amazon.jobs")
                        .status(Job.JobStatus.ACTIVE).build(),

                Job.builder().company(amazon).title("Business Development Associate").type(Job.JobType.PRIVATE)
                        .location("Delhi NCR").salaryMin(600000).salaryMax(900000)
                        .skillsRequired(toJson(asList("Communication", "Sales", "Excel"))).qualification("Any Graduate")
                        .experienceMin(0).experienceMax(2).applyLink("https://amazon.jobs")
                        .status(Job.JobStatus.ACTIVE).build(),

                Job.builder().company(amazon).title("Operations Manager").type(Job.JobType.PRIVATE)
                        .location("Hyderabad").salaryMin(800000).salaryMax(1200000)
                        .skillsRequired(toJson(asList("Leadership", "Excel", "Process Improvement"))).qualification("Any Graduate/MBA")
                        .experienceMin(2).experienceMax(5).applyLink("https://amazon.jobs")
                        .status(Job.JobStatus.ACTIVE).build(),

                Job.builder().company(capgemini).title("Software Developer").type(Job.JobType.PRIVATE)
                        .location("Bengaluru").salaryMin(500000).salaryMax(800000)
                        .skillsRequired(toJson(asList("Java", "Angular", "Microservices"))).qualification("B.Tech")
                        .experienceMin(0).experienceMax(2).applyLink("https://www.capgemini.com/in-en/careers")
                        .status(Job.JobStatus.ACTIVE).build(),

                Job.builder().company(capgemini).title("Technical Support Engineer").type(Job.JobType.PRIVATE)
                        .location("Pune").salaryMin(300000).salaryMax(500000)
                        .skillsRequired(toJson(asList("Troubleshooting", "SQL", "Communication"))).qualification("Any Graduate")
                        .experienceMin(0).experienceMax(2).applyLink("https://www.capgemini.com/in-en/careers")
                        .status(Job.JobStatus.ACTIVE).build(),

                Job.builder().company(capgemini).title("HR Executive").type(Job.JobType.PRIVATE)
                        .location("Mumbai").salaryMin(300000).salaryMax(500000)
                        .skillsRequired(toJson(asList("Recruitment", "Communication", "MS Office"))).qualification("MBA HR")
                        .experienceMin(0).experienceMax(2).applyLink("https://www.capgemini.com/in-en/careers")
                        .status(Job.JobStatus.ACTIVE).build(),

                Job.builder().company(tcs).title(".NET Developer").type(Job.JobType.PRIVATE)
                        .location("Indore").salaryMin(400000).salaryMax(600000)
                        .skillsRequired(toJson(asList("C#", ".NET Core", "SQL Server"))).qualification("B.Tech/MCA")
                        .experienceMin(0).experienceMax(2).applyLink("https://tcs.com/careers")
                        .status(Job.JobStatus.ACTIVE).build(),

                Job.builder().company(infosys).title("UI/UX Designer").type(Job.JobType.PRIVATE)
                        .location("Pune").salaryMin(400000).salaryMax(700000)
                        .skillsRequired(toJson(asList("Figma", "Adobe XD", "Wireframing"))).qualification("Any Graduate")
                        .experienceMin(0).experienceMax(2).applyLink("https://career.infosys.com")
                        .status(Job.JobStatus.ACTIVE).build(),

                Job.builder().company(wipro).title("Digital Marketing Executive").type(Job.JobType.PRIVATE)
                        .location("Remote").salaryMin(300000).salaryMax(500000)
                        .skillsRequired(toJson(asList("SEO", "Google Ads", "Content Marketing"))).qualification("Any Graduate")
                        .experienceMin(0).experienceMax(2).applyLink("https://careers.wipro.com")
                        .status(Job.JobStatus.ACTIVE).build(),

                Job.builder().company(amazon).title("Machine Learning Intern").type(Job.JobType.INTERNSHIP)
                        .location("Bengaluru").salaryMin(50000).salaryMax(80000)
                        .skillsRequired(toJson(asList("Python", "TensorFlow", "Statistics"))).qualification("B.Tech CS/IT")
                        .experienceMin(0).experienceMax(0).applyLink("https://amazon.jobs")
                        .status(Job.JobStatus.ACTIVE).build(),

                Job.builder().company(capgemini).title("Content Writer").type(Job.JobType.PRIVATE)
                        .location("Remote").salaryMin(200000).salaryMax(400000)
                        .skillsRequired(toJson(asList("Content Writing", "SEO", "English"))).qualification("Any Graduate")
                        .experienceMin(0).experienceMax(2).applyLink("https://www.capgemini.com/in-en/careers")
                        .status(Job.JobStatus.ACTIVE).build(),

                Job.builder().company(tcs).title("Cybersecurity Analyst").type(Job.JobType.PRIVATE)
                        .location("Gurugram").salaryMin(600000).salaryMax(1000000)
                        .skillsRequired(toJson(asList("Network Security", "SIEM", "Linux"))).qualification("B.Tech")
                        .experienceMin(1).experienceMax(3).applyLink("https://tcs.com/careers")
                        .status(Job.JobStatus.ACTIVE).build(),

                Job.builder().company(infosys).title("Mobile App Developer (Android)").type(Job.JobType.PRIVATE)
                        .location("Bengaluru").salaryMin(500000).salaryMax(800000)
                        .skillsRequired(toJson(asList("Kotlin", "Android SDK", "Firebase"))).qualification("B.Tech")
                        .experienceMin(1).experienceMax(3).applyLink("https://career.infosys.com")
                        .status(Job.JobStatus.ACTIVE).build(),

                Job.builder().company(wipro).title("Customer Support Executive").type(Job.JobType.PRIVATE)
                        .location("Kochi").salaryMin(200000).salaryMax(400000)
                        .skillsRequired(toJson(asList("Communication", "CRM", "Problem Solving"))).qualification("Any Graduate")
                        .experienceMin(0).experienceMax(1).applyLink("https://careers.wipro.com")
                        .status(Job.JobStatus.ACTIVE).build()
        ));
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