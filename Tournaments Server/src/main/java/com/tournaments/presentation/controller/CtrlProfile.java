package com.tournaments.presentation.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tournaments.application.dto.ProfileDto;
import com.tournaments.application.usecase.FollowProfileUseCase;
import com.tournaments.application.usecase.GetProfileUseCase;
import com.tournaments.application.usecase.UnfollowProfileUseCase;
import com.tournaments.infrastructure.security.CustomUserDetails;
import com.tournaments.presentation.serializer.ProfileSerializer;

@RestController
@RequestMapping("/api/profiles")
public class CtrlProfile {

    private final GetProfileUseCase getProfileUseCase;
    private final FollowProfileUseCase followProfileUseCase;
    private final UnfollowProfileUseCase unfollowProfileUseCase;

    public CtrlProfile(GetProfileUseCase getProfileUseCase, FollowProfileUseCase followProfileUseCase, UnfollowProfileUseCase unfollowProfileUseCase) {
        this.getProfileUseCase = getProfileUseCase;
        this.followProfileUseCase = followProfileUseCase;
        this.unfollowProfileUseCase = unfollowProfileUseCase;
    }

    @GetMapping("/{username}")
    public ResponseEntity<?> getProfile(@PathVariable String username, 
                                        @AuthenticationPrincipal UserDetails userDetails) {
        Long currentUserId = null;
        if (userDetails instanceof CustomUserDetails) {
            currentUserId = ((CustomUserDetails) userDetails).getId();
        }
        ProfileDto profile = getProfileUseCase.execute(username, currentUserId);
        return ResponseEntity.ok(ProfileSerializer.serialize(profile));
    }

    @PostMapping("/{username}/follow")
    public ResponseEntity<?> followProfile(@PathVariable String username, 
                                        @AuthenticationPrincipal UserDetails userDetails) {
        // Aquí userDetails nunca es null porque el endpoint requiere autenticación
        Long currentUserId = ((CustomUserDetails) userDetails).getId();
        followProfileUseCase.execute(username, currentUserId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{username}/unfollow")
    public ResponseEntity<?> unfollowProfile(@PathVariable String username, 
                                            @AuthenticationPrincipal UserDetails userDetails) {
        Long currentUserId = ((CustomUserDetails) userDetails).getId();
        unfollowProfileUseCase.execute(username, currentUserId);
        return ResponseEntity.ok().build();
    }
}