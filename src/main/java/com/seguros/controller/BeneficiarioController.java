package com.seguros.controller;

import com.seguros.dto.BeneficiarioDTO;
import com.seguros.model.Beneficiario;
import com.seguros.service.BeneficiarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/beneficiarios")
public class BeneficiarioController {

    private final BeneficiarioService beneficiarioService;

    public BeneficiarioController(BeneficiarioService beneficiarioService) {
        this.beneficiarioService = beneficiarioService;
    }

    @PostMapping
    public ResponseEntity<Beneficiario> crearBeneficiario(@RequestBody BeneficiarioDTO dto) {
        return ResponseEntity.ok(beneficiarioService.crearBeneficiario(dto));
    }

    @PostMapping("/contrato/{contratoId}")
    public ResponseEntity<List<Beneficiario>> actualizarBeneficiarios(
            @PathVariable Long contratoId,
            @RequestBody List<BeneficiarioDTO> beneficiarios) {
        return ResponseEntity.ok(beneficiarioService.actualizarBeneficiarios(contratoId, beneficiarios));
    }

    @GetMapping("/contrato/{contratoId}")
    public ResponseEntity<List<Beneficiario>> obtenerPorContrato(@PathVariable Long contratoId) {
        return ResponseEntity.ok(beneficiarioService.obtenerPorContrato(contratoId));
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Beneficiario>> obtenerPorCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(beneficiarioService.obtenerPorCliente(clienteId));
    }
}