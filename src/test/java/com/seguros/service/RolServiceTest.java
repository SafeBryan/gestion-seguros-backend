package com.seguros.service;

import com.seguros.dto.RolDTO;
import com.seguros.model.Rol;
import com.seguros.repository.RolRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class RolServiceTest {

    @Mock
    private RolRepository rolRepository;

    @InjectMocks
    private RolService rolService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCrearRol_exito() {
        RolDTO dto = new RolDTO();
        dto.setNombre("AGENTE");
        dto.setDescripcion("Agente de seguros");

        when(rolRepository.existsByNombre("AGENTE")).thenReturn(false);
        when(rolRepository.save(any(Rol.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Rol resultado = rolService.crearRol(dto);

        assertNotNull(resultado);
        assertEquals("AGENTE", resultado.getNombre());
        assertEquals("Agente de seguros", resultado.getDescripcion());
    }

    @Test
    void testCrearRol_yaExiste() {
        RolDTO dto = new RolDTO();
        dto.setNombre("ADMIN");

        when(rolRepository.existsByNombre("ADMIN")).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> rolService.crearRol(dto));
        assertEquals("El nombre de rol ya existe", ex.getMessage());
    }

    @Test
    void testObtenerTodosRoles() {
        Rol rol1 = new Rol("ADMIN", "Administrador");
        rol1.setId(1L);

        Rol rol2 = new Rol("CLIENTE", "Cliente final");
        rol2.setId(2L);

        when(rolRepository.findAll()).thenReturn(List.of(rol1, rol2));

        List<RolDTO> result = rolService.obtenerTodosRoles();

        assertEquals(2, result.size());
        assertEquals("ADMIN", result.get(0).getNombre());
    }

    @Test
    void testActualizarRol_exito() {
        Rol existente = new Rol("AGENTE", "Original");
        existente.setId(10L);

        RolDTO dto = new RolDTO();
        dto.setNombre("AGENTE");
        dto.setDescripcion("Actualizado");

        when(rolRepository.findById(10L)).thenReturn(Optional.of(existente));
        when(rolRepository.save(any(Rol.class))).thenAnswer(i -> i.getArgument(0));

        Rol actualizado = rolService.actualizarRol(10L, dto);

        assertEquals("AGENTE", actualizado.getNombre());
        assertEquals("Actualizado", actualizado.getDescripcion());
    }

    @Test
    void testActualizarRol_noEncontrado() {
        when(rolRepository.findById(99L)).thenReturn(Optional.empty());

        RolDTO dto = new RolDTO();
        dto.setNombre("TEST");

        RuntimeException ex = assertThrows(RuntimeException.class, () -> rolService.actualizarRol(99L, dto));
        assertEquals("Rol no encontrado", ex.getMessage());
    }

    @Test
    void testActualizarRol_cambioDeNombre_yaExiste() {
        Rol existente = new Rol("AGENTE", "Original");
        existente.setId(10L);

        RolDTO dto = new RolDTO();
        dto.setNombre("ADMIN"); // Cambiamos el nombre
        dto.setDescripcion("Actualizado");

        when(rolRepository.findById(10L)).thenReturn(Optional.of(existente));
        when(rolRepository.existsByNombre("ADMIN")).thenReturn(true); // Simulamos que ya existe

        RuntimeException ex = assertThrows(RuntimeException.class, () -> rolService.actualizarRol(10L, dto));
        assertEquals("El nombre de rol ya existe", ex.getMessage());
    }

    @Test
    void testActualizarRol_cambioDeNombre_exito() {
        Rol existente = new Rol("AGENTE", "Original");
        existente.setId(10L);

        RolDTO dto = new RolDTO();
        dto.setNombre("SUPERVISOR"); // Nombre distinto
        dto.setDescripcion("Actualizado");

        when(rolRepository.findById(10L)).thenReturn(Optional.of(existente));
        when(rolRepository.existsByNombre("SUPERVISOR")).thenReturn(false);
        when(rolRepository.save(any(Rol.class))).thenAnswer(i -> i.getArgument(0));

        Rol actualizado = rolService.actualizarRol(10L, dto);

        assertEquals("SUPERVISOR", actualizado.getNombre());
        assertEquals("Actualizado", actualizado.getDescripcion());
    }


}
