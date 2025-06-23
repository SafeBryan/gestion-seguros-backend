package com.seguros.security;

import com.seguros.model.Rol;
import com.seguros.model.Usuario;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class UsuarioDetailsTest {

    @Test
    void testUsuarioDetails_returnCorrectData() {
        // Arrange
        Usuario usuario = new Usuario();
        usuario.setEmail("bryan@example.com");
        usuario.setPassword("123456");
        Rol rol = new Rol();
        rol.setNombre("ADMIN");
        usuario.setRol(rol);

        List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_ADMIN"));

        UsuarioDetails userDetails = new UsuarioDetails(usuario, authorities);

        // Act & Assert
        assertEquals("bryan@example.com", userDetails.getUsername());
        assertEquals("123456", userDetails.getPassword());
        assertEquals(authorities, userDetails.getAuthorities());

        assertTrue(userDetails.isAccountNonExpired());
        assertTrue(userDetails.isAccountNonLocked());
        assertTrue(userDetails.isCredentialsNonExpired());
        assertTrue(userDetails.isEnabled());

        assertEquals(usuario, userDetails.getUsuario());
    }
}
