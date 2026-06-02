package com.careersetu.util;

import com.careersetu.exception.BadRequestException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public class SecurityUtil {

    private SecurityUtil() {}

    /**
     * Returns the email (username) of the currently authenticated user.
     * Controllers resolve userId by calling:
     *   userRepository.findByEmail(SecurityUtil.getCurrentEmail()).orElseThrow().getId()
     */
    public static String getCurrentEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new BadRequestException("Not authenticated");
        }
        Object principal = auth.getPrincipal();
        if (principal instanceof UserDetails userDetails) {
            return userDetails.getUsername();
        }
        if (principal instanceof String email) {
            return email;
        }
        throw new BadRequestException("Unable to extract user identity");
    }
}
