package com.seguros.service;

import com.seguros.dto.ContratoDTO;
import com.seguros.model.*;
import com.seguros.repository.ContratoRepository;
import com.seguros.repository.SeguroRepository;
import com.seguros.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
public class ContratoService {

    private final ContratoRepository contratoRepository;
    private final UsuarioRepository usuarioRepository;
    private final SeguroRepository seguroRepository;

    public ContratoService(ContratoRepository contratoRepository,
                           UsuarioRepository usuarioRepository,
                           SeguroRepository seguroRepository) {
        this.contratoRepository = contratoRepository;
        this.usuarioRepository = usuarioRepository;
        this.seguroRepository = seguroRepository;
    }

    @Transactional
    public Contrato crearContrato(ContratoDTO contratoDTO) {
        Usuario cliente = usuarioRepository.findById(contratoDTO.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        Usuario agente = usuarioRepository.findById(contratoDTO.getAgenteId())
                .orElseThrow(() -> new RuntimeException("Agente no encontrado"));

        Seguro seguro = seguroRepository.findById(contratoDTO.getSeguroId())
                .orElseThrow(() -> new RuntimeException("Seguro no encontrado"));

        Contrato contrato = new Contrato();
        contrato.setCliente(cliente);
        contrato.setAgente(agente);
        contrato.setSeguro(seguro);
        contrato.setFechaInicio(contratoDTO.getFechaInicio());
        contrato.setFechaFin(contratoDTO.getFechaFin());
        contrato.setFrecuenciaPago(contratoDTO.getFrecuenciaPago());
        contrato.setFirmaElectronica(contratoDTO.getFirmaElectronica());

        return contratoRepository.save(contrato);
    }

    public List<Contrato> obtenerContratosPorCliente(Long clienteId) {
        return contratoRepository.findContratosActivosPorCliente(clienteId);
    }

    public List<Contrato> obtenerContratosPorVencer(int dias) {
        LocalDate fechaLimite = LocalDate.now().plusDays(dias);
        return contratoRepository.findContratosPorVencer(fechaLimite);
    }

    @Transactional
    public Contrato actualizarEstado(Long contratoId, Contrato.EstadoContrato nuevoEstado) {
        Contrato contrato = contratoRepository.findById(contratoId)
                .orElseThrow(() -> new RuntimeException("Contrato no encontrado"));

        contrato.setEstado(nuevoEstado);
        return contratoRepository.save(contrato);
    }

    public Contrato obtenerContratoValido(Long contratoId) {
        Contrato contrato = contratoRepository.findById(contratoId)
                .orElseThrow(() -> new RuntimeException("Contrato no encontrado"));

        if (!contrato.isActivo()) {
            throw new RuntimeException("El contrato no está activo");
        }

        return contrato;
    }
}