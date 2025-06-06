package com.seguros.controller;

import com.seguros.model.Rol;
import com.seguros.model.Seguro;
import com.seguros.model.Seguro.TipoSeguro;
import com.seguros.model.Usuario;
import com.seguros.repository.RolRepository;
import com.seguros.repository.SeguroRepository;
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

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class SeguroControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SeguroRepository seguroRepository;

    @Autowired
    private RolRepository rolRepository;


    @Autowired
    private UsuarioRepository usuarioRepository;

    private Usuario creador;
    private Seguro seguroExistente;

    @BeforeEach
    void setUp() {
        // Buscar rol ADMIN existente o crearlo
        Rol rolAdmin = rolRepository.findByNombre("ADMIN").orElseGet(() -> {
            Rol nuevo = new Rol();
            nuevo.setNombre("ADMIN");
            nuevo.setDescripcion("Administrador");
            return rolRepository.save(nuevo);
        });

        // Crear usuario
        creador = new Usuario();
        creador.setEmail("admin@test.com");
        creador.setPassword("123456");
        creador.setNombre("Admin");
        creador.setApellido("User");
        creador.setActivo(true);
        creador.setRol(rolAdmin); // asociar el rol existente
        creador = usuarioRepository.save(creador);

        // Crear seguro
        seguroExistente = new Seguro();
        seguroExistente.setNombre("Seguro Vida");
        seguroExistente.setDescripcion("Cobertura completa de vida");
        seguroExistente.setTipo(TipoSeguro.VIDA);
        seguroExistente.setActivo(true);
        seguroExistente.setPrecioAnual(new BigDecimal("120.00"));
        seguroExistente.setCreadoPor(creador);
        seguroRepository.save(seguroExistente);
    }



    @Test
    @WithMockUser(roles = "ADMIN")
    void crearSeguro_IntegrationTest() throws Exception {
        String seguroJson = String.format("""
        {
            "nombre": "Seguro Salud",
            "descripcion": "Cobertura completa de salud",
            "tipo": "SALUD",
            "precioAnual": 250.0,
            "activo": true,
            "creadoPorId": %d
        }
        """, creador.getId());

        mockMvc.perform(post("/api/seguros")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(seguroJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Seguro Salud"));
    }


    @Test
    @WithMockUser(roles = "ADMIN")
    void obtenerSegurosPorTipo_IntegrationTest() throws Exception {
        mockMvc.perform(get("/api/seguros/tipo/VIDA"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.nombre == 'Seguro Vida')]").exists());
    }
}

