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
        seedCompanies();
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

    private void seedCompanies() {
        if (companyRepository.count() > 0) return;

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
