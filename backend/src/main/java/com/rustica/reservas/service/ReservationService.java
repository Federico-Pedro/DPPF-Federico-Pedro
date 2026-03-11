package com.rustica.reservas.service;


import com.rustica.reservas.entity.Product;
import com.rustica.reservas.entity.Reservation;
import com.rustica.reservas.entity.User;
import com.rustica.reservas.exception.UserAlreadyExistsException;
import com.rustica.reservas.repository.ProductRepository;
import com.rustica.reservas.repository.ReservationRepository;
import com.rustica.reservas.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ReservationService(ReservationRepository reservationRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.reservationRepository = reservationRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;

    }

    public Reservation createReservation(LocalDate date, Long productId, Long userId) {

        if (reservationRepository.existsByDate(date)) {
            throw new UserAlreadyExistsException("Esta fecha ya se encuentra reservada");
        }

        Reservation newReservation = new Reservation();
        newReservation.setDate(date);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        newReservation.setProduct(product);
        newReservation.setUser(user);

        Reservation savedReservation = reservationRepository.save(newReservation);

        return savedReservation;
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Reservation getReservationById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
    }

    public Reservation updateReservation(Long id, LocalDate date, Product product, User user) {
        Reservation existingReservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        existingReservation.setDate(date);;



        return reservationRepository.save(existingReservation);
    }

    public void deleteReservation(Long id) {

        if (!reservationRepository.existsById(id)) {
            throw new RuntimeException("Reserva no encontrada");
        }

        reservationRepository.deleteById(id);
    }

    public List<LocalDate> getReservedDatesByProductId(Long productId) {
        return reservationRepository.findByProductId(productId)
                .stream()
                .map(Reservation::getDate)
                .collect(Collectors.toList());
    }
}

