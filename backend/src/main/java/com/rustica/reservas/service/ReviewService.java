package com.rustica.reservas.service;


import com.rustica.reservas.entity.Favorite;
import com.rustica.reservas.entity.Product;
import com.rustica.reservas.entity.Review;
import com.rustica.reservas.entity.User;
import com.rustica.reservas.repository.FavoriteRepository;
import com.rustica.reservas.repository.ProductRepository;
import com.rustica.reservas.repository.ReviewRepository;
import com.rustica.reservas.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;

    }
    public Review createReview(Long productId, Long userId, Integer rating, String comment, LocalDate date){
        if (reviewRepository.findByProductIdAndUserId(productId, userId).isPresent()) {
            throw new RuntimeException("Ya realizaste una reseña para este producto");
        }
        Review newReview = new Review();

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        newReview.setProduct(product);
        newReview.setUser(user);
        newReview.setRating(rating);
        newReview.setComment(comment);
        newReview.setDate(date);

        Review savedReview = reviewRepository.save(newReview);

        return savedReview;
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public List<Review> getReviewsByProductId(Long productId) {
        return reviewRepository.findByProductId(productId);
    }

    public Review getReviewById(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No se encuentra en reviews"));
    }

    public Review getReviewByProductAndUser(Long productId, Long userId) {
        return reviewRepository.findByProductIdAndUserId(productId, userId).orElse(null);
    }

    public void deleteReview(Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new RuntimeException("No se encuentra en reviews");
        }
        reviewRepository.deleteById(id);
    }

    public Map<String, Object> getProductStats(Long productId) {
        Double average = reviewRepository.findAverageRatingByProductId(productId);
        Long total = (long) reviewRepository.findByProductId(productId).size();
        Map<String, Object> stats = new HashMap<>();
        stats.put("average", average != null ? average : 0);
        stats.put("total", total);
        return stats;
    }

    public Map<Long, Map<String, Object>> getAllProductsStats() {
        List<Review> allReviews = reviewRepository.findAll();
        Map<Long, Map<String, Object>> stats = new HashMap<>();

        allReviews.stream()
                .collect(Collectors.groupingBy(r -> r.getProduct().getId()))
                .forEach((productId, reviews) -> {
                    Map<String, Object> productStats = new HashMap<>();
                    double average = reviews.stream()
                            .mapToInt(Review::getRating)
                            .average()
                            .orElse(0);
                    productStats.put("average", average);
                    productStats.put("total", reviews.size());
                    stats.put(productId, productStats);
                });

        return stats;
    }
}
