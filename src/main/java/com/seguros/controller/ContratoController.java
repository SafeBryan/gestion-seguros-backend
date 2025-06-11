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
    public ResponseEntity<ContratoDTO> crearContrato(@RequestBody ContratoDTO contratoDTO) {
        Contrato contrato = contratoService.crearContrato(contratoDTO);
        ContratoDTO respuesta = contratoService.convertirAContratoDTO(contrato);
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<ContratoDTO>> obtenerPorCliente(@PathVariable Long clienteId) {
        List<Contrato> contratos = contratoService.obtenerContratosPorCliente(clienteId);
        List<ContratoDTO> dtos = contratos.stream()
                .map(contratoService::convertirAContratoDTO)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/por-vencer")
    public ResponseEntity<List<ContratoDTO>> obtenerPorVencer(@RequestParam(defaultValue = "30") int dias) {
        List<Contrato> contratos = contratoService.obtenerContratosPorVencer(dias);
        List<ContratoDTO> dtos = contratos.stream()
                .map(contratoService::convertirAContratoDTO)
                .toList();
        return ResponseEntity.ok(dtos);
    }


    @PutMapping("/{id}/estado")
    public ResponseEntity<ContratoDTO> actualizarEstado(
            @PathVariable Long id,
            @RequestParam Contrato.EstadoContrato estado) {
        Contrato contrato = contratoService.actualizarEstado(id, estado);
        ContratoDTO dto = contratoService.convertirAContratoDTO(contrato);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContratoDTO> actualizarContrato(
            @PathVariable Long id,
            @RequestBody ContratoDTO contratoDTO) {
        Contrato contrato = contratoService.actualizarContrato(id, contratoDTO);
        ContratoDTO dto = contratoService.convertirAContratoDTO(contrato);
        return ResponseEntity.ok(dto);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @GetMapping
    public ResponseEntity<List<ContratoDTO>> obtenerTodos() {
        List<Contrato> contratos = contratoService.obtenerTodos();
        List<ContratoDTO> dtos = contratos.stream()
                .map(contratoService::convertirAContratoDTO)
                .toList();
        return ResponseEntity.ok(dtos);
    }

}