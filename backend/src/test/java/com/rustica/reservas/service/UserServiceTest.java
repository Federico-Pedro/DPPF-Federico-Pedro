package com.rustica.reservas.service;

import com.rustica.reservas.entity.User;
import com.rustica.reservas.repository.UserRepository;
import com.rustica.reservas.util.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private UserService userService;

    // ✅ Caso 1: login exitoso
    @Test
    void login_conCredencialesCorrectas_retornaToken() {
        // Arrange: preparamos los datos y le decimos a los mocks qué devolver
        User user = new User();
        user.setEmail("federico@mail.com");
        user.setPassword("hashedPassword");
        user.setRole("user");

        when(userRepository.findByEmail("federico@mail.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("1234", "hashedPassword")).thenReturn(true);
        when(jwtUtil.generateToken("federico@mail.com", "USER")).thenReturn("fake-jwt-token");

        // Act: ejecutamos el método real
        String token = userService.login("federico@mail.com", "1234");

        // Assert: verificamos el resultado
        assertEquals("fake-jwt-token", token);
    }

    // ❌ Caso 2: email no existe
    @Test
    void login_conEmailInexistente_lanzaExcepcion() {
        when(userRepository.findByEmail("noexiste@mail.com")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                userService.login("noexiste@mail.com", "1234")
        );

        assertEquals("Email o contraseña incorrectos", ex.getMessage());
    }

    // ❌ Caso 3: password incorrecta
    @Test
    void login_conPasswordIncorrecta_lanzaExcepcion() {
        User user = new User();
        user.setEmail("federico@mail.com");
        user.setPassword("hashedPassword");

        when(userRepository.findByEmail("federico@mail.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongpassword", "hashedPassword")).thenReturn(false);

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                userService.login("federico@mail.com", "wrongpassword")
        );

        assertEquals("Email o contraseña incorrectos", ex.getMessage());
    }
}