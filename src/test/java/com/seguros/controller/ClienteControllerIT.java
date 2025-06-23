package com.seguros.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.seguros.dto.ClienteRequestDTO;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ClienteControllerIT {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private ClienteRepository clienteRepository;
    @Autowired private RolRepository rolRepository;
    @Autowired private SeguroRepository seguroRepository;
    @Autowired private ContratoRepository contratoRepository;
    @Autowired private DependienteRepository dependienteRepository;
    @Autowired private ReembolsoRepository reembolsoRepository;

    private Usuario clienteUsuario;

    @BeforeEach
    void setup() {
        // Eliminar datos en orden correcto
        dependienteRepository.deleteAll();
        reembolsoRepository.deleteAll();
        contratoRepository.deleteAll();
        seguroRepository.deleteAll();
        clienteRepository.deleteAll();
        usuarioRepository.deleteAll();
        // No borres roles si no es necesario: rolRepository.deleteAll(); ← ¡Evitar esto!

        // Buscar o crear rol CLIENTE
        Rol rolUser = rolRepository.findByNombre("CLIENTE").orElseGet(() -> {
            Rol nuevoRol = new Rol();
            nuevoRol.setNombre("CLIENTE");
            nuevoRol.setDescripcion("Usuario cliente");
            return rolRepository.save(nuevoRol);
        });

        // Crear usuario con ese rol
        clienteUsuario = new Usuario();
        clienteUsuario.setNombre("Bryan");
        clienteUsuario.setApellido("Perez");
        clienteUsuario.setEmail("bryan@test.com");
        clienteUsuario.setPassword("123456");
        clienteUsuario.setRol(rolUser);
        clienteUsuario = usuarioRepository.save(clienteUsuario);
    }


    @Test
    @WithMockUser(roles = "ADMIN")
    void testCrearCliente() throws Exception {
        ClienteRequestDTO dto = new ClienteRequestDTO();
        dto.setUsuarioId(clienteUsuario.getId());
        dto.setTipoIdentificacion("Cédula");
        dto.setNumeroIdentificacion("0102030405");
        dto.setFechaNacimiento(LocalDate.of(1995, 6, 23));
        dto.setNacionalidad("Ecuatoriana");
        dto.setEstadoCivil("Soltero");
        dto.setSexo("Masculino");
        dto.setLugarNacimiento("Ambato");
        dto.setEstatura(1.75);
        dto.setPeso(70.0);
        dto.setDireccion("Av. Siempre Viva");

        mockMvc.perform(post("/api/clientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Bryan"))
                .andExpect(jsonPath("$.numeroIdentificacion").value("0102030405"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testListarClientes() throws Exception {
        // Crear cliente primero
        ClienteRequestDTO dto = new ClienteRequestDTO();
        dto.setUsuarioId(clienteUsuario.getId());
        dto.setTipoIdentificacion("Cédula");
        dto.setNumeroIdentificacion("0102030405");
        dto.setFechaNacimiento(LocalDate.of(1995, 6, 23));
        dto.setNacionalidad("Ecuatoriana");
        dto.setEstadoCivil("Soltero");
        dto.setSexo("Masculino");
        dto.setLugarNacimiento("Ambato");
        dto.setEstatura(1.75);
        dto.setPeso(70.0);
        dto.setDireccion("Av. Siempre Viva");

        mockMvc.perform(post("/api/clientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/clientes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].numeroIdentificacion").value("0102030405"));
    }
}
