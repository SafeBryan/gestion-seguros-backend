package com.seguros.service;

import com.seguros.dto.BeneficiarioDTO;
import com.seguros.model.Beneficiario;
import com.seguros.model.Contrato;
import com.seguros.repository.BeneficiarioRepository;
import com.seguros.repository.ContratoRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class BeneficiarioService {

    private final BeneficiarioRepository beneficiarioRepository;
    private final ContratoRepository contratoRepository;

    public BeneficiarioService(BeneficiarioRepository beneficiarioRepository, ContratoRepository contratoRepository) {
        this.beneficiarioRepository = beneficiarioRepository;
        this.contratoRepository = contratoRepository;
    }

    @Transactional
    public Beneficiario crearBeneficiario(BeneficiarioDTO dto) {
        Contrato contrato = contratoRepository.findById(dto.getContratoId())
                .orElseThrow(() -> new RuntimeException("Contrato no encontrado"));

        BigDecimal porcentajeTotal = beneficiarioRepository.sumPorcentajeByContratoId(contrato.getId());
        if (porcentajeTotal == null) {
            porcentajeTotal = BigDecimal.ZERO;
        }

        if (porcentajeTotal.add(dto.getPorcentaje()).compareTo(new BigDecimal("100")) > 0) {
            throw new RuntimeException("La suma de porcentajes no puede exceder el 100%");
        }

        Beneficiario beneficiario = new Beneficiario();
        beneficiario.setContrato(contrato);
        beneficiario.setNombre(dto.getNombre());
        beneficiario.setParentesco(dto.getParentesco());
        beneficiario.setPorcentaje(dto.getPorcentaje());
        beneficiario.setEsPrincipal(dto.isEsPrincipal());
        beneficiario.setDocumentoIdentidad(dto.getDocumentoIdentidad());
        beneficiario.setEmail(dto.getEmail());
        beneficiario.setTelefono(dto.getTelefono());
        beneficiario.setFechaNacimiento(dto.getFechaNacimiento());

        return beneficiarioRepository.save(beneficiario);
    }

    @Transactional
    public List<Beneficiario> actualizarBeneficiarios(Long contratoId, List<BeneficiarioDTO> beneficiariosDTO) {
        beneficiarioRepository.deleteAllByContratoId(contratoId);

        BigDecimal porcentajeTotal = beneficiariosDTO.stream()
                .map(BeneficiarioDTO::getPorcentaje)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (porcentajeTotal.compareTo(new BigDecimal("100")) != 0) {
            throw new RuntimeException("La suma total de porcentajes debe ser exactamente 100%");
        }

        return beneficiariosDTO.stream()
                .map(this::crearBeneficiario)
                .toList();
    }

    public List<Beneficiario> obtenerPorContrato(Long contratoId) {
        return beneficiarioRepository.findByContratoId(contratoId);
    }

    public List<Beneficiario> obtenerPorCliente(Long clienteId) {
        return beneficiarioRepository.findByClienteId(clienteId);
    }
}
