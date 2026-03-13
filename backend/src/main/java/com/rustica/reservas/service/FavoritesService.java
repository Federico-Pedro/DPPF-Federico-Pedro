package com.rustica.reservas.service;


import com.rustica.reservas.entity.Favorite;
import com.rustica.reservas.entity.Product;
import com.rustica.reservas.entity.User;
import com.rustica.reservas.repository.FavoriteRepository;
import com.rustica.reservas.repository.ProductRepository;
import com.rustica.reservas.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
public class FavoritesService {

    private final FavoriteRepository favoriteRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public FavoritesService(FavoriteRepository favoriteRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.favoriteRepository = favoriteRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;

    }

    public Favorite createFavorite(Long productId, Long userId) {

        Favorite newFavorite = new Favorite();

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        newFavorite.setProduct(product);
        newFavorite.setUser(user);

        Favorite savedFavorite = favoriteRepository.save(newFavorite);

        return savedFavorite;
    }

    public List<Favorite> getAllFavorites() {
        return favoriteRepository.findAll();
    }

    public Favorite getFavoriteById(Long id) {
        return favoriteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No se encuentra en favoritos"));
    }

   public void deleteFavorite(Long productId) {
        if (!favoriteRepository.existsByProductId(productId)) {
            throw new RuntimeException("No se encuentra en favoritos");
        }
        favoriteRepository.deleteByProductId(productId);
    }

    public List<Product> getProductByUserId(Long userId) {
        return favoriteRepository.findByUserId(userId)
                .stream()
                .map(favorite -> favorite.getProduct())
                .collect(Collectors.toList());

    }
}

