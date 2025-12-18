package com.haalier.moneymanager.service;

import com.haalier.moneymanager.dto.AuthDTO;
import com.haalier.moneymanager.dto.ProfileDTO;
import com.haalier.moneymanager.entity.ProfileEntity;
import com.haalier.moneymanager.repository.ProfileRepository;
import com.haalier.moneymanager.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Value("${app.activation.url}")
    private String activationURL;

    public ProfileDTO registerProfile(ProfileDTO profileDTO) {
        ProfileEntity newProfile = toEntity(profileDTO);
        newProfile.setActivationToken(UUID.randomUUID().toString());
        newProfile = profileRepository.save(newProfile);
        // Send activation email
        String activationLink = activationURL + "/api/v1.0/activate?token=" + newProfile.getActivationToken();
        String subject = "Money Manager Account Activation";
        String body = "Please click the link below to activate your account: " + activationLink;

        emailService.sendEmail(newProfile.getEmail(), subject, body);
        return toDTO(newProfile);
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

    public Map<String, Object> authenticateAndGenerateToken(AuthDTO authDTO) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authDTO.getEmail(),
                    authDTO.getPassword()));

            String token = jwtUtil.generateToken(authDTO.getEmail());
            return Map.of("token", token, "user", getPublicProfile(authDTO.getEmail()));

        } catch (Exception e) {
            throw new RuntimeException("Invalid email or password.");
        }
    }
}
