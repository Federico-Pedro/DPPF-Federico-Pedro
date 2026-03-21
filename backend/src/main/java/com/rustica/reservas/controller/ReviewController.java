package com.rustica.reservas.controller;

import com.rustica.reservas.dto.ReviewRequest;
import com.rustica.reservas.entity.Review;
import com.rustica.reservas.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

        import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    private final ReviewService reviewService;


    public ReviewController(ReviewService reviewService) {

        this.reviewService = reviewService;

    }

    @PostMapping("/product/{productId}")
    public ResponseEntity<Review> createReview(@Valid @RequestBody ReviewRequest request) {
        Review createdReview = reviewService.createReview(

                request.getProductId(),
                request.getUserId(),
                request.getRating(),
                request.getComment(),
                request.getDate()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(createdReview);
    }

    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        List<Review> allReviews = reviewService.getAllReviews();
        return ResponseEntity.ok(allReviews);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getReviewsByProductId(@PathVariable Long productId) {
        List<Review> reviews = reviewService.getReviewsByProductId(productId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewsById(@PathVariable Long id) {
        Review review = reviewService.getReviewById(id);
        return ResponseEntity.ok(review);
    }

    //Endpoint para review para un producto determinado segun el id del usuario loggeado
    @GetMapping("/product/{productId}/user/{userId}")
    public ResponseEntity<Review> getReviewByProductAndUser(
            @PathVariable Long productId,
            @PathVariable Long userId) {
        Review review = reviewService.getReviewByProductAndUser(productId, userId);
        return ResponseEntity.ok(review);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/product/{productId}/stats")
    public ResponseEntity<Map<String, Object>> getProductStats(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getProductStats(productId));
    }

    @GetMapping("/stats/all")
    public ResponseEntity<Map<Long, Map<String, Object>>> getAllProductsStats() {
        return ResponseEntity.ok(reviewService.getAllProductsStats());
    }

}