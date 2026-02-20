package com.tournaments.application.service;


import com.tournaments.presentation.request.AuthResponse;
import com.tournaments.presentation.request.LoginRequest;
import com.tournaments.presentation.request.RegisterRequest;

public interface AuthService {

    AuthResponse login(LoginRequest request);

    AuthResponse register(RegisterRequest request);
    
    void logout(String bearerToken);
}
