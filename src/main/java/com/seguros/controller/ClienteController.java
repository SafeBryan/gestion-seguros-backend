package com.seguros.controller;

import com.seguros.dto.ClienteRequestDTO;
import com.seguros.dto.ClienteResponseDTO;
import com.seguros.service.ClienteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'AGENTE')")
    @PostMapping
    public ResponseEntity<ClienteResponseDTO> crearCliente(@RequestBody ClienteRequestDTO dto) {
        return ResponseEntity.ok(clienteService.crearCliente(dto));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'AGENTE')")
    @GetMapping
    public ResponseEntity<List<ClienteResponseDTO>> listarClientes() {
        return ResponseEntity.ok(clienteService.listarClientes());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'AGENTE')")
    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> obtenerCliente(@PathVariable Long id) {
        return ResponseEntity.ok(clienteService.obtenerCliente(id));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'AGENTE')")
    @PutMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> actualizarCliente(
            @PathVariable Long id,
            @RequestBody ClienteRequestDTO dto) {
        return ResponseEntity.ok(clienteService.actualizarCliente(id, dto));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'AGENTE')")
    @PutMapping("/{id}/desactivar")
    public ResponseEntity<Void> desactivarCliente(@PathVariable Long id) {
        clienteService.desactivarCliente(id);
        return ResponseEntity.noContent().build();
    }
}
