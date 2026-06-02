package com.careersetu.controller;

import com.careersetu.exception.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.Period;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Career Tools — utility APIs (no auth required).
 * Features: Age Calculator, CGPA → Percentage, Salary Explorer (static ranges).
 */
@RestController
@RequestMapping("/tools")
@RequiredArgsConstructor
@Tag(name = "Career Tools", description = "Utility calculators for students")
public class CareerToolsController {

    /**
     * Age Calculator
     * POST /api/tools/age
     * Body: { "dob": "2002-05-15", "cutoffDate": "2024-01-01" }
     */
    @PostMapping("/age")
    @Operation(summary = "Calculate age as on exam cutoff date with category relaxation info")
    public ResponseEntity<ApiResponse<Map<String, Object>>> calculateAge(
            @RequestBody Map<String, String> body) {

        String dobStr     = body.get("dob");
        String cutoffStr  = body.getOrDefault("cutoffDate", LocalDate.now().toString());

        LocalDate dob     = LocalDate.parse(dobStr);
        LocalDate cutoff  = LocalDate.parse(cutoffStr);
        Period age        = Period.between(dob, cutoff);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("years",  age.getYears());
        result.put("months", age.getMonths());
        result.put("days",   age.getDays());
        result.put("ageOnCutoff", age.getYears() + " years " + age.getMonths() + " months");
        result.put("relaxations", Map.of(
                "OBC",       "3 years relaxation for most exams",
                "SC/ST",     "5 years relaxation for most exams",
                "PwD",       "10 years relaxation (General), 13 years (OBC), 15 years (SC/ST)",
                "ExServiceman", "Length of service + 3 years"
        ));
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    /**
     * CGPA to Percentage Converter
     * GET /api/tools/cgpa?cgpa=8.5&scale=10
     */
    @GetMapping("/cgpa")
    @Operation(summary = "Convert CGPA to percentage. scale param: 10 (default) or 4")
    public ResponseEntity<ApiResponse<Map<String, Object>>> cgpaToPercentage(
            @RequestParam double cgpa,
            @RequestParam(defaultValue = "10") int scale) {

        double percentage;
        String formula;

        if (scale == 10) {
            percentage = cgpa * 9.5;   // UGC / most Indian university formula
            formula    = "CGPA × 9.5 (UGC formula)";
        } else if (scale == 4) {
            percentage = (cgpa / 4.0) * 100;
            formula    = "(CGPA / 4) × 100";
        } else {
            percentage = (cgpa / scale) * 100;
            formula    = "(CGPA / " + scale + ") × 100";
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("cgpa",       cgpa);
        result.put("scale",      scale);
        result.put("percentage", Math.round(percentage * 100.0) / 100.0);
        result.put("formula",    formula);
        result.put("grade", percentage >= 75 ? "First Class with Distinction"
                          : percentage >= 60 ? "First Class"
                          : percentage >= 55 ? "Second Class (Higher)"
                          : percentage >= 50 ? "Second Class"
                          : "Pass Class");
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    /**
     * Salary Explorer — static ranges by career path
     * GET /api/tools/salary?role=SSC+CGL
     */
    @GetMapping("/salary")
    @Operation(summary = "Get average salary range for a career path or job role")
    public ResponseEntity<ApiResponse<Map<String, Object>>> salaryExplorer(
            @RequestParam String role) {

        Map<String, Object> data = getSalaryData(role.toLowerCase().trim());
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    /**
     * EMI Calculator
     * POST /api/tools/emi
     * Body: { "principal": 100000, "ratePercent": 12, "tenureMonths": 24 }
     */
    @PostMapping("/emi")
    @Operation(summary = "Calculate EMI for coaching fee or course financing")
    public ResponseEntity<ApiResponse<Map<String, Object>>> emiCalculator(
            @RequestBody Map<String, Double> body) {

        double P = body.get("principal");
        double r = body.get("ratePercent") / 12 / 100;
        int    n = body.get("tenureMonths").intValue();

        double emi   = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        double total = emi * n;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("monthlyEmi",    Math.round(emi));
        result.put("totalAmount",   Math.round(total));
        result.put("totalInterest", Math.round(total - P));
        result.put("principal",     (long) P);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    // ─── Static salary data (expand as needed) ─────────────────────────────────
    private Map<String, Object> getSalaryData(String role) {
        Map<String, Map<String, Object>> db = new LinkedHashMap<>();

        db.put("ssc cgl",    salaryEntry("SSC CGL", 25000, 75000, 45000, "High", "Govt benefits + pension"));
        db.put("ibps po",    salaryEntry("IBPS PO", 36000, 55000, 42000, "High", "Bank perks + housing"));
        db.put("upsc ias",   salaryEntry("UPSC IAS", 56100, 250000, 100000, "Very High", "Top govt perks"));
        db.put("sbi po",     salaryEntry("SBI PO", 38000, 60000, 48000, "High", "Bank perks + pension"));
        db.put("rrb ntpc",   salaryEntry("RRB NTPC", 19900, 38000, 28000, "Medium", "Railway perks"));
        db.put("data analyst",    salaryEntry("Data Analyst", 35000, 120000, 65000, "High", "Skill-dependent growth"));
        db.put("software engineer", salaryEntry("Software Engineer", 35000, 200000, 80000, "Very High", "Domain + company dependent"));
        db.put("full stack developer", salaryEntry("Full Stack Developer", 40000, 180000, 85000, "Very High", "React/Node most in demand"));
        db.put("tcs",        salaryEntry("TCS (Fresher)", 26000, 38000, 30000, "Medium", "TCS NQT + Digital bands"));
        db.put("infosys",    salaryEntry("Infosys (Fresher)", 24000, 40000, 32000, "Medium", "Role-dependent"));
        db.put("amazon",     salaryEntry("Amazon SDE", 100000, 350000, 180000, "Very High", "High CoL cities"));
        db.put("ctet",       salaryEntry("CTET Teacher", 28000, 70000, 40000, "Medium", "Govt + state benefits"));

        String key = role.replaceAll("\\s+", " ");
        if (db.containsKey(key)) return db.get(key);

        // fuzzy match
        for (Map.Entry<String, Map<String, Object>> entry : db.entrySet()) {
            if (key.contains(entry.getKey()) || entry.getKey().contains(key)) {
                return entry.getValue();
            }
        }

        return Map.of("message", "Salary data not available for '" + role + "'. Try: SSC CGL, IBPS PO, Data Analyst, TCS, Amazon SDE etc.",
                      "tip", "Use the AI Advisor for custom salary prediction: /api/ai/salary-predictor");
    }

    private Map<String, Object> salaryEntry(String name, int min, int max, int avg,
                                             String jobSecurity, String perks) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("role",        name);
        m.put("salaryMin",   min);
        m.put("salaryMax",   max);
        m.put("averageSalary", avg);
        m.put("jobSecurity", jobSecurity);
        m.put("perks",       perks);
        m.put("growth",      Map.of("1yr", avg, "3yr", (int)(avg * 1.4), "5yr", (int)(avg * 1.9)));
        return m;
    }
}
