package com.seguros.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.seguros.config.SecurityTestConfig;
import com.seguros.dto.SeguroDTO;
import com.seguros.model.Seguro;
import com.seguros.model.Seguro.TipoSeguro;
import com.seguros.security.JwtService;
import com.seguros.service.SeguroService;
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

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SeguroController.class)
@Import(SecurityTestConfig.class)
class SeguroControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SeguroService seguroService;

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
    void testCrearSeguro() throws Exception {
        mockSecurityContext();

        SeguroDTO dto = new SeguroDTO();
        Seguro seguro = new Seguro();

        Mockito.when(seguroService.crearSeguro(any(SeguroDTO.class))).thenReturn(seguro);

        mockMvc.perform(post("/api/seguros")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());
    }

    @Test
    void testObtenerSegurosActivos() throws Exception {
        mockSecurityContext();

        List<Seguro> lista = Arrays.asList(new Seguro(), new Seguro());
        Mockito.when(seguroService.obtenerSegurosActivos()).thenReturn(lista);

        mockMvc.perform(get("/api/seguros")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void testObtenerPorTipo() throws Exception {
        mockSecurityContext();

        TipoSeguro tipo = TipoSeguro.VIDA;
        List<Seguro> lista = Arrays.asList(new Seguro());
        Mockito.when(seguroService.obtenerSegurosPorTipo(tipo)).thenReturn(lista);

        mockMvc.perform(get("/api/seguros/tipo/" + tipo)
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void testActualizarEstado() throws Exception {
        mockSecurityContext();

        Seguro seguro = new Seguro();
        Mockito.when(seguroService.actualizarEstado(eq(1L), eq(true))).thenReturn(seguro);

        mockMvc.perform(put("/api/seguros/1/estado")
                        .header("Authorization", token)
                        .param("activo", "true"))
                .andExpect(status().isOk());
    }
}
