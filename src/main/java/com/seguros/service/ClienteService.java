package com.seguros.service;

import com.seguros.dto.ClienteRequestDTO;
import com.seguros.dto.ClienteResponseDTO;
import com.seguros.model.Cliente;
import com.seguros.model.Usuario;
import com.seguros.repository.ClienteRepository;
import com.seguros.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;

    public ClienteService(ClienteRepository clienteRepository, UsuarioRepository usuarioRepository) {
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public ClienteResponseDTO crearCliente(ClienteRequestDTO dto) {
        if (clienteRepository.existsByNumeroIdentificacion(dto.getNumeroIdentificacion())) {
            throw new RuntimeException("El número de identificación ya está registrado.");
        }

        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!usuario.getRol().getNombre().equals("CLIENTE")) {
            throw new RuntimeException("El usuario no tiene rol CLIENTE.");
        }

        if (clienteRepository.existsById(usuario.getId())) {
            throw new RuntimeException("Este usuario ya tiene datos de cliente registrados.");
        }

        Cliente cliente = new Cliente();
        cliente.setUsuario(usuario);
        cliente.setTipoIdentificacion(dto.getTipoIdentificacion());
        cliente.setNumeroIdentificacion(dto.getNumeroIdentificacion());
        cliente.setFechaNacimiento(dto.getFechaNacimiento());
        cliente.setNacionalidad(dto.getNacionalidad());
        cliente.setEstadoCivil(dto.getEstadoCivil());
        cliente.setSexo(dto.getSexo());
        cliente.setLugarNacimiento(dto.getLugarNacimiento());
        cliente.setEstatura(dto.getEstatura());
        cliente.setPeso(dto.getPeso());
        cliente.setDireccion(dto.getDireccion());

        cliente = clienteRepository.save(cliente);
        return convertirAResponse(cliente);
    }

    public List<ClienteResponseDTO> listarClientes() {
        return clienteRepository.findAll().stream()
                .map(this::convertirAResponse)
                .collect(Collectors.toList());
    }

    public ClienteResponseDTO obtenerCliente(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        return convertirAResponse(cliente);
    }

    @Transactional
    public ClienteResponseDTO actualizarCliente(Long id, ClienteRequestDTO dto) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        if (!cliente.getNumeroIdentificacion().equals(dto.getNumeroIdentificacion()) &&
                clienteRepository.existsByNumeroIdentificacion(dto.getNumeroIdentificacion())) {
            throw new RuntimeException("El número de identificación ya está registrado.");
        }

        cliente.setTipoIdentificacion(dto.getTipoIdentificacion());
        cliente.setNumeroIdentificacion(dto.getNumeroIdentificacion());
        cliente.setFechaNacimiento(dto.getFechaNacimiento());
        cliente.setNacionalidad(dto.getNacionalidad());
        cliente.setEstadoCivil(dto.getEstadoCivil());
        cliente.setSexo(dto.getSexo());
        cliente.setLugarNacimiento(dto.getLugarNacimiento());
        cliente.setEstatura(dto.getEstatura());
        cliente.setPeso(dto.getPeso());
        cliente.setDireccion(dto.getDireccion());

        return convertirAResponse(clienteRepository.save(cliente));
    }

    @Transactional
    public void desactivarCliente(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        Usuario usuario = cliente.getUsuario();
        usuario.setActivo(false);
        usuarioRepository.save(usuario);
    }

    private ClienteResponseDTO convertirAResponse(Cliente cliente) {
        ClienteResponseDTO dto = new ClienteResponseDTO();
        dto.setId(cliente.getId());
        dto.setNombre(cliente.getUsuario().getNombre());
        dto.setApellido(cliente.getUsuario().getApellido());
        dto.setEmail(cliente.getUsuario().getEmail());
        dto.setTelefono(cliente.getUsuario().getTelefono());

        dto.setTipoIdentificacion(cliente.getTipoIdentificacion());
        dto.setNumeroIdentificacion(cliente.getNumeroIdentificacion());
        dto.setFechaNacimiento(cliente.getFechaNacimiento());
        dto.setNacionalidad(cliente.getNacionalidad());
        dto.setEstadoCivil(cliente.getEstadoCivil());
        dto.setSexo(cliente.getSexo());
        dto.setLugarNacimiento(cliente.getLugarNacimiento());
        dto.setEstatura(cliente.getEstatura());
        dto.setPeso(cliente.getPeso());
        dto.setDireccion(cliente.getDireccion());
        return dto;
    }
}
