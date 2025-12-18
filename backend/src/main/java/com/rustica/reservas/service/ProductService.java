package com.rustica.reservas.service;

import com.rustica.reservas.entity.Product;
import com.rustica.reservas.repository.ProductRepository;
import org.springframework.stereotype.Service;
import com.rustica.reservas.exception.ProductAlreadyExistsException;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }


    public Product createProduct(String name, String description, List<String> images) {


        if (productRepository.existsByName(name)) {
            throw new ProductAlreadyExistsException("Ya existe un producto con el nombre: " + name);
        }


        Product newProduct = new Product();
        newProduct.setName(name);
        newProduct.setDescription(description);
        newProduct.setImages(images);
        newProduct.setActive(true);


        Product savedProduct = productRepository.save(newProduct);


        return savedProduct;
    }


    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }


    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
    }


    public void deleteProduct(Long id) {

        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Cannot delete: Product not found with ID: " + id);
        }

        productRepository.deleteById(id);
    }


}