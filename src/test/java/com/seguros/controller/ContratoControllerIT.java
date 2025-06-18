package com.seguros.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.seguros.dto.ContratoDTO;
import com.seguros.model.*;
import com.seguros.model.Contrato.EstadoContrato;
import com.seguros.model.Contrato.FrecuenciaPago;
import com.seguros.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ContratoControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ClienteRepository clienteRepository; // 👈 NUEVO

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
    private Seguro seguroExistente;

    @BeforeEach
    void setUp() {
        // Limpieza en orden correcto
        reembolsoRepository.deleteAll();
        contratoRepository.deleteAll();
        seguroRepository.deleteAll();
        clienteRepository.deleteAll(); // 👈 ELIMINA CLIENTES PRIMERO
        usuarioRepository.deleteAll();

        // Crear roles
        Rol rolAdmin = rolRepository.findByNombre("ADMIN").orElseGet(() -> {
            Rol rol = new Rol();
            rol.setNombre("ADMIN");
            rol.setDescripcion("Administrador");
            return rolRepository.save(rol);
        });

        Rol rolUser = rolRepository.findByNombre("USER").orElseGet(() -> {
            Rol rol = new Rol();
            rol.setNombre("USER");
            rol.setDescripcion("Usuario normal");
            return rolRepository.save(rol);
        });

        // Crear cliente (usuario)
        cliente = new Usuario();
        cliente.setNombre("Cliente");
        cliente.setApellido("Cliente");
        cliente.setEmail("cliente@test.com");
        cliente.setPassword("123456");
        cliente.setRol(rolUser);
        cliente = usuarioRepository.save(cliente);

        // Crear entidad Cliente
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
        entidadCliente.setDireccion("Av. Principal");
        clienteRepository.save(entidadCliente);

        // Crear agente
        agente = new Usuario();
        agente.setNombre("Agente");
        agente.setApellido("Agente");
        agente.setEmail("agente@test.com");
        agente.setPassword("123456");
        agente.setRol(rolAdmin);
        agente = usuarioRepository.save(agente);

        // Crear seguro
        SeguroVida seguroVida = new SeguroVida();
        seguroVida.setNombre("Seguro Vida");
        seguroVida.setDescripcion("Cobertura completa de vida");
        seguroVida.setMontoCobertura(new BigDecimal("10000.00"));
        seguroVida.setActivo(true);
        seguroVida.setPrecioAnual(new BigDecimal("120.00"));
        seguroVida.setCreadoPor(cliente);
        seguroExistente = seguroRepository.save(seguroVida);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void crearContrato() throws Exception {
        ContratoDTO dto = new ContratoDTO();
        dto.setClienteId(cliente.getId());
        dto.setAgenteId(agente.getId());
        dto.setSeguroId(seguroExistente.getId());
        dto.setFechaInicio(LocalDate.now());
        dto.setFechaFin(LocalDate.now().plusYears(1));
        dto.setFrecuenciaPago(FrecuenciaPago.MENSUAL);
        dto.setFirmaElectronica("firma123");

        var beneficiario = new com.seguros.dto.BeneficiarioDTO();
        beneficiario.setNombre("Juan Pérez");
        beneficiario.setParentesco("Hijo");
        beneficiario.setPorcentaje(BigDecimal.valueOf(100));
        beneficiario.setEsPrincipal(true);
        beneficiario.setDocumentoIdentidad("1234567890");
        beneficiario.setEmail("juan.perez@test.com");
        beneficiario.setTelefono("0999999999");
        beneficiario.setFechaNacimiento(LocalDate.of(2005, 5, 15));
        dto.setBeneficiarios(List.of(beneficiario));

        mockMvc.perform(post("/api/contratos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.clienteId").value(cliente.getId()))
                .andExpect(jsonPath("$.seguroId").value(seguroExistente.getId()));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void obtenerContratos() throws Exception {
        Contrato contrato = new Contrato();
        contrato.setCliente(cliente);
        contrato.setAgente(agente);
        contrato.setSeguro(seguroExistente);
        contrato.setFechaInicio(LocalDate.now());
        contrato.setFechaFin(LocalDate.now().plusYears(1));
        contrato.setFrecuenciaPago(FrecuenciaPago.MENSUAL);
        contrato.setEstado(EstadoContrato.ACTIVO);
        contrato.setFirmaElectronica("firma123");
        contratoRepository.save(contrato);

        mockMvc.perform(get("/api/contratos/cliente/" + cliente.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].clienteId").value(cliente.getId()))
                .andExpect(jsonPath("$[0].seguroId").value(seguroExistente.getId()));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void actualizarEstadoContrato() throws Exception {
        Contrato contrato = new Contrato();
        contrato.setCliente(cliente);
        contrato.setAgente(agente);
        contrato.setSeguro(seguroExistente);
        contrato.setFechaInicio(LocalDate.now());
        contrato.setFechaFin(LocalDate.now().plusYears(1));
        contrato.setFrecuenciaPago(FrecuenciaPago.MENSUAL);
        contrato.setEstado(EstadoContrato.ACTIVO);
        contrato.setFirmaElectronica("firma123");
        contrato = contratoRepository.save(contrato);

        mockMvc.perform(put("/api/contratos/" + contrato.getId() + "/estado")
                        .param("estado", EstadoContrato.CANCELADO.name()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value(EstadoContrato.CANCELADO.name()));
    }

    @Test
    @WithMockUser(roles = "USER")
    void obtenerContratosPorVencer() throws Exception {
        mockMvc.perform(get("/api/contratos/por-vencer")
                        .param("dias", "30"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void actualizarContratoCompleto() throws Exception {
        Contrato contrato = new Contrato();
        contrato.setCliente(cliente);
        contrato.setAgente(agente);
        contrato.setSeguro(seguroExistente);
        contrato.setFechaInicio(LocalDate.now());
        contrato.setFechaFin(LocalDate.now().plusYears(1));
        contrato.setFrecuenciaPago(FrecuenciaPago.MENSUAL);
        contrato.setEstado(EstadoContrato.ACTIVO);
        contrato.setFirmaElectronica("firmaOriginal");
        contrato.setBeneficiarios(new ArrayList<>());
        contrato = contratoRepository.save(contrato);

        ContratoDTO dto = new ContratoDTO();
        dto.setClienteId(cliente.getId());
        dto.setAgenteId(agente.getId());
        dto.setSeguroId(seguroExistente.getId());
        dto.setFechaInicio(LocalDate.now().plusDays(1));
        dto.setFechaFin(LocalDate.now().plusYears(2));
        dto.setFrecuenciaPago(FrecuenciaPago.ANUAL);
        dto.setFirmaElectronica("firmaActualizada");

        var beneficiario = new com.seguros.dto.BeneficiarioDTO();
        beneficiario.setNombre("Nuevo Beneficiario");
        beneficiario.setParentesco("Esposo/a");
        beneficiario.setPorcentaje(BigDecimal.valueOf(100));
        beneficiario.setEsPrincipal(true);
        beneficiario.setDocumentoIdentidad("9999999999");
        beneficiario.setEmail("benef@test.com");
        beneficiario.setTelefono("0988888888");
        beneficiario.setFechaNacimiento(LocalDate.of(1990, 1, 1));
        dto.setBeneficiarios(List.of(beneficiario));

        mockMvc.perform(put("/api/contratos/" + contrato.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firmaElectronica").value("firmaActualizada"))
                .andExpect(jsonPath("$.frecuenciaPago").value("ANUAL"))
                .andExpect(jsonPath("$.beneficiarios.length()").value(1));
    }
}
