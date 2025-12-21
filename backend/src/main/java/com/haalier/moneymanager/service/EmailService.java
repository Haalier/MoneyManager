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
        Resend resend = new Resend(apiKey);
        CreateEmailOptions params =
                CreateEmailOptions.builder().from("onboarding@resend.dev").to(toEmail).subject(subject).html(body).build();

        try {
            CreateEmailResponse data = resend.emails().send(params);
            System.out.println(data.getId());
        } catch (ResendException ex) {
            log.error("Exception while sending email", ex);
            ex.printStackTrace();
            throw new RuntimeException("Email sending failed", ex);
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
