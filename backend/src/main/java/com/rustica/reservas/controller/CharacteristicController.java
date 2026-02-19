package com.rustica.reservas.controller;


import com.rustica.reservas.entity.Characteristic;
import com.rustica.reservas.service.CharacteristicService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/characteristics")
@CrossOrigin(origins = "http://localhost:5173")
public class CharacteristicController {

    private final CharacteristicService characteristicService;

    public CharacteristicController(CharacteristicService characteristicService) {
        this.characteristicService = characteristicService;
    }

    @PostMapping
    public ResponseEntity<Characteristic> createCharacteristic(@Valid @RequestBody Characteristic characteristic) {
        Characteristic createdCharacteristic = characteristicService.createCharacteristic(
                characteristic.getName(),
                characteristic.getIcon()
                );
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCharacteristic);
    }


    @GetMapping
    public ResponseEntity<List<Characteristic>> getAllCharacteristics() {
        List<Characteristic> characteristics = characteristicService.getAllCharacteristics();
        return ResponseEntity.ok(characteristics);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Characteristic> getCharacteristicById(@PathVariable Long id) {
        Characteristic characteristic = characteristicService.getCharacteristicById(id);
        return ResponseEntity.ok(characteristic);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Characteristic> updateCharacteristic(
            @PathVariable Long id,
            @RequestBody Characteristic characteristic) {
        Characteristic updateCharacteristic = characteristicService.updateCharacteristic(
                id,
                characteristic.getName(),
                characteristic.getIcon()

        );
        return ResponseEntity.ok(updateCharacteristic);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCharacteristic(@PathVariable Long id) {
        characteristicService.deleteCharacteristic(id);
        return ResponseEntity.noContent().build();
    }

}

