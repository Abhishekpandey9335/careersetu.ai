package com.careersetu.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AuthResponse {
    private Long userId;
    private String name;
    private String email;
    private String role;
    private boolean isPremium;
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
}
