package com.seguros.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.seguros.config.SecurityTestConfig;
import com.seguros.dto.PagoDTO;
import com.seguros.model.Pago;
import com.seguros.security.JwtService;
import com.seguros.service.PagoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PagoController.class)
@Import(SecurityTestConfig.class)
class PagoControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockBean private PagoService pagoService;
    @MockBean private JwtService jwtService;
    @MockBean private UserDetailsService userDetailsService;

    private final String token = "Bearer test.jwt.token";

    @BeforeEach
    void setupSecurity() {
        Mockito.when(jwtService.extractUsername(any())).thenReturn("usuario@example.com");
        Mockito.when(jwtService.isTokenValid(Mockito.anyString(), Mockito.anyString())).thenReturn(true);
        Mockito.when(userDetailsService.loadUserByUsername(any()))
                .thenReturn(new User("usuario@example.com", "", List.of()));
    }

    @Test
    void testRegistrarPago() throws Exception {
        PagoDTO inputDto = new PagoDTO();
        inputDto.setContratoId(1L);
        inputDto.setMonto(BigDecimal.valueOf(100));

        Pago pago = new Pago();
        pago.setId(1L);

        PagoDTO responseDto = new PagoDTO();
        responseDto.setId(1L);

        Mockito.when(pagoService.registrarPago(any())).thenReturn(pago);
        Mockito.when(pagoService.convertToDto(pago)).thenReturn(responseDto);

        mockMvc.perform(post("/api/pagos")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void testObtenerPorContrato() throws Exception {
        PagoDTO dto = new PagoDTO();
        dto.setId(1L);

        Mockito.when(pagoService.obtenerPagosPorContrato(anyLong())).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/pagos/contrato/1")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    void testObtenerPorCliente() throws Exception {
        PagoDTO dto = new PagoDTO();
        dto.setId(1L);

        Mockito.when(pagoService.obtenerPagosPorCliente(anyLong())).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/pagos/cliente/1")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    void testObtenerTotalPagado() throws Exception {
        Mockito.when(pagoService.obtenerTotalPagadoPorContrato(1L)).thenReturn(BigDecimal.valueOf(300));

        mockMvc.perform(get("/api/pagos/total/1")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(content().string("300"));
    }

    @Test
    void testGenerarReporte() throws Exception {
        PagoDTO dto = new PagoDTO();
        dto.setId(1L);

        String fechaInicio = "2025-05-25T14:13:14.169717";
        String fechaFin = "2025-06-24T14:13:14.169771";

        Mockito.when(pagoService.generarReportePagos(any(), any())).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/pagos/reporte")
                        .header("Authorization", token)
                        .param("fechaInicio", fechaInicio)
                        .param("fechaFin", fechaFin))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }


    @Test
    void testRevertirPago() throws Exception {
        mockMvc.perform(post("/api/pagos/1/revertir")
                        .header("Authorization", token)
                        .param("motivo", "Error de cobro"))
                .andExpect(status().isOk());

        Mockito.verify(pagoService).revertirPago(1L, "Error de cobro");
    }
}
