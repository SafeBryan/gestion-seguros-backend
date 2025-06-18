package com.seguros.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.seguros.config.SecurityTestConfig;
import com.seguros.dto.BeneficiarioDTO;
import com.seguros.model.Beneficiario;
import com.seguros.security.JwtService;
import com.seguros.service.BeneficiarioService;
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

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BeneficiarioController.class)
@Import(SecurityTestConfig.class)
public class BeneficiarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BeneficiarioService beneficiarioService;

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
        Mockito.when(jwtService.extractUsername(any(String.class))).thenReturn(mockUser.getUsername());
        Mockito.when(jwtService.isTokenValid(any(String.class), any(UserDetails.class))).thenReturn(true); // ✅ Línea corregida
        Mockito.when(userDetailsService.loadUserByUsername(any(String.class))).thenReturn(mockUser);
    }



    @Test
    void testCrearBeneficiario() throws Exception {
        mockSecurityContext();

        BeneficiarioDTO dto = new BeneficiarioDTO();
        dto.setNombre("Juan");
        dto.setParentesco("Hijo");

        Beneficiario beneficiario = new Beneficiario();
        beneficiario.setId(1L);
        beneficiario.setNombre("Juan");

        Mockito.when(beneficiarioService.crearBeneficiario(any(BeneficiarioDTO.class))).thenReturn(beneficiario);

        mockMvc.perform(post("/api/beneficiarios")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.nombre").value("Juan"));
    }

    @Test
    void testActualizarBeneficiarios() throws Exception {
        mockSecurityContext();

        BeneficiarioDTO dto = new BeneficiarioDTO();
        dto.setNombre("Maria");

        Beneficiario beneficiario = new Beneficiario();
        beneficiario.setId(1L);
        beneficiario.setNombre("Maria");

        Mockito.when(beneficiarioService.actualizarBeneficiarios(eq(1L), any()))
                .thenReturn(List.of(beneficiario));

        mockMvc.perform(post("/api/beneficiarios/contrato/1")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(List.of(dto))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].nombre").value("Maria"));
    }

    @Test
    void testObtenerPorContrato() throws Exception {
        mockSecurityContext();

        Beneficiario beneficiario = new Beneficiario();
        beneficiario.setId(1L);
        beneficiario.setNombre("Pedro");

        Mockito.when(beneficiarioService.obtenerPorContrato(1L))
                .thenReturn(List.of(beneficiario));

        mockMvc.perform(get("/api/beneficiarios/contrato/1")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].nombre").value("Pedro"));
    }

    @Test
    void testObtenerPorCliente() throws Exception {
        mockSecurityContext();

        Beneficiario beneficiario = new Beneficiario();
        beneficiario.setId(1L);
        beneficiario.setNombre("Lucia");

        Mockito.when(beneficiarioService.obtenerPorCliente(1L))
                .thenReturn(List.of(beneficiario));

        mockMvc.perform(get("/api/beneficiarios/cliente/1")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].nombre").value("Lucia"));
    }

    @Test
    void testCrearBeneficiarioError() throws Exception {
        mockSecurityContext();

        BeneficiarioDTO dto = new BeneficiarioDTO();
        dto.setNombre("Error");

        Mockito.when(beneficiarioService.crearBeneficiario(any()))
                .thenThrow(new RuntimeException("Error al crear beneficiario"));

        mockMvc.perform(post("/api/beneficiarios")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Error al crear beneficiario"));
    }
}
