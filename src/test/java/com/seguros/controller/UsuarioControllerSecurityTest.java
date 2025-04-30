package com.seguros.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.seguros.dto.RegistroDTO;
import com.seguros.security.JwtService;
import com.seguros.service.UsuarioService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class UsuarioControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UsuarioService usuarioService;
    @MockBean
    private JwtService jwtService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private String getRegistroDTOJson() throws Exception {
        RegistroDTO dto = new RegistroDTO();
        dto.setEmail("test@example.com");
        dto.setPassword("123456");
        dto.setNombre("Bryan");
        dto.setApellido("Pazmiño");
        dto.setTelefono("0987654321");
        dto.setRolId(1L);
        return objectMapper.writeValueAsString(dto);
    }

    @Test
    @WithAnonymousUser
    void cuandoUsuarioNoAutenticado_intentaCrearUsuario_deberiaRetornarNoAutorizado() throws Exception {
        mockMvc.perform(post("/api/usuarios")
                        .content(getRegistroDTOJson())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "CLIENTE")
    void cuandoCliente_intentaCrearUsuario_deberiaRetornarProhibido() throws Exception {
        mockMvc.perform(post("/api/usuarios")
                        .content(getRegistroDTOJson())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void cuandoAdmin_intentaCrearUsuario_deberiaPermitir() throws Exception {
        mockMvc.perform(post("/api/usuarios")
                        .content(getRegistroDTOJson())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}
