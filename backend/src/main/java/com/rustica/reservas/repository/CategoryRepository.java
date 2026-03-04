package com.rustica.reservas.repository;

import com.rustica.reservas.entity.Category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {


    Optional<Category> findByid(Long id);


    void deleteById(Long id);

    boolean existsById(Long id);
    boolean existsByName(String name);
}