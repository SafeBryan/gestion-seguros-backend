package com.seguros.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.seguros.config.SecurityTestConfig;
import com.seguros.dto.DependienteDTO;
import com.seguros.model.Dependiente;
import com.seguros.security.JwtService;
import com.seguros.service.DependienteService;
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

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DependienteController.class)
@Import(SecurityTestConfig.class)
class DependienteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DependienteService dependienteService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UserDetailsService userDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    private final String token = "Bearer test.jwt.token";

    private void mockSecurityContext() {
        UserDetails mockUser = new User("usuario@test.com", "password",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));

        Mockito.when(jwtService.extractUsername(anyString())).thenReturn("usuario@test.com");
        Mockito.when(jwtService.isTokenValid(anyString(), anyString())).thenReturn(true); // 🔧 Corregido aquí
        Mockito.when(userDetailsService.loadUserByUsername(anyString())).thenReturn(mockUser);
    }


    @Test
    void testActualizarDependientes() throws Exception {
        mockSecurityContext();

        DependienteDTO dto = new DependienteDTO();
        dto.setNombre("Juan");
        dto.setParentesco("Hijo");

        Dependiente dependiente = new Dependiente();
        dependiente.setNombre("Juan");

        Mockito.when(dependienteService.actualizarDependientes(eq(1L), anyList()))
                .thenReturn(List.of(dependiente));

        mockMvc.perform(post("/api/dependientes/contrato/1")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(List.of(dto))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].nombre").value("Juan"));
    }

    @Test
    void testObtenerPorContrato() throws Exception {
        mockSecurityContext();

        Dependiente dependiente = new Dependiente();
        dependiente.setNombre("Maria");

        Mockito.when(dependienteService.obtenerPorContrato(1L)).thenReturn(List.of(dependiente));

        mockMvc.perform(get("/api/dependientes/contrato/1")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].nombre").value("Maria"));
    }
}
