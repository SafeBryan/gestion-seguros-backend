package com.seguros.service;

import com.seguros.dto.RolDTO;
import com.seguros.model.Rol;
import com.seguros.repository.RolRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RolService {

    private final RolRepository rolRepository;

    public RolService(RolRepository rolRepository) {
        this.rolRepository = rolRepository;
    }

    @Transactional
    public Rol crearRol(RolDTO rolDTO) {
        if (rolRepository.existsByNombre(rolDTO.getNombre())) {
            throw new RuntimeException("El nombre de rol ya existe");
        }

        Rol rol = new Rol();
        rol.setNombre(rolDTO.getNombre());
        rol.setDescripcion(rolDTO.getDescripcion());

        return rolRepository.save(rol);
    }

    public List<RolDTO> obtenerTodosRoles() {
        return rolRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public RolDTO obtenerRolPorId(Long id) {
        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        return convertirADTO(rol);
    }

    @Transactional
    public Rol actualizarRol(Long id, RolDTO rolDTO) {
        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        if (!rol.getNombre().equals(rolDTO.getNombre())) {
            if (rolRepository.existsByNombre(rolDTO.getNombre())) {
                throw new RuntimeException("El nombre de rol ya existe");
            }
            rol.setNombre(rolDTO.getNombre());
        }

        rol.setDescripcion(rolDTO.getDescripcion());
        return rolRepository.save(rol);
    }

    @Transactional
    public void eliminarRol(Long id) {
        if (!rolRepository.existsById(id)) {
            throw new RuntimeException("Rol no encontrado");
        }
        rolRepository.deleteById(id);
    }

    private RolDTO convertirADTO(Rol rol) {
        RolDTO dto = new RolDTO();
        dto.setId(rol.getId());
        dto.setNombre(rol.getNombre());
        dto.setDescripcion(rol.getDescripcion());
        return dto;
    }
}
