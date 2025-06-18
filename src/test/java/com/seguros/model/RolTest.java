package com.seguros.model;

import io.qameta.allure.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@Epic("Seguros")
@Feature("Creación de seguro")
@Story("Validación del modelo Rol")
class RolTest {

    @Test
    @DisplayName("Validar getters y setters de Rol")
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
    @DisplayName("Probar constructor personalizado de Rol")
    void testConstructorPersonalizado() {
        Rol rol = new Rol("ADMIN", "Administrador");

        assertEquals("ADMIN", rol.getNombre());
        assertEquals("Administrador", rol.getDescripcion());
    }

    @Test
    @DisplayName("Probar método onCreate de Rol")
    void testOnCreate() {
        Rol rol = new Rol();
        rol.onCreate();

        assertNotNull(rol.getCreatedAt());
    }
}
