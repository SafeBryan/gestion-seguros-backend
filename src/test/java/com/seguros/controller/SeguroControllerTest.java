package com.seguros.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.seguros.config.SecurityTestConfig;
import com.seguros.dto.SeguroDTO;
import com.seguros.model.Seguro;
import com.seguros.model.Seguro.TipoSeguro;
import com.seguros.model.SeguroVida;
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

import java.math.BigDecimal;
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
        dto.setNombre("Seguro Vida");
        dto.setTipo(TipoSeguro.VIDA);
        dto.setPrecioAnual(BigDecimal.valueOf(120.0));
        dto.setActivo(true);
        dto.setMontoCobertura(BigDecimal.valueOf(50000));

        SeguroVida seguro = new SeguroVida();
        seguro.setNombre(dto.getNombre());
        seguro.setActivo(dto.getActivo());
        seguro.setPrecioAnual(dto.getPrecioAnual());
        seguro.setMontoCobertura(dto.getMontoCobertura());

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

        SeguroVida seguro1 = new SeguroVida();
        seguro1.setId(1L);
        seguro1.setNombre("Seguro Vida");
        seguro1.setActivo(true);
        seguro1.setPrecioAnual(BigDecimal.valueOf(120.0));
        seguro1.setMontoCobertura(BigDecimal.valueOf(50000));

        SeguroVida seguro2 = new SeguroVida();
        seguro2.setId(2L);
        seguro2.setNombre("Seguro Vida Plus");
        seguro2.setActivo(true);
        seguro2.setPrecioAnual(BigDecimal.valueOf(150.0));
        seguro2.setMontoCobertura(BigDecimal.valueOf(60000));

        List<Seguro> lista = Arrays.asList(seguro1, seguro2);

        Mockito.when(seguroService.obtenerSegurosActivos()).thenReturn(lista);

        mockMvc.perform(get("/api/seguros/activos")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void testObtenerPorTipo() throws Exception {
        mockSecurityContext();

        TipoSeguro tipo = TipoSeguro.VIDA;
        SeguroVida seguro = new SeguroVida();
        seguro.setId(3L);
        seguro.setNombre("Seguro Especial");
        seguro.setActivo(true);
        seguro.setPrecioAnual(BigDecimal.valueOf(200));
        seguro.setMontoCobertura(BigDecimal.valueOf(75000));

        List<Seguro> lista = Arrays.asList(seguro);
        Mockito.when(seguroService.obtenerSegurosPorTipo(tipo)).thenReturn(lista);

        mockMvc.perform(get("/api/seguros/tipo/" + tipo)
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void testActualizarEstado() throws Exception {
        mockSecurityContext();

        SeguroVida seguro = new SeguroVida();
        seguro.setId(4L);
        seguro.setActivo(true);
        seguro.setNombre("Seguro Estado");

        Mockito.when(seguroService.actualizarEstado(eq(1L), eq(true))).thenReturn(seguro);

        mockMvc.perform(put("/api/seguros/1/estado")
                        .header("Authorization", token)
                        .param("activo", "true"))
                .andExpect(status().isOk());
    }

    @Test
    void testObtenerTodosLosSeguros() throws Exception {
        mockSecurityContext();

        SeguroVida seguro1 = new SeguroVida();
        seguro1.setId(1L);
        seguro1.setNombre("Seguro Vida Total");
        seguro1.setPrecioAnual(BigDecimal.valueOf(1000));

        Mockito.when(seguroService.obtenerTodosLosSeguros()).thenReturn(List.of(seguro1));

        mockMvc.perform(get("/api/seguros")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].nombre").value("Seguro Vida Total"));
    }

    @Test
    void testEditarSeguro() throws Exception {
        mockSecurityContext();

        SeguroDTO dto = new SeguroDTO();
        dto.setNombre("Editado");
        dto.setTipo(TipoSeguro.VIDA);
        dto.setActivo(true);
        dto.setPrecioAnual(BigDecimal.valueOf(999));
        dto.setMontoCobertura(BigDecimal.valueOf(99999));

        SeguroVida seguroEditado = new SeguroVida();
        seguroEditado.setId(5L);
        seguroEditado.setNombre(dto.getNombre());
        seguroEditado.setActivo(dto.getActivo());
        seguroEditado.setPrecioAnual(dto.getPrecioAnual());
        seguroEditado.setMontoCobertura(dto.getMontoCobertura());

        Mockito.when(seguroService.editarSeguro(eq(5L), any(SeguroDTO.class)))
                .thenReturn(seguroEditado);

        mockMvc.perform(put("/api/seguros/5")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Editado"))
                .andExpect(jsonPath("$.precioAnual").value(999));
    }


}
