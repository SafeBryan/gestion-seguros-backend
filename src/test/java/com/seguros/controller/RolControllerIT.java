package com.seguros.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class RolControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(roles = "ADMIN")
    void crearRol_IntegrationTest() throws Exception {
        String rolJson = """
    {
        "nombre": "CLIENTE_TEST_123",
        "descripcion": "Rol de prueba"
    }
    """;

        mockMvc.perform(post("/api/roles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(rolJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("CLIENTE_TEST_123"));
    }


    @Test
    @WithMockUser(roles = "ADMIN")
    void obtenerTodosRoles_IntegrationTest() throws Exception {
        mockMvc.perform(get("/api/roles"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void actualizarRol_IntegrationTest() throws Exception {
        // Primero, crear un rol
        String rolJson = """
        {
            "nombre": "TEMP",
            "descripcion": "Temporal"
        }
        """;

        String updatedRolJson = """
        {
            "nombre": "TEMP_ACTUALIZADO",
            "descripcion": "Temporal actualizado"
        }
        """;

        String content = mockMvc.perform(post("/api/roles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(rolJson))
                .andReturn()
                .getResponse()
                .getContentAsString();

        Long rolId = new ObjectMapper().readTree(content).get("id").asLong();

        mockMvc.perform(put("/api/roles/" + rolId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatedRolJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("TEMP_ACTUALIZADO"));
    }
}

