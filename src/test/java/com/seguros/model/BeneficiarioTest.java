package com.seguros.model;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class BeneficiarioTest {

    @Test
    void testGettersAndSetters() {
        Beneficiario beneficiario = new Beneficiario();
        Contrato contrato = new Contrato();
        contrato.setId(1L);

        beneficiario.setId(10L);
        beneficiario.setContrato(contrato);
        beneficiario.setNombre("Carlos");
        beneficiario.setParentesco("Padre");
        beneficiario.setPorcentaje(BigDecimal.valueOf(75));
        beneficiario.setEsPrincipal(true);
        beneficiario.setDocumentoIdentidad("1234567890");
        beneficiario.setEmail("carlos@test.com");
        beneficiario.setTelefono("0987654321");
        beneficiario.setFechaNacimiento(LocalDate.of(1980, 5, 10));

        assertEquals(10L, beneficiario.getId());
        assertEquals(contrato, beneficiario.getContrato());
        assertEquals("Carlos", beneficiario.getNombre());
        assertEquals("Padre", beneficiario.getParentesco());
        assertEquals(BigDecimal.valueOf(75), beneficiario.getPorcentaje());
        assertTrue(beneficiario.isEsPrincipal());
        assertEquals("1234567890", beneficiario.getDocumentoIdentidad());
        assertEquals("carlos@test.com", beneficiario.getEmail());
        assertEquals("0987654321", beneficiario.getTelefono());
        assertEquals(LocalDate.of(1980, 5, 10), beneficiario.getFechaNacimiento());
    }

    @Test
    void testPorcentajeInvalidoMenorQueCero() {
        Beneficiario beneficiario = new Beneficiario();
        beneficiario.setPorcentaje(BigDecimal.valueOf(-5));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, beneficiario::validarPorcentaje);
        assertEquals("El porcentaje debe estar entre 0 y 100", ex.getMessage());
    }

    @Test
    void testPorcentajeInvalidoMayorA100() {
        Beneficiario beneficiario = new Beneficiario();
        beneficiario.setPorcentaje(BigDecimal.valueOf(101));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, beneficiario::validarPorcentaje);
        assertEquals("El porcentaje debe estar entre 0 y 100", ex.getMessage());
    }

    @Test
    void testPorcentajeValido() {
        Beneficiario beneficiario = new Beneficiario();
        beneficiario.setPorcentaje(BigDecimal.valueOf(100));

        // No debe lanzar excepción
        assertDoesNotThrow(beneficiario::validarPorcentaje);
    }
}
