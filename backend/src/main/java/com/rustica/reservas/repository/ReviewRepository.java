package com.rustica.reservas.repository;


import com.rustica.reservas.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {


    Optional<Review> findById(Long id);

    List<Review> findAll();
    List<Review> findByProductId(Long productId);
    Optional<Review> findByProductIdAndUserId(Long productId, Long userId);
    Optional<Review> findByUserIdAndProductId(Long userId, Long productId);

    void deleteById(Long id);

    boolean existsById(Long id);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId")
    Double findAverageRatingByProductId(@Param("productId") Long productId);




}