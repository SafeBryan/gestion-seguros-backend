package com.seguros.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.seguros.dto.BeneficiarioDTO;
import com.seguros.model.*;
import com.seguros.repository.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.AfterEach;
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
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class BeneficiarioControllerIT {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private RolRepository rolRepository;
    @Autowired private SeguroRepository seguroRepository;
    @Autowired private ContratoRepository contratoRepository;
    @Autowired private BeneficiarioRepository beneficiarioRepository;

    @PersistenceContext
    private EntityManager entityManager;

    private Usuario cliente;
    private Usuario agente;
    private Seguro seguro;
    private Contrato contrato;

    @BeforeEach
    void setUp() {
        // Desactivar restricciones de clave foránea temporalmente
        entityManager.createNativeQuery("SET FOREIGN_KEY_CHECKS = 0").executeUpdate();

        beneficiarioRepository.deleteAll();
        contratoRepository.deleteAll();
        seguroRepository.deleteAll();
        usuarioRepository.deleteAll();
        rolRepository.deleteAll();

        // Activar nuevamente restricciones
        entityManager.createNativeQuery("SET FOREIGN_KEY_CHECKS = 1").executeUpdate();

        Rol rolUser = rolRepository.findByNombre("USER").orElseGet(() -> {
            Rol r = new Rol();
            r.setNombre("USER");
            r.setDescripcion("Usuario");
            return rolRepository.save(r);
        });

        Rol rolAdmin = rolRepository.findByNombre("ADMIN").orElseGet(() -> {
            Rol r = new Rol();
            r.setNombre("ADMIN");
            r.setDescripcion("Administrador");
            return rolRepository.save(r);
        });

        cliente = new Usuario();
        cliente.setNombre("Cliente");
        cliente.setApellido("Perez");
        cliente.setEmail("cliente@ejemplo.com");
        cliente.setPassword("1234");
        cliente.setRol(rolUser);
        cliente = usuarioRepository.save(cliente);

        agente = new Usuario();
        agente.setNombre("Agente");
        agente.setApellido("hola");
        agente.setEmail("agente@ejemplo.com");
        agente.setPassword("1234");
        agente.setRol(rolAdmin);
        agente = usuarioRepository.save(agente);

        SeguroVida seguroVida = new SeguroVida();
        seguroVida.setNombre("Vida");
        seguroVida.setDescripcion("Cobertura vida");
        seguroVida.setMontoCobertura(BigDecimal.valueOf(10000));
        seguroVida.setActivo(true);
        seguroVida.setPrecioAnual(BigDecimal.valueOf(100));
        seguroVida.setCreadoPor(agente);
        seguro = seguroRepository.save(seguroVida);

        contrato = new Contrato();
        contrato.setCliente(cliente);
        contrato.setAgente(agente);
        contrato.setSeguro(seguro);
        contrato.setFechaInicio(LocalDate.now());
        contrato.setFechaFin(LocalDate.now().plusYears(1));
        contrato.setFrecuenciaPago(Contrato.FrecuenciaPago.MENSUAL);
        contrato.setEstado(Contrato.EstadoContrato.ACTIVO);
        contrato.setFirmaElectronica("firmaXYZ");
        contrato = contratoRepository.save(contrato);
    }

    @AfterEach
    void enableForeignKeys() {
        entityManager.createNativeQuery("SET FOREIGN_KEY_CHECKS = 1").executeUpdate();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testCrearBeneficiario() throws Exception {
        BeneficiarioDTO dto = new BeneficiarioDTO();
        dto.setNombre("Juan");
        dto.setParentesco("Hijo");
        dto.setPorcentaje(BigDecimal.valueOf(100));
        dto.setEsPrincipal(true);
        dto.setDocumentoIdentidad("1234567890");
        dto.setEmail("juan@test.com");
        dto.setTelefono("0999999999");
        dto.setFechaNacimiento(LocalDate.of(2000, 1, 1));
        dto.setContratoId(contrato.getId());

        mockMvc.perform(post("/api/beneficiarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Juan"))
                .andExpect(jsonPath("$.contrato.id").value(contrato.getId()));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testActualizarBeneficiarios() throws Exception {
        BeneficiarioDTO dto = new BeneficiarioDTO();
        dto.setNombre("María");
        dto.setParentesco("Hermana");
        dto.setPorcentaje(BigDecimal.valueOf(100));
        dto.setEsPrincipal(true);
        dto.setDocumentoIdentidad("9876543210");
        dto.setEmail("maria@test.com");
        dto.setTelefono("0988888888");
        dto.setFechaNacimiento(LocalDate.of(1995, 6, 15));
        dto.setContratoId(contrato.getId()); // ✅ Este era el dato faltante

        mockMvc.perform(post("/api/beneficiarios/contrato/" + contrato.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(List.of(dto))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].nombre").value("María"));
    }


    @Test
    @WithMockUser(roles = "USER")
    void testObtenerPorContrato() throws Exception {
        Beneficiario beneficiario = new Beneficiario();
        beneficiario.setContrato(contrato);
        beneficiario.setNombre("Luis");
        beneficiario.setParentesco("Padre");
        beneficiario.setPorcentaje(BigDecimal.valueOf(100));
        beneficiario.setEsPrincipal(true);
        beneficiario.setDocumentoIdentidad("1231231230");
        beneficiario.setEmail("luis@test.com");
        beneficiario.setTelefono("0911111111");
        beneficiario.setFechaNacimiento(LocalDate.of(1970, 3, 10));
        beneficiarioRepository.save(beneficiario);

        mockMvc.perform(get("/api/beneficiarios/contrato/" + contrato.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].nombre").value("Luis"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void testObtenerPorCliente() throws Exception {
        Beneficiario beneficiario = new Beneficiario();
        beneficiario.setContrato(contrato);
        beneficiario.setNombre("Ana");
        beneficiario.setParentesco("Madre");
        beneficiario.setPorcentaje(BigDecimal.valueOf(100));
        beneficiario.setEsPrincipal(true);
        beneficiario.setDocumentoIdentidad("1111111111");
        beneficiario.setEmail("ana@test.com");
        beneficiario.setTelefono("0977777777");
        beneficiario.setFechaNacimiento(LocalDate.of(1975, 7, 20));
        beneficiarioRepository.save(beneficiario);

        mockMvc.perform(get("/api/beneficiarios/cliente/" + cliente.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].nombre").value("Ana"));
    }
}
