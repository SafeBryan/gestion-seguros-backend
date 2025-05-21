package com.seguros.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.qameta.allure.*;
import io.qameta.allure.junit5.AllureJunit5;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
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
@ExtendWith(AllureJunit5.class)
public class RolControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Epic("Gestión de Usuarios")
    @Feature("CRUD de Rol")
    @Story("Creación de rol desde API")
    @DisplayName("Crear rol correctamente con MockMvc")
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
    @DisplayName("Obtener todos los roles como ADMIN")
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
    @Test
    @WithMockUser(roles = "ADMIN")
    void crearRol_conDatosInvalidos_debeRetornarBadRequest() throws Exception {
        String rolJsonInvalido = """
    {
        "nombre": "",  // Nombre vacío
        "descripcion": "Descripción sin nombre"
    }
    """;

        mockMvc.perform(post("/api/roles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(rolJsonInvalido))
                .andExpect(status().isBadRequest());
    }

    @Test
    void obtenerTodosRoles_sinAutenticacion_debeRetornarUnauthorized() throws Exception {
        mockMvc.perform(get("/api/roles"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void actualizarRol_conIdInexistente_debeRetornarNotFound() throws Exception {
        String updatedRolJson = """
    {
        "nombre": "INEXISTENTE",
        "descripcion": "Rol que no existe"
    }
    """;

        mockMvc.perform(put("/api/roles/99999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatedRolJson))
                .andExpect(status().isNotFound());
    }
    @Test
    @WithMockUser(roles = "USER")
    void crearRol_sinPermiso_debeRetornarForbidden() throws Exception {
        String rolJson = """
    {
        "nombre": "NO_ADMIN",
        "descripcion": "Sin permisos"
    }
    """;

        mockMvc.perform(post("/api/roles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(rolJson))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void eliminarRol_existente_debeRetornarNoContent() throws Exception {
        String rolJson = """
    {
        "nombre": "A_ELIMINAR",
        "descripcion": "Rol a eliminar"
    }
    """;

        String content = mockMvc.perform(post("/api/roles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(rolJson))
                .andReturn().getResponse().getContentAsString();

        Long rolId = new ObjectMapper().readTree(content).get("id").asLong();

        mockMvc.perform(delete("/api/roles/" + rolId))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void eliminarRol_inexistente_debeRetornarNotFound() throws Exception {
        mockMvc.perform(delete("/api/roles/99999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void obtenerRolPorId_existente_debeRetornarRol() throws Exception {
        String rolJson = """
    {
        "nombre": "UNICO",
        "descripcion": "Rol único"
    }
    """;

        String content = mockMvc.perform(post("/api/roles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(rolJson))
                .andReturn().getResponse().getContentAsString();

        Long rolId = new ObjectMapper().readTree(content).get("id").asLong();

        mockMvc.perform(get("/api/roles/" + rolId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("UNICO"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void actualizarRol_conDatosInvalidos_debeRetornarBadRequest() throws Exception {
        String rolJson = """
    {
        "nombre": "VALIDO",
        "descripcion": "Temporal"
    }
    """;

        String content = mockMvc.perform(post("/api/roles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(rolJson))
                .andReturn().getResponse().getContentAsString();

        Long rolId = new ObjectMapper().readTree(content).get("id").asLong();

        String rolInvalido = """
    {
        "nombre": "",
        "descripcion": "Actualización inválida"
    }
    """;

        mockMvc.perform(put("/api/roles/" + rolId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(rolInvalido))
                .andExpect(status().isBadRequest());
    }


}
