package com.seguros.auth;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LoginResponseTest {

    @Test
    void testGetToken() {
        // Arrange
        String expectedToken = "test.jwt.token";

        // Act
        LoginResponse response = new LoginResponse(expectedToken);

        // Assert
        assertEquals(expectedToken, response.getToken(), "El token devuelto no es el esperado");
    }
}
