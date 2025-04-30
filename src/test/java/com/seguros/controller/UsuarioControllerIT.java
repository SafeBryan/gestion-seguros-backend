package com.seguros.controller;

import com.seguros.model.Rol;
import com.seguros.model.Usuario;
import com.seguros.repository.RolRepository;
import com.seguros.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class UsuarioControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    private Rol rolAdmin;

    @BeforeEach
    void setUp() {
        rolAdmin = rolRepository.findByNombre("ADMIN").orElseGet(() -> {
            Rol nuevoRol = new Rol();
            nuevoRol.setNombre("ADMIN");
            nuevoRol.setDescripcion("Administrador");
            return rolRepository.save(nuevoRol);
        });

        Usuario usuario = new Usuario();
        usuario.setEmail("admin@test.com");
        usuario.setPassword("password");
        usuario.setNombre("Admin");
        usuario.setApellido("User");
        usuario.setRol(rolAdmin);
        usuario.setActivo(true);
        usuarioRepository.save(usuario);
    }


    @Test
    @WithMockUser(roles = "ADMIN")
    void crearUsuario_IntegrationTest() throws Exception {
        String usuarioJson = "{\"email\":\"nuevo@test.com\",\"password\":\"password\",\"nombre\":\"Nuevo\",\"apellido\":\"Usuario\",\"telefono\":\"123456789\",\"rolId\":" + rolAdmin.getId() + "}";

        mockMvc.perform(post("/api/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(usuarioJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("nuevo@test.com"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void obtenerUsuariosPorRol_IntegrationTest() throws Exception {
        mockMvc.perform(get("/api/usuarios/rol/ADMIN"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.email == 'admin@test.com')]").exists());
    }

}