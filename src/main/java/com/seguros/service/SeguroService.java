package com.seguros.service;

import com.seguros.dto.SeguroDTO;
import com.seguros.model.Seguro;
import com.seguros.model.SeguroSalud;
import com.seguros.model.SeguroVida;
import com.seguros.model.Usuario;
import com.seguros.repository.SeguroRepository;
import com.seguros.repository.UsuarioRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SeguroService {

    private final SeguroRepository seguroRepository;
    private final UsuarioRepository usuarioRepository;

    public SeguroService(SeguroRepository seguroRepository,
                         UsuarioRepository usuarioRepository) {
        this.seguroRepository = seguroRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public Seguro crearSeguro(SeguroDTO seguroDTO) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario creadoPor = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (seguroDTO.getTipo() == null) {
            throw new IllegalArgumentException("Tipo de seguro no válido");
        }

        Seguro seguro;

        switch (seguroDTO.getTipo()) {
            case VIDA -> {
                var seguroVida = new SeguroVida();
                seguroVida.setMontoCobertura(seguroDTO.getMontoCobertura());
                seguro = seguroVida;
            }
            case SALUD -> {
                var seguroSalud = new SeguroSalud();
                seguroSalud.setHospitalesConvenio(seguroDTO.getHospitalesConvenio());
                seguroSalud.setNumeroConsultasIncluidas(seguroDTO.getNumeroConsultasIncluidas());
                seguro = seguroSalud;
            }
            default -> throw new IllegalArgumentException("Tipo de seguro no válido");
        }

        seguro.setNombre(seguroDTO.getNombre());
        seguro.setDescripcion(seguroDTO.getDescripcion());
        seguro.setCobertura(seguroDTO.getCobertura());
        seguro.setPrecioAnual(seguroDTO.getPrecioAnual());
        seguro.setActivo(seguroDTO.getActivo());
        seguro.setCreadoPor(creadoPor);

        return seguroRepository.save(seguro);
    }


    public List<Seguro> obtenerSegurosActivos() {
        return seguroRepository.findByActivoTrue();
    }

    public List<Seguro> obtenerTodosLosSeguros() {
        return seguroRepository.findAll();
    }

    public List<Seguro> obtenerSegurosPorTipo(Seguro.TipoSeguro tipo) {
        return seguroRepository.findAll().stream()
                .filter(seguro -> (tipo == Seguro.TipoSeguro.VIDA && seguro instanceof SeguroVida) ||
                        (tipo == Seguro.TipoSeguro.SALUD && seguro instanceof SeguroSalud))
                .toList();
    }

    @Transactional
    public Seguro actualizarEstado(Long seguroId, boolean activo) {
        Seguro seguro = seguroRepository.findById(seguroId)
                .orElseThrow(() -> new RuntimeException("Seguro no encontrado"));

        seguro.setActivo(activo);
        return seguroRepository.save(seguro);
    }

    @Transactional
    public Seguro editarSeguro(Long id, SeguroDTO seguroDTO) {
        Seguro seguroExistente = seguroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seguro no encontrado"));

        // Campos comunes
        seguroExistente.setNombre(seguroDTO.getNombre());
        seguroExistente.setDescripcion(seguroDTO.getDescripcion());
        seguroExistente.setCobertura(seguroDTO.getCobertura());
        seguroExistente.setPrecioAnual(seguroDTO.getPrecioAnual());
        seguroExistente.setActivo(seguroDTO.getActivo());

        // Campos específicos según tipo
        if (seguroExistente instanceof SeguroVida seguroVida) {
            seguroVida.setMontoCobertura(seguroDTO.getMontoCobertura());
        } else if (seguroExistente instanceof SeguroSalud seguroSalud) {
            seguroSalud.setHospitalesConvenio(seguroDTO.getHospitalesConvenio());
            seguroSalud.setNumeroConsultasIncluidas(seguroDTO.getNumeroConsultasIncluidas());
        }

        return seguroRepository.save(seguroExistente);
    }



}
