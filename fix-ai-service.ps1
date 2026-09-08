function Write-Utf8NoBom($path, $content) {
    $full = Join-Path (Get-Location) $path
    [System.IO.File]::WriteAllText($full, $content, [System.Text.UTF8Encoding]::new($false))
}

$p = "careersetu-backend\src\main\java\com\careersetu\service\AiService.java"
$full = Join-Path (Get-Location) $p
$c = [System.IO.File]::ReadAllText($full, [System.Text.Encoding]::UTF8)

# Normalize all line endings to LF so text matching is reliable
$c = $c -replace "`r`n", "`n"

# 6a: add import (idempotent)
if ($c -notmatch [regex]::Escape("import org.springframework.web.multipart.MultipartFile;")) {
    $c = $c.Replace(
        "import org.springframework.web.client.RestTemplate;",
        "import org.springframework.web.client.RestTemplate;`nimport org.springframework.web.multipart.MultipartFile;"
    )
    Write-Host "6a: import added"
} else {
    Write-Host "6a: import already present, skipped"
}

# 6b: add repository/extractor fields (idempotent)
if ($c -notmatch [regex]::Escape("private final ResumeUploadRepository resumeUploadRepository;")) {
    $fieldsOld = "    private final AiConversationRepository conversationRepository;`n    private final UserRepository userRepository;`n    private final UserProfileRepository userProfileRepository;"
    if ($c.Contains($fieldsOld)) {
        $fieldsNew = $fieldsOld + "`n    private final ResumeUploadRepository resumeUploadRepository;`n    private final ResumeTextExtractor resumeTextExtractor;"
        $c = $c.Replace($fieldsOld, $fieldsNew)
        Write-Host "6b: fields added"
    } else {
        Write-Host "6b: WARNING anchor not found"
    }
} else {
    Write-Host "6b: fields already present, skipped"
}

# 6c-start: change 'return' to 'String base =' (idempotent)
if ($c -notmatch [regex]::Escape("String base = userProfileRepository.findByUserId(userId).map(p ->")) {
    $startOld = "    private String buildProfileContext(Long userId) {`n        return userProfileRepository.findByUserId(userId).map(p ->"
    if ($c.Contains($startOld)) {
        $startNew = "    private String buildProfileContext(Long userId) {`n        String base = userProfileRepository.findByUserId(userId).map(p ->"
        $c = $c.Replace($startOld, $startNew)
        Write-Host "6c-start: patched"
    } else {
        Write-Host "6c-start: WARNING anchor not found"
    }
} else {
    Write-Host "6c-start: already present, skipped"
}

# 6c-end: insert resumeCtx logic before buildSystemPrompt method (idempotent)
if ($c -notmatch [regex]::Escape("resumeUploadRepository.findTopByUserIdOrderByUploadedAtDesc")) {
    $endOld = "    }`n`n    private String buildSystemPrompt(String name, String profileContext) {"
    if ($c.Contains($endOld)) {
        $endNew = "`n        String resumeCtx = resumeUploadRepository.findTopByUserIdOrderByUploadedAtDesc(userId)`n                .map(r -> ""`n`nResume on file (\""" + "`" + r.getFileName() + `"`"), extracted text:`n" + "`" + r.getExtractedText())`n                .orElse("""");`n`n        return base + resumeCtx;`n    }`n`n    private String buildSystemPrompt(String name, String profileContext) {"
        $c = $c.Replace($endOld, $endNew)
        Write-Host "6c-end: patched"
    } else {
        Write-Host "6c-end: WARNING anchor not found"
    }
} else {
    Write-Host "6c-end: already present, skipped"
}

# 6d: add uploadAndAnalyzeResume method (idempotent)
if ($c -notmatch [regex]::Escape("public com.careersetu.dto.ai.ResumeAnalysisResponse uploadAndAnalyzeResume")) {
    $oldTail = "    /** Public helper used by ResumeBuilderController */`n    public com.careersetu.dto.ai.AiChatResponse reviewResumeViaAi(String prompt) {`n        String reply = callAiApi(singleTurn(`n                ""You are an expert ATS resume reviewer for the Indian job market."", prompt));`n        return com.careersetu.dto.ai.AiChatResponse.builder().reply(reply).build();`n    }`n`n}"
    if ($c.Contains($oldTail)) {
        $newMethodBody = @'

    @Transactional
    public com.careersetu.dto.ai.ResumeAnalysisResponse uploadAndAnalyzeResume(Long userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        if (file == null || file.isEmpty())
            throw new BadRequestException("Please attach a resume file.");
        if (file.getSize() > 5 * 1024 * 1024)
            throw new BadRequestException("File too large. Max size is 5MB.");

        String text;
        try {
            text = resumeTextExtractor.extract(file);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException(e.getMessage());
        } catch (Exception e) {
            log.error("Resume extraction failed: {}", e.getMessage());
            throw new BadRequestException("Could not read this file. Please upload a valid PDF or DOCX.");
        }

        if (text == null || text.isBlank())
            throw new BadRequestException("No readable text found in this file.");

        String trimmed = text.length() > 6000 ? text.substring(0, 6000) : text;

        ResumeUpload resume = ResumeUpload.builder()
                .user(user).fileName(file.getOriginalFilename()).extractedText(trimmed)
                .build();
        resume = resumeUploadRepository.save(resume);

        String profile = buildProfileContext(userId);
        String prompt = String.format("""
                Analyse this student's resume and profile in detail.
                Student profile (includes resume text): %s

                Provide:
                1. Overall impression (strengths & weaknesses)
                2. Key skills detected in the resume
                3. Best-fit career paths based on this resume (top 3, ranked)
                4. A personalised step-by-step career roadmap for the top recommendation
                5. What to add or improve in the resume itself
                Be specific to the Indian job market.
                """, profile);

        String reply = callAiApi(singleTurn(
                "You are CareerSetu's AI Career Advisor. You read resumes carefully and give precise, actionable career guidance.",
                prompt));

        return com.careersetu.dto.ai.ResumeAnalysisResponse.builder()
                .resumeId(resume.getId()).fileName(resume.getFileName()).reply(reply).build();
    }

}
'@
        $newMethodBody = $newMethodBody -replace "`r`n", "`n"
        $newTail = $oldTail.Substring(0, $oldTail.Length - 2) + $newMethodBody.TrimStart("`n")
        $c = $c.Replace($oldTail, $newTail)
        Write-Host "6d: uploadAndAnalyzeResume added"
    } else {
        Write-Host "6d: WARNING tail anchor not found"
    }
} else {
    Write-Host "6d: method already present, skipped"
}

Write-Utf8NoBom $p $c
Write-Host "6. AiService.java patch attempt complete"