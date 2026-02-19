package com.rustica.reservas.service;

import com.rustica.reservas.entity.Characteristic;
import com.rustica.reservas.exception.UserAlreadyExistsException;
import com.rustica.reservas.repository.CharacteristicRepository;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class CharacteristicService {

    private final CharacteristicRepository characteristicRepository;

    public CharacteristicService(CharacteristicRepository characteristicRepository) {
        this.characteristicRepository = characteristicRepository;

    }

    public Characteristic createCharacteristic(String name, String icon) {

        if (characteristicRepository.existsByName(name)) {
            throw new UserAlreadyExistsException("Esta caracteristica ya existe");
        }

        Characteristic newCharacteristic = new Characteristic();
        newCharacteristic.setName(name);
        newCharacteristic.setIcon(icon);

        Characteristic savedCharacteristic = characteristicRepository.save(newCharacteristic);

        return savedCharacteristic;
    }

    public List<Characteristic> getAllCharacteristics() {
        return characteristicRepository.findAll();
    }

    public Characteristic getCharacteristicById(Long id) {
        return characteristicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Caracteristica no encontrada"));
    }

    public Characteristic updateCharacteristic(Long id, String name, String icon) {
        Characteristic existingCharacteristic = characteristicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Caracteristica no encontrada"));

        existingCharacteristic.setName(name);
        existingCharacteristic.setIcon(icon);


        return characteristicRepository.save(existingCharacteristic);
    }

    public void deleteCharacteristic(Long id) {

        if (!characteristicRepository.existsById(id)) {
            throw new RuntimeException("Caracteristica no encontrada");
        }

        characteristicRepository.deleteById(id);
    }

}


