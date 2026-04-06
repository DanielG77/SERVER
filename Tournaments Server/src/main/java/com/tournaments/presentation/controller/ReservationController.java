package com.tournaments.presentation.controller;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tournaments.application.service.ReservationService;
import com.tournaments.domain.model.Payment;
import com.tournaments.domain.model.TicketReservation;
import com.tournaments.infrastructure.security.CustomUserDetails;
import com.tournaments.presentation.dto.PaymentDTO;
import com.tournaments.presentation.dto.TicketReservationDTO;
import com.tournaments.presentation.mapper.PaymentMapper;
import com.tournaments.presentation.mapper.TicketReservationMapper;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Reservations", description = "Endpoints for managing ticket reservations and payments")
@SecurityRequirement(name = "bearerAuth")
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping("/tournaments/{tournamentId}/reservations")
    @Operation(summary = "Create a ticket reservation for a tournament")
    public ResponseEntity<TicketReservationDTO> createReservation(
            @PathVariable UUID tournamentId,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        TicketReservation reservation = reservationService.createReservation(tournamentId, currentUser.getId());
        return new ResponseEntity<>(TicketReservationMapper.toDto(reservation), HttpStatus.CREATED);
    }

    @PostMapping("/reservations/{reservationId}/payments")
    @Operation(summary = "Create a payment for a reservation")
    public ResponseEntity<PaymentDTO> createPayment(
            @PathVariable UUID reservationId,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Payment payment = reservationService.createPayment(reservationId, currentUser.getId());
        return ResponseEntity.ok(PaymentMapper.toDto(payment));
    }

    @GetMapping("/reservations/{reservationId}")
    @Operation(summary = "Get a specific reservation by its ID")
    public ResponseEntity<TicketReservationDTO> getReservationById(
            @PathVariable UUID reservationId,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        TicketReservation reservation = reservationService.getReservationByIdForUser(reservationId, currentUser.getId());
        return ResponseEntity.ok(TicketReservationMapper.toDto(reservation));
    }

    @GetMapping("/reservations")
    @Operation(summary = "Get all reservations for the current user")
    public ResponseEntity<List<TicketReservationDTO>> getUserReservations(
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        List<TicketReservation> reservations = reservationService.getReservationsForUser(currentUser.getId());
        List<TicketReservationDTO> reservationDTOs = reservations.stream()
                .map(TicketReservationMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(reservationDTOs);
    }
}
