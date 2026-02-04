package com.tournaments;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.tournaments.infrastructure.persistence.repositories.jpa")
public class TournamentsApplication {
    public static void main(String[] args) {
        SpringApplication.run(TournamentsApplication.class, args);
    }
}
