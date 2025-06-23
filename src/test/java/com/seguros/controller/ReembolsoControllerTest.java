package com.seguros.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.seguros.config.SecurityTestConfig;
import com.seguros.dto.ReembolsoRequestDTO;
import com.seguros.dto.ReembolsoResponseDTO;
import com.seguros.model.Reembolso;
import com.seguros.model.Usuario;
import com.seguros.security.JwtService;
import com.seguros.security.UsuarioDetails;
import com.seguros.service.ArchivoService;
import com.seguros.service.ReembolsoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import java.math.BigDecimal;

@WebMvcTest(ReembolsoController.class)
@Import(SecurityTestConfig.class)
class ReembolsoControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockBean private ReembolsoService reembolsoService;
    @MockBean private ArchivoService archivoService;
    @MockBean private JwtService jwtService;
    @MockBean private UserDetailsService userDetailsService;

    private final String token = "Bearer test.jwt.token";



    @BeforeEach
    void setupMocks() {
        Mockito.when(jwtService.extractUsername(any())).thenReturn("cliente@test.com");
        Mockito.when(jwtService.isTokenValid(Mockito.anyString(), Mockito.anyString())).thenReturn(true);
        Mockito.when(userDetailsService.loadUserByUsername(any()))
                .thenReturn(new org.springframework.security.core.userdetails.User("cliente@test.com", "", List.of()));
    }

    @Test
    void testCrearReembolso() throws Exception {
        // Preparar el DTO de solicitud
        ReembolsoRequestDTO dto = new ReembolsoRequestDTO();
        dto.setDescripcion("Consulta médica");
        dto.setMonto(BigDecimal.valueOf(100.0));

        // Archivos simulados
        Map<String, String> archivosMap = new HashMap<>();
        archivosMap.put("factura.pdf", "/uploads/factura.pdf");

        ReembolsoResponseDTO response = new ReembolsoResponseDTO();
        response.setId(1L);
        response.setDescripcion("Consulta médica");
        response.setMonto(BigDecimal.valueOf(100.0));
        response.setArchivos(archivosMap);

        MockMultipartFile datos = new MockMultipartFile(
                "datos",
                "",
                "application/json",
                objectMapper.writeValueAsBytes(dto)
        );

        MockMultipartFile archivo = new MockMultipartFile(
                "archivos",
                "factura.pdf",
                "application/pdf",
                "contenido de prueba".getBytes()
        );

        // Mock de guardar archivo
        Mockito.when(archivoService.guardarArchivo(any())).thenReturn("/uploads/factura.pdf");

        // Simular retorno del reembolso creado
        Reembolso mockReembolso = new Reembolso();
        mockReembolso.setId(1L);
        mockReembolso.setDescripcion("Consulta médica");
        mockReembolso.setMonto(BigDecimal.valueOf(100.0));
        mockReembolso.setArchivos("{\"factura.pdf\":\"/uploads/factura.pdf\"}");

        Mockito.when(reembolsoService.solicitarReembolso(any(), any())).thenReturn(mockReembolso);

        // ✅ Simular usuario autenticado con SecurityContextHolder
        Usuario mockUsuario = new Usuario();
        mockUsuario.setId(1L);
        mockUsuario.setNombre("Bryan");
        mockUsuario.setEmail("cliente@test.com");
        mockUsuario.setPassword("123456");

        UsuarioDetails usuarioDetails = new UsuarioDetails(mockUsuario, List.of());

        var auth = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                usuarioDetails,
                null,
                usuarioDetails.getAuthorities()
        );
        org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(auth);

        // Ejecutar la solicitud y validar respuesta
        mockMvc.perform(multipart("/api/reembolsos")
                        .file(datos)
                        .file(archivo)
                        .header("Authorization", token)
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.descripcion").value("Consulta médica"));

        // Limpiar el contexto de seguridad
        org.springframework.security.core.context.SecurityContextHolder.clearContext();
    }




    @Test
    void testObtenerReembolsosPendientes() throws Exception {
        Reembolso mockReembolso = new Reembolso();
        mockReembolso.setId(1L);
        mockReembolso.setDescripcion("Reembolso 1");
        mockReembolso.setMonto(BigDecimal.valueOf(150.0));
        mockReembolso.setArchivos("{\"factura.pdf\":\"/uploads/factura.pdf\"}");
        mockReembolso.setEstado(Reembolso.EstadoReembolso.PENDIENTE);

        // Otros datos requeridos por el mapeo (puedes dejar en null si no los usas en la prueba)
        Mockito.when(reembolsoService.obtenerReembolsosPendientes()).thenReturn(List.of(mockReembolso));

        mockMvc.perform(get("/api/reembolsos/pendientes")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].descripcion").value("Reembolso 1"));
    }
}
