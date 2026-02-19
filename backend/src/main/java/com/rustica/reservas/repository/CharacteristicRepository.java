package com.rustica.reservas.repository;

import com.rustica.reservas.entity.Characteristic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface CharacteristicRepository extends JpaRepository<Characteristic, Long> {


    Optional<Characteristic> findByid(Long id);


    void deleteById(Long id);

    boolean existsById(Long id);
    boolean existsByName(String name);
}