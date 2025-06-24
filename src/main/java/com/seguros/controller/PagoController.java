package com.seguros.controller;

import com.seguros.dto.PagoDTO;
import com.seguros.model.Pago;
import com.seguros.service.PagoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/pagos")
public class PagoController {

    private final PagoService pagoService;

    public PagoController(PagoService pagoService) {
        this.pagoService = pagoService;
    }

    @PostMapping("/test-upload")
    public ResponseEntity<String> testFileUpload(@RequestParam("file") MultipartFile file) {
        try {
            System.out.println("Nombre archivo: " + file.getOriginalFilename());
            System.out.println("Tipo contenido: " + file.getContentType());
            System.out.println("Tamaño: " + file.getSize() + " bytes");
            System.out.println("Primeros bytes: " + Arrays.toString(Arrays.copyOfRange(file.getBytes(), 0, 10)));

            return ResponseEntity.ok("Archivo recibido: " + file.getOriginalFilename());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<PagoDTO> registrarPago(@RequestBody PagoDTO dto) {
        Pago pago = pagoService.registrarPago(dto);
        return ResponseEntity.ok(pagoService.convertToDto(pago));
    }

    @GetMapping("/contrato/{contratoId}")
    public ResponseEntity<List<PagoDTO>> obtenerPorContrato(@PathVariable Long contratoId) {
        List<PagoDTO> pagos = pagoService.obtenerPagosPorContrato(contratoId);
        return ResponseEntity.ok(pagos);
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<PagoDTO>> obtenerPorCliente(@PathVariable Long clienteId) {
        List<PagoDTO> pagos = pagoService.obtenerPagosPorCliente(clienteId);
        return ResponseEntity.ok(pagos);
    }

    @GetMapping("/total/{contratoId}")
    public ResponseEntity<BigDecimal> obtenerTotalPagado(@PathVariable Long contratoId) {
        return ResponseEntity.ok(pagoService.obtenerTotalPagadoPorContrato(contratoId));
    }

    @GetMapping("/reporte")
    public ResponseEntity<List<PagoDTO>> generarReporte(
            @RequestParam LocalDateTime fechaInicio,
            @RequestParam LocalDateTime fechaFin) {
        List<PagoDTO> pagos = pagoService.generarReportePagos(fechaInicio, fechaFin);
        return ResponseEntity.ok(pagos);
    }

    @PostMapping("/{pagoId}/revertir")
    public ResponseEntity<Void> revertirPago(@PathVariable Long pagoId, @RequestParam String motivo) {
        pagoService.revertirPago(pagoId, motivo);
        return ResponseEntity.ok().build();
    }
}
