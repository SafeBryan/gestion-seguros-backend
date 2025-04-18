package com.seguros.controller;

import com.seguros.dto.PagoDTO;
import com.seguros.model.Pago;
import com.seguros.service.PagoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/pagos")
public class PagoController {

    private final PagoService pagoService;

    public PagoController(PagoService pagoService) {
        this.pagoService = pagoService;
    }

    @PostMapping
    public ResponseEntity<Pago> registrarPago(@RequestBody PagoDTO dto) {
        return ResponseEntity.ok(pagoService.registrarPago(dto));
    }

    @GetMapping("/contrato/{contratoId}")
    public ResponseEntity<List<Pago>> obtenerPorContrato(@PathVariable Long contratoId) {
        return ResponseEntity.ok(pagoService.obtenerPagosPorContrato(contratoId));
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Pago>> obtenerPorCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(pagoService.obtenerPagosPorCliente(clienteId));
    }

    @GetMapping("/total/{contratoId}")
    public ResponseEntity<BigDecimal> obtenerTotalPagado(@PathVariable Long contratoId) {
        return ResponseEntity.ok(pagoService.obtenerTotalPagadoPorContrato(contratoId));
    }

    @GetMapping("/reporte")
    public ResponseEntity<List<Pago>> generarReporte(
            @RequestParam LocalDateTime fechaInicio,
            @RequestParam LocalDateTime fechaFin) {
        return ResponseEntity.ok(pagoService.generarReportePagos(fechaInicio, fechaFin));
    }

    @PostMapping("/{pagoId}/revertir")
    public ResponseEntity<Void> revertirPago(@PathVariable Long pagoId, @RequestParam String motivo) {
        pagoService.revertirPago(pagoId, motivo);
        return ResponseEntity.ok().build();
    }
}
