package com.rustica.reservas.service;

import com.rustica.reservas.entity.User;
import com.rustica.reservas.repository.UserRepository;
import com.rustica.reservas.util.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.rustica.reservas.service.EmailService;
import org.springframework.stereotype.Service;
import com.rustica.reservas.exception.UserAlreadyExistsException;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, EmailService emailService, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.jwtUtil = jwtUtil;
    }

    public User createUser(String name, String lastName, String email, String password, String role) {

        if (userRepository.existsByEmail(email)) {
            throw new UserAlreadyExistsException("Este email ya se encuentra registrado");
        }

        User newUser = new User();
        newUser.setName(name);
        newUser.setLastName(lastName);
        newUser.setEmail(email);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setRole(role);


        User savedUser = userRepository.save(newUser);
        emailService.sendConfirmationEmail(name, email);

        return savedUser;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public String login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email o contraseña incorrectos"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Email o contraseña incorrectos");
        }

        return jwtUtil.generateToken(user.getEmail(), user.getRole());
    }

    public User updateUser(String email, String name, String lastName, String password, String role) {
        User existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        existingUser.setName(name);
        existingUser.setLastName(lastName);
        if (password != null && !password.isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(password));
        }
        existingUser.setRole(role);

        return userRepository.save(existingUser);
    }

    public void deleteUser(String email) {

        if (!userRepository.existsByEmail(email)) {
            throw new RuntimeException("Usuario no encontrado");
        }

        userRepository.deleteByEmail(email);
    }

}