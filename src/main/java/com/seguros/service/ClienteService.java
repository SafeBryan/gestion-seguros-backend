package com.seguros.service;

import com.seguros.dto.ClienteRequestDTO;
import com.seguros.dto.ClienteResponseDTO;
import com.seguros.exception.*;
import com.seguros.model.Cliente;
import com.seguros.model.Usuario;
import com.seguros.repository.ClienteRepository;
import com.seguros.repository.UsuarioRepository;
import com.seguros.util.MensajesError;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
            throw new NumeroIdentificacionExistenteException(MensajesError.NUMERO_IDENTIFICACION_REPETIDO);
        }

        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new UsuarioNoEncontradoException(MensajesError.USUARIO_NO_ENCONTRADO));

        if (!usuario.getRol().getNombre().equals("CLIENTE")) {
            throw new RolInvalidoException(MensajesError.ROL_INVALIDO_PARA_CLIENTE);
        }

        if (clienteRepository.existsById(usuario.getId())) {
            throw new ClienteYaRegistradoException(MensajesError.CLIENTE_YA_REGISTRADO_PARA_USUARIO);
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
                .toList(); // ✅ si usas Java 16+
    }

    public ClienteResponseDTO obtenerCliente(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(MensajesError.CLIENTE_NO_ENCONTRADO));
        return convertirAResponse(cliente);
    }


    @Transactional
    public ClienteResponseDTO actualizarCliente(Long id, ClienteRequestDTO dto) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ClienteNoEncontradoException(MensajesError.CONTRATO_NO_ENCONTRADO));

        boolean identificacionCambiada = !cliente.getNumeroIdentificacion().equals(dto.getNumeroIdentificacion());
        boolean identificacionYaExiste = clienteRepository.existsByNumeroIdentificacion(dto.getNumeroIdentificacion());

        if (identificacionCambiada && identificacionYaExiste) {
            throw new NumeroIdentificacionExistenteException(MensajesError.NUMERO_IDENTIFICACION_REPETIDO);
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
