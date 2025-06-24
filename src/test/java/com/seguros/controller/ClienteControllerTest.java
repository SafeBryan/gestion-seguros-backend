package com.seguros.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.seguros.config.SecurityTestConfig;
import com.seguros.dto.ClienteRequestDTO;
import com.seguros.dto.ClienteResponseDTO;
import com.seguros.security.JwtService;
import com.seguros.service.ClienteService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ClienteController.class)
@Import(SecurityTestConfig.class)
class ClienteControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockBean private ClienteService clienteService;
    @MockBean private JwtService jwtService;
    @MockBean private UserDetailsService userDetailsService;

    private final String token = "Bearer test.jwt.token";

    @BeforeEach
    void mockSecurity() {
        var user = new User("admin@test.com", "123456",
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN")));
        Mockito.when(jwtService.extractUsername(any())).thenReturn("admin@test.com");
        Mockito.when(jwtService.isTokenValid(Mockito.anyString(), Mockito.anyString())).thenReturn(true);
        Mockito.when(userDetailsService.loadUserByUsername(any())).thenReturn(user);
    }

    @Test
    void testCrearCliente() throws Exception {
        ClienteRequestDTO request = new ClienteRequestDTO();
        request.setNumeroIdentificacion("1234567890");

        ClienteResponseDTO response = new ClienteResponseDTO();
        response.setId(1L);
        response.setNumeroIdentificacion("1234567890");

        Mockito.when(clienteService.crearCliente(any())).thenReturn(response);

        mockMvc.perform(post("/api/clientes")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.numeroIdentificacion").value("1234567890"));
    }

    @Test
    void testListarClientes() throws Exception {
        ClienteResponseDTO dto = new ClienteResponseDTO();
        dto.setId(1L);

        Mockito.when(clienteService.listarClientes()).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/clientes")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    void testObtenerCliente() throws Exception {
        ClienteResponseDTO dto = new ClienteResponseDTO();
        dto.setId(1L);

        Mockito.when(clienteService.obtenerCliente(1L)).thenReturn(dto);

        mockMvc.perform(get("/api/clientes/1")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void testActualizarCliente() throws Exception {
        ClienteRequestDTO request = new ClienteRequestDTO();
        request.setNumeroIdentificacion("1234567890");

        ClienteResponseDTO response = new ClienteResponseDTO();
        response.setId(1L);
        response.setNumeroIdentificacion("1234567890");

        Mockito.when(clienteService.actualizarCliente(eq(1L), any())).thenReturn(response);

        mockMvc.perform(put("/api/clientes/1")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.numeroIdentificacion").value("1234567890"));
    }

    @Test
    void testDesactivarCliente() throws Exception {
        Mockito.doNothing().when(clienteService).desactivarCliente(1L);

        mockMvc.perform(put("/api/clientes/1/desactivar")
                        .header("Authorization", token))
                .andExpect(status().isNoContent());
    }
}
