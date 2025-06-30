package com.seguros.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;


import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class RolControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    private final String rolJson = """
    {
        "nombre": "TEST",
        "descripcion": "Test rol"
    }
    """;

    @Test
    @WithAnonymousUser
    void cuandoNoAutenticado_intentaCrearRol_retornaForbidden() throws Exception {
        mockMvc.perform(post("/api/roles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(rolJson))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "CLIENTE")
    void cuandoCliente_intentaCrearRol_retornaForbidden() throws Exception {
        mockMvc.perform(post("/api/roles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(rolJson))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "CLIENTE")
    void cuandoCliente_intentaActualizarRol_retornaForbidden() throws Exception {
        mockMvc.perform(put("/api/roles/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
            {
                "nombre": "TEST",
                "descripcion": "Test rol"
            }
            """))
                .andExpect(status().isForbidden());
    }


    @Test
    @WithAnonymousUser
    void cuandoNoAutenticado_intentaVerRoles_retornaStatus() throws Exception {
        mockMvc.perform(post("/api/roles"))
                .andExpect(status().isForbidden()); // o .isUnauthorized() dependiendo de tu config
    }

    @WithMockUser(roles = "ADMIN")
    void cuandoAdmin_intentaCrearRol_retornaOk() throws Exception {
        mockMvc.perform(post("/api/roles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
            {
                "nombre": "ADMIN_TEST_"  // Usa un nombre diferente cada vez
                , "descripcion": "Test rol"
            }
            """))
                .andExpect(status().isOk());
    }




}

