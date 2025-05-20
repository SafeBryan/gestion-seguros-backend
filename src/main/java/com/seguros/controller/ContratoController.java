package com.seguros.controller;

import com.seguros.dto.ContratoDTO;
import com.seguros.model.Contrato;
import com.seguros.service.ContratoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/contratos")
public class ContratoController {

    private final ContratoService contratoService;

    public ContratoController(ContratoService contratoService) {
        this.contratoService = contratoService;
    }

    @PostMapping
    public ResponseEntity<Contrato> crearContrato(@RequestBody ContratoDTO contratoDTO) {
        return ResponseEntity.ok(contratoService.crearContrato(contratoDTO));
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Contrato>> obtenerPorCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(contratoService.obtenerContratosPorCliente(clienteId));
    }

    @GetMapping("/por-vencer")
    public ResponseEntity<List<Contrato>> obtenerPorVencer(@RequestParam(defaultValue = "30") int dias) {
        return ResponseEntity.ok(contratoService.obtenerContratosPorVencer(dias));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<Contrato> actualizarEstado(
            @PathVariable Long id,
            @RequestParam Contrato.EstadoContrato estado) {
        return ResponseEntity.ok(contratoService.actualizarEstado(id, estado));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}