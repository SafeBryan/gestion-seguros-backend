package com.seguros.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.seguros.config.SecurityTestConfig;
import com.seguros.dto.ContratoDTO;
import com.seguros.model.Contrato;
import com.seguros.model.Contrato.EstadoContrato;
import com.seguros.model.Contrato.FrecuenciaPago;
import com.seguros.security.JwtService;
import com.seguros.service.ContratoService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ContratoController.class)
@Import(SecurityTestConfig.class)
class ContratoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ContratoService contratoService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UserDetailsService userDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    private final String token = "Bearer test.jwt.token";

    private void mockSecurityContext() {
        UserDetails mockUser = new User(
                "usuario@example.com",
                "password",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );

        Mockito.when(jwtService.extractUsername(anyString())).thenReturn(mockUser.getUsername());
        Mockito.when(jwtService.isTokenValid(anyString(), anyString())).thenReturn(true);
        Mockito.when(userDetailsService.loadUserByUsername(anyString())).thenReturn(mockUser);
    }

    @Test
    void testCrearContrato() throws Exception {
        mockSecurityContext();

        ContratoDTO dto = new ContratoDTO();
        dto.setClienteId(1L);
        dto.setSeguroId(1L);
        dto.setAgenteId(2L);
        dto.setFechaInicio(LocalDate.now());
        dto.setFechaFin(LocalDate.now().plusDays(30));
        dto.setFrecuenciaPago(FrecuenciaPago.MENSUAL);
        dto.setFirmaElectronica("firma");

        Contrato contrato = new Contrato();
        contrato.setId(1L);

        ContratoDTO dtoEsperado = new ContratoDTO();
        dtoEsperado.setId(1L);

        Mockito.when(contratoService.crearContrato(any(ContratoDTO.class))).thenReturn(contrato);
        Mockito.when(contratoService.convertirAContratoDTO((contrato))).thenReturn(dtoEsperado);

        mockMvc.perform(post("/api/contratos")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }


    @Test
    void testObtenerPorCliente() throws Exception {
        mockSecurityContext();

        Contrato contrato1 = new Contrato();
        contrato1.setId(1L);
        Contrato contrato2 = new Contrato();
        contrato2.setId(2L);

        ContratoDTO dto1 = new ContratoDTO();
        dto1.setId(1L);
        ContratoDTO dto2 = new ContratoDTO();
        dto2.setId(2L);

        Mockito.when(contratoService.obtenerContratosPorCliente(1L))
                .thenReturn(Arrays.asList(contrato1, contrato2));

        Mockito.when(contratoService.convertirAContratoDTO(contrato1)).thenReturn(dto1);
        Mockito.when(contratoService.convertirAContratoDTO(contrato2)).thenReturn(dto2);

        mockMvc.perform(get("/api/contratos/cliente/1")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[1].id").value(2));
    }


    @Test
    void testObtenerPorVencer() throws Exception {
        mockSecurityContext();

        List<Contrato> contratos = Arrays.asList(new Contrato());

        Mockito.when(contratoService.obtenerContratosPorVencer(15)).thenReturn(contratos);

        mockMvc.perform(get("/api/contratos/por-vencer")
                        .header("Authorization", token)
                        .param("dias", "15"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void testObtenerPorVencerDefault() throws Exception {
        mockSecurityContext();

        Mockito.when(contratoService.obtenerContratosPorVencer(30)).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/contratos/por-vencer")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void testActualizarEstado() throws Exception {
        mockSecurityContext();

        Contrato contrato = new Contrato();
        contrato.setId(1L);
        contrato.setEstado(EstadoContrato.CANCELADO);

        ContratoDTO dtoEsperado = new ContratoDTO();
        dtoEsperado.setId(1L);
        dtoEsperado.setEstado(EstadoContrato.CANCELADO);

        Mockito.when(contratoService.actualizarEstado(1L, EstadoContrato.CANCELADO)).thenReturn(contrato);
        Mockito.when(contratoService.convertirAContratoDTO(contrato)).thenReturn(dtoEsperado);

        mockMvc.perform(put("/api/contratos/1/estado")
                        .header("Authorization", token)
                        .param("estado", "CANCELADO"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("CANCELADO"));
    }


    @Test
    void testCrearContratoClienteNoEncontrado() throws Exception {
        mockSecurityContext();

        ContratoDTO dto = new ContratoDTO();
        dto.setClienteId(1L);
        dto.setSeguroId(1L);
        dto.setAgenteId(2L);
        dto.setFechaInicio(LocalDate.now());
        dto.setFechaFin(LocalDate.now().plusDays(30));
        dto.setFrecuenciaPago(FrecuenciaPago.MENSUAL);
        dto.setFirmaElectronica("firma");

        Mockito.when(contratoService.crearContrato(any(ContratoDTO.class)))
                .thenThrow(new RuntimeException("Cliente no encontrado"));

        mockMvc.perform(post("/api/contratos")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Cliente no encontrado"));
    }

    @Test
    void testActualizarEstadoContratoNoEncontrado() throws Exception {
        mockSecurityContext();

        Mockito.when(contratoService.actualizarEstado(eq(1L), any()))
                .thenThrow(new RuntimeException("Contrato no encontrado"));

        mockMvc.perform(put("/api/contratos/1/estado")
                        .header("Authorization", token)
                        .param("estado", "CANCELADO"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Contrato no encontrado"));
    }

    @Test
    void testObtenerPorClienteNoExiste() throws Exception {
        mockSecurityContext();

        Mockito.when(contratoService.obtenerContratosPorCliente(99L))
                .thenThrow(new RuntimeException("Cliente no tiene contratos"));

        mockMvc.perform(get("/api/contratos/cliente/99")
                        .header("Authorization", token))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Cliente no tiene contratos"));
    }

    @Test
    void testObtenerPorVencerLanzaError() throws Exception {
        mockSecurityContext();

        Mockito.when(contratoService.obtenerContratosPorVencer(anyInt()))
                .thenThrow(new RuntimeException("Error en la búsqueda"));

        mockMvc.perform(get("/api/contratos/por-vencer")
                        .header("Authorization", token)
                        .param("dias", "15"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Error en la búsqueda"));
    }
    @Test
    void testActualizarContrato() throws Exception {
        mockSecurityContext();

        ContratoDTO dto = new ContratoDTO();
        dto.setClienteId(1L);
        dto.setAgenteId(2L);
        dto.setSeguroId(3L);
        dto.setFechaInicio(LocalDate.now());
        dto.setFechaFin(LocalDate.now().plusDays(30));
        dto.setFrecuenciaPago(FrecuenciaPago.ANUAL);
        dto.setFirmaElectronica("firmaActualizada");

        Contrato contratoActualizado = new Contrato();
        contratoActualizado.setId(1L);

        ContratoDTO respuestaDTO = new ContratoDTO();
        respuestaDTO.setId(1L);
        respuestaDTO.setFirmaElectronica("firmaActualizada");

        Mockito.when(contratoService.actualizarContrato(eq(1L), any(ContratoDTO.class)))
                .thenReturn(contratoActualizado);
        Mockito.when(contratoService.convertirAContratoDTO((contratoActualizado)))
                .thenReturn(respuestaDTO);

        mockMvc.perform(put("/api/contratos/1")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.firmaElectronica").value("firmaActualizada"));
    }
    @Test
    void testActualizarContratoNoExiste() throws Exception {
        mockSecurityContext();

        ContratoDTO dto = new ContratoDTO();
        dto.setClienteId(1L);
        dto.setAgenteId(2L);
        dto.setSeguroId(3L);
        dto.setFechaInicio(LocalDate.now());
        dto.setFechaFin(LocalDate.now().plusDays(30));
        dto.setFrecuenciaPago(FrecuenciaPago.ANUAL);
        dto.setFirmaElectronica("firmaActualizada");

        Mockito.when(contratoService.actualizarContrato(eq(1L), any(ContratoDTO.class)))
                .thenThrow(new RuntimeException("Contrato no encontrado"));

        mockMvc.perform(put("/api/contratos/1")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Contrato no encontrado"));
    }

}
