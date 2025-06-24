package com.seguros.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class PagoControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void accesoDenegadoSinAutenticacion() throws Exception {
        mockMvc.perform(get("/api/pagos/contrato/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "USER")
    void accesoPermitidoUsuarioAutenticado() throws Exception {
        mockMvc.perform(get("/api/pagos/contrato/1"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void accesoPermitidoAdminParaReportePagos() throws Exception {
        mockMvc.perform(get("/api/pagos/reporte")
                        .param("fechaInicio", "2024-01-01T00:00:00")
                        .param("fechaFin", "2024-12-31T23:59:59"))
                .andExpect(status().isOk());
    }
}
