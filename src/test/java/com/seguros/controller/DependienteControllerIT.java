package com.seguros.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.seguros.dto.DependienteDTO;
import com.seguros.model.*;
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

import java.time.LocalDate;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class DependienteControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ContratoRepository contratoRepository;

    @Autowired
    private DependienteRepository dependienteRepository;

    @Autowired
    private ReembolsoRepository reembolsoRepository;

    private Usuario cliente;
    private Contrato contrato;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private SeguroRepository seguroRepository;

    @Autowired
    private ClienteRepository clienteRepository;


    @BeforeEach
    void setup() {
        // Eliminar en orden correcto por claves foráneas
        dependienteRepository.deleteAll();
        reembolsoRepository.deleteAll();
        contratoRepository.deleteAll();
        seguroRepository.deleteAll();
        clienteRepository.deleteAll();
        usuarioRepository.deleteAll();
        rolRepository.deleteAll();

        // Crear roles
        Rol rolUser = rolRepository.findByNombre("USER").orElseGet(() -> {
            Rol rol = new Rol();
            rol.setNombre("USER");
            rol.setDescripcion("Usuario");
            return rolRepository.save(rol);
        });

        Rol rolAdmin = rolRepository.findByNombre("ADMIN").orElseGet(() -> {
            Rol rol = new Rol();
            rol.setNombre("ADMIN");
            rol.setDescripcion("Administrador");
            return rolRepository.save(rol);
        });


        // Crear cliente (usuario)
        cliente = new Usuario();
        cliente.setNombre("Usuario");
        cliente.setApellido("Test");
        cliente.setEmail("usuario@test.com");
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
        Usuario agente = new Usuario();
        agente.setNombre("Agente");
        agente.setApellido("Test");
        agente.setEmail("agente@test.com");
        agente.setPassword("123456");
        agente.setRol(rolAdmin);
        agente = usuarioRepository.save(agente);

        // Crear seguro
        SeguroVida seguro = new SeguroVida();
        seguro.setNombre("Seguro de Vida");
        seguro.setDescripcion("Seguro completo");
        seguro.setMontoCobertura(new java.math.BigDecimal("10000.00"));
        seguro.setActivo(true);
        seguro.setPrecioAnual(new java.math.BigDecimal("150.00"));
        seguro.setCreadoPor(cliente);
        seguro = seguroRepository.save(seguro);

        // Crear contrato con relaciones correctas
        contrato = new Contrato();
        contrato.setCliente(cliente);
        contrato.setAgente(agente);
        contrato.setSeguro(seguro);
        contrato.setFirmaElectronica("firma123");
        contrato.setFechaInicio(LocalDate.now());
        contrato.setFechaFin(LocalDate.now().plusYears(1));
        contrato.setFrecuenciaPago(Contrato.FrecuenciaPago.MENSUAL);
        contrato.setEstado(Contrato.EstadoContrato.ACTIVO);
        contrato = contratoRepository.save(contrato);
    }


    @Test
    @WithMockUser
    void testActualizarDependientes() throws Exception {
        DependienteDTO dto = new DependienteDTO();
        dto.setNombre("Juan");
        dto.setParentesco("Hijo");
        dto.setDocumentoIdentidad("1111111111");
        dto.setEmail("juan@test.com");
        dto.setTelefono("0987654321");
        dto.setFechaNacimiento(LocalDate.of(2010, 1, 1));
        dto.setContratoId(contrato.getId()); // 👈 Esta línea es CLAVE

        mockMvc.perform(post("/api/dependientes/contrato/" + contrato.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(List.of(dto))))
                .andExpect(status().isOk());
    }


    @Test
    @WithMockUser
    void testObtenerDependientesPorContrato() throws Exception {
        Dependiente dependiente = new Dependiente();
        dependiente.setNombre("Maria");
        dependiente.setParentesco("Hija");
        dependiente.setDocumentoIdentidad("2222222222");
        dependiente.setEmail("maria@test.com");
        dependiente.setTelefono("0999999999");
        dependiente.setFechaNacimiento(LocalDate.of(2012, 2, 2));
        dependiente.setContrato(contrato);
        dependienteRepository.save(dependiente);

        mockMvc.perform(get("/api/dependientes/contrato/" + contrato.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombre").value("Maria"))
                .andExpect(jsonPath("$[0].parentesco").value("Hija"));
    }
}
