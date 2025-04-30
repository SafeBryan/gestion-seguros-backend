package com.seguros.model;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class SeguroTest {

    @Test
    void testGettersAndSetters() {
        Seguro seguro = new Seguro();
        LocalDateTime now = LocalDateTime.now();

        seguro.setId(1L);
        seguro.setNombre("Test Seguro");
        seguro.setTipo(Seguro.TipoSeguro.VIDA);
        seguro.setDescripcion("Descripción");
        seguro.setCobertura("Cobertura");
        seguro.setPrecioAnual(BigDecimal.TEN);
        seguro.setActivo(false);
        seguro.setCreatedAt(now);

        assertEquals(1L, seguro.getId());
        assertEquals("Test Seguro", seguro.getNombre());
        assertEquals(Seguro.TipoSeguro.VIDA, seguro.getTipo());
        assertEquals("Descripción", seguro.getDescripcion());
        assertEquals("Cobertura", seguro.getCobertura());
        assertEquals(BigDecimal.TEN, seguro.getPrecioAnual());
        assertFalse(seguro.isActivo());
        assertEquals(now, seguro.getCreatedAt());
    }
}
