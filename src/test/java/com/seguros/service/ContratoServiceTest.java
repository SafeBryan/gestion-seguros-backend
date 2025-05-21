package com.seguros.service;

import com.seguros.dto.ContratoDTO;
import com.seguros.model.Contrato;
import com.seguros.model.Seguro;
import com.seguros.model.Usuario;
import com.seguros.repository.ContratoRepository;
import com.seguros.repository.SeguroRepository;
import com.seguros.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ContratoServiceTest {

    private ContratoService contratoService;
    private ContratoRepository contratoRepository;
    private UsuarioRepository usuarioRepository;
    private SeguroRepository seguroRepository;

    @BeforeEach
    void setUp() {
        contratoRepository = mock(ContratoRepository.class);
        usuarioRepository = mock(UsuarioRepository.class);
        seguroRepository = mock(SeguroRepository.class);
        contratoService = new ContratoService(contratoRepository, usuarioRepository, seguroRepository);
    }

    @Test
    void testCrearContrato() {
        Usuario cliente = new Usuario(); cliente.setId(1L);
        Usuario agente = new Usuario(); agente.setId(2L);
        Seguro seguro = new Seguro(); seguro.setId(3L);

        ContratoDTO dto = new ContratoDTO();
        dto.setClienteId(1L);
        dto.setAgenteId(2L);
        dto.setSeguroId(3L);
        dto.setFechaInicio(LocalDate.of(2025, 1, 1));
        dto.setFechaFin(LocalDate.of(2026, 1, 1));
        dto.setFrecuenciaPago(Contrato.FrecuenciaPago.ANUAL);
        dto.setFirmaElectronica("firmaX");

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(usuarioRepository.findById(2L)).thenReturn(Optional.of(agente));
        when(seguroRepository.findById(3L)).thenReturn(Optional.of(seguro));
        when(contratoRepository.save(Mockito.any())).thenAnswer(inv -> inv.getArgument(0));

        Contrato contrato = contratoService.crearContrato(dto);

        assertEquals(cliente, contrato.getCliente());
        assertEquals(agente, contrato.getAgente());
        assertEquals(seguro, contrato.getSeguro());
        assertEquals(dto.getFechaInicio(), contrato.getFechaInicio());
        assertEquals(dto.getFrecuenciaPago(), contrato.getFrecuenciaPago());
        assertEquals("firmaX", contrato.getFirmaElectronica());
    }

    @Test
    void testCrearContrato_ClienteNoExiste() {
        ContratoDTO dto = new ContratoDTO();
        dto.setClienteId(99L);

        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                contratoService.crearContrato(dto));

        assertEquals("Cliente no encontrado", ex.getMessage());
    }

    @Test
    void testCrearContrato_AgenteNoExiste() {
        Usuario cliente = new Usuario(); cliente.setId(1L);
        ContratoDTO dto = new ContratoDTO();
        dto.setClienteId(1L);
        dto.setAgenteId(2L);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(usuarioRepository.findById(2L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                contratoService.crearContrato(dto));

        assertEquals("Agente no encontrado", ex.getMessage());
    }

    @Test
    void testCrearContrato_SeguroNoExiste() {
        Usuario cliente = new Usuario(); cliente.setId(1L);
        Usuario agente = new Usuario(); agente.setId(2L);
        ContratoDTO dto = new ContratoDTO();
        dto.setClienteId(1L);
        dto.setAgenteId(2L);
        dto.setSeguroId(3L);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(usuarioRepository.findById(2L)).thenReturn(Optional.of(agente));
        when(seguroRepository.findById(3L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                contratoService.crearContrato(dto));

        assertEquals("Seguro no encontrado", ex.getMessage());
    }

    @Test
    void testActualizarEstado() {
        Contrato contrato = new Contrato();
        contrato.setEstado(Contrato.EstadoContrato.ACTIVO);

        when(contratoRepository.findById(1L)).thenReturn(Optional.of(contrato));
        when(contratoRepository.save(Mockito.any())).thenAnswer(inv -> inv.getArgument(0));

        Contrato actualizado = contratoService.actualizarEstado(1L, Contrato.EstadoContrato.CANCELADO);

        assertEquals(Contrato.EstadoContrato.CANCELADO, actualizado.getEstado());
    }

    @Test
    void testActualizarEstado_ContratoNoExiste() {
        when(contratoRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                contratoService.actualizarEstado(1L, Contrato.EstadoContrato.ACTIVO));

        assertEquals("Contrato no encontrado", ex.getMessage());
    }

    @Test
    void testObtenerContratoValido() {
        Contrato contrato = new Contrato();
        contrato.setEstado(Contrato.EstadoContrato.ACTIVO);

        when(contratoRepository.findById(1L)).thenReturn(Optional.of(contrato));

        Contrato result = contratoService.obtenerContratoValido(1L);

        assertEquals(Contrato.EstadoContrato.ACTIVO, result.getEstado());
    }

    @Test
    void testObtenerContratoValido_ContratoNoExiste() {
        when(contratoRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                contratoService.obtenerContratoValido(1L));

        assertEquals("Contrato no encontrado", ex.getMessage());
    }

    @Test
    void testObtenerContratoValido_ContratoInactivo() {
        Contrato contrato = new Contrato();
        contrato.setEstado(Contrato.EstadoContrato.CANCELADO); // contrato inactivo

        when(contratoRepository.findById(1L)).thenReturn(Optional.of(contrato));

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                contratoService.obtenerContratoValido(1L));

        assertEquals("El contrato no está activo", ex.getMessage());
    }
}
