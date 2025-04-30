package com.seguros.controller;

import com.seguros.config.SecurityTestConfig;
import com.seguros.dto.RegistroDTO;
import com.seguros.dto.UsuarioDTO;
import com.seguros.model.Usuario;
import com.seguros.security.JwtService;
import com.seguros.service.UsuarioService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import java.util.Arrays;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UsuarioController.class)
@Import(SecurityTestConfig.class)
public class UsuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UsuarioService usuarioService;

    @MockBean
    private JwtService jwtService;


    @Test
    @WithMockUser(roles = "ADMIN")
    void crearUsuario_DeberiaRetornarUsuarioCreado() throws Exception {
        RegistroDTO registroDTO = new RegistroDTO();
        registroDTO.setEmail("test@test.com");
        registroDTO.setPassword("password");
        registroDTO.setNombre("Test");
        registroDTO.setApellido("User");
        registroDTO.setRolId(1L);

        Usuario usuarioMock = new Usuario();
        usuarioMock.setId(1L);
        usuarioMock.setEmail("test@test.com");

        given(usuarioService.crearUsuario(any(RegistroDTO.class))).willReturn(usuarioMock);

        mockMvc.perform(post("/api/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"test@test.com\",\"password\":\"password\",\"nombre\":\"Test\",\"apellido\":\"User\",\"rolId\":1}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@test.com"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void obtenerTodosUsuarios_DeberiaRetornarLista() throws Exception {
        UsuarioDTO usuarioDTO = new UsuarioDTO();
        usuarioDTO.setId(1L);
        usuarioDTO.setEmail("test@test.com");

        given(usuarioService.obtenerTodosUsuarios()).willReturn(Arrays.asList(usuarioDTO));

        mockMvc.perform(get("/api/usuarios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].email").value("test@test.com"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void actualizarEstado_DeberiaRetornarUsuarioActualizado() throws Exception {
        Usuario usuarioMock = new Usuario();
        usuarioMock.setId(1L);
        usuarioMock.setActivo(false);

        given(usuarioService.actualizarEstado(1L, false)).willReturn(usuarioMock);

        mockMvc.perform(put("/api/usuarios/1/estado?activo=false"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.activo").value(false));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void obtenerUsuariosPorRol_DeberiaRetornarListaFiltrada() throws Exception {
        UsuarioDTO usuarioDTO = new UsuarioDTO();
        usuarioDTO.setId(1L);
        usuarioDTO.setEmail("admin@test.com");

        given(usuarioService.obtenerUsuariosPorRol("ADMIN"))
                .willReturn(Arrays.asList(usuarioDTO));

        mockMvc.perform(get("/api/usuarios/rol/ADMIN"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].email").value("admin@test.com"));
    }

}