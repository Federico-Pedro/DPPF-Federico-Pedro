package com.rustica.reservas.dto;

import lombok.Data;

import java.util.List;

@Data //crea automaticamente getters y setters
public class ProductRequest {
    private String name;
    private String description;
    private List<String> images;
    private String category;
    private List<Long> characteristicIds;


}