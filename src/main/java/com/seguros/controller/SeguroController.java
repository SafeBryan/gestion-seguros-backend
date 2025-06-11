package com.seguros.controller;

import com.seguros.dto.SeguroDTO;
import com.seguros.model.Seguro;
import com.seguros.service.SeguroService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/seguros")
public class SeguroController {

    private final SeguroService seguroService;

    public SeguroController(SeguroService seguroService) {
        this.seguroService = seguroService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Seguro> crearSeguro(@Valid @RequestBody SeguroDTO seguroDTO) {
        return ResponseEntity.ok(seguroService.crearSeguro(seguroDTO));
    }


    @GetMapping("/activos")
    public ResponseEntity<List<Seguro>> obtenerSegurosActivos() {
        return ResponseEntity.ok(seguroService.obtenerSegurosActivos());
    }
    @GetMapping()
    public ResponseEntity<List<Seguro>> obtenerTodosLosSeguros() {
        return ResponseEntity.ok(seguroService.obtenerTodosLosSeguros());
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
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Seguro> editarSeguro(
            @PathVariable Long id,
            @RequestBody SeguroDTO seguroDTO) {

        return ResponseEntity.ok(seguroService.editarSeguro(id, seguroDTO));
    }



}