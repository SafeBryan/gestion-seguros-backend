package com.seguros.security;

import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
    }

    @Test
    void generateToken_and_extractUsername_shouldWorkCorrectly() {
        User userDetails = new User("bryan@example.com", "password",
                List.of(new SimpleGrantedAuthority("ROLE_USER")));

        String token = jwtService.generateToken(userDetails, 1L, "Bryan", "Pérez");

        assertNotNull(token);

        String extractedUsername = jwtService.extractUsername(token);
        assertEquals("bryan@example.com", extractedUsername);
    }

    @Test
    void isTokenValid_shouldReturnTrueForValidToken() {
        User userDetails = new User("bryan@example.com", "password",
                List.of(new SimpleGrantedAuthority("ROLE_USER")));

        String token = jwtService.generateToken(userDetails, 1L, "Bryan", "Pérez");

        assertTrue(jwtService.isTokenValid(token, userDetails));
    }

    @Test
    void extractAllClaims_shouldContainCustomClaims() {
        User userDetails = new User("bryan@example.com", "password",
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN")));

        String token = jwtService.generateToken(userDetails, 99L, "Bryan", "Pérez");

        Claims claims = jwtService.extractAllClaims(token);

        assertEquals("Bryan", claims.get("nombre"));
        assertEquals("Pérez", claims.get("apellido"));
        assertEquals(99, claims.get("id", Integer.class)); // Puede ser Long o Integer
        assertTrue(((List<?>) claims.get("roles")).contains("ROLE_ADMIN"));
    }

    @Test
    void isTokenValid_shouldReturnFalseIfTampered() {
        // Token inválido simulado (cadena rota)
        String invalidToken = "ey.invalid.token";

        User userDetails = new User("bryan@example.com", "password",
                List.of(new SimpleGrantedAuthority("ROLE_USER")));

        assertThrows(Exception.class, () -> jwtService.isTokenValid(invalidToken, userDetails));
    }

}
