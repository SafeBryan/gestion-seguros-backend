package com.seguros.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.seguros.model.*;
import com.seguros.repository.*;
import com.seguros.security.UsuarioDetails;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ReporteControllerIT {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private ClienteRepository clienteRepository;
    @Autowired private RolRepository rolRepository;
    @Autowired private SeguroRepository seguroRepository;
    @Autowired private ContratoRepository contratoRepository;
    @Autowired private ReembolsoRepository reembolsoRepository;
    @Autowired private PagoRepository pagoRepository;

    private Usuario cliente;
    private Usuario agente;
    private Contrato contrato;

    @BeforeEach
    void setUp() {
        // Limpieza
        pagoRepository.deleteAll();
        reembolsoRepository.deleteAll();
        contratoRepository.deleteAll();
        seguroRepository.deleteAll();
        clienteRepository.deleteAll();
        usuarioRepository.deleteAll();
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


        // Usuario cliente
        cliente = new Usuario();
        cliente.setNombre("Cliente");
        cliente.setApellido("Test");
        cliente.setEmail("cliente@correo.com");
        cliente.setPassword("123456");
        cliente.setRol(rolUser);
        cliente = usuarioRepository.save(cliente);

        cliente = usuarioRepository.save(cliente);

        Cliente clienteEntidad = new Cliente();
        clienteEntidad.setUsuario(cliente);
        clienteEntidad.setTipoIdentificacion("Cédula");
        clienteEntidad.setNumeroIdentificacion("0102030405");
        clienteEntidad.setFechaNacimiento(LocalDate.of(1990, 1, 1));
        clienteEntidad.setNacionalidad("Ecuatoriana");
        clienteEntidad.setEstadoCivil("Soltero");
        clienteEntidad.setSexo("Masculino");
        clienteEntidad.setLugarNacimiento("Ambato");
        clienteEntidad.setEstatura(1.75);
        clienteEntidad.setPeso(70.0);
        clienteEntidad.setDireccion("Av. Central");
        clienteRepository.save(clienteEntidad);

        // Usuario agente
        agente = new Usuario();
        agente.setNombre("Agente");
        agente.setApellido("Test");
        agente.setEmail("agente@correo.com");
        agente.setPassword("123456");
        agente.setRol(rolAdmin);
        agente = usuarioRepository.save(agente);

        agente = usuarioRepository.save(agente);

        // Seguro
        SeguroVida seguro = new SeguroVida();
        seguro.setNombre("Seguro Vida");
        seguro.setDescripcion("Cobertura completa");
        seguro.setMontoCobertura(new BigDecimal("10000.00"));
        seguro.setPrecioAnual(new BigDecimal("120.00"));
        seguro.setActivo(true);
        seguro.setCreadoPor(cliente);
        seguro = seguroRepository.save(seguro);

        // Contrato
        contrato = new Contrato();
        contrato.setCliente(cliente);
        contrato.setAgente(agente);
        contrato.setSeguro(seguro);
        contrato.setFechaInicio(LocalDate.now().minusMonths(2));
        contrato.setFechaFin(LocalDate.now().minusDays(1)); // vencido
        contrato.setFrecuenciaPago(Contrato.FrecuenciaPago.MENSUAL);
        contrato.setEstado(Contrato.EstadoContrato.ACTIVO);
        contrato.setFirmaElectronica("firma123");
        contrato = contratoRepository.save(contrato);

        // Seguridad simulada
        var auth = new UsernamePasswordAuthenticationToken(
                new UsuarioDetails(cliente, List.of(new SimpleGrantedAuthority("ROLE_USER"))),
                null,
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Test
    void testContratosVencidos() throws Exception {
        mockMvc.perform(get("/api/reportes/contratos-vencidos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(contrato.getId()));
    }

    @Test
    void testContratosPorCliente() throws Exception {
        mockMvc.perform(get("/api/reportes/contratos-por-cliente/" + cliente.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].clienteId").value(cliente.getId()));
    }

    @Test
    void testContratosPorVencer() throws Exception {
        contrato.setFechaFin(LocalDate.now().plusDays(5));
        contratoRepository.save(contrato);

        mockMvc.perform(get("/api/reportes/contratos-por-vencer"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(contrato.getId()));
    }

    @Test
    void testSegurosImpagos() throws Exception {
        // Simular impago (depende de tu lógica real)
        contrato.setEstado(Contrato.EstadoContrato.ACTIVO);
        contratoRepository.save(contrato);

        mockMvc.perform(get("/api/reportes/seguros-impagos"))
                .andExpect(status().isOk());
        // Puedes agregar validación si la lógica de impago está clara
    }

    @Test
    void testReembolsosPendientes() throws Exception {
        Reembolso reembolso = new Reembolso();
        reembolso.setContrato(contrato);
        reembolso.setDescripcion("Examen de sangre");
        reembolso.setMonto(BigDecimal.valueOf(200));
        reembolso.setEstado(Reembolso.EstadoReembolso.PENDIENTE);
        reembolso.setArchivos("{\"archivo1.pdf\":\"/uploads/archivo1.pdf\"}");
        reembolsoRepository.save(reembolso);

        mockMvc.perform(get("/api/reportes/reembolsos-pendientes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].descripcion").value("Examen de sangre"))
                .andExpect(jsonPath("$[0].estado").value("PENDIENTE"));
    }
}
