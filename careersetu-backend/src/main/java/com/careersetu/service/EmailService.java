package com.careersetu.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

/**
 * Email service for sending notifications via Spring Mail (Gmail SMTP / SendGrid).
 * All methods are @Async — fire and forget, non-blocking.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@careersetu.in}")
    private String fromEmail;

    /** Generic HTML email */
    @Async
    public void sendHtml(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, "CareerSetu");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
            log.info("Email sent to {}: {}", to, subject);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    /** Exam deadline reminder email */
    @Async
    public void sendDeadlineReminder(String to, String userName, String examName,
                                      String lastDate, String applyUrl) {
        String html = String.format("""
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
                  <div style="background:#1a56db;color:white;padding:16px 20px;border-radius:8px 8px 0 0">
                    <h2 style="margin:0">⏰ CareerSetu — Exam Deadline Alert</h2>
                  </div>
                  <div style="background:#f9fafb;padding:20px;border:1px solid #e5e7eb;border-radius:0 0 8px 8px">
                    <p>Hi <strong>%s</strong>,</p>
                    <p>The application form for <strong>%s</strong> closes on <strong>%s</strong>.</p>
                    <p style="color:#dc2626;font-weight:bold">⚠️ Only 3 days remaining!</p>
                    <a href="%s" style="display:inline-block;background:#1a56db;color:white;padding:12px 24px;
                       border-radius:6px;text-decoration:none;margin:16px 0">Apply Now →</a>
                    <p style="color:#6b7280;font-size:12px;margin-top:20px">
                      You are receiving this because you registered on CareerSetu.
                    </p>
                  </div>
                </div>
                """, userName, examName, lastDate, applyUrl);
        sendHtml(to, "⏰ Last 3 Days: " + examName + " Application Deadline", html);
    }

    /** New exam form open email */
    @Async
    public void sendNewFormOpen(String to, String userName, String examName,
                                 String lastDate, String vacancies, String applyUrl) {
        String html = String.format("""
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
                  <div style="background:#059669;color:white;padding:16px 20px;border-radius:8px 8px 0 0">
                    <h2 style="margin:0">📋 New Form Open: %s</h2>
                  </div>
                  <div style="background:#f9fafb;padding:20px;border:1px solid #e5e7eb;border-radius:0 0 8px 8px">
                    <p>Hi <strong>%s</strong>,</p>
                    <p>A new application form is now open:</p>
                    <ul>
                      <li><strong>Exam:</strong> %s</li>
                      <li><strong>Vacancies:</strong> %s</li>
                      <li><strong>Last Date:</strong> %s</li>
                    </ul>
                    <a href="%s" style="display:inline-block;background:#059669;color:white;padding:12px 24px;
                       border-radius:6px;text-decoration:none;margin:16px 0">View & Apply →</a>
                  </div>
                </div>
                """, examName, userName, examName, vacancies, lastDate, applyUrl);
        sendHtml(to, "📋 New Form Open: " + examName, html);
    }

    /** Welcome email after registration */
    @Async
    public void sendWelcomeEmail(String to, String userName) {
        String html = String.format("""
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
                  <div style="background:#1a56db;color:white;padding:24px;border-radius:8px 8px 0 0;text-align:center">
                    <h1 style="margin:0">Welcome to CareerSetu! 🎉</h1>
                    <p style="opacity:0.9">India's AI-Powered Career Operating System</p>
                  </div>
                  <div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;border-radius:0 0 8px 8px">
                    <p>Hi <strong>%s</strong>,</p>
                    <p>You're now part of CareerSetu — the platform that helps every Indian student find their best career path.</p>
                    <p><strong>What to do next:</strong></p>
                    <ol>
                      <li>Complete your profile (Education, Skills, Goal)</li>
                      <li>Use the Eligibility Checker to find your best exams</li>
                      <li>Chat with our AI Career Advisor for personalised guidance</li>
                    </ol>
                    <p style="color:#6b7280;font-size:12px">Best of luck with your career journey! 🚀</p>
                  </div>
                </div>
                """, userName);
        sendHtml(to, "Welcome to CareerSetu! 🎉", html);
    }

    /** Premium activation email */
    @Async
    public void sendPremiumActivated(String to, String userName, String plan, String expiryDate) {
        String html = String.format("""
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
                  <div style="background:#7c3aed;color:white;padding:24px;border-radius:8px 8px 0 0;text-align:center">
                    <h1 style="margin:0">⭐ Premium Activated!</h1>
                  </div>
                  <div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;border-radius:0 0 8px 8px">
                    <p>Hi <strong>%s</strong>,</p>
                    <p>Your <strong>%s</strong> plan is now active until <strong>%s</strong>.</p>
                    <p><strong>Your Premium benefits:</strong></p>
                    <ul>
                      <li>✅ Unlimited AI Career Advisor queries</li>
                      <li>✅ Company Readiness Score for all companies</li>
                      <li>✅ Premium study materials</li>
                      <li>✅ AI Mock Interviews</li>
                      <li>✅ ATS Resume Review</li>
                      <li>✅ Ad-free experience</li>
                    </ul>
                  </div>
                </div>
                """, userName, plan, expiryDate);
        sendHtml(to, "⭐ CareerSetu Premium Activated!", html);
    }
}
