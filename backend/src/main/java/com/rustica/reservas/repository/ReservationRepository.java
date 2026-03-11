package com.rustica.reservas.repository;

import com.rustica.reservas.entity.Reservation;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {


    Optional<Reservation> findById(Long id);

    List<Reservation> findByProductId(Long productId);
    void deleteById(Long id);

    boolean existsById(Long id);

    @Transactional
    boolean existsByDate(LocalDate date);
}