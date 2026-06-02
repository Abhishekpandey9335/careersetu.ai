package com.careersetu.dto.subscription;

import com.careersetu.entity.Subscription;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateOrderRequest {
    @NotNull
    private Subscription.Plan plan;
}
