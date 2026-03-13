package com.rustica.reservas.repository;

import com.rustica.reservas.entity.Favorite;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {


    Optional<Favorite> findById(Long id);

    List<Favorite> findByUserId(Long userId);

    void deleteById(Long id);

    boolean existsById(Long id);

    @Transactional
    void deleteByProductId(Long productId);

    boolean existsByProductId(Long productId);


}