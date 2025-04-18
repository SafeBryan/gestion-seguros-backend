package com.seguros.service;

import com.seguros.dto.SeguroDTO;
import com.seguros.model.Seguro;
import com.seguros.model.Usuario;
import com.seguros.repository.SeguroRepository;
import com.seguros.repository.UsuarioRepository;
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
        Usuario creadoPor = usuarioRepository.findById(seguroDTO.getCreadoPorId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Seguro seguro = new Seguro();
        seguro.setNombre(seguroDTO.getNombre());
        seguro.setTipo(seguroDTO.getTipo());
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

    public List<Seguro> obtenerSegurosPorTipo(Seguro.TipoSeguro tipo) {
        return seguroRepository.findByTipo(tipo);
    }

    @Transactional
    public Seguro actualizarEstado(Long seguroId, boolean activo) {
        Seguro seguro = seguroRepository.findById(seguroId)
                .orElseThrow(() -> new RuntimeException("Seguro no encontrado"));

        seguro.setActivo(activo);
        return seguroRepository.save(seguro);
    }
}