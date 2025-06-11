package com.seguros.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.seguros.dto.BeneficiarioDTO;
import com.seguros.dto.ContratoDTO;
import com.seguros.dto.SeguroDTO;
import com.seguros.dto.UsuarioDTO;
import com.seguros.model.*;
import com.seguros.repository.ContratoRepository;
import com.seguros.repository.SeguroRepository;
import com.seguros.repository.UsuarioRepository;
import com.seguros.util.MensajesError;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class ContratoService {

    private final ContratoRepository contratoRepository;
    private final UsuarioRepository usuarioRepository;
    private final SeguroRepository seguroRepository;

    public ContratoService(ContratoRepository contratoRepository,
                           UsuarioRepository usuarioRepository,
                           SeguroRepository seguroRepository) {
        this.contratoRepository = contratoRepository;
        this.usuarioRepository = usuarioRepository;
        this.seguroRepository = seguroRepository;
    }

    @Transactional
    public Contrato crearContrato(ContratoDTO contratoDTO) {

        if (contratoDTO.getBeneficiarios() == null || contratoDTO.getBeneficiarios().isEmpty()) {
            throw new IllegalArgumentException("Debe agregar al menos un beneficiario para crear el contrato.");
        }

        Usuario cliente = usuarioRepository.findById(contratoDTO.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        Usuario agente = usuarioRepository.findById(contratoDTO.getAgenteId())
                .orElseThrow(() -> new RuntimeException("Agente no encontrado"));

        Seguro seguro = seguroRepository.findById(contratoDTO.getSeguroId())
                .orElseThrow(() -> new RuntimeException("Seguro no encontrado"));

        Contrato contrato = new Contrato();
        contrato.setCliente(cliente);
        contrato.setAgente(agente);
        contrato.setSeguro(seguro);
        contrato.setFechaInicio(contratoDTO.getFechaInicio());
        contrato.setFechaFin(contratoDTO.getFechaFin());
        contrato.setFrecuenciaPago(contratoDTO.getFrecuenciaPago());
        contrato.setFirmaElectronica(contratoDTO.getFirmaElectronica());

        // estado y archivos (JSON convertido a string)
        contrato.setEstado(contratoDTO.getEstado() != null ? contratoDTO.getEstado() : Contrato.EstadoContrato.ACTIVO);
        if (contratoDTO.getArchivos() != null) {
            contrato.setArchivos(new com.fasterxml.jackson.databind.ObjectMapper()
                    .valueToTree(contratoDTO.getArchivos()).toString());
        }

        // Beneficiarios
        List<Beneficiario> beneficiarios = contratoDTO.getBeneficiarios().stream().map(dto -> {
            Beneficiario b = new Beneficiario();
            b.setNombre(dto.getNombre());
            b.setParentesco(dto.getParentesco());
            b.setPorcentaje(dto.getPorcentaje());
            b.setEsPrincipal(dto.isEsPrincipal());
            b.setDocumentoIdentidad(dto.getDocumentoIdentidad());
            b.setEmail(dto.getEmail());
            b.setTelefono(dto.getTelefono());
            b.setFechaNacimiento(dto.getFechaNacimiento());
            b.setContrato(contrato);
            return b;
        }).toList();
        contrato.setBeneficiarios(beneficiarios);


        return contratoRepository.save(contrato);
    }


    public List<Contrato> obtenerContratosPorCliente(Long clienteId) {
        return contratoRepository.findContratosActivosPorCliente(clienteId);
    }

    public List<Contrato> obtenerContratosPorVencer(int dias) {
        LocalDate fechaLimite = LocalDate.now().plusDays(dias);
        return contratoRepository.findContratosPorVencer(fechaLimite);
    }

    @Transactional
    public Contrato actualizarEstado(Long contratoId, Contrato.EstadoContrato nuevoEstado) {
        Contrato contrato = contratoRepository.findById(contratoId)
                .orElseThrow(() -> new RuntimeException("Contrato no encontrado"));

        contrato.setEstado(nuevoEstado);
        return contratoRepository.save(contrato);
    }

    public Contrato obtenerContratoValido(Long contratoId) {
        Contrato contrato = contratoRepository.findById(contratoId)
                .orElseThrow(() -> new RuntimeException("Contrato no encontrado"));

        if (!contrato.isActivo()) {
            throw new RuntimeException("El contrato no está activo");
        }

        return contrato;
    }

    public ContratoDTO convertirAContratoDTO(Contrato contrato) {
        ContratoDTO dto = new ContratoDTO();
        dto.setId(contrato.getId());
        dto.setClienteId(contrato.getCliente().getId());
        dto.setAgenteId(contrato.getAgente().getId());
        dto.setSeguroId(contrato.getSeguro().getId());
        dto.setFechaInicio(contrato.getFechaInicio());
        dto.setFechaFin(contrato.getFechaFin());
        dto.setFrecuenciaPago(contrato.getFrecuenciaPago());
        dto.setEstado(contrato.getEstado());
        dto.setFirmaElectronica(contrato.getFirmaElectronica());

        try {
            if (contrato.getArchivos() != null) {
                ObjectMapper mapper = new ObjectMapper();
                Map<String, String> archivosMap = mapper.readValue(contrato.getArchivos(), new TypeReference<>() {});
                dto.setArchivos(archivosMap);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (contrato.getBeneficiarios() != null) {
            List<BeneficiarioDTO> beneficiarios = contrato.getBeneficiarios().stream().map(b -> {
                BeneficiarioDTO bDto = new BeneficiarioDTO();
                bDto.setId(b.getId()); // ✅ aquí incluyes el ID
                bDto.setContratoId(contrato.getId());
                bDto.setNombre(b.getNombre());
                bDto.setParentesco(b.getParentesco());
                bDto.setPorcentaje(b.getPorcentaje());
                bDto.setEsPrincipal(b.isEsPrincipal());
                bDto.setDocumentoIdentidad(b.getDocumentoIdentidad());
                bDto.setEmail(b.getEmail());
                bDto.setTelefono(b.getTelefono());
                bDto.setFechaNacimiento(b.getFechaNacimiento());
                return bDto;
            }).toList();
            dto.setBeneficiarios(beneficiarios);
        }
        // Agente
        Usuario agente = contrato.getAgente();
        if (agente != null) {
            UsuarioDTO agenteDto = new UsuarioDTO();
            agenteDto.setId(agente.getId());
            agenteDto.setNombre(agente.getNombre());
            agenteDto.setApellido(agente.getApellido());
            agenteDto.setEmail(agente.getEmail());
            agenteDto.setTelefono(agente.getTelefono());
            agenteDto.setRolId(agente.getRol().getId());
            agenteDto.setRolNombre(agente.getRol().getNombre());
            agenteDto.setActivo(agente.isActivo());
            dto.setAgente(agenteDto);
        }

// Seguro
        Seguro seguro = contrato.getSeguro();
        if (seguro != null) {
            SeguroDTO seguroDto = new SeguroDTO();
            seguroDto.setId(seguro.getId());
            seguroDto.setNombre(seguro.getNombre());
            seguroDto.setTipo(seguro.getTipo());
            seguroDto.setDescripcion(seguro.getDescripcion());
            seguroDto.setActivo(seguro.getActivo());
            dto.setSeguro(seguroDto);
        }


        return dto;
    }

    @Transactional
    public Contrato actualizarContrato(Long id, ContratoDTO dto) {
        Contrato contrato = contratoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(MensajesError.CONTRATO_NO_ENCONTRADO));


        // Solo permitir editar el estado si el contrato ya está CANCELADO
        if (contrato.getEstado() != Contrato.EstadoContrato.ACTIVO && dto.getEstado() != null) {
            contrato.setEstado(dto.getEstado());
        }

        Usuario cliente = usuarioRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new RuntimeException(MensajesError.CLIENTE_NO_ENCONTRADO));
        Usuario agente = usuarioRepository.findById(dto.getAgenteId())
                .orElseThrow(() -> new RuntimeException(MensajesError.AGENTE_NO_ENCONTRADO));

        Seguro seguro = seguroRepository.findById(dto.getSeguroId())
                .orElseThrow(() -> new RuntimeException(MensajesError.SEGURO_NO_ENCONTRADO));


        contrato.setCliente(cliente);
        contrato.setAgente(agente);
        contrato.setSeguro(seguro);
        contrato.setFechaInicio(dto.getFechaInicio());
        contrato.setFechaFin(dto.getFechaFin());
        contrato.setFrecuenciaPago(dto.getFrecuenciaPago());
        contrato.setFirmaElectronica(dto.getFirmaElectronica());

        // Archivos
        if (dto.getArchivos() != null) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                contrato.setArchivos(mapper.writeValueAsString(dto.getArchivos()));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        // Beneficiarios (elimina y reemplaza todos)
        contrato.getBeneficiarios().clear();
        List<Beneficiario> nuevos = dto.getBeneficiarios().stream().map(b -> {
            Beneficiario beneficiario = new Beneficiario();
            beneficiario.setNombre(b.getNombre());
            beneficiario.setParentesco(b.getParentesco());
            beneficiario.setPorcentaje(b.getPorcentaje());
            beneficiario.setEsPrincipal(b.isEsPrincipal());
            beneficiario.setDocumentoIdentidad(b.getDocumentoIdentidad());
            beneficiario.setEmail(b.getEmail());
            beneficiario.setTelefono(b.getTelefono());
            beneficiario.setFechaNacimiento(b.getFechaNacimiento());
            beneficiario.setContrato(contrato);
            return beneficiario;
        }).toList();
        contrato.getBeneficiarios().addAll(nuevos);

        return contratoRepository.save(contrato);
    }
    public List<Contrato> obtenerTodos() {
        return contratoRepository.findAll();
    }
}