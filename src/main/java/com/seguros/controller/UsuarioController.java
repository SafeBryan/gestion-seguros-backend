package com.seguros.controller;

import com.seguros.dto.RegistroDTO;
import com.seguros.dto.UsuarioDTO;
import com.seguros.model.Usuario;
import com.seguros.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Usuario> crearUsuario(@RequestBody RegistroDTO registroDTO) {
        return ResponseEntity.ok(usuarioService.crearUsuario(registroDTO));
    }
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(
            @PathVariable Long id,
            @RequestBody UsuarioDTO usuarioDTO) {
        return ResponseEntity.ok(usuarioService.actualizarUsuario(id, usuarioDTO));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        usuarioService.eliminarUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> obtenerTodosUsuarios() {
        return ResponseEntity.ok(usuarioService.obtenerTodosUsuarios());
    }

    @GetMapping("/rol/{rolNombre}")
    public ResponseEntity<List<UsuarioDTO>> obtenerUsuariosPorRol(@PathVariable String rolNombre) {
        return ResponseEntity.ok(usuarioService.obtenerUsuariosPorRol(rolNombre));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<Usuario> actualizarEstado(
            @PathVariable Long id,
            @RequestParam boolean activo) {
        return ResponseEntity.ok(usuarioService.actualizarEstado(id, activo));
    }
}