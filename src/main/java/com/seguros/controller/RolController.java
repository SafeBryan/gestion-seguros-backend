package com.seguros.controller;

import com.seguros.dto.RolDTO;
import com.seguros.model.Rol;
import com.seguros.service.RolService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RolController {

    private final RolService rolService;

    public RolController(RolService rolService) {
        this.rolService = rolService;
    }

    @PostMapping
    public ResponseEntity<Rol> crearRol(@RequestBody RolDTO rolDTO) {
        return ResponseEntity.ok(rolService.crearRol(rolDTO));
    }

    @GetMapping
    public ResponseEntity<List<RolDTO>> obtenerTodosRoles() {
        return ResponseEntity.ok(rolService.obtenerTodosRoles());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Rol> actualizarRol(
            @PathVariable Long id,
            @RequestBody RolDTO rolDTO) {
        return ResponseEntity.ok(rolService.actualizarRol(id, rolDTO));
    }
}