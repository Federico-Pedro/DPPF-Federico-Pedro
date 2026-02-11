package com.rustica.reservas.service;

import com.rustica.reservas.entity.User;
import com.rustica.reservas.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.rustica.reservas.exception.UserAlreadyExistsException;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(String name, String lastName, String email, String password) {

        if (userRepository.existsByEmail(email)) {
            throw new UserAlreadyExistsException("Este email ya se encuentra registrado");
        }

        User newUser = new User();
        newUser.setName(name);
        newUser.setLastName(lastName);
        newUser.setEmail(email);
        newUser.setPassword(password);


        User savedUser = userRepository.save(newUser);

        return savedUser;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public User updateUser(Long id, String name, String lastName, String email, String password) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        existingUser.setName(name);
        existingUser.setLastName(lastName);
        existingUser.setEmail(email);
        existingUser.setPassword(password);

        return userRepository.save(existingUser);
    }

    public void deleteUser(Long id) {

        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado con id: " + id);
        }

        userRepository.deleteById(id);
    }

}