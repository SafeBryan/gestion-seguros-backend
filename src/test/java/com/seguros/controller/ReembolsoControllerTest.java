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
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
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

    @Test
    void testProcesarReembolso() throws Exception {
        Usuario mockUsuario = new Usuario();
        mockUsuario.setId(2L);
        mockUsuario.setNombre("Admin");

        UsuarioDetails usuarioDetails = new UsuarioDetails(mockUsuario, List.of());

        var auth = new UsernamePasswordAuthenticationToken(usuarioDetails, null, usuarioDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);

        mockMvc.perform(post("/api/reembolsos/1/procesar")
                        .param("aprobar", "true")
                        .param("comentario", "Aprobado")
                        .header("Authorization", token))
                .andExpect(status().isOk());

        SecurityContextHolder.clearContext();
    }

    @Test
    void testObtenerMisReembolsos() throws Exception {
        Usuario mockUsuario = new Usuario();
        mockUsuario.setId(5L);
        mockUsuario.setNombre("Cliente");

        UsuarioDetails usuarioDetails = new UsuarioDetails(mockUsuario, List.of());

        var auth = new UsernamePasswordAuthenticationToken(usuarioDetails, null, usuarioDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);

        Reembolso mockReembolso = new Reembolso();
        mockReembolso.setId(1L);
        mockReembolso.setDescripcion("Examenes");
        mockReembolso.setMonto(BigDecimal.valueOf(80));
        mockReembolso.setArchivos("{\"recibo.pdf\":\"/ruta/recibo.pdf\"}");

        Mockito.when(reembolsoService.obtenerReembolsosPorCliente(5L)).thenReturn(List.of(mockReembolso));

        mockMvc.perform(get("/api/reembolsos/mis-reembolsos")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].descripcion").value("Examenes"));

        SecurityContextHolder.clearContext();
    }

    @Test
    void testObtenerReembolsosPorCliente() throws Exception {
        Reembolso mockReembolso = new Reembolso();
        mockReembolso.setId(1L);
        mockReembolso.setDescripcion("Radiografía");
        mockReembolso.setMonto(BigDecimal.valueOf(50));
        mockReembolso.setArchivos("{\"rayos.pdf\":\"/ruta/rayos.pdf\"}");

        Mockito.when(reembolsoService.obtenerReembolsosPorCliente(10L)).thenReturn(List.of(mockReembolso));

        mockMvc.perform(get("/api/reembolsos/cliente/10")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].descripcion").value("Radiografía"));
    }

    @Test
    void testObtenerDetalleReembolso() throws Exception {
        Reembolso mockReembolso = new Reembolso();
        mockReembolso.setId(1L);
        mockReembolso.setDescripcion("Cirugía menor");
        mockReembolso.setMonto(BigDecimal.valueOf(300));
        mockReembolso.setArchivos("{\"cirugia.pdf\":\"/ruta/cirugia.pdf\"}");

        Mockito.when(reembolsoService.buscarPorId(1L)).thenReturn(java.util.Optional.of(mockReembolso));

        mockMvc.perform(get("/api/reembolsos/1")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.descripcion").value("Cirugía menor"));
    }

    @Test
    void testArchivosJsonInvalido() throws Exception {
        Reembolso mockReembolso = new Reembolso();
        mockReembolso.setId(2L);
        mockReembolso.setDescripcion("Error en JSON");
        mockReembolso.setMonto(BigDecimal.valueOf(100));
        mockReembolso.setArchivos("no-es-json");

        Mockito.when(reembolsoService.buscarPorId(2L)).thenReturn(java.util.Optional.of(mockReembolso));

        mockMvc.perform(get("/api/reembolsos/2")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.archivos").doesNotExist()); // o null
    }

    @Test
    void testDetalleCompletoConContratoYSeguroYClienteYAprobado() throws Exception {
        Reembolso mockReembolso = new Reembolso();
        mockReembolso.setId(3L);
        mockReembolso.setDescripcion("Reembolso completo");
        mockReembolso.setMonto(BigDecimal.valueOf(200));
        mockReembolso.setArchivos("{\"factura.pdf\":\"/uploads/factura.pdf\"}");

        // Cliente
        Usuario cliente = new Usuario();
        cliente.setId(100L);
        cliente.setNombre("Juan Cliente");

        // Seguro mockeado
        var seguro = Mockito.mock(com.seguros.model.Seguro.class);
        Mockito.when(seguro.getId()).thenReturn(200L);
        Mockito.when(seguro.getNombre()).thenReturn("Plan Oro");

        // Contrato
        var contrato = new com.seguros.model.Contrato();
        contrato.setId(300L);
        contrato.setCliente(cliente);
        contrato.setSeguro(seguro);

        // Aprobador
        Usuario aprobador = new Usuario();
        aprobador.setNombre("Ana Revisora");

        mockReembolso.setContrato(contrato);
        mockReembolso.setAprobadoPor(aprobador);

        Mockito.when(reembolsoService.buscarPorId(3L)).thenReturn(java.util.Optional.of(mockReembolso));

        mockMvc.perform(get("/api/reembolsos/3")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.clienteId").value(100L))
                .andExpect(jsonPath("$.clienteNombre").value("Juan Cliente"))
                .andExpect(jsonPath("$.seguroId").value(200L))
                .andExpect(jsonPath("$.seguroNombre").value("Plan Oro"))
                .andExpect(jsonPath("$.contratoId").value(300L))
                .andExpect(jsonPath("$.aprobadoPorNombre").value("Ana Revisora"));
    }
    @Test
    void testDetalleConContratoSinSeguro() throws Exception {
        Reembolso mockReembolso = new Reembolso();
        mockReembolso.setId(4L);
        mockReembolso.setDescripcion("Reembolso sin seguro");
        mockReembolso.setMonto(BigDecimal.valueOf(150));
        mockReembolso.setArchivos("{\"archivo.pdf\":\"/uploads/archivo.pdf\"}");

        // Cliente
        Usuario cliente = new Usuario();
        cliente.setId(101L);
        cliente.setNombre("Cliente sin seguro");

        // Contrato con cliente pero sin seguro
        var contrato = new com.seguros.model.Contrato();
        contrato.setId(301L);
        contrato.setCliente(cliente);
        contrato.setSeguro(null);  // <- clave

        mockReembolso.setContrato(contrato);

        Mockito.when(reembolsoService.buscarPorId(4L)).thenReturn(java.util.Optional.of(mockReembolso));

        mockMvc.perform(get("/api/reembolsos/4")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.clienteId").value(101L))
                .andExpect(jsonPath("$.seguroId").doesNotExist()) // clave para verificar null
                .andExpect(jsonPath("$.seguroNombre").doesNotExist());
    }

    @Test
    void testDetalleConContratoSinCliente() throws Exception {
        Reembolso mockReembolso = new Reembolso();
        mockReembolso.setId(5L);
        mockReembolso.setDescripcion("Reembolso sin cliente");
        mockReembolso.setMonto(BigDecimal.valueOf(180));
        mockReembolso.setArchivos("{\"archivo.pdf\":\"/uploads/archivo.pdf\"}");

        // Seguro mock
        var seguro = Mockito.mock(com.seguros.model.Seguro.class);
        Mockito.when(seguro.getId()).thenReturn(202L);
        Mockito.when(seguro.getNombre()).thenReturn("Plan Plata");

        // Contrato con seguro pero sin cliente
        var contrato = new com.seguros.model.Contrato();
        contrato.setId(302L);
        contrato.setSeguro(seguro);
        contrato.setCliente(null);  // <- clave

        mockReembolso.setContrato(contrato);

        Mockito.when(reembolsoService.buscarPorId(5L)).thenReturn(java.util.Optional.of(mockReembolso));

        mockMvc.perform(get("/api/reembolsos/5")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.seguroId").value(202L))
                .andExpect(jsonPath("$.clienteId").doesNotExist()) // clave para verificar null
                .andExpect(jsonPath("$.clienteNombre").doesNotExist());
    }


}
