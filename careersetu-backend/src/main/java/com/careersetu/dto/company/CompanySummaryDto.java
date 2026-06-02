package com.careersetu.dto.company;

import lombok.Data;
import java.util.List;

@Data
public class CompanySummaryDto {
    private Long id;
    private String name;
    private String slug;
    private String industry;
    private Integer foundedYear;
    private String hq;
    private Integer avgPackageFresher;
    private String website;
    private String logoUrl;
}
