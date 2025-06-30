package com.seguros.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

class ContratoTest {

    @Test
    void testGettersAndSetters() {
        Contrato contrato = new Contrato();
        Usuario cliente = new Usuario();
        Usuario agente = new Usuario();

        // ✅ Usar clase concreta en lugar de Seguro abstracto
        SeguroVida seguro = new SeguroVida();
        seguro.setId(10L);
        seguro.setNombre("Seguro Vida");
        seguro.setMontoCobertura(new java.math.BigDecimal("10000.00"));

        LocalDate fechaInicio = LocalDate.of(2025, 1, 1);
        LocalDate fechaFin = LocalDate.of(2026, 1, 1);
        LocalDateTime createdAt = LocalDateTime.now();

        contrato.setId(1L);
        contrato.setCliente(cliente);
        contrato.setAgente(agente);
        contrato.setSeguro(seguro);
        contrato.setFechaInicio(fechaInicio);
        contrato.setFechaFin(fechaFin);
        contrato.setFrecuenciaPago(Contrato.FrecuenciaPago.MENSUAL);
        contrato.setEstado(Contrato.EstadoContrato.ACTIVO);
        contrato.setFirmaElectronica("firma123");
        contrato.setArchivos("{\"archivo.pdf\":\"base64data\"}");
        contrato.setBeneficiarios(Collections.emptyList());
        contrato.setPagos(Collections.emptyList());
        contrato.setReembolsos(Collections.emptyList());
        contrato.setCreatedAt(createdAt);

        assertEquals(1L, contrato.getId());
        assertEquals(cliente, contrato.getCliente());
        assertEquals(agente, contrato.getAgente());
        assertEquals(seguro, contrato.getSeguro());
        assertEquals(fechaInicio, contrato.getFechaInicio());
        assertEquals(fechaFin, contrato.getFechaFin());
        assertEquals(Contrato.FrecuenciaPago.MENSUAL, contrato.getFrecuenciaPago());
        assertEquals(Contrato.EstadoContrato.ACTIVO, contrato.getEstado());
        assertEquals("firma123", contrato.getFirmaElectronica());
        assertEquals("{\"archivo.pdf\":\"base64data\"}", contrato.getArchivos());
        assertTrue(contrato.getBeneficiarios().isEmpty());
        assertTrue(contrato.getPagos().isEmpty());
        assertTrue(contrato.getReembolsos().isEmpty());
        assertEquals(createdAt, contrato.getCreatedAt());
        assertTrue(contrato.isActivo());
    }
}
