package com.rustica.reservas.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;



@Data
public class ReservationRequest {
    @NotNull(message = "La fecha es obligatoria")
    private LocalDate date;

    @NotNull(message = "El producto es obliogatorio")
    private Long productId;

    @NotNull(message = "El usuario es obligatorio")
    private Long userId;

}