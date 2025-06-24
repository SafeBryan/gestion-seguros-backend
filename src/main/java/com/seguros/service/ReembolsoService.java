package com.seguros.service;

import com.seguros.dto.ReembolsoRequestDTO;
import com.seguros.dto.ReembolsoResponseDTO;
import com.seguros.exception.JsonConversionException;
import com.seguros.model.*;
import com.seguros.repository.ReembolsoRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ReembolsoService {

    private final ReembolsoRepository reembolsoRepository;
    private final ContratoService contratoService;
    private final UsuarioService usuarioService;

    private final ObjectMapper objectMapper;

    public ReembolsoService(
            ReembolsoRepository reembolsoRepository,
            ContratoService contratoService,
            UsuarioService usuarioService,
            ObjectMapper objectMapper
    ) {
        this.reembolsoRepository = reembolsoRepository;
        this.contratoService = contratoService;
        this.usuarioService = usuarioService;
        this.objectMapper = objectMapper;
    }


    @Transactional
    public Reembolso solicitarReembolso(ReembolsoRequestDTO dto, Long clienteId) {
        Contrato contrato = contratoService.obtenerContratoValido(dto.getContratoId());
        Usuario cliente = usuarioService.obtenerUsuario(clienteId);

        if (!contrato.getCliente().getId().equals(cliente.getId())) {
            throw new RuntimeException("El contrato no pertenece al cliente");
        }

        Reembolso reembolso = new Reembolso();
        reembolso.setContrato(contrato);
        reembolso.setMonto(dto.getMonto());
        reembolso.setDescripcion(dto.getDescripcion());

        // ✅ Usar JSON válido para los archivos
        try {
            if (dto.getArchivos() != null && !dto.getArchivos().isEmpty()) {
                String archivosJson = objectMapper.writeValueAsString(dto.getArchivos());
                reembolso.setArchivos(archivosJson);
            } else {
                reembolso.setArchivos(null);
            }
        } catch (Exception e) {
            throw new JsonConversionException("Error al convertir archivos a JSON", e);
        }


        // Datos médicos y de accidente
        reembolso.setNombreMedico(dto.getNombreMedico());
        reembolso.setMotivoConsulta(dto.getMotivoConsulta());
        reembolso.setCie10(dto.getCie10());
        reembolso.setFechaAtencion(dto.getFechaAtencion());
        reembolso.setInicioSintomas(dto.getInicioSintomas());
        reembolso.setEsAccidente(dto.getEsAccidente() != null && dto.getEsAccidente());
        reembolso.setDetalleAccidente(dto.getDetalleAccidente());

        return reembolsoRepository.save(reembolso);
    }


    public List<Reembolso> obtenerReembolsosPendientes() {
        return reembolsoRepository.findByEstado(Reembolso.EstadoReembolso.PENDIENTE);
    }

    @Transactional
    public void procesarReembolso(Long reembolsoId, Long aprobadorId, boolean aprobar, String comentario) {
        Reembolso reembolso = reembolsoRepository.findById(reembolsoId)
                .orElseThrow(() -> new RuntimeException("Reembolso no encontrado"));

        Usuario aprobador = usuarioService.obtenerUsuario(aprobadorId);

        if (aprobador.getRol().getNombre().equals("CLIENTE")) {
            throw new RuntimeException("Los clientes no pueden aprobar reembolsos");
        }

        if (aprobar) {
            reembolso.aprobar(aprobador, comentario);
        } else {
            reembolso.rechazar(aprobador, comentario);
        }

        reembolsoRepository.save(reembolso);
    }

    public List<Reembolso> obtenerReembolsosPorCliente(Long clienteId) {
        Usuario cliente = usuarioService.obtenerUsuario(clienteId);
        return reembolsoRepository.findByContrato_Cliente(cliente);
    }

    public Optional<Reembolso> buscarPorId(Long id) {
        return reembolsoRepository.findById(id);
    }

    public ReembolsoResponseDTO convertirADTO(Reembolso r) {
        ReembolsoResponseDTO dto = new ReembolsoResponseDTO();

        dto.setId(r.getId());
        dto.setMonto(r.getMonto());
        dto.setDescripcion(r.getDescripcion());
        dto.setEstado(r.getEstado());

        try {
            Map<String, String> archivosMap = objectMapper.readValue(r.getArchivos(), Map.class);
            dto.setArchivos(archivosMap);
        } catch (Exception e) {
            dto.setArchivos(null); // o Collections.emptyMap()
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
