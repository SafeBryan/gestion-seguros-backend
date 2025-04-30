package com.seguros.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class RolTest {

    @Test
    void testGettersAndSetters() {
        Rol rol = new Rol();
        LocalDateTime now = LocalDateTime.now();

        rol.setId(1L);
        rol.setNombre("CLIENTE");
        rol.setDescripcion("Rol de cliente");
        rol.setCreatedAt(now);

        assertEquals(1L, rol.getId());
        assertEquals("CLIENTE", rol.getNombre());
        assertEquals("Rol de cliente", rol.getDescripcion());
        assertEquals(now, rol.getCreatedAt());
    }

    @Test
    void testConstructorPersonalizado() {
        Rol rol = new Rol("ADMIN", "Administrador");

        assertEquals("ADMIN", rol.getNombre());
        assertEquals("Administrador", rol.getDescripcion());
    }

    @Test
    void testOnCreate() {
        Rol rol = new Rol();
        rol.onCreate();

        assertNotNull(rol.getCreatedAt());
    }


}
