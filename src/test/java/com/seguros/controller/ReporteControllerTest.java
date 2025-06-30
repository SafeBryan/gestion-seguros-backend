package com.seguros.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.seguros.config.SecurityTestConfig;
import com.seguros.dto.ContratoDTO;
import com.seguros.dto.ReembolsoResponseDTO;
import com.seguros.model.Contrato;
import com.seguros.model.Reembolso;
import com.seguros.security.JwtService;
import com.seguros.service.ContratoService;
import com.seguros.service.ReembolsoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ReporteController.class)
@Import(SecurityTestConfig.class)
class ReporteControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockBean private ContratoService contratoService;
    @MockBean private ReembolsoService reembolsoService;
    @MockBean private JwtService jwtService;
    @MockBean private UserDetailsService userDetailsService;

    private final String token = "Bearer test.jwt.token";

    @BeforeEach
    void setupSecurityMocks() {
        Mockito.when(jwtService.extractUsername(any())).thenReturn("usuario@example.com");
        Mockito.when(jwtService.isTokenValid(Mockito.anyString(), Mockito.anyString())).thenReturn(true);
        Mockito.when(userDetailsService.loadUserByUsername(any()))
                .thenReturn(new User("usuario@example.com", "", List.of()));
    }

    @Test
    void testGetSegurosImpagos() throws Exception {
        ContratoDTO dto = new ContratoDTO();
        dto.setId(1L);

        Mockito.when(contratoService.obtenerContratosImpagos()).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/reportes/seguros-impagos")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    void testGetContratosPorCliente() throws Exception {
        Contrato contrato = new Contrato();
        contrato.setId(1L);
        ContratoDTO dto = new ContratoDTO();
        dto.setId(1L);

        Mockito.when(contratoService.obtenerContratosPorCliente(anyLong())).thenReturn(List.of(contrato));
        Mockito.when(contratoService.convertirAContratoDTO(contrato)).thenReturn(dto);

        mockMvc.perform(get("/api/reportes/contratos-por-cliente/1")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    void testGetReembolsosPendientes() throws Exception {
        Reembolso reembolso = new Reembolso();
        reembolso.setId(1L);
        ReembolsoResponseDTO dto = new ReembolsoResponseDTO();
        dto.setId(1L);

        Mockito.when(reembolsoService.obtenerReembolsosPendientes()).thenReturn(List.of(reembolso));
        Mockito.when(reembolsoService.convertirADTO(reembolso)).thenReturn(dto);

        mockMvc.perform(get("/api/reportes/reembolsos-pendientes")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    void testGetContratosVencidos() throws Exception {
        ContratoDTO dto = new ContratoDTO();
        dto.setId(1L);

        Mockito.when(contratoService.obtenerContratosVencidos()).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/reportes/contratos-vencidos")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    void testGetContratosPorVencer() throws Exception {
        ContratoDTO dto = new ContratoDTO();
        dto.setId(1L);

        Mockito.when(contratoService.obtenerContratosPorVencer()).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/reportes/contratos-por-vencer")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }
}
