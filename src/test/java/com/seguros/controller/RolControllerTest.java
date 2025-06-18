package com.seguros.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.seguros.config.SecurityTestConfig;
import com.seguros.dto.RolDTO;
import com.seguros.model.Rol;
import com.seguros.security.JwtService;
import com.seguros.service.RolService;
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

@WebMvcTest(RolController.class)
@Import(SecurityTestConfig.class)
public class RolControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RolService rolService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UserDetailsService userDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    private final String token = "Bearer test.jwt.token";

    private void mockSecurityContext() {
        UserDetails user = new User("admin", "123", List.of(new SimpleGrantedAuthority("ROLE_ADMIN")));
        Mockito.when(jwtService.extractUsername(any())).thenReturn("admin");
        Mockito.when(jwtService.isTokenValid(any(String.class), any(UserDetails.class))).thenReturn(true);
        Mockito.when(userDetailsService.loadUserByUsername("admin")).thenReturn(user);
    }

    @Test
    void testCrearRol() throws Exception {
        mockSecurityContext();

        RolDTO dto = new RolDTO();
        dto.setNombre("NUEVO");
        dto.setDescripcion("Descripción");

        Rol rol = new Rol();
        rol.setId(1L);
        rol.setNombre("NUEVO");
        rol.setDescripcion("Descripción");

        Mockito.when(rolService.crearRol(any())).thenReturn(rol);

        mockMvc.perform(post("/api/roles")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("NUEVO"));
    }

    @Test
    void testObtenerTodosRoles() throws Exception {
        mockSecurityContext();

        RolDTO dto = new RolDTO();
        dto.setNombre("ADMIN");
        dto.setDescripcion("Administrador");

        Mockito.when(rolService.obtenerTodosRoles()).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/roles")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void testActualizarRol() throws Exception {
        mockSecurityContext();

        RolDTO dto = new RolDTO();
        dto.setNombre("ACTUALIZADO");
        dto.setDescripcion("Nuevo nombre");

        Rol rol = new Rol();
        rol.setId(1L);
        rol.setNombre("ACTUALIZADO");
        rol.setDescripcion("Nuevo nombre");

        Mockito.when(rolService.actualizarRol(eq(1L), any())).thenReturn(rol);

        mockMvc.perform(put("/api/roles/1")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("ACTUALIZADO"));
    }

    @Test
    void testEliminarRol() throws Exception {
        mockSecurityContext();

        Mockito.doNothing().when(rolService).eliminarRol(1L);

        mockMvc.perform(delete("/api/roles/1")
                        .header("Authorization", token))
                .andExpect(status().isNoContent());
    }

    @Test
    void testObtenerRolPorId() throws Exception {
        mockSecurityContext();

        RolDTO dto = new RolDTO();
        dto.setId(1L);
        dto.setNombre("ADMIN");
        dto.setDescripcion("Administrador");

        Mockito.when(rolService.obtenerRolPorId(1L)).thenReturn(dto);

        mockMvc.perform(get("/api/roles/1")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("ADMIN"));
    }

    @Test
    void testCrearRolConDatosInvalidos() throws Exception {
        mockSecurityContext();

        RolDTO dto = new RolDTO();
        dto.setNombre(""); // nombre inválido
        dto.setDescripcion("Sin nombre");

        mockMvc.perform(post("/api/roles")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testActualizarRolInexistente() throws Exception {
        mockSecurityContext();

        RolDTO dto = new RolDTO();
        dto.setNombre("ACTUALIZADO");
        dto.setDescripcion("Nuevo nombre");

        Mockito.when(rolService.actualizarRol(eq(999L), any()))
                .thenThrow(new RuntimeException("Rol no encontrado"));

        mockMvc.perform(put("/api/roles/999")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isNotFound());
    }


}

