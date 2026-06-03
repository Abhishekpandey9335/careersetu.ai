package com.careersetu.service;

import com.careersetu.dto.exam.*;
import com.careersetu.entity.*;
import com.careersetu.exception.BadRequestException;
import com.careersetu.exception.ResourceNotFoundException;
import com.careersetu.repository.ExamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamService {

    private final ExamRepository examRepository;

    public Page<ExamSummaryDto> searchExams(Exam.ExamCategory category,
                                            Exam.ExamStatus status,
                                            String search,
                                            int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size);
        String categoryStr = (category != null) ? category.name() : null;
        String statusStr = (status != null) ? status.name() : null;
        return examRepository.searchExams(categoryStr, statusStr, search, pageable)
                .map(this::toSummaryDto);
    }

    public ExamDetailDto getBySlug(String slug) {
        Exam exam = examRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Exam", "slug", slug));
        return toDetailDto(exam);
    }

    public List<ExamSummaryDto> checkEligibility(EligibilityRequest req) {
        return examRepository.findEligibleExams(req.getAge(), null, null, req.getQualification())
                .stream()
                .filter(e -> req.getStream() == null || isStreamAllowed(e, req.getStream()))
                .map(this::toSummaryDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ExamDetailDto createExam(CreateExamRequest req) {
        if (examRepository.findBySlug(req.getSlug()).isPresent()) {
            throw new BadRequestException("Exam with slug '" + req.getSlug() + "' already exists");
        }

        Exam exam = Exam.builder()
                .name(req.getName()).slug(req.getSlug())
                .category(req.getCategory()).conductingBody(req.getConductingBody())
                .minAge(req.getMinAge()).maxAge(req.getMaxAge())
                .minQualification(req.getMinQualification())
                .allowedStreams(req.getAllowedStreams())
                .categoryRelaxations(req.getCategoryRelaxations())
                .vacancy(req.getVacancy())
                .formStart(req.getFormStart()).formEnd(req.getFormEnd())
                .examDate(req.getExamDate()).resultDate(req.getResultDate())
                .officialNotificationUrl(req.getOfficialNotificationUrl())
                .officialApplyUrl(req.getOfficialApplyUrl())
                .logoUrl(req.getLogoUrl())
                .salaryMin(req.getSalaryMin()).salaryMax(req.getSalaryMax())
                .applicationFeeGeneral(req.getApplicationFeeGeneral())
                .applicationFeeReserved(req.getApplicationFeeReserved())
                .build();
        exam = examRepository.save(exam);

        ExamDetail detail = ExamDetail.builder()
                .exam(exam)
                .syllabusJson(req.getSyllabusJson())
                .selectionProcessJson(req.getSelectionProcessJson())
                .eligibilityJson(req.getEligibilityJson())
                .salaryJson(req.getSalaryJson())
                .booksJson(req.getBooksJson())
                .preparationTips(req.getPreparationTips())
                .previousCutoffs(req.getPreviousCutoffs())
                .faq(req.getFaq())
                .build();
        exam.setDetail(detail);
        examRepository.save(exam);

        return toDetailDto(exam);
    }

    @Transactional
    public ExamSummaryDto updateStatus(Long examId, Exam.ExamStatus status) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam", examId));
        exam.setStatus(status);
        return toSummaryDto(examRepository.save(exam));
    }

    public List<ExamSummaryDto> getLatest(int limit) {
        return examRepository.findTop5ByOrderByCreatedAtDesc()
                .stream().map(this::toSummaryDto).collect(Collectors.toList());
    }

    // -------- mappers --------

    private boolean isStreamAllowed(Exam e, String stream) {
        if (e.getAllowedStreams() == null || e.getAllowedStreams().isEmpty()) return true;
        return e.getAllowedStreams().stream()
                .anyMatch(s -> s.equalsIgnoreCase(stream));
    }

    public ExamSummaryDto toSummaryDto(Exam e) {
        ExamSummaryDto dto = new ExamSummaryDto();
        dto.setId(e.getId()); dto.setName(e.getName()); dto.setSlug(e.getSlug());
        dto.setCategory(e.getCategory()); dto.setConductingBody(e.getConductingBody());
        dto.setVacancy(e.getVacancy()); dto.setFormStart(e.getFormStart());
        dto.setFormEnd(e.getFormEnd()); dto.setExamDate(e.getExamDate());
        dto.setStatus(e.getStatus()); dto.setLogoUrl(e.getLogoUrl());
        dto.setSalaryMin(e.getSalaryMin()); dto.setSalaryMax(e.getSalaryMax());
        dto.setMinQualification(e.getMinQualification());
        dto.setApplicationFeeGeneral(e.getApplicationFeeGeneral());
        dto.setOfficialApplyUrl(e.getOfficialApplyUrl());
        dto.setCreatedAt(e.getCreatedAt());
        return dto;
    }

    private ExamDetailDto toDetailDto(Exam e) {
        ExamDetailDto dto = new ExamDetailDto();
        dto.setId(e.getId()); dto.setName(e.getName()); dto.setSlug(e.getSlug());
        dto.setCategory(e.getCategory()); dto.setConductingBody(e.getConductingBody());
        dto.setMinAge(e.getMinAge()); dto.setMaxAge(e.getMaxAge());
        dto.setMinQualification(e.getMinQualification());
        dto.setAllowedStreams(e.getAllowedStreams());
        dto.setCategoryRelaxations(e.getCategoryRelaxations());
        dto.setVacancy(e.getVacancy()); dto.setFormStart(e.getFormStart());
        dto.setFormEnd(e.getFormEnd()); dto.setExamDate(e.getExamDate());
        dto.setResultDate(e.getResultDate()); dto.setStatus(e.getStatus());
        dto.setOfficialNotificationUrl(e.getOfficialNotificationUrl());
        dto.setOfficialApplyUrl(e.getOfficialApplyUrl());
        dto.setLogoUrl(e.getLogoUrl());
        dto.setSalaryMin(e.getSalaryMin()); dto.setSalaryMax(e.getSalaryMax());
        dto.setApplicationFeeGeneral(e.getApplicationFeeGeneral());
        dto.setApplicationFeeReserved(e.getApplicationFeeReserved());
        if (e.getDetail() != null) {
            ExamDetail d = e.getDetail();
            dto.setSyllabusJson(d.getSyllabusJson());
            dto.setSelectionProcessJson(d.getSelectionProcessJson());
            dto.setEligibilityJson(d.getEligibilityJson());
            dto.setSalaryJson(d.getSalaryJson());
            dto.setBooksJson(d.getBooksJson());
            dto.setPreparationTips(d.getPreparationTips());
            dto.setPreviousCutoffs(d.getPreviousCutoffs());
            dto.setFaq(d.getFaq());
        }
        return dto;
    }

    public java.util.List<com.careersetu.dto.exam.ExamSummaryDto> getCalendar(int year, int month) {
        java.time.LocalDate start = java.time.LocalDate.of(year, month, 1);
        java.time.LocalDate end   = start.withDayOfMonth(start.lengthOfMonth());
        return examRepository.findAll().stream()
                .filter(e -> isInRange(e, start, end))
                .map(this::toSummaryDto)
                .toList();
    }

    public java.util.List<com.careersetu.dto.exam.ExamSummaryDto> getUpcoming(int days) {
        java.time.LocalDate today = java.time.LocalDate.now();
        java.time.LocalDate until = today.plusDays(days);
        return examRepository.findAll().stream()
                .filter(e -> isInRange(e, today, until))
                .map(this::toSummaryDto)
                .toList();
    }

    private boolean isInRange(com.careersetu.entity.Exam e, java.time.LocalDate start, java.time.LocalDate end) {
        return (e.getFormStart() != null && !e.getFormStart().isBefore(start) && !e.getFormStart().isAfter(end))
            || (e.getFormEnd()   != null && !e.getFormEnd().isBefore(start)   && !e.getFormEnd().isAfter(end))
            || (e.getExamDate()  != null && !e.getExamDate().isBefore(start)  && !e.getExamDate().isAfter(end));
    }

}
