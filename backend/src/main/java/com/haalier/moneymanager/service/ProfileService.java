package com.haalier.moneymanager.service;

import com.haalier.moneymanager.dto.AuthDTO;
import com.haalier.moneymanager.dto.NotificationSettingsDTO;
import com.haalier.moneymanager.dto.ProfileDTO;
import com.haalier.moneymanager.entity.ProfileEntity;
import com.haalier.moneymanager.repository.ProfileRepository;
import com.haalier.moneymanager.util.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public record AuthResponse(ResponseCookie cookie, ProfileDTO user) {
    }

    @Value("${app.activation.url}")
    private String activationURL;

    @Transactional
    public ProfileDTO registerProfile(ProfileDTO profileDTO) {

        if (profileRepository.existsByEmail(profileDTO.getEmail())) {
            throw new RuntimeException("Email already exists.");
        }

        ProfileEntity newProfile = toEntity(profileDTO);
        newProfile.setActivationToken(UUID.randomUUID().toString());

        newProfile = profileRepository.save(newProfile);

        try {
            String activationLink = activationURL + "/api/v1.0/activate?token=" + newProfile.getActivationToken();
            String subject = "Money Manager Account Activation";
            String body = buildActivationLink(newProfile.getFullName(), activationLink);
            emailService.sendEmail(newProfile.getEmail(), subject, body);
            return toDTO(newProfile);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send activation email. Please try again later.");
        }
    }

    private String buildActivationLink(String fullName, String activationLink) {
        return """
                <html>
                <body>
                    <h2>Welcome to Money Manager, %s!</h2>
                    <p>Please click the button below to activate your account:</p>
                    <a href="%s" style="display:inline-block;padding:10px 20px;background-color:#4CAF50;color:#fff;text-decoration:none;border-radius:5px;font-weight:bold;">
                        Activate Account
                    </a>
                    <p>Or copy this link: <a href="%s">%s</a></p>
                    <p>This link will expire in 24 hours.</p>
                    <br>
                    <p>Thanks,<br>Money Manager Team</p>
                </body>
                </html>
                """.formatted(fullName, activationLink, activationLink, activationLink);
    }

    public ProfileEntity toEntity(ProfileDTO profileDTO) {
        return ProfileEntity.builder().id(profileDTO.getId()).fullName(profileDTO.getFullName())
                .email(profileDTO.getEmail()).password(passwordEncoder.encode(profileDTO.getPassword()))
                .profileImageURL(profileDTO.getProfileImageURL())
                .createdAt(profileDTO.getCreatedAt()).updatedAt(profileDTO.getUpdatedAt()).build();
    }

    public ProfileDTO toDTO(ProfileEntity profileEntity) {
        return ProfileDTO.builder().id(profileEntity.getId()).fullName(profileEntity.getFullName())
                .email(profileEntity.getEmail())
                .profileImageURL(profileEntity.getProfileImageURL())
                .createdAt(profileEntity.getCreatedAt()).updatedAt(profileEntity.getUpdatedAt()).build();
    }

    public boolean activateProfile(String activationToken) {
        return profileRepository.findByActivationToken(activationToken).map((ProfileEntity profile) -> {
            profile.setIsActive(true);
            profileRepository.save(profile);
            return true;
        }).orElse(false);
    }

    public boolean isAccountActive(String email) {
        return profileRepository.findByEmail(email).map(ProfileEntity::getIsActive).orElse(false);
    }

    public ProfileEntity getCurrentProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assert authentication != null;
        String email = authentication.getName();
        return profileRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    public ProfileDTO getPublicProfile(String email) {
        ProfileEntity currentUser = null;

        if (email == null) {
            currentUser = getCurrentProfile();
        } else {
            currentUser = profileRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        }

        return ProfileDTO.builder().id(currentUser.getId()).fullName(currentUser.getFullName())
                .email(currentUser.getEmail()).profileImageURL(currentUser.getProfileImageURL())
                .createdAt(currentUser.getCreatedAt())
                .updatedAt(currentUser.getUpdatedAt()).build();
    }

    public AuthResponse authenticateAndGenerateToken(AuthDTO authDTO) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authDTO.getEmail(),
                    authDTO.getPassword()));

            String token = jwtUtil.generateToken(authDTO.getEmail());

            ResponseCookie cookie = ResponseCookie.from("token", token)
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .maxAge(60 * 60 * 24)
                    .sameSite("None")
                    .partitioned(true)
                    .build();

            ProfileDTO user = getPublicProfile(authDTO.getEmail());

            return new AuthResponse(cookie, user);

        } catch (Exception e) {
            throw new RuntimeException("Invalid email or password.");
        }
    }

    @Transactional
    public void updateNotificationSettings(NotificationSettingsDTO dto) {
        ProfileEntity profile = getCurrentProfile();
        profile.setDailyReminderEnabled(dto.isDailyReminderEnabled());
        profile.setDailySummaryEnabled(dto.isDailySummaryEnabled());
    }
}
