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
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class PagoControllerIT {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private ClienteRepository clienteRepository;
    @Autowired private RolRepository rolRepository;
    @Autowired private SeguroRepository seguroRepository;
    @Autowired private ContratoRepository contratoRepository;
    @Autowired private PagoRepository pagoRepository;
    @Autowired private ReembolsoRepository reembolsoRepository;


    private Usuario cliente;
    private Usuario agente;
    private Contrato contrato;

    @BeforeEach
    void setUp() {
        pagoRepository.deleteAll();
        reembolsoRepository.deleteAll();
        contratoRepository.deleteAll();
        seguroRepository.deleteAll();
        clienteRepository.deleteAll();
        usuarioRepository.deleteAll();
        rolRepository.deleteAll();

        Rol rolUser = rolRepository.findByNombre("USER").orElseGet(() -> {
            Rol nuevoRol = new Rol();
            nuevoRol.setNombre("USER");
            nuevoRol.setDescripcion("Cliente");
            return rolRepository.save(nuevoRol);
        });

        Rol rolAdmin = rolRepository.findByNombre("ADMIN").orElseGet(() -> {
            Rol nuevoRol = new Rol();
            nuevoRol.setNombre("ADMIN");
            nuevoRol.setDescripcion("Agente");
            return rolRepository.save(nuevoRol);
        });


        cliente = new Usuario();
        cliente.setNombre("Cliente");
        cliente.setApellido("Test");
        cliente.setEmail("cliente@correo.com");
        cliente.setPassword("123456");
        cliente.setRol(rolUser);
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

        agente = new Usuario();
        agente.setNombre("Agente");
        agente.setApellido("Test");
        agente.setEmail("agente@correo.com");
        agente.setPassword("123456");
        agente.setRol(rolAdmin);
        agente = usuarioRepository.save(agente);

        SeguroVida seguro = new SeguroVida();
        seguro.setNombre("Seguro Vida");
        seguro.setDescripcion("Cobertura completa");
        seguro.setMontoCobertura(new BigDecimal("10000.00"));
        seguro.setPrecioAnual(new BigDecimal("120.00"));
        seguro.setActivo(true);
        seguro.setCreadoPor(cliente);
        seguro = seguroRepository.save(seguro);

        contrato = new Contrato();
        contrato.setCliente(cliente);
        contrato.setAgente(agente);
        contrato.setSeguro(seguro);
        contrato.setFechaInicio(LocalDate.now().minusMonths(1));
        contrato.setFechaFin(LocalDate.now().plusMonths(11));
        contrato.setFrecuenciaPago(Contrato.FrecuenciaPago.MENSUAL);
        contrato.setEstado(Contrato.EstadoContrato.ACTIVO);
        contrato.setFirmaElectronica("firma123");
        contrato = contratoRepository.save(contrato);

        var auth = new UsernamePasswordAuthenticationToken(
                new UsuarioDetails(cliente, List.of(new SimpleGrantedAuthority("ROLE_USER"))),
                null,
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Test
    void testRegistrarPago() throws Exception {
        String json = """
            {
                "contratoId": %d,
                "monto": 50.00,
                "fecha": "%s",
                "metodo": "TRANSFERENCIA"
            }
        """.formatted(contrato.getId(), LocalDateTime.now().toString());

        mockMvc.perform(post("/api/pagos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.monto").value(50.00));
    }

    @Test
    void testObtenerPagosPorContrato() throws Exception {
        Pago pago = new Pago();
        pago.setContrato(contrato);
        pago.setMonto(BigDecimal.valueOf(100));
        pago.setFechaPago(LocalDateTime.now());
        pago.setMetodo(Pago.MetodoPago.EFECTIVO);

        pagoRepository.save(pago);

        mockMvc.perform(get("/api/pagos/contrato/" + contrato.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].monto").value(100));
    }

    @Test
    void testObtenerPagosPorCliente() throws Exception {
        Pago pago = new Pago();
        pago.setContrato(contrato);
        pago.setMonto(BigDecimal.valueOf(120));
        pago.setFechaPago(LocalDateTime.now());
        pago.setMetodo(Pago.MetodoPago.EFECTIVO);
        pagoRepository.save(pago);

        mockMvc.perform(get("/api/pagos/cliente/" + cliente.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].monto").value(120));
    }

    @Test
    void testObtenerTotalPagado() throws Exception {
        Pago pago = new Pago();
        pago.setContrato(contrato);
        pago.setMonto(BigDecimal.valueOf(75));
        pago.setFechaPago(LocalDateTime.now());
        pago.setMetodo(Pago.MetodoPago.EFECTIVO);

        pagoRepository.save(pago);

        mockMvc.perform(get("/api/pagos/total/" + contrato.getId()))
                .andExpect(status().isOk())
                .andExpect(content().string("75.00"));
    }

    @Test
    void testGenerarReportePagos() throws Exception {
        LocalDateTime inicio = LocalDateTime.now().minusDays(10);
        LocalDateTime fin = LocalDateTime.now().plusDays(1);

        Pago pago = new Pago();
        pago.setContrato(contrato);
        pago.setMonto(BigDecimal.valueOf(60));
        pago.setFechaPago(LocalDateTime.now());
        pago.setMetodo(Pago.MetodoPago.EFECTIVO);

        pagoRepository.save(pago);

        mockMvc.perform(get("/api/pagos/reporte")
                        .param("fechaInicio", inicio.toString())
                        .param("fechaFin", fin.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].monto").value(60));
    }

    @Test
    void testRevertirPago() throws Exception {
        Pago pago = new Pago();
        pago.setContrato(contrato);
        pago.setMonto(BigDecimal.valueOf(150));
        pago.setFechaPago(LocalDateTime.now());
        pago.setMetodo(Pago.MetodoPago.EFECTIVO);
        pago.setEstado(Pago.EstadoPago.COMPLETADO);

        pago = pagoRepository.save(pago);

        mockMvc.perform(post("/api/pagos/" + pago.getId() + "/revertir")
                        .param("motivo", "Error en pago"))
                .andExpect(status().isOk());
    }
}
