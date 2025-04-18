package com.seguros.repository;

import com.seguros.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    List<Usuario> findByRolNombre(String rolNombre);
    boolean existsByEmail(String email);
    List<Usuario> findByActivo(boolean activo);
}