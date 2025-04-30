package com.seguros.base;

import com.seguros.model.Rol;
import com.seguros.model.Usuario;
import com.seguros.repository.RolRepository;
import com.seguros.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Profile("test")
public class TestDataLoader implements CommandLineRunner {

    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public TestDataLoader(RolRepository rolRepository,
                          UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder) {
        this.rolRepository = rolRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Crear roles de prueba
        Rol admin = new Rol("ADMIN", "Administrador");
        Rol agente = new Rol("AGENTE", "Agente de seguros");
        Rol cliente = new Rol("CLIENTE", "Cliente");

        rolRepository.saveAll(List.of(admin, agente, cliente));

        // Crear usuario admin de prueba
        Usuario usuarioAdmin = new Usuario();
        usuarioAdmin.setEmail("admin@test.com");
        usuarioAdmin.setPassword(passwordEncoder.encode("admin123"));
        usuarioAdmin.setNombre("Admin");
        usuarioAdmin.setApellido("Test");
        usuarioAdmin.setRol(admin);
        usuarioAdmin.setActivo(true);

        usuarioRepository.save(usuarioAdmin);
    }
}