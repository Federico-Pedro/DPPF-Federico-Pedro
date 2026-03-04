package com.rustica.reservas.controller;

import com.rustica.reservas.entity.Category;
import com.rustica.reservas.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    public ResponseEntity<Category> createCategory(@Valid @RequestBody Category category) {
        Category createdCategory = categoryService.createCategory(
                category.getName(),
                category.getDescription(),
                category.getImage()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
    }


    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    //@GetMapping("/{id}")
    //public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
      //  Category category = categoryService.getcategoryById(id);
        //return ResponseEntity.ok(category);
    //}

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(
            @PathVariable Long id,
            @RequestBody Category category) {
        Category updateCategory = categoryService.updateCategory(
                id,
                category.getName(),
                category.getDescription(),
                category.getImage()

        );
        return ResponseEntity.ok(updateCategory);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

}