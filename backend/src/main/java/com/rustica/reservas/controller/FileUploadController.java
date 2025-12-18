package com.rustica.reservas.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class FileUploadController {


    @PostMapping("/upload")
    public ResponseEntity<List<String>> uploadFiles(@RequestParam("files") MultipartFile[] files) {

        List<String> imageUrls = new ArrayList<>();

        if (files.length == 0) {
            return ResponseEntity.badRequest().build();
        }

        try {
            Path uploadPath = Paths.get(System.getProperty("user.dir"), "..", "frontend", "public", "images").normalize();

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String originalFilename = file.getOriginalFilename();
                    String filename = System.currentTimeMillis() + "_" + originalFilename;
                    Path filePath = uploadPath.resolve(filename);
                    Files.copy(file.getInputStream(), filePath);
                    imageUrls.add("/images/" + filename);
                }
            }

            return ResponseEntity.ok(imageUrls);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}