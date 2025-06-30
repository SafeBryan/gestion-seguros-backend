package com.seguros.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.seguros.dto.ReembolsoRequestDTO;
import com.seguros.model.*;
import com.seguros.repository.*;
import com.seguros.security.UsuarioDetails;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ReembolsoControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private SeguroRepository seguroRepository;

    @Autowired
    private ContratoRepository contratoRepository;

    @Autowired
    private ReembolsoRepository reembolsoRepository;

    private Usuario cliente;
    private Usuario agente;
    private Contrato contrato;

    @BeforeEach
    void setup() {
        setUp(); // inicializa datos antes del contexto

        var authority = new SimpleGrantedAuthority("ROLE_" + cliente.getRol().getNombre());
        UsuarioDetails usuarioDetails = new UsuarioDetails(cliente, java.util.List.of(authority));

        Authentication auth = new UsernamePasswordAuthenticationToken(usuarioDetails, null, usuarioDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @BeforeEach
    void setUp() {
        reembolsoRepository.deleteAll();
        contratoRepository.deleteAll();
        seguroRepository.deleteAll();
        clienteRepository.deleteAll();
        usuarioRepository.deleteAll(); // Este ya está, pero asegúrate que realmente borra

        // También podrías borrar roles si se duplican:
        rolRepository.deleteAll();

        // Roles
        Rol rolUser = rolRepository.findByNombre("USER").orElseGet(() -> {
            Rol r = new Rol();
            r.setNombre("USER");
            r.setDescripcion("Cliente");
            return rolRepository.save(r);
        });

        Rol rolAdmin = rolRepository.findByNombre("ADMIN").orElseGet(() -> {
            Rol r = new Rol();
            r.setNombre("ADMIN");
            r.setDescripcion("Agente");
            return rolRepository.save(r);
        });

        // Cliente
        cliente = new Usuario();
        cliente.setNombre("Cliente");
        cliente.setApellido("Test");
        cliente.setEmail("cliente@correo.com");
        cliente.setPassword("123456");
        cliente.setRol(rolUser);
        cliente = usuarioRepository.save(cliente);

        Cliente entidadCliente = new Cliente();
        entidadCliente.setUsuario(cliente);
        entidadCliente.setTipoIdentificacion("Cédula");
        entidadCliente.setNumeroIdentificacion("0102030405");
        entidadCliente.setFechaNacimiento(LocalDate.of(1990, 1, 1));
        entidadCliente.setNacionalidad("Ecuatoriana");
        entidadCliente.setEstadoCivil("Soltero");
        entidadCliente.setSexo("Masculino");
        entidadCliente.setLugarNacimiento("Ambato");
        entidadCliente.setEstatura(1.75);
        entidadCliente.setPeso(70.0);
        entidadCliente.setDireccion("Dirección Test");
        clienteRepository.save(entidadCliente);

        // Agente
        agente = new Usuario();
        agente.setNombre("Agente");
        agente.setApellido("Test");
        agente.setEmail("agente@correo.com");
        agente.setPassword("123456");
        agente.setRol(rolAdmin);
        agente = usuarioRepository.save(agente);

        // Seguro
        SeguroVida seguro = new SeguroVida();
        seguro.setNombre("Seguro Vida");
        seguro.setDescripcion("Cobertura completa");
        seguro.setMontoCobertura(BigDecimal.valueOf(10000));
        seguro.setActivo(true);
        seguro.setPrecioAnual(BigDecimal.valueOf(100));
        seguro.setCreadoPor(cliente);
        seguro = seguroRepository.save(seguro);

        // Contrato
        contrato = new Contrato();
        contrato.setCliente(cliente);
        contrato.setAgente(agente);
        contrato.setSeguro(seguro);
        contrato.setFechaInicio(LocalDate.now());
        contrato.setFechaFin(LocalDate.now().plusYears(1));
        contrato.setFrecuenciaPago(Contrato.FrecuenciaPago.MENSUAL);
        contrato.setEstado(Contrato.EstadoContrato.ACTIVO);
        contrato.setFirmaElectronica("firma123");
        contrato = contratoRepository.save(contrato);
    }

    @Test
    @WithMockUser(username = "cliente@correo.com", roles = "USER")
    void testCrearReembolsoConDatosMedicosYAccidente() throws Exception {
        ReembolsoRequestDTO dto = new ReembolsoRequestDTO();
        dto.setContratoId(contrato.getId());
        dto.setMonto(BigDecimal.valueOf(350.50));
        dto.setDescripcion("Emergencia médica");
        dto.setArchivos(Map.of("emergencia.pdf", "archivos/emergencia.pdf"));

        // Datos médicos
        dto.setNombreMedico("Dr. Juan Pérez");
        dto.setMotivoConsulta("Dolor abdominal");
        dto.setCie10("R10.0");
        dto.setFechaAtencion(LocalDate.of(2025, 6, 10));
        dto.setInicioSintomas(LocalDate.of(2025, 6, 8));

        // Datos de accidente
        dto.setEsAccidente(true);
        dto.setDetalleAccidente("Caída en la calle");

        // Archivo JSON del DTO
        MockMultipartFile archivoDatos = new MockMultipartFile(
                "datos",
                "",
                "application/json",
                objectMapper.writeValueAsBytes(dto)
        );

        // Archivo adjunto simulado
        MockMultipartFile archivoAdjunto = new MockMultipartFile(
                "archivos",
                "emergencia.pdf",
                "application/pdf",
                "contenido-falso-pdf".getBytes()
        );

        mockMvc.perform(multipart("/api/reembolsos")
                        .file(archivoDatos)
                        .file(archivoAdjunto)
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.monto").value(350.50))
                .andExpect(jsonPath("$.descripcion").value("Emergencia médica"))
                .andExpect(jsonPath("$.contratoId").value(contrato.getId()))
                .andExpect(jsonPath("$.estado").value("PENDIENTE"));
    }


    @Test
    @WithMockUser(username = "cliente@correo.com", roles = "USER")
    void testObtenerMisReembolsos() throws Exception {
        Reembolso reembolso = new Reembolso();
        reembolso.setContrato(contrato);
        reembolso.setMonto(BigDecimal.valueOf(500));
        reembolso.setDescripcion("Examen de sangre");
        reembolso.setArchivos("{\"archivo1.pdf\": \"ruta/archivo1.pdf\"}");
        reembolso.setEstado(Reembolso.EstadoReembolso.PENDIENTE); // ✅ cambio aquí
        reembolsoRepository.save(reembolso);

        mockMvc.perform(get("/api/reembolsos/mis-reembolsos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].descripcion").value("Examen de sangre"))
                .andExpect(jsonPath("$[0].monto").value(500));
    }
}
