package com.seguros.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.seguros.dto.ContratoDTO;
import com.seguros.model.Contrato;
import com.seguros.model.Rol;
import com.seguros.model.Seguro;
import com.seguros.model.Usuario;
import com.seguros.model.Contrato.EstadoContrato;
import com.seguros.model.Contrato.FrecuenciaPago;
import com.seguros.repository.ContratoRepository;
import com.seguros.repository.RolRepository;
import com.seguros.repository.SeguroRepository;
import com.seguros.repository.UsuarioRepository;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class ContratoControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private SeguroRepository seguroRepository;

    @Autowired
    private ContratoRepository contratoRepository;

    private Usuario cliente;
    private Usuario agente;
    private Seguro seguroExistente;

    @BeforeEach
    void setUp() {
        contratoRepository.deleteAll();
        seguroRepository.deleteAll();
        usuarioRepository.deleteAll();
        rolRepository.deleteAll();

        // Crear rol ADMIN
        Rol rolAdmin = rolRepository.findByNombre("ADMIN").orElseGet(() -> {
            Rol rol = new Rol();
            rol.setNombre("ADMIN");
            rol.setDescripcion("Administrador");
            return rolRepository.save(rol);
        });

        // Crear rol USER
        Rol rolUser = rolRepository.findByNombre("USER").orElseGet(() -> {
            Rol rol = new Rol();
            rol.setNombre("USER");
            rol.setDescripcion("Usuario normal");
            return rolRepository.save(rol);
        });

        // Crear cliente con rol USER
        cliente = new Usuario();
        cliente.setNombre("Cliente");
        cliente.setApellido("Cliente");
        cliente.setEmail("cliente@test.com");
        cliente.setPassword("123456");
        cliente.setRol(rolUser);
        cliente = usuarioRepository.save(cliente);

        // Crear agente con rol ADMIN
        agente = new Usuario();
        agente.setNombre("Agente");
        agente.setApellido("Agente");
        agente.setEmail("agente@test.com");
        agente.setPassword("123456");
        agente.setRol(rolAdmin);
        agente = usuarioRepository.save(agente);

        // Crear seguro
        seguroExistente = new Seguro();
        seguroExistente.setNombre("Seguro Vida");
        seguroExistente.setDescripcion("Cobertura completa de vida");
        seguroExistente.setTipo(Seguro.TipoSeguro.VIDA);
        seguroExistente.setActivo(true);
        seguroExistente.setPrecioAnual(new BigDecimal("120.00"));
        seguroExistente.setCreadoPor(cliente);
        seguroRepository.save(seguroExistente);
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

        mockMvc.perform(post("/api/contratos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.cliente.id").value(cliente.getId()))
                .andExpect(jsonPath("$.seguro.id").value(seguroExistente.getId()));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void obtenerContratos() throws Exception {
        // Primero crear un contrato para el cliente
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
                .andExpect(jsonPath("$[0].cliente.id").value(cliente.getId()))
                .andExpect(jsonPath("$[0].seguro.id").value(seguroExistente.getId()));
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
}
