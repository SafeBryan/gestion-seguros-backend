package com.seguros.service;

import com.seguros.dto.RegistroDTO;
import com.seguros.dto.UsuarioDTO;
import com.seguros.model.Rol;
import com.seguros.model.Usuario;
import com.seguros.repository.RolRepository;
import com.seguros.repository.UsuarioRepository;
import com.seguros.util.MensajesError;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository,
                          RolRepository rolRepository,
                          PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Usuario crearUsuario(RegistroDTO registroDTO) {
        if (usuarioRepository.existsByEmail(registroDTO.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        Rol rol = rolRepository.findById(registroDTO.getRolId())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        Usuario usuario = new Usuario();
        usuario.setEmail(registroDTO.getEmail());
        usuario.setPassword(passwordEncoder.encode(registroDTO.getPassword()));
        usuario.setNombre(registroDTO.getNombre());
        usuario.setApellido(registroDTO.getApellido());
        usuario.setTelefono(registroDTO.getTelefono());
        usuario.setRol(rol);
        usuario.setActivo(true);

        return usuarioRepository.save(usuario);
    }

    public List<UsuarioDTO> obtenerTodosUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public List<UsuarioDTO> obtenerUsuariosPorRol(String rolNombre) {
        return usuarioRepository.findByRolNombre(rolNombre).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public Usuario actualizarEstado(Long usuarioId, boolean activo) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException(MensajesError.USUARIO_NO_ENCONTRADO));
        usuario.setActivo(activo);
        return usuarioRepository.save(usuario);
    }

    private UsuarioDTO convertirADTO(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setEmail(usuario.getEmail());
        dto.setNombre(usuario.getNombre());
        dto.setApellido(usuario.getApellido());
        dto.setTelefono(usuario.getTelefono());
        dto.setRolId(usuario.getRol().getId());
        dto.setRolNombre(usuario.getRol().getNombre());
        dto.setActivo(usuario.isActivo());
        return dto;
    }

    public Usuario obtenerUsuario(Long usuarioId) {
        return usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException(MensajesError.USUARIO_NO_ENCONTRADO));
    }
    @Transactional
    public Usuario actualizarUsuario(Long usuarioId, UsuarioDTO usuarioDTO) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException(MensajesError.USUARIO_NO_ENCONTRADO));

        usuario.setNombre(usuarioDTO.getNombre());
        usuario.setApellido(usuarioDTO.getApellido());
        usuario.setTelefono(usuarioDTO.getTelefono());

        // Actualizar el email solo si es diferente y no existe en otro usuario
        if (!usuario.getEmail().equals(usuarioDTO.getEmail())) {
            if (usuarioRepository.existsByEmail(usuarioDTO.getEmail())) {
                throw new RuntimeException("El email ya está registrado");
            }
            usuario.setEmail(usuarioDTO.getEmail());
        }

        // Actualizar el rol si es necesario
        if (!usuario.getRol().getId().equals(usuarioDTO.getRolId())) {
            Rol rol = rolRepository.findById(usuarioDTO.getRolId())
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
            usuario.setRol(rol);
        }

        return usuarioRepository.save(usuario);
    }

    @Transactional
    public void eliminarUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException(MensajesError.USUARIO_NO_ENCONTRADO));
        // Opción 2: Eliminación lógica (desactivar el usuario)
         usuario.setActivo(false);
         usuarioRepository.save(usuario);
    }
}