package com.seguros.service;

import com.seguros.dto.PagoDTO;
import com.seguros.model.Contrato;
import com.seguros.model.Pago;
import com.seguros.model.Pago.EstadoPago;
import com.seguros.model.Pago.MetodoPago;
import com.seguros.repository.ContratoRepository;
import com.seguros.repository.PagoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PagoServiceTest {

    private PagoService pagoService;
    private PagoRepository pagoRepository;
    private ContratoRepository contratoRepository;

    @BeforeEach
    void setUp() {
        pagoRepository = mock(PagoRepository.class);
        contratoRepository = mock(ContratoRepository.class);
        pagoService = new PagoService(pagoRepository, contratoRepository);
    }

    private PagoDTO crearDTO() {
        PagoDTO dto = new PagoDTO();
        dto.setContratoId(1L);
        dto.setMonto(BigDecimal.valueOf(100.0));
        dto.setMetodo(MetodoPago.TRANSFERENCIA);
        dto.setObservaciones("Pago mensual");
        dto.setFechaPago(LocalDateTime.now());
        dto.setEstado(EstadoPago.COMPLETADO);
        dto.setReferencia("ABC123");
        return dto;
    }

    @Test
    @DisplayName("Debe registrar un pago correctamente")
    void testRegistrarPago_Exitoso() {
        PagoDTO dto = crearDTO();
        Contrato contrato = new Contrato(); contrato.setId(1L);

        when(contratoRepository.findById(1L)).thenReturn(Optional.of(contrato));
        when(pagoRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Pago result = pagoService.registrarPago(dto);

        assertEquals(BigDecimal.valueOf(100.0), result.getMonto());
        assertEquals(MetodoPago.TRANSFERENCIA, result.getMetodo());
        assertEquals(EstadoPago.COMPLETADO, result.getEstado());
        assertEquals("ABC123", result.getReferencia());
    }

    @Test
    @DisplayName("Debe lanzar excepción si el contrato no existe")
    void testRegistrarPago_ContratoNoExiste() {
        PagoDTO dto = crearDTO();
        when(contratoRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            pagoService.registrarPago(dto);
        });

        assertEquals("Contrato no encontrado", ex.getMessage());
    }

    @Test
    @DisplayName("Debe lanzar excepción si el comprobante está mal codificado")
    void testRegistrarPago_ComprobanteInvalido() {
        PagoDTO dto = crearDTO();
        dto.setComprobante("NO_ES_BASE64");
        dto.setComprobanteNombre("test.pdf");
        dto.setComprobanteTipoContenido("application/pdf");

        Contrato contrato = new Contrato(); contrato.setId(1L);
        when(contratoRepository.findById(1L)).thenReturn(Optional.of(contrato));

        assertThrows(RuntimeException.class, () -> {
            pagoService.registrarPago(dto);
        });
    }

    @Test
    @DisplayName("Debe revertir un pago correctamente")
    void testRevertirPago_Exitoso() {
        Pago pago = new Pago();
        pago.setId(1L);
        pago.setEstado(EstadoPago.COMPLETADO);
        when(pagoRepository.findById(1L)).thenReturn(Optional.of(pago));

        pagoService.revertirPago(1L, "Error de monto");

        assertEquals(EstadoPago.REVERTIDO, pago.getEstado());
        assertTrue(pago.getObservaciones().contains("Error de monto"));
        verify(pagoRepository).save(pago);
    }

    @Test
    @DisplayName("Debe lanzar excepción si pago no existe al revertir")
    void testRevertirPago_NoExiste() {
        when(pagoRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            pagoService.revertirPago(1L, "Motivo");
        });

        assertEquals("Pago no encontrado", ex.getMessage());
    }

    @Test
    @DisplayName("Debe lanzar excepción si el pago no está completado")
    void testRevertirPago_NoCompletado() {
        Pago pago = new Pago();
        pago.setId(1L);
        pago.setEstado(EstadoPago.PENDIENTE);
        when(pagoRepository.findById(1L)).thenReturn(Optional.of(pago));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            pagoService.revertirPago(1L, "No válido");
        });

        assertEquals("Solo se pueden revertir pagos completados", ex.getMessage());
    }

    @Test
    @DisplayName("Debe obtener pagos por contrato")
    void testObtenerPagosPorContrato() {
        Pago pago = new Pago(); pago.setId(1L);
        when(pagoRepository.findByContratoId(1L)).thenReturn(List.of(pago));

        List<PagoDTO> result = pagoService.obtenerPagosPorContrato(1L);
        assertEquals(1, result.size());
    }

    @Test
    @DisplayName("Debe obtener pagos por cliente")
    void testObtenerPagosPorCliente() {
        Pago pago = new Pago(); pago.setId(1L);
        when(pagoRepository.findByClienteId(1L)).thenReturn(List.of(pago));

        List<PagoDTO> result = pagoService.obtenerPagosPorCliente(1L);
        assertEquals(1, result.size());
    }

    @Test
    @DisplayName("Debe obtener total pagado correctamente")
    void testObtenerTotalPagado() {
        when(pagoRepository.sumPagosCompletadosByContratoId(1L)).thenReturn(BigDecimal.valueOf(250.0));

        BigDecimal total = pagoService.obtenerTotalPagadoPorContrato(1L);
        assertEquals(BigDecimal.valueOf(250.0), total);
    }

    @Test
    @DisplayName("Debe retornar cero si no hay pagos")
    void testObtenerTotalPagado_Null() {
        when(pagoRepository.sumPagosCompletadosByContratoId(1L)).thenReturn(null);

        BigDecimal total = pagoService.obtenerTotalPagadoPorContrato(1L);
        assertEquals(BigDecimal.ZERO, total);
    }

    @Test
    @DisplayName("Debe generar reporte de pagos por rango de fechas")
    void testGenerarReportePagos() {
        Pago pago = new Pago(); pago.setId(1L);
        when(pagoRepository.findByFechaPagoBetween(any(), any())).thenReturn(List.of(pago));

        List<PagoDTO> result = pagoService.generarReportePagos(
                LocalDateTime.now().minusDays(1), LocalDateTime.now());

        assertEquals(1, result.size());
    }
}
