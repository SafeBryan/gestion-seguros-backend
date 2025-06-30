package com.seguros.model;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

class ReembolsoTest {

    @Test
    void testGettersAndSetters() {
        Reembolso r = new Reembolso();

        Long id = 1L;
        Contrato contrato = mock(Contrato.class);
        BigDecimal monto = new BigDecimal("123.45");
        String descripcion = "Consulta general";
        Reembolso.EstadoReembolso estado = Reembolso.EstadoReembolso.APROBADO;
        String archivos = "{\"factura.pdf\":\"/ruta/factura.pdf\"}";
        Usuario aprobador = new Usuario();
        String comentario = "Aprobado correctamente";
        LocalDateTime fechaSolicitud = LocalDateTime.of(2024, 1, 1, 12, 0);
        LocalDateTime fechaRevision = LocalDateTime.of(2024, 1, 2, 12, 0);
        String nombreMedico = "Dr. Juan Pérez";
        String motivoConsulta = "Chequeo";
        String cie10 = "A00";
        LocalDate fechaAtencion = LocalDate.of(2023, 12, 25);
        LocalDate inicioSintomas = LocalDate.of(2023, 12, 20);
        Boolean esAccidente = true;
        String detalleAccidente = "Caída en la calle";

        r.setId(id);
        r.setContrato(contrato);
        r.setMonto(monto);
        r.setDescripcion(descripcion);
        r.setEstado(estado);
        r.setArchivos(archivos);
        r.setAprobadoPor(aprobador);
        r.setComentarioRevisor(comentario);
        r.setFechaSolicitud(fechaSolicitud);
        r.setFechaRevision(fechaRevision);
        r.setNombreMedico(nombreMedico);
        r.setMotivoConsulta(motivoConsulta);
        r.setCie10(cie10);
        r.setFechaAtencion(fechaAtencion);
        r.setInicioSintomas(inicioSintomas);
        r.setEsAccidente(esAccidente);
        r.setDetalleAccidente(detalleAccidente);

        assertEquals(id, r.getId());
        assertEquals(contrato, r.getContrato());
        assertEquals(monto, r.getMonto());
        assertEquals(descripcion, r.getDescripcion());
        assertEquals(estado, r.getEstado());
        assertEquals(archivos, r.getArchivos());
        assertEquals(aprobador, r.getAprobadoPor());
        assertEquals(comentario, r.getComentarioRevisor());
        assertEquals(fechaSolicitud, r.getFechaSolicitud());
        assertEquals(fechaRevision, r.getFechaRevision());
        assertEquals(nombreMedico, r.getNombreMedico());
        assertEquals(motivoConsulta, r.getMotivoConsulta());
        assertEquals(cie10, r.getCie10());
        assertEquals(fechaAtencion, r.getFechaAtencion());
        assertEquals(inicioSintomas, r.getInicioSintomas());
        assertTrue(r.getEsAccidente());
        assertEquals(detalleAccidente, r.getDetalleAccidente());
    }

    @Test
    void testIsPendiente() {
        Reembolso r = new Reembolso();
        r.setEstado(Reembolso.EstadoReembolso.PENDIENTE);
        assertTrue(r.isPendiente());

        r.setEstado(Reembolso.EstadoReembolso.APROBADO);
        assertFalse(r.isPendiente());
    }

    @Test
    void testAprobar() {
        Reembolso r = new Reembolso();
        Usuario aprobador = new Usuario();
        r.aprobar(aprobador, "Todo correcto");

        assertEquals(Reembolso.EstadoReembolso.APROBADO, r.getEstado());
        assertEquals(aprobador, r.getAprobadoPor());
        assertEquals("Todo correcto", r.getComentarioRevisor());
        assertNotNull(r.getFechaRevision());
    }

    @Test
    void testRechazar() {
        Reembolso r = new Reembolso();
        Usuario aprobador = new Usuario();
        r.rechazar(aprobador, "Documento ilegible");

        assertEquals(Reembolso.EstadoReembolso.RECHAZADO, r.getEstado());
        assertEquals(aprobador, r.getAprobadoPor());
        assertEquals("Documento ilegible", r.getComentarioRevisor());
        assertNotNull(r.getFechaRevision());
    }
}
