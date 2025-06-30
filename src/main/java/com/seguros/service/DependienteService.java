package com.seguros.service;

import com.seguros.dto.DependienteDTO;
import com.seguros.model.Contrato;
import com.seguros.model.Dependiente;
import com.seguros.repository.ContratoRepository;
import com.seguros.repository.DependienteRepository;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;

@Service
public class DependienteService {

    private final DependienteRepository dependienteRepository;
    private final ContratoRepository contratoRepository;

    public DependienteService(DependienteRepository dependienteRepository, ContratoRepository contratoRepository) {
        this.dependienteRepository = dependienteRepository;
        this.contratoRepository = contratoRepository;
    }

    @Transactional
    public Dependiente crearDependiente(DependienteDTO dto) {
        Contrato contrato = contratoRepository.findById(dto.getContratoId())
                .orElseThrow(() -> new RuntimeException("Contrato no encontrado"));

        Dependiente d = new Dependiente();
        d.setContrato(contrato);
        d.setNombre(dto.getNombre());
        d.setParentesco(dto.getParentesco());
        d.setDocumentoIdentidad(dto.getDocumentoIdentidad());
        d.setEmail(dto.getEmail());
        d.setTelefono(dto.getTelefono());
        d.setFechaNacimiento(dto.getFechaNacimiento());

        return dependienteRepository.save(d);
    }

    @Transactional
    public List<Dependiente> actualizarDependientes(Long contratoId, List<DependienteDTO> dependientesDTO) {
        dependienteRepository.deleteAllByContratoId(contratoId);

        return dependientesDTO.stream()
                .map(this::crearDependiente)
                .toList();
    }

    public List<Dependiente> obtenerPorContrato(Long contratoId) {
        return dependienteRepository.findByContratoId(contratoId);
    }
}
