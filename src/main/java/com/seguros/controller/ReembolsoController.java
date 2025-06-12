package com.seguros.controller;

import com.seguros.dto.ReembolsoRequestDTO;
import com.seguros.dto.ReembolsoResponseDTO;
import com.seguros.model.Reembolso;
import com.seguros.model.Usuario;
import com.seguros.security.UsuarioDetails;
import com.seguros.service.ArchivoService;
import com.seguros.service.ReembolsoService;

import io.qameta.allure.internal.shadowed.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reembolsos")
public class ReembolsoController {

    private final ReembolsoService reembolsoService;
    private final ArchivoService archivoService;

    public ReembolsoController(ReembolsoService reembolsoService, ArchivoService archivoService) {
        this.reembolsoService = reembolsoService;
        this.archivoService = archivoService;
    }

    // ✅ Cliente solicita un reembolso
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReembolsoResponseDTO> crearReembolso(
            @RequestPart("datos") ReembolsoRequestDTO requestDTO,
            @RequestPart("archivos") List<MultipartFile> archivos,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {

        Usuario cliente = usuarioDetails.getUsuario();

        Map<String, String> archivosMap = new HashMap<>();
        for (MultipartFile archivo : archivos) {
            String rutaGuardada = archivoService.guardarArchivo(archivo);
            archivosMap.put(archivo.getOriginalFilename(), rutaGuardada);
        }

        requestDTO.setArchivos(archivosMap);

        Reembolso reembolso = reembolsoService.solicitarReembolso(requestDTO, cliente.getId());
        return ResponseEntity.ok(toDto(reembolso));
    }

    // ✅ Admin o agente consulta todos los reembolsos pendientes
    @GetMapping("/pendientes")
    public ResponseEntity<List<ReembolsoResponseDTO>> obtenerPendientes() {
        List<ReembolsoResponseDTO> lista = reembolsoService.obtenerReembolsosPendientes()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(lista);
    }

    // ✅ Admin o agente aprueba o rechaza un reembolso
    @PostMapping("/{id}/procesar")
    public ResponseEntity<Void> procesarReembolso(
            @PathVariable Long id,
            @RequestParam boolean aprobar,
            @RequestParam String comentario,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {

        Usuario aprobador = usuarioDetails.getUsuario();
        reembolsoService.procesarReembolso(id, aprobador.getId(), aprobar, comentario);
        return ResponseEntity.ok().build();
    }

    // ✅ Cliente ve sus propios reembolsos
    @GetMapping("/mis-reembolsos")
    public ResponseEntity<List<ReembolsoResponseDTO>> obtenerMisReembolsos(
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {

        Usuario cliente = usuarioDetails.getUsuario();
        List<ReembolsoResponseDTO> lista = reembolsoService.obtenerReembolsosPorCliente(cliente.getId())
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(lista);
    }

    // ✅ Admin puede consultar reembolsos por ID de cliente
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<ReembolsoResponseDTO>> obtenerPorCliente(@PathVariable Long clienteId) {
        List<ReembolsoResponseDTO> lista = reembolsoService.obtenerReembolsosPorCliente(clienteId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(lista);
    }

    // ✅ Obtener detalle de un reembolso específico
    @GetMapping("/{id}")
    public ResponseEntity<ReembolsoResponseDTO> obtenerDetalle(@PathVariable Long id) {
        return reembolsoService.buscarPorId(id)
                .map(this::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Mapeo de entidad a DTO
    private final ObjectMapper objectMapper = new ObjectMapper();

    private ReembolsoResponseDTO toDto(Reembolso r) {
        ReembolsoResponseDTO dto = new ReembolsoResponseDTO();

        dto.setId(r.getId());
        dto.setMonto(r.getMonto());
        dto.setDescripcion(r.getDescripcion());
        dto.setEstado(r.getEstado());

        try {
            Map<String, String> archivosMap = objectMapper.readValue(
                    r.getArchivos(), Map.class
            );
            dto.setArchivos(archivosMap);
        } catch (Exception e) {
            dto.setArchivos(null); // o Collections.emptyMap() si prefieres
        }

        if (r.getContrato() != null) {
            dto.setContratoId(r.getContrato().getId());

            if (r.getContrato().getSeguro() != null) {
                dto.setSeguroId(r.getContrato().getSeguro().getId());
                dto.setSeguroNombre(r.getContrato().getSeguro().getNombre());
            }

            if (r.getContrato().getCliente() != null) {
                dto.setClienteId(r.getContrato().getCliente().getId());
                dto.setClienteNombre(r.getContrato().getCliente().getNombre());
            }
        }

        if (r.getAprobadoPor() != null) {
            dto.setAprobadoPorNombre(r.getAprobadoPor().getNombre());
        }

        dto.setComentarioRevisor(r.getComentarioRevisor());
        dto.setFechaSolicitud(r.getFechaSolicitud());
        dto.setFechaRevision(r.getFechaRevision());

        return dto;
    }
}
