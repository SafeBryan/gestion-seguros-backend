package com.seguros.service;

import com.seguros.dto.ReembolsoDTO;
import com.seguros.model.*;
import com.seguros.repository.ReembolsoRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReembolsoService {

    private final ReembolsoRepository reembolsoRepository;
    private final ContratoService contratoService;
    private final UsuarioService usuarioService;

    // Constructor manual para inyección de dependencias
    public ReembolsoService(ReembolsoRepository reembolsoRepository,
                            ContratoService contratoService,
                            UsuarioService usuarioService) {
        this.reembolsoRepository = reembolsoRepository;
        this.contratoService = contratoService;
        this.usuarioService = usuarioService;
    }

    @Transactional
    public Reembolso solicitarReembolso(ReembolsoDTO reembolsoDTO) {
        Contrato contrato = contratoService.obtenerContratoValido(reembolsoDTO.getContratoId());
        Usuario cliente = usuarioService.obtenerUsuario(reembolsoDTO.getClienteId());

        if (!contrato.getCliente().getId().equals(cliente.getId())) {
            throw new RuntimeException("El contrato no pertenece al cliente");
        }

        Reembolso reembolso = new Reembolso();
        reembolso.setContrato(contrato);
        reembolso.setMonto(reembolsoDTO.getMonto());
        reembolso.setDescripcion(reembolsoDTO.getDescripcion());

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

}
