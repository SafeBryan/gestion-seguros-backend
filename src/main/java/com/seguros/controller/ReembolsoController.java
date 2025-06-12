package com.seguros.controller;

import com.seguros.dto.ReembolsoRequestDTO;
import com.seguros.dto.ReembolsoResponseDTO;
import com.seguros.model.Reembolso;
import com.seguros.model.Usuario;
import com.seguros.service.ReembolsoService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reembolsos")
public class ReembolsoController {

    private final ReembolsoService reembolsoService;

    public ReembolsoController(ReembolsoService reembolsoService) {
        this.reembolsoService = reembolsoService;
    }

    // ✅ Cliente solicita un reembolso
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Reembolso> crearReembolso(
            @RequestPart("datos") ReembolsoRequestDTO requestDTO,
            @RequestPart("archivos") List<MultipartFile> archivos,
            @AuthenticationPrincipal Usuario cliente) {

        // Convertir archivos a base64 o guardar en servidor/s3/etc según tu lógica
        String nombresArchivos = archivos.stream()
                .map(MultipartFile::getOriginalFilename)
                .reduce((a, b) -> a + "," + b).orElse("sin_nombre");

        requestDTO.setArchivos(Map.of("nombres", nombresArchivos)); // Simulación por ahora

        Reembolso reembolso = reembolsoService.solicitarReembolso(requestDTO, cliente.getId());
        return ResponseEntity.ok(reembolso);
    }


    // ✅ Admin o agente consulta todos los reembolsos pendientes
    @GetMapping("/pendientes")
    public ResponseEntity<List<Reembolso>> obtenerPendientes() {
        return ResponseEntity.ok(reembolsoService.obtenerReembolsosPendientes());
    }

    // ✅ Admin o agente aprueba o rechaza un reembolso
    @PostMapping("/{id}/procesar")
    public ResponseEntity<Void> procesarReembolso(@PathVariable Long id,
                                                  @RequestParam boolean aprobar,
                                                  @RequestParam String comentario,
                                                  @AuthenticationPrincipal Usuario aprobador) {
        reembolsoService.procesarReembolso(id, aprobador.getId(), aprobar, comentario);
        return ResponseEntity.ok().build();
    }

    // ✅ Cliente ve sus propios reembolsos
    @GetMapping("/mis-reembolsos")
    public ResponseEntity<List<Reembolso>> obtenerMisReembolsos(@AuthenticationPrincipal Usuario cliente) {
        return ResponseEntity.ok(reembolsoService.obtenerReembolsosPorCliente(cliente.getId()));
    }

    // (Opcional) ✅ Admin puede consultar reembolsos por ID de cliente (si lo necesitas)
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Reembolso>> obtenerPorCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(reembolsoService.obtenerReembolsosPorCliente(clienteId));
    }

    // (Opcional) ✅ Obtener detalle de un reembolso específico
    @GetMapping("/{id}")
    public ResponseEntity<Reembolso> obtenerDetalle(@PathVariable Long id) {
        return ResponseEntity.of(reembolsoService.buscarPorId(id));
    }
}
