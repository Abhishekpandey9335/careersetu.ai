package com.careersetu.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AiChatResponse {
    private Long conversationId;
    private String reply;
    private String conversationTitle;
}
