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

    @Test
    void testCrearSeguro_tipoInvalido() {
        // Simular contexto de seguridad con un email válido
        SecurityContext securityContext = mock(SecurityContext.class);
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                "admin@test.com", null, List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );
        when(securityContext.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(securityContext);

        // Mockear usuario encontrado por email
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("admin@test.com");
        when(usuarioRepository.findByEmail("admin@test.com")).thenReturn(Optional.of(usuario));

        // DTO sin tipo (null) para que falle el switch
        SeguroDTO dto = new SeguroDTO();
        dto.setTipo(null);

        Exception ex = assertThrows(IllegalArgumentException.class, () ->
                seguroService.crearSeguro(dto));

        assertEquals("Tipo de seguro no válido", ex.getMessage());
    }


    @Test
    void testEditarSeguro_exitoso_vida() {
        SeguroVida seguroExistente = new SeguroVida();
        seguroExistente.setId(1L);

        SeguroDTO dto = new SeguroDTO();
        dto.setNombre("Nuevo nombre");
        dto.setDescripcion("Nueva descripción");
        dto.setCobertura("Cobertura actualizada");
        dto.setPrecioAnual(new BigDecimal("100.00"));
        dto.setActivo(true);
        dto.setMontoCobertura(new BigDecimal("50000"));

        when(seguroRepository.findById(1L)).thenReturn(Optional.of(seguroExistente));
        when(seguroRepository.save(any(Seguro.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Seguro actualizado = seguroService.editarSeguro(1L, dto);

        assertEquals("Nuevo nombre", actualizado.getNombre());
        assertEquals("Nueva descripción", actualizado.getDescripcion());
        assertEquals("Cobertura actualizada", actualizado.getCobertura());
        assertEquals(new BigDecimal("100.00"), actualizado.getPrecioAnual());
        assertEquals(new BigDecimal("50000"), ((SeguroVida) actualizado).getMontoCobertura());
    }

    @Test
    void testEditarSeguro_noExiste() {
        when(seguroRepository.findById(999L)).thenReturn(Optional.empty());

        SeguroDTO dto = new SeguroDTO(); // contenido no relevante aquí

        Exception ex = assertThrows(RuntimeException.class, () ->
                seguroService.editarSeguro(999L, dto));

        assertEquals("Seguro no encontrado", ex.getMessage());
    }

    @Test
    void testCrearSeguro_salud() {
        // Simular contexto de seguridad
        SecurityContext securityContext = mock(SecurityContext.class);
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                "admin@test.com", null, List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );
        when(securityContext.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(securityContext);

        // Mock usuario
        Usuario usuario = new Usuario();
        usuario.setEmail("admin@test.com");
        when(usuarioRepository.findByEmail("admin@test.com")).thenReturn(Optional.of(usuario));

        // DTO SALUD
        SeguroDTO dto = new SeguroDTO();
        dto.setTipo(Seguro.TipoSeguro.SALUD);
        dto.setNombre("Seguro Salud");
        dto.setDescripcion("Cobertura médica");
        dto.setCobertura("Consultas y hospitalización");
        dto.setPrecioAnual(new BigDecimal("600.00"));
        dto.setActivo(true);
        dto.setHospitalesConvenio("Hospital Central");
        dto.setNumeroConsultasIncluidas(10);

        when(seguroRepository.save(any(Seguro.class))).thenAnswer(i -> i.getArgument(0));

        Seguro resultado = seguroService.crearSeguro(dto);

        assertTrue(resultado instanceof SeguroSalud);
        assertEquals("Seguro Salud", resultado.getNombre());
    }

    @Test
    void testObtenerTodosLosSeguros() {
        when(seguroRepository.findAll()).thenReturn(List.of(new SeguroVida(), new SeguroSalud()));

        List<Seguro> seguros = seguroService.obtenerTodosLosSeguros();

        assertEquals(2, seguros.size());
        verify(seguroRepository).findAll();
    }

    @Test
    void testObtenerSegurosPorTipo() {
        Seguro vida = new SeguroVida();
        Seguro salud = new SeguroSalud();

        when(seguroRepository.findAll()).thenReturn(List.of(vida, salud));

        List<Seguro> segurosVida = seguroService.obtenerSegurosPorTipo(Seguro.TipoSeguro.VIDA);
        List<Seguro> segurosSalud = seguroService.obtenerSegurosPorTipo(Seguro.TipoSeguro.SALUD);

        assertEquals(1, segurosVida.size());
        assertTrue(segurosVida.get(0) instanceof SeguroVida);

        assertEquals(1, segurosSalud.size());
        assertTrue(segurosSalud.get(0) instanceof SeguroSalud);
    }

    @Test
    void testEditarSeguro_vida() {
        SeguroVida seguro = new SeguroVida();
        seguro.setMontoCobertura(new BigDecimal("1000"));

        when(seguroRepository.findById(1L)).thenReturn(Optional.of(seguro));
        when(seguroRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        SeguroDTO dto = new SeguroDTO();
        dto.setNombre("Actualizado");
        dto.setDescripcion("Actualizado desc");
        dto.setCobertura("Cobertura X");
        dto.setPrecioAnual(new BigDecimal("1200"));
        dto.setActivo(true);
        dto.setMontoCobertura(new BigDecimal("5000"));

        Seguro editado = seguroService.editarSeguro(1L, dto);

        assertEquals("Actualizado", editado.getNombre());
        assertEquals(new BigDecimal("5000"), ((SeguroVida) editado).getMontoCobertura());
    }

    @Test
    void testEditarSeguro_salud() {
        SeguroSalud seguro = new SeguroSalud();
        seguro.setHospitalesConvenio("Antiguo");
        seguro.setNumeroConsultasIncluidas(5);

        when(seguroRepository.findById(2L)).thenReturn(Optional.of(seguro));
        when(seguroRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        SeguroDTO dto = new SeguroDTO();
        dto.setNombre("Salud actualizado");
        dto.setDescripcion("Nueva desc");
        dto.setCobertura("Nueva cobertura");
        dto.setPrecioAnual(new BigDecimal("800"));
        dto.setActivo(true);
        dto.setHospitalesConvenio("Nuevo Hospital");
        dto.setNumeroConsultasIncluidas(15);

        Seguro editado = seguroService.editarSeguro(2L, dto);

        assertEquals("Nuevo Hospital", ((SeguroSalud) editado).getHospitalesConvenio());
        assertEquals(15, ((SeguroSalud) editado).getNumeroConsultasIncluidas());
    }

}
