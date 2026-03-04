package com.rustica.reservas.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El título es obligatorio")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "La descripcion es obligatoria")
    @Column(nullable = false)
    private String description;

    @NotBlank(message = "La imagen es obligatoria")
    @NotNull(message = "La imagen es obligatoria")
    @Column(nullable = false)
    private String image;

    @ManyToMany(mappedBy = "categories")
    @JsonIgnore
    private List<Product> products;
}