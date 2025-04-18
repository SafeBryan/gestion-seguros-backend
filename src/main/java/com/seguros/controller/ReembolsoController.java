package com.seguros.controller;

import com.seguros.dto.ReembolsoDTO;
import com.seguros.model.Reembolso;
import com.seguros.model.Usuario;
import com.seguros.service.ReembolsoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reembolsos")
public class ReembolsoController {

    private final ReembolsoService reembolsoService;

    // Constructor manual para inyección de dependencias
    public ReembolsoController(ReembolsoService reembolsoService) {
        this.reembolsoService = reembolsoService;
    }

    @PostMapping
    public ResponseEntity<Reembolso> crearReembolso(@RequestBody ReembolsoDTO reembolsoDTO,
                                                    @AuthenticationPrincipal Usuario cliente) {
        reembolsoDTO.setClienteId(cliente.getId());
        return ResponseEntity.ok(reembolsoService.solicitarReembolso(reembolsoDTO));
    }

    @GetMapping("/pendientes")
    public ResponseEntity<List<Reembolso>> obtenerPendientes() {
        return ResponseEntity.ok(reembolsoService.obtenerReembolsosPendientes());
    }

    @PostMapping("/{id}/procesar")
    public ResponseEntity<Void> procesarReembolso(@PathVariable Long id,
                                                  @RequestParam boolean aprobar,
                                                  @RequestParam String comentario,
                                                  @AuthenticationPrincipal Usuario aprobador) {
        reembolsoService.procesarReembolso(id, aprobador.getId(), aprobar, comentario);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Reembolso>> obtenerPorCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(reembolsoService.obtenerReembolsosPorCliente(clienteId));
    }
}
