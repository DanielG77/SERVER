package com.tournaments.domain.repository;

import com.tournaments.domain.model.User;

public interface AuthenticationServicePort {

    User getCurrentUser();
}