package com.seguros.service;

import com.seguros.dto.SeguroDTO;
import com.seguros.model.*;
import com.seguros.model.Seguro.TipoSeguro;
import com.seguros.repository.SeguroRepository;
import com.seguros.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SeguroServiceTest {

    private SeguroRepository seguroRepository;
    private UsuarioRepository usuarioRepository;
    private SeguroService seguroService;

    @BeforeEach
    void setUp() {
        seguroRepository = mock(SeguroRepository.class);
        usuarioRepository = mock(UsuarioRepository.class);
        seguroService = new SeguroService(seguroRepository, usuarioRepository);
    }

    @Test
    void testCrearSeguro_exitoso() {
        // Simular contexto de seguridad
        SecurityContext securityContext = mock(SecurityContext.class);
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                "admin@test.com", null, List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );
        when(securityContext.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(securityContext);

        // Arrange
        SeguroDTO dto = new SeguroDTO();
        dto.setNombre("Seguro Vida");
        dto.setTipo(TipoSeguro.VIDA);
        dto.setDescripcion("Protección de vida");
        dto.setCobertura("Muerte natural o accidental");
        dto.setPrecioAnual(new BigDecimal("500.00"));
        dto.setActivo(true);
        dto.setMontoCobertura(new BigDecimal("100000"));
        // dto.setCreadoPorId(1L);

        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("admin@test.com");

        // Mock correcto: búsqueda por email (no por ID)
        when(usuarioRepository.findByEmail("admin@test.com")).thenReturn(Optional.of(usuario));
        when(seguroRepository.save(any(Seguro.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Seguro creado = seguroService.crearSeguro(dto);

        // Assert
        assertEquals("Seguro Vida", creado.getNombre());
        assertEquals(TipoSeguro.VIDA, creado.getTipo());
        assertEquals(usuario, creado.getCreadoPor());
        assertTrue(creado instanceof SeguroVida);
        verify(seguroRepository).save(any(Seguro.class));
    }



    @Test
    void testCrearSeguro_usuarioNoExiste() {
        // Simular contexto de seguridad
        SecurityContext securityContext = mock(SecurityContext.class);
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                "admin@test.com", null, List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );
        when(securityContext.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(securityContext);

        SeguroDTO dto = new SeguroDTO();
        dto.setCreadoPorId(99L);

        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        Exception ex = assertThrows(RuntimeException.class, () ->
                seguroService.crearSeguro(dto));

        assertEquals("Usuario no encontrado", ex.getMessage());
    }


    @Test
    void testObtenerSegurosActivos() {
        SeguroVida s1 = new SeguroVida();
        SeguroVida s2 = new SeguroVida();

        List<Seguro> seguros = List.of(s1, s2);
        when(seguroRepository.findByActivoTrue()).thenReturn(seguros);

        List<Seguro> resultado = seguroService.obtenerSegurosActivos();

        assertEquals(2, resultado.size());
        verify(seguroRepository).findByActivoTrue();
    }


    @Test
    void testActualizarEstado_exitoso() {
        SeguroVida seguro = new SeguroVida();
        seguro.setActivo(true);

        when(seguroRepository.findById(1L)).thenReturn(Optional.of(seguro));
        when(seguroRepository.save(any(Seguro.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Seguro actualizado = seguroService.actualizarEstado(1L, false);

        assertFalse(actualizado.getActivo());
        verify(seguroRepository).save(seguro);
    }

    @Test
    void testActualizarEstado_seguroNoExiste() {
        when(seguroRepository.findById(999L)).thenReturn(Optional.empty());

        Exception ex = assertThrows(RuntimeException.class, () ->
                seguroService.actualizarEstado(999L, true));

        assertEquals("Seguro no encontrado", ex.getMessage());
    }
}
