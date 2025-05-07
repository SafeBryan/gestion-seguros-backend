package com.seguros.controller;

import com.seguros.dto.RolDTO;
import com.seguros.model.Rol;
import com.seguros.service.RolService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RolController {

    private final RolService rolService;

    public RolController(RolService rolService) {
        this.rolService = rolService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Rol> crearRol(@RequestBody @Valid RolDTO rolDTO) {
        return ResponseEntity.ok(rolService.crearRol(rolDTO));
    }

    @GetMapping
    public ResponseEntity<List<RolDTO>> obtenerTodosRoles() {
        return ResponseEntity.ok(rolService.obtenerTodosRoles());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<RolDTO> obtenerRolPorId(@PathVariable Long id) {
        return ResponseEntity.ok(rolService.obtenerRolPorId(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Rol> actualizarRol(@PathVariable Long id, @RequestBody @Valid RolDTO rolDTO) {
        return ResponseEntity.ok(rolService.actualizarRol(id, rolDTO));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarRol(@PathVariable Long id) {
        rolService.eliminarRol(id);
        return ResponseEntity.noContent().build();
    }
}
