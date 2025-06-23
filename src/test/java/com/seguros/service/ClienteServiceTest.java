package com.seguros.service;

import com.seguros.dto.ClienteRequestDTO;
import com.seguros.dto.ClienteResponseDTO;
import com.seguros.model.Cliente;
import com.seguros.model.Rol;
import com.seguros.model.Usuario;
import com.seguros.repository.ClienteRepository;
import com.seguros.repository.UsuarioRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ClienteServiceTest {

    @Mock
    private ClienteRepository clienteRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private ClienteService clienteService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    private ClienteRequestDTO crearClienteRequestDTO() {
        ClienteRequestDTO dto = new ClienteRequestDTO();
        dto.setUsuarioId(1L);
        dto.setTipoIdentificacion("CEDULA");
        dto.setNumeroIdentificacion("1234567890");
        dto.setFechaNacimiento(LocalDate.of(1990, 1, 1));
        dto.setNacionalidad("Ecuatoriana");
        dto.setEstadoCivil("Soltero");
        dto.setSexo("M");
        dto.setLugarNacimiento("Ambato");
        dto.setEstatura(1.75);
        dto.setPeso(70.0);
        dto.setDireccion("Av. Siempre Viva");
        return dto;
    }

    private Usuario crearUsuarioConRolCliente() {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Juan");
        usuario.setApellido("Pérez");
        usuario.setEmail("juan@example.com");
        usuario.setTelefono("0999999999");
        usuario.setActivo(true);

        Rol rol = new Rol();
        rol.setNombre("CLIENTE");
        usuario.setRol(rol);
        return usuario;
    }

    private Cliente crearCliente(Usuario usuario) {
        Cliente cliente = new Cliente();
        cliente.setId(1L);
        cliente.setUsuario(usuario);
        cliente.setTipoIdentificacion("CEDULA");
        cliente.setNumeroIdentificacion("1234567890");
        cliente.setFechaNacimiento(LocalDate.of(1990, 1, 1));
        cliente.setNacionalidad("Ecuatoriana");
        cliente.setEstadoCivil("Soltero");
        cliente.setSexo("M");
        cliente.setLugarNacimiento("Ambato");
        cliente.setEstatura(1.75);
        cliente.setPeso(70.0);
        cliente.setDireccion("Av. Siempre Viva");
        return cliente;
    }

    @Test
    void crearCliente_deberiaGuardarClienteCorrectamente() {
        ClienteRequestDTO dto = crearClienteRequestDTO();
        Usuario usuario = crearUsuarioConRolCliente();
        Cliente cliente = crearCliente(usuario);

        when(clienteRepository.existsByNumeroIdentificacion(dto.getNumeroIdentificacion())).thenReturn(false);
        when(usuarioRepository.findById(dto.getUsuarioId())).thenReturn(Optional.of(usuario));
        when(clienteRepository.existsById(usuario.getId())).thenReturn(false);
        when(clienteRepository.save(any(Cliente.class))).thenReturn(cliente);

        ClienteResponseDTO response = clienteService.crearCliente(dto);

        assertNotNull(response);
        assertEquals("Juan", response.getNombre());
        verify(clienteRepository).save(any(Cliente.class));
    }

    @Test
    void crearCliente_conIdentificacionDuplicada_lanzaExcepcion() {
        ClienteRequestDTO dto = crearClienteRequestDTO();

        when(clienteRepository.existsByNumeroIdentificacion(dto.getNumeroIdentificacion())).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> clienteService.crearCliente(dto));
        assertTrue(ex.getMessage().contains("ya está registrado"));
    }

    @Test
    void obtenerCliente_existente_deberiaDevolverCliente() {
        Usuario usuario = crearUsuarioConRolCliente();
        Cliente cliente = crearCliente(usuario);

        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));

        ClienteResponseDTO response = clienteService.obtenerCliente(1L);

        assertEquals("Juan", response.getNombre());
    }

    @Test
    void obtenerCliente_noExistente_lanzaExcepcion() {
        when(clienteRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> clienteService.obtenerCliente(1L));
        assertEquals("Cliente no encontrado", ex.getMessage());
    }

    @Test
    void desactivarCliente_deberiaActualizarEstadoUsuario() {
        Usuario usuario = crearUsuarioConRolCliente();
        Cliente cliente = crearCliente(usuario);

        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));

        clienteService.desactivarCliente(1L);

        assertFalse(usuario.isActivo());
        verify(usuarioRepository).save(usuario);
    }

    @Test
    void crearCliente_conRolIncorrecto_lanzaExcepcion() {
        ClienteRequestDTO dto = crearClienteRequestDTO();

        Usuario usuario = crearUsuarioConRolCliente();
        usuario.getRol().setNombre("ADMIN"); // Cambiamos el rol

        when(clienteRepository.existsByNumeroIdentificacion(dto.getNumeroIdentificacion())).thenReturn(false);
        when(usuarioRepository.findById(dto.getUsuarioId())).thenReturn(Optional.of(usuario));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> clienteService.crearCliente(dto));
        assertTrue(ex.getMessage().contains("no tiene rol CLIENTE"));
    }

    @Test
    void crearCliente_conClienteYaRegistrado_lanzaExcepcion() {
        ClienteRequestDTO dto = crearClienteRequestDTO();
        Usuario usuario = crearUsuarioConRolCliente();

        when(clienteRepository.existsByNumeroIdentificacion(dto.getNumeroIdentificacion())).thenReturn(false);
        when(usuarioRepository.findById(dto.getUsuarioId())).thenReturn(Optional.of(usuario));
        when(clienteRepository.existsById(usuario.getId())).thenReturn(true); // Simula cliente existente

        RuntimeException ex = assertThrows(RuntimeException.class, () -> clienteService.crearCliente(dto));
        assertTrue(ex.getMessage().contains("ya tiene datos de cliente registrados"));
    }

    @Test
    void actualizarCliente_conNumeroIdentificacionDuplicado_lanzaExcepcion() {
        Usuario usuario = crearUsuarioConRolCliente();
        Cliente cliente = crearCliente(usuario);

        ClienteRequestDTO dto = crearClienteRequestDTO();
        dto.setNumeroIdentificacion("0987654321"); // Diferente para forzar validación

        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(clienteRepository.existsByNumeroIdentificacion("0987654321")).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> clienteService.actualizarCliente(1L, dto));
        assertTrue(ex.getMessage().contains("ya está registrado"));
    }

    @Test
    void actualizarCliente_conDatosValidos_actualizaYDevuelveDTO() {
        Usuario usuario = crearUsuarioConRolCliente();
        Cliente cliente = crearCliente(usuario);

        ClienteRequestDTO dto = crearClienteRequestDTO(); // misma cédula = "1234567890"
        // No se activa la validación porque son iguales

        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(clienteRepository.save(any(Cliente.class))).thenAnswer(inv -> inv.getArgument(0));

        ClienteResponseDTO response = clienteService.actualizarCliente(1L, dto);

        assertEquals(dto.getNumeroIdentificacion(), response.getNumeroIdentificacion());
        assertEquals(dto.getDireccion(), response.getDireccion());
        assertEquals(dto.getFechaNacimiento(), response.getFechaNacimiento());
        verify(clienteRepository).save(any(Cliente.class));
    }

}
