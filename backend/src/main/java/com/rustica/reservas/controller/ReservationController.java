package com.rustica.reservas.controller;


import com.rustica.reservas.dto.ReservationRequest;
import com.rustica.reservas.entity.Reservation;
import com.rustica.reservas.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;


@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:5173")
public class ReservationController {

    private final ReservationService reservationService;


    public ReservationController(ReservationService reservationService) {

        this.reservationService = reservationService;

    }

    @PostMapping
    public ResponseEntity<Reservation> createReservation(@Valid @RequestBody ReservationRequest request) {
        Reservation createdReservation = reservationService.createReservation(
                request.getDate(),
                request.getCreationDate(),
                request.getProductId(),
                request.getUserId()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(createdReservation);
    }


    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() {
        List<Reservation> reservations = reservationService.getAllReservations();
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reservation > getUserById(@PathVariable Long id) {
        Reservation reservation = reservationService.getReservationById(id);
        return ResponseEntity.ok(reservation);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Reservation>> getReservationsByUser(@PathVariable Long userId) {
        List<Reservation> reservations = reservationService.getReservationsByUserId(userId);
        return ResponseEntity.ok(reservations);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reservation> updateReservation(
            @PathVariable Long id,
            @RequestBody Reservation reservation) {
        Reservation updateReservation = reservationService.updateReservation(
                id,
                reservation.getDate(),
                reservation.getProduct(),
                reservation.getUser()

        );
        return ResponseEntity.ok(updateReservation);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<LocalDate>> getReservedDates(@PathVariable Long productId) {
        return ResponseEntity.ok(reservationService.getReservedDatesByProductId(productId));
    }



}