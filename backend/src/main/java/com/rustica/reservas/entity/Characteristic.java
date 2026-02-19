package com.rustica.reservas.entity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.*;



@Entity
@Table(name = "characteristics")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Characteristic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "El icono es obligatorio")
    @Column(nullable = false)
    private String icon;
}
