package com.seguros.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;


import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ReembolsoControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void accesoDenegadoSinAutenticacion() throws Exception {
        mockMvc.perform(get("/api/reembolsos/mis-reembolsos"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void accesoPermitidoParaAdminEnPendientes() throws Exception {
        mockMvc.perform(get("/api/reembolsos/pendientes"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "AGENTE")
    void accesoPermitidoParaAgenteEnPendientes() throws Exception {
        mockMvc.perform(get("/api/reembolsos/pendientes"))
                .andExpect(status().isOk());
    }
}
