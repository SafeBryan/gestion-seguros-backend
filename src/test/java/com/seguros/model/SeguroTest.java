package com.seguros.model;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class SeguroTest {

    @Test
    void testSeguroVidaGettersAndSetters() {
        SeguroVida seguro = new SeguroVida();
        LocalDateTime now = LocalDateTime.now();

        seguro.setId(1L);
        seguro.setNombre("Test Seguro Vida");
        seguro.setDescripcion("Descripción Vida");
        seguro.setCobertura("Cobertura Vida");
        seguro.setPrecioAnual(BigDecimal.TEN);
        seguro.setActivo(false);
        seguro.setCreatedAt(now);
        seguro.setMontoCobertura(BigDecimal.valueOf(50000));

        assertEquals(1L, seguro.getId());
        assertEquals("Test Seguro Vida", seguro.getNombre());
        assertEquals(Seguro.TipoSeguro.VIDA, seguro.getTipo());
        assertEquals("Descripción Vida", seguro.getDescripcion());
        assertEquals("Cobertura Vida", seguro.getCobertura());
        assertEquals(BigDecimal.TEN, seguro.getPrecioAnual());
        assertFalse(seguro.getActivo());
        assertEquals(now, seguro.getCreatedAt());

        assertEquals(BigDecimal.valueOf(50000), seguro.getMontoCobertura());
    }

    @Test
    void testSeguroSaludGettersAndSetters() {
        SeguroSalud seguro = new SeguroSalud();
        LocalDateTime now = LocalDateTime.now();

        seguro.setId(2L);
        seguro.setNombre("Test Seguro Salud");
        seguro.setDescripcion("Descripción Salud");
        seguro.setCobertura("Cobertura Salud");
        seguro.setPrecioAnual(BigDecimal.valueOf(1500));
        seguro.setActivo(true);
        seguro.setCreatedAt(now);
        seguro.setHospitalesConvenio("Hospital Central");
        seguro.setNumeroConsultasIncluidas(10);

        assertEquals(2L, seguro.getId());
        assertEquals("Test Seguro Salud", seguro.getNombre());
        assertEquals(Seguro.TipoSeguro.SALUD, seguro.getTipo()); // Infirió automáticamente
        assertEquals("Descripción Salud", seguro.getDescripcion());
        assertEquals("Cobertura Salud", seguro.getCobertura());
        assertEquals(BigDecimal.valueOf(1500), seguro.getPrecioAnual());
        assertTrue(seguro.getActivo());
        assertEquals(now, seguro.getCreatedAt());

        assertEquals("Hospital Central", seguro.getHospitalesConvenio());
        assertEquals(10, seguro.getNumeroConsultasIncluidas());
    }

    @Test
    void testSeguroBaseGetTipoRetornaNull() {
        Seguro seguro = new Seguro() {
        };

        assertNull(seguro.getTipo(), "El tipo debería ser null en la implementación base");
    }

}
