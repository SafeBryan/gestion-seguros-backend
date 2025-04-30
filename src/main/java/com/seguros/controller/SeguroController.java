package com.seguros.controller;

import com.seguros.dto.SeguroDTO;
import com.seguros.model.Seguro;
import com.seguros.service.SeguroService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/seguros")
public class SeguroController {

    private final SeguroService seguroService;

    public SeguroController(SeguroService seguroService) {
        this.seguroService = seguroService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Seguro> crearSeguro(@RequestBody SeguroDTO seguroDTO) {
        return ResponseEntity.ok(seguroService.crearSeguro(seguroDTO));
    }


    @GetMapping
    public ResponseEntity<List<Seguro>> obtenerSegurosActivos() {
        return ResponseEntity.ok(seguroService.obtenerSegurosActivos());
    }

    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<Seguro>> obtenerPorTipo(@PathVariable Seguro.TipoSeguro tipo) {
        return ResponseEntity.ok(seguroService.obtenerSegurosPorTipo(tipo));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<Seguro> actualizarEstado(
            @PathVariable Long id,
            @RequestParam boolean activo) {
        return ResponseEntity.ok(seguroService.actualizarEstado(id, activo));
    }
}