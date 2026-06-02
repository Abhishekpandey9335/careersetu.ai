package com.careersetu.dto.studymaterial;

import com.careersetu.entity.StudyMaterial;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class StudyMaterialDto {
    private Long id;
    private String title;
    private Long examId;
    private String examName;
    private String subject;
    private StudyMaterial.MaterialType type;
    private String fileUrl;
    private boolean isPremium;
    private Integer downloadsCount;
    private LocalDateTime createdAt;
}
