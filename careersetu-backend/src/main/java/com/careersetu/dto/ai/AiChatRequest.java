package com.careersetu.dto.ai;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AiChatRequest {
    @NotBlank(message = "Message is required")
    private String message;

    private Long conversationId; // null = new conversation
}
