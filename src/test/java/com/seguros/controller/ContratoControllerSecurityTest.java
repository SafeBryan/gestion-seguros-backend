package com.seguros.controller;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.beans.factory.annotation.Autowired;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ContratoControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void accesoDenegadoSinAutenticacion() throws Exception {
        mockMvc.perform(get("/api/contratos/cliente/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "USER")
    void accesoPermitidoConRolUsuario() throws Exception {
        mockMvc.perform(get("/api/contratos/cliente/1"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void accesoPermitidoConRolAdmin() throws Exception {
        mockMvc.perform(get("/api/contratos/cliente/1"))
                .andExpect(status().isOk());
    }
}
