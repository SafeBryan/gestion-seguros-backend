package com.seguros.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class UsuarioTest {

    @Test
    void testGettersAndSetters() {
        Usuario usuario = new Usuario();
        Rol rol = new Rol();
        rol.setId(1L);
        rol.setNombre("ADMIN");
        rol.setDescripcion("Administrador");

        LocalDateTime now = LocalDateTime.now();

        usuario.setId(1L);
        usuario.setEmail("test@example.com");
        usuario.setPassword("secure123");
        usuario.setNombre("Juan");
        usuario.setApellido("Pérez");
        usuario.setTelefono("0999999999");
        usuario.setRol(rol);
        usuario.setActivo(true);
        usuario.setCreatedAt(now);

        assertEquals(1L, usuario.getId());
        assertEquals("test@example.com", usuario.getEmail());
        assertEquals("secure123", usuario.getPassword());
        assertEquals("Juan", usuario.getNombre());
        assertEquals("Pérez", usuario.getApellido());
        assertEquals("0999999999", usuario.getTelefono());
        assertEquals(rol, usuario.getRol());
        assertTrue(usuario.isActivo());
        assertEquals(now, usuario.getCreatedAt());
    }
}
