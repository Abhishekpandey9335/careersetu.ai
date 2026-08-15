package com.careersetu.service;

import com.careersetu.dto.studymaterial.StudyMaterialDto;
import com.careersetu.entity.*;
import com.careersetu.exception.BadRequestException;
import com.careersetu.exception.ResourceNotFoundException;
import com.careersetu.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StudyMaterialService {

    private final StudyMaterialRepository studyMaterialRepository;
    private final UserRepository userRepository;

    public Page<StudyMaterialDto> filter(StudyMaterial.MaterialType type,
                                          Boolean premium, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "downloadsCount"));
        return studyMaterialRepository.filterMaterials(type, premium, pageable)
                .map(this::toDto);
    }

    @Transactional
    public StudyMaterialDto getById(Long id, Long userId) {
        StudyMaterial material = studyMaterialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("StudyMaterial", id));

        if (material.isPremium()) {
            if (userId == null) throw new BadRequestException("Login required to access premium material");
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", userId));
            if (!user.isPremium())
                throw new BadRequestException("Active premium subscription required for this material");
        }
        material.setDownloadsCount(material.getDownloadsCount() + 1);
        studyMaterialRepository.save(material);
        return toDto(material);
    }

    @Transactional
    public StudyMaterialDto create(String title, String subject,
                                    StudyMaterial.MaterialType type, String fileUrl,
                                    boolean isPremium, Long uploadedById) {
        User uploader = userRepository.findById(uploadedById)
                .orElseThrow(() -> new ResourceNotFoundException("User", uploadedById));

        StudyMaterial m = StudyMaterial.builder()
                .title(title).subject(subject).type(type)
                .fileUrl(fileUrl).isPremium(isPremium).uploadedBy(uploader).build();
        return toDto(studyMaterialRepository.save(m));
    }

    @Transactional
    public void delete(Long id) {
        if (!studyMaterialRepository.existsById(id))
            throw new ResourceNotFoundException("StudyMaterial", id);
        studyMaterialRepository.deleteById(id);
    }

    private StudyMaterialDto toDto(StudyMaterial m) {
        StudyMaterialDto dto = new StudyMaterialDto();
        dto.setId(m.getId()); dto.setTitle(m.getTitle());
        dto.setSubject(m.getSubject()); dto.setType(m.getType());
        dto.setFileUrl(m.getFileUrl()); dto.setPremium(m.isPremium());
        dto.setDownloadsCount(m.getDownloadsCount()); dto.setCreatedAt(m.getCreatedAt());
        return dto;
    }
}
