package com.seguros.controller;

import com.seguros.dto.DependienteDTO;
import com.seguros.model.Dependiente;
import com.seguros.service.DependienteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dependientes")
public class DependienteController {

    private final DependienteService dependienteService;

    public DependienteController(DependienteService dependienteService) {
        this.dependienteService = dependienteService;
    }

    @PostMapping("/contrato/{contratoId}")
    public ResponseEntity<List<Dependiente>> actualizarDependientes(
            @PathVariable Long contratoId,
            @RequestBody List<DependienteDTO> dependientes) {
        return ResponseEntity.ok(dependienteService.actualizarDependientes(contratoId, dependientes));
    }

    @GetMapping("/contrato/{contratoId}")
    public ResponseEntity<List<Dependiente>> obtenerPorContrato(@PathVariable Long contratoId) {
        return ResponseEntity.ok(dependienteService.obtenerPorContrato(contratoId));
    }
}
