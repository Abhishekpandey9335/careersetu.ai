package com.careersetu.service;

import com.careersetu.dto.ai.AiChatRequest;
import com.careersetu.dto.ai.AiChatResponse;
import com.careersetu.dto.ai.RoadmapGenerateRequest;
import com.careersetu.entity.*;
import com.careersetu.exception.BadRequestException;
import com.careersetu.exception.ResourceNotFoundException;
import com.careersetu.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiService {

    private final AiConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    @Value("${ai.provider}")
    private String aiProvider;

    @Value("${ai.grok-api-url}")
    private String grokApiUrl;

    @Value("${ai.grok-api-key}")
    private String grokApiKey;

    @Value("${ai.openai-api-url}")
    private String openaiApiUrl;

    @Value("${ai.openai-api-key}")
    private String openaiApiKey;

    private final RestTemplate restTemplate;

    // ─── Public API ────────────────────────────────────────────────────────────

    @Transactional
    public AiChatResponse chat(Long userId, AiChatRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        AiConversation conversation;
        List<Object> messages;

        if (request.getConversationId() != null) {
            conversation = conversationRepository.findById(request.getConversationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Conversation", request.getConversationId()));
            if (!conversation.getUser().getId().equals(userId))
                throw new ResourceNotFoundException("Conversation", request.getConversationId());
            messages = new ArrayList<>(conversation.getMessagesJson());
        } else {
            conversation = AiConversation.builder()
                    .user(user).messagesJson(new ArrayList<>()).build();
            messages = new ArrayList<>();
            messages.add(Map.of("role", "system",
                    "content", buildSystemPrompt(user.getName(), buildProfileContext(userId))));
        }

        messages.add(Map.of("role", "user", "content", request.getMessage()));
        String reply = callAiApi(messages);
        messages.add(Map.of("role", "assistant", "content", reply));

        if (conversation.getTitle() == null) {
            String title = request.getMessage();
            conversation.setTitle(title.length() > 60 ? title.substring(0, 57) + "..." : title);
        }
        conversation.setMessagesJson(messages);
        conversation = conversationRepository.save(conversation);

        return AiChatResponse.builder()
                .conversationId(conversation.getId())
                .reply(reply)
                .conversationTitle(conversation.getTitle())
                .build();
    }

    @Transactional
    public AiChatResponse generateRoadmap(Long userId, RoadmapGenerateRequest request) {
        String profile = buildProfileContext(userId);
        String prompt = String.format("""
                Generate a detailed %d-week study roadmap for: %s
                Student profile: %s
                Daily study hours available: %d

                Structure the response as:
                1. Overview and strategy
                2. Week-by-week plan (topics, daily tasks, resources)
                3. Milestone checkpoints
                4. Recommended books and YouTube channels
                5. Mock test schedule
                """, request.getDurationWeeks(), request.getExamOrGoal(), profile, request.getHoursPerDay());

        String reply = callAiApi(singleTurn(
                "You are CareerSetu's AI Career Advisor. Generate detailed, actionable roadmaps for Indian students.",
                prompt));
        return AiChatResponse.builder().reply(reply).build();
    }

    public AiChatResponse analyzeSkillGap(Long userId, String targetRole) {
        String profile = buildProfileContext(userId);
        String prompt = String.format("""
                Analyse the skill gap for this student targeting: %s
                Student profile: %s

                Provide:
                1. All skills required for the target role
                2. Skills already present (from profile)
                3. Missing skills ranked by priority
                4. Best free + paid resources per missing skill
                5. Realistic timeline to be job-ready
                """, targetRole, profile);

        String reply = callAiApi(singleTurn(
                "You are CareerSetu's AI Career Advisor specialising in skill gap analysis for Indian students.",
                prompt));
        return AiChatResponse.builder().reply(reply).build();
    }

    public List<AiConversation> getUserConversations(Long userId) {
        return conversationRepository
                .findByUserIdOrderByUpdatedAtDesc(userId, PageRequest.of(0, 20))
                .getContent();
    }

    @Transactional
    public void deleteConversation(Long conversationId, Long userId) {
        AiConversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation", conversationId));
        if (!conv.getUser().getId().equals(userId))
            throw new ResourceNotFoundException("Conversation", conversationId);
        conversationRepository.delete(conv);
    }

    // ─── Helpers ───────────────────────────────────────────────────────────────

    private String buildProfileContext(Long userId) {
        return userProfileRepository.findByUserId(userId).map(p ->
                String.format("Age: %s | Qualification: %s | Stream: %s | State: %s | " +
                              "Category: %s | Skills: %s | Goal: %s | Expected Salary: ₹%sk/month",
                        p.getAge(), p.getQualification(), p.getStream(), p.getState(),
                        p.getCategory(),
                        p.getSkills() != null ? String.join(", ", p.getSkills()) : "Not specified",
                        p.getGoal(), p.getExpectedSalary())
        ).orElse("Profile not yet completed — giving general guidance");
    }

    private String buildSystemPrompt(String name, String profileContext) {
        return String.format("""
                You are CareerSetu's AI Career Advisor — India's most helpful career guidance assistant.
                Help Indian students from Class 10 to Postgraduate find the best career path.

                Student Name: %s
                Student Profile: %s

                Guidelines:
                - Give personalised advice based on the student profile above
                - Be specific: exam names, cutoffs, salary ranges, timelines
                - Use simple, clear language (many users are from Tier 2/3 cities)
                - Always confirm eligibility before recommending exams
                - Format roadmaps and lists cleanly with sections
                """, name, profileContext);
    }

    private List<Object> singleTurn(String systemPrompt, String userMessage) {
        return List.of(
                Map.of("role", "system",  "content", systemPrompt),
                Map.of("role", "user",    "content", userMessage)
        );
    }

    @SuppressWarnings("unchecked")
    private String callAiApi(List<Object> messages) {
        try {
            String apiUrl = aiProvider.equals("openai") ? openaiApiUrl : grokApiUrl;
            String apiKey = aiProvider.equals("openai") ? openaiApiKey : grokApiKey;
            String model  = aiProvider.equals("openai") ? "gpt-4o" : "llama-3.3-70b-versatile";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("model", model);
            body.put("messages", messages);
            body.put("max_tokens", 2048);
            body.put("temperature", 0.7);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    apiUrl, new HttpEntity<>(body, headers), Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List<Map<String, Object>> choices =
                        (List<Map<String, Object>>) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map<String, Object> msg = (Map<String, Object>) choices.get(0).get("message");
                    return (String) msg.get("content");
                }
            }
            throw new BadRequestException("AI service returned empty response");
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            log.error("AI API call failed: {}", e.getMessage());
            throw new BadRequestException("AI service unavailable. Please try again shortly.");
        }
    }

    public com.careersetu.dto.ai.AiChatResponse predictSalary(Long userId, com.careersetu.dto.ai.SalaryPredictorRequest req) {
        String profile = buildProfileContext(userId);
        String prompt = String.format(
                "Predict the salary trajectory for an Indian student pursuing: %s\n" +
                "Location preference: %s\n" +
                "Current experience: %d years\n" +
                "Student profile: %s\n\n" +
                "Provide a structured salary prediction:\n" +
                "1. Entry-level (0-1 year): expected CTC range\n" +
                "2. Mid-level (3 years): expected CTC range\n" +
                "3. Senior (5 years): expected CTC range\n" +
                "4. Factors that will increase salary faster\n" +
                "5. Top 3 companies to target for best packages\n" +
                "6. Skills that give maximum salary boost\n" +
                "Include realistic in-hand salary vs CTC breakdown.",
                req.getCareerPath(),
                req.getLocation() != null ? req.getLocation() : "Metro cities",
                req.getCurrentExperience(), profile);

        String reply = callAiApi(singleTurn(
                "You are CareerSetu AI. Provide accurate salary predictions for India.",
                prompt));
        return com.careersetu.dto.ai.AiChatResponse.builder().reply(reply).build();
    }

    public com.careersetu.dto.ai.AiChatResponse getCareerGuidance(Long userId) {
        String profile = buildProfileContext(userId);
        String prompt = "Based on this student profile, suggest the TOP 5 most suitable career paths.\n" +
                "Student profile: " + profile + "\n\n" +
                "For each career: name, why it suits THIS student, pros/cons, salary, time to first job, required exams/skills, competition level.\n" +
                "Rank from most to least recommended. Be specific to India.";

        String reply = callAiApi(singleTurn(
                "You are CareerSetu AI Career Advisor. Give personalised career guidance for Indian students.", prompt));
        return com.careersetu.dto.ai.AiChatResponse.builder().reply(reply).build();
    }

    public com.careersetu.dto.ai.AiChatResponse predictCollegeOrStream(Long userId,
            com.careersetu.dto.ai.CollegePredictorRequest req) {
        String prompt = String.format(
                "A Class %s student needs guidance. Marks: %s, Stream: %s, Career goal: %s, State: %s, Category: %s.\n\n" +
                "Provide: 1) Best stream/branch recommendation with reasons  2) Top 10 colleges they can target  " +
                "3) Entrance exams to prepare  4) Alternative paths  5) Timeline & prep strategy  6) Career scope of top 3 options. " +
                "Be specific to India.",
                req.getCurrentClass(),
                req.getPercentage() != null ? req.getPercentage() + "%" : "Not specified",
                req.getStream() != null ? req.getStream() : "Not decided",
                req.getCareerGoal() != null ? req.getCareerGoal() : "Not decided",
                req.getState() != null ? req.getState() : "Not specified",
                req.getCategory() != null ? req.getCategory() : "General");

        String reply = callAiApi(singleTurn(
                "You are CareerSetu AI College & Stream Advisor for Indian Class 10/12 students.", prompt));
        return com.careersetu.dto.ai.AiChatResponse.builder().reply(reply).build();
    }

    public com.careersetu.dto.ai.AiChatResponse conductMockInterview(Long userId,
            com.careersetu.dto.ai.InterviewCoachRequest req) {
        String profile = buildProfileContext(userId);
        String round   = req.getRound() != null ? req.getRound() : "technical";
        String prompt;
        if (req.getPreviousQuestion() != null && req.getPreviousAnswer() != null) {
            prompt = String.format(
                    "You are conducting a mock %s interview for: %s\nStudent profile: %s\n\n" +
                    "Previous question: %s\nStudent answer: %s\n\n" +
                    "1. Evaluate answer (Score X/10, what was good, what was missing)\n" +
                    "2. Ideal answer\n3. Next interview question\n4. Tip for this question type\n" +
                    "Format: EVALUATION | IDEAL ANSWER | NEXT QUESTION | TIP",
                    round, req.getTargetRole(), profile, req.getPreviousQuestion(), req.getPreviousAnswer());
        } else {
            prompt = String.format(
                    "Start a mock %s interview for: %s\nStudent profile: %s\n\n" +
                    "1. Introduce yourself as interviewer  2. Explain what this round covers  " +
                    "3. Ask the first question  4. Tell student how to respond.",
                    round, req.getTargetRole(), profile);
        }
        String reply = callAiApi(singleTurn(
                "You are an expert interviewer for Indian job seekers. Be realistic but encouraging.", prompt));
        return com.careersetu.dto.ai.AiChatResponse.builder().reply(reply).build();
    }

    public com.careersetu.dto.ai.AiChatResponse getCareerGps(Long userId, String targetSalary, int targetYears) {
        String profile = buildProfileContext(userId);
        String prompt = String.format(
                "Build a CAREER GPS for this student.\nProfile: %s\nTarget: Reach Rs.%s/month in %d years.\n\n" +
                "Step-by-step GPS route: 1) Current position assessment  2) Year-by-year milestones  " +
                "3) Skills to acquire (priority order)  4) Exams/certifications  5) Job switch strategy  " +
                "6) Salary checkpoints  7) Risks & mitigation  8) Fastest vs safe route.\n" +
                "Be very specific — exam names, company names, exact skills.",
                profile, targetSalary, targetYears);
        String reply = callAiApi(singleTurn(
                "You are CareerSetu AI Career GPS. Create precise roadmaps for Indian students.", prompt));
        return com.careersetu.dto.ai.AiChatResponse.builder().reply(reply).build();
    }


    /** Public helper used by ResumeBuilderController */
    public com.careersetu.dto.ai.AiChatResponse reviewResumeViaAi(String prompt) {
        String reply = callAiApi(singleTurn(
                "You are an expert ATS resume reviewer for the Indian job market.", prompt));
        return com.careersetu.dto.ai.AiChatResponse.builder().reply(reply).build();
    }

}
