package com.rustica.reservas.service;

import com.rustica.reservas.entity.Characteristic;
import com.rustica.reservas.entity.Product;
import com.rustica.reservas.repository.ProductRepository;
import com.rustica.reservas.repository.CharacteristicRepository;
import org.springframework.stereotype.Service;
import com.rustica.reservas.exception.ProductAlreadyExistsException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CharacteristicRepository characteristicRepository;

    public ProductService(ProductRepository productRepository, CharacteristicRepository characteristicRepository) {
        this.productRepository = productRepository;
        this.characteristicRepository = characteristicRepository;
    }

    public Product createProduct(String name, String description, List<String> images, String category, List<Long> characteristicIds, List<String> politics) {

        if (productRepository.existsByName(name)) {
            throw new ProductAlreadyExistsException("Ya existe un producto con el nombre: " + name);
        }

        Product newProduct = new Product();
        newProduct.setName(name);
        newProduct.setDescription(description);
        newProduct.setImages(images);
        newProduct.setActive(true);
        newProduct.setCategory(category);
        List<Characteristic> characteristics = characteristicRepository.findAllById(characteristicIds);
        newProduct.setCharacteristics(characteristics);
        newProduct.setPolitics(politics);

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

    public Product updateProduct(Long id, String name, String description, List<String> images, String category, List<Long> characteristicIds, List<String> politics) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + id));

        existingProduct.setName(name);
        existingProduct.setDescription(description);
        existingProduct.setImages(images);
        existingProduct.setCategory(category);
        List<Characteristic> characteristics = characteristicRepository.findAllById(characteristicIds);
        existingProduct.setCharacteristics(characteristics);
        existingProduct.setPolitics(politics);

        return productRepository.save(existingProduct);
    }

    public void deleteProduct(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cannot delete: Product not found with ID: " + id));
        //ELIMINA ARCHIVOS DE IMAGENES ANTES DE BORRAR EL PRODUCTO DE LA BASE DE DATOS

        //Crea el path absoluto a la carpeta imagenes
        Path uploadPath = Paths.get(System.getProperty("user.dir"), "..", "frontend", "public", "images").normalize();

        try {
            for (String imageUrl : product.getImages()) {
                //Quita el /images/ dejando solo el nombre del archivo
                String filename = imageUrl.replace("/images/", "");
                //crea la direccion del archivo
                Path filePath = uploadPath.resolve(filename);
                //elimina el archivo si existe
                Files.deleteIfExists(filePath);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        productRepository.deleteById(id);
    }

}