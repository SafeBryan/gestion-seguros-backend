package com.seguros.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.seguros.dto.SeguroDTO;
import com.seguros.model.Seguro;
import com.seguros.security.JwtService;
import com.seguros.service.SeguroService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class SeguroControllerSecurityTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SeguroService seguroService;

    @MockBean
    private JwtService jwtService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private String getSeguroDTOJson() throws Exception {
        SeguroDTO dto = new SeguroDTO();
        dto.setNombre("Seguro Vida Prueba");
        dto.setTipo(Seguro.TipoSeguro.VIDA);
        dto.setDescripcion("Cobertura total de vida");
        dto.setCobertura("Total");
        dto.setPrecioAnual(new BigDecimal("150.00"));
        dto.setActivo(true);
        dto.setCreadoPorId(1L);
        return objectMapper.writeValueAsString(dto);
    }

    @Test
    @WithAnonymousUser
    void cuandoNoAutenticado_intentaCrearSeguro_deberiaRetornarForbidden() throws Exception {
        mockMvc.perform(post("/api/seguros")
                        .content(getSeguroDTOJson())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "CLIENTE")
    void cuandoCliente_intentaCrearSeguro_deberiaRetornarForbidden() throws Exception {
        mockMvc.perform(post("/api/seguros")
                        .content(getSeguroDTOJson())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void cuandoAdmin_intentaCrearSeguro_deberiaPermitir() throws Exception {
        mockMvc.perform(post("/api/seguros")
                        .content(getSeguroDTOJson())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}