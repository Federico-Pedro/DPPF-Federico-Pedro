package com.rustica.reservas.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.*;

import java.util.List;


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

    @ManyToMany(mappedBy = "characteristics")
    @JsonIgnore
    private List<Product> products;
}
