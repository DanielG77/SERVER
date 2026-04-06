package com.tournaments.application.usecase;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tournaments.domain.model.TicketReservation;
import com.tournaments.domain.repository.TicketReservationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetReservationsByUserUseCase {

    private final TicketReservationRepository ticketReservationRepository;

    @Transactional(readOnly = true)
    public List<TicketReservation> execute(Long userId) {
        return ticketReservationRepository.findByUserId(userId);
    }
}
