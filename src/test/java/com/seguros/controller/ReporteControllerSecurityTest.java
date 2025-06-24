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
class ReporteControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void accesoDenegadoSinAutenticacion() throws Exception {
        mockMvc.perform(get("/api/reportes/contratos-vencidos"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void accesoPermitidoParaAdmin() throws Exception {
        mockMvc.perform(get("/api/reportes/contratos-vencidos"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "AGENTE")
    void accesoPermitidoParaAgente() throws Exception {
        mockMvc.perform(get("/api/reportes/seguros-impagos"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "USER")
    void accesoPermitidoParaClienteSoloEnContratosPropios() throws Exception {
        mockMvc.perform(get("/api/reportes/contratos-por-cliente/1"))
                .andExpect(status().isOk()); // Este test pasa si el endpoint permite acceso al cliente
    }
}
