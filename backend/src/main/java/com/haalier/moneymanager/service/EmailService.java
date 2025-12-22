package com.haalier.moneymanager.service;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    @Value("${resend.api.key}")
    private String apiKey;

//    @Value("${resend.from.email}")
//    private String fromEmail;

    @Value("${resend.from.name}")
    private String fromName;

    public void sendEmail(String toEmail, String subject, String body) {
        log.info("=== EMAIL SERVICE START ===");
        log.info("Sending to: {}", toEmail);
        log.info("From: {}", fromName);
        log.info("Subject: {}", subject);
        log.info("API Key present: {}", apiKey != null && !apiKey.isEmpty());
        log.info("API Key starts with 're': {}", apiKey != null && apiKey.startsWith("re"));

        if (apiKey == null || apiKey.isEmpty() || apiKey.startsWith("${")) {
            log.error("CRITICAL: RESEND_API_KEY is not configured!");
            log.error("API Key value: {}", apiKey);
            throw new RuntimeException("Email service not configured - API key missing");
        }


        try {
            log.info("Creating Resend client");
            Resend resend = new Resend(apiKey);

            log.info("Building email params");
            CreateEmailOptions params =
                    CreateEmailOptions.builder().from("onboarding@resend.dev").to(toEmail).subject(subject).html(body)
                            .build();

            log.info("Sending email");
            CreateEmailResponse data = resend.emails().send(params);

            log.info("Email sent. Message ID: {}", data.getId());
            log.info("=== EMAIL SERVICE END ===");
        } catch (ResendException ex) {
            log.error("=== RESEND EXCEPTION ===");
            log.error("Status Code: {}", ex.getStatusCode());
            log.error("Error Name: {}", ex.getErrorName());
            log.error("Error Message: {}", ex.getMessage());
            log.error("Full exception: ", ex);
            log.error("=========================");
            throw new RuntimeException("Resend API error: " + ex.getMessage(), ex);
        } catch (Exception ex) {
            log.error("=== UNEXPECTED EXCEPTION ===");
            log.error("Exception type: {}", ex.getClass().getName());
            log.error("Error message: {}", ex.getMessage());
            log.error("Full exception: ", ex);
            log.error("============================");
            throw new RuntimeException("Email sending failed: " + ex.getMessage(), ex);
        }
    }
//    private final JavaMailSender mailSender;

//    public void sendEmail(String to, String subject, String body) {
//        try{
//            SimpleMailMessage message = new SimpleMailMessage();
//            message.setFrom(fromEmail);
//            message.setTo(to);
//            message.setSubject(subject);
//            message.setText(body);
//            mailSender.send(message);
//        }catch (Exception e) {
//            throw new RuntimeException(e.getMessage());
//        }
//    }
}
