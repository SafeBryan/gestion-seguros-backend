package com.seguros.security;

import com.seguros.model.Rol;
import com.seguros.model.Usuario;
import com.seguros.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UsuarioDetailsServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioDetailsService usuarioDetailsService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void loadUserByUsername_usuarioExiste_devuelveUsuarioDetails() {
        // Arrange
        Usuario usuario = new Usuario();
        usuario.setEmail("bryan@example.com");
        usuario.setPassword("1234");

        Rol rol = new Rol();
        rol.setNombre("ADMIN");
        usuario.setRol(rol);

        when(usuarioRepository.findByEmail("bryan@example.com")).thenReturn(Optional.of(usuario));

        // Act
        UserDetails result = usuarioDetailsService.loadUserByUsername("bryan@example.com");

        // Assert
        assertEquals("bryan@example.com", result.getUsername());
        assertEquals("1234", result.getPassword());
        assertTrue(result.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")));
    }

    @Test
    void loadUserByUsername_usuarioNoExiste_lanzaExcepcion() {
        when(usuarioRepository.findByEmail("inexistente@example.com"))
                .thenReturn(Optional.empty());

        UsernameNotFoundException ex = assertThrows(
                UsernameNotFoundException.class,
                () -> usuarioDetailsService.loadUserByUsername("inexistente@example.com")
        );

        assertEquals("Usuario no encontrado: inexistente@example.com", ex.getMessage());
    }
}
