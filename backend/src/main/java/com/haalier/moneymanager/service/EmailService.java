package com.haalier.moneymanager.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamSource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromName;

    public void sendEmail(String to, String subject, String body) throws MessagingException {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromName);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Error while sending mail: " + e.getMessage());
        }
    }

    public void sendEmailWithAttachment(String to, String subject, String body, byte[] attachmentBytes,
                                        String fileName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromName);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);
            helper.addAttachment(fileName, new ByteArrayResource(attachmentBytes));

            mailSender.send(message);
        } catch (MessagingException e) {
            log.error("Failed to send email with attachment", e);
            throw new RuntimeException("Error while sending mail with attachment: " + e.getMessage());
        }
    }
}
