package com.seguros.service;

import com.seguros.dto.PagoDTO;
import com.seguros.exception.ComprobanteInvalidoException;
import com.seguros.model.Contrato;
import com.seguros.model.Pago;
import com.seguros.repository.ContratoRepository;
import com.seguros.repository.PagoRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Service
public class PagoService {

    private final PagoRepository pagoRepository;
    private final ContratoRepository contratoRepository;

    public PagoService(PagoRepository pagoRepository, ContratoRepository contratoRepository) {
        this.pagoRepository = pagoRepository;
        this.contratoRepository = contratoRepository;
    }

    @Transactional
    public Pago registrarPago(PagoDTO dto) {
        Contrato contrato = contratoRepository.findById(dto.getContratoId())
                .orElseThrow(() -> new RuntimeException("Contrato no encontrado"));

        Pago pago = new Pago();
        pago.setContrato(contrato);
        pago.setMonto(dto.getMonto());
        pago.setMetodo(dto.getMetodo());
        pago.setObservaciones(dto.getObservaciones());
        pago.setReferencia(dto.getReferencia());  // Nuevo campo

        // Procesar comprobante
        if (dto.getComprobante() != null && !dto.getComprobante().isEmpty()) {
            try {
                byte[] comprobanteBytes = Base64.getDecoder().decode(dto.getComprobante());
                pago.setComprobante(comprobanteBytes);
                pago.setComprobanteNombre(dto.getComprobanteNombre());
                pago.setComprobanteTipoContenido(dto.getComprobanteTipoContenido());
            } catch (IllegalArgumentException e) {
                throw new ComprobanteInvalidoException("Formato de comprobante inválido", e);
            }
        }

        pago.setEstado(dto.getEstado() != null ? dto.getEstado() : Pago.EstadoPago.COMPLETADO);

        if (dto.getFechaPago() != null) {
            pago.setFechaPago(dto.getFechaPago());
        }

        return pagoRepository.save(pago);
    }

    public List<PagoDTO> obtenerPagosPorContrato(Long contratoId) {
        List<Pago> pagos = pagoRepository.findByContratoId(contratoId);
        return pagos.stream().map(this::convertToDto).toList();
    }

    public List<PagoDTO> obtenerPagosPorCliente(Long clienteId) {
        List<Pago> pagos = pagoRepository.findByClienteId(clienteId);
        return pagos.stream().map(this::convertToDto).toList();
    }

    public BigDecimal obtenerTotalPagadoPorContrato(Long contratoId) {
        BigDecimal total = pagoRepository.sumPagosCompletadosByContratoId(contratoId);
        return total != null ? total : BigDecimal.ZERO;
    }

    public List<PagoDTO> generarReportePagos(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        List<Pago> pagos = pagoRepository.findByFechaPagoBetween(fechaInicio, fechaFin);
        return pagos.stream().map(this::convertToDto).toList();
    }

    @Transactional
    public void revertirPago(Long pagoId, String motivo) {
        Pago pago = pagoRepository.findById(pagoId)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));

        if (!pago.isCompletado()) {
            throw new RuntimeException("Solo se pueden revertir pagos completados");
        }

        pago.setEstado(Pago.EstadoPago.REVERTIDO);
        pago.setObservaciones("REVERTIDO - Motivo: " + motivo);
        pagoRepository.save(pago);
    }

    public PagoDTO convertToDto(Pago pago) {
        PagoDTO dto = new PagoDTO();

        // Mapeo de campos básicos
        dto.setId(pago.getId());
        dto.setMonto(pago.getMonto());
        dto.setFechaPago(pago.getFechaPago());
        dto.setMetodo(pago.getMetodo());
        dto.setEstado(pago.getEstado());
        dto.setObservaciones(pago.getObservaciones());
        dto.setReferencia(pago.getReferencia()); // Añadido el campo referencia

        // Mapeo de relación con Contrato
        if (pago.getContrato() != null) {
            dto.setContratoId(pago.getContrato().getId());
            dto.setContratoReferencia(pago.getReferencia()); // Usar referencia real del contrato

            // Mapeo de información del Cliente si existe
            if (pago.getContrato().getCliente() != null) {
                dto.setClienteNombre(pago.getContrato().getCliente().getNombre());
            }
        }

        // Mapeo del comprobante (optimizado)
        if (pago.getComprobante() != null && pago.getComprobante().length > 0) {
            dto.setComprobante(Base64.getEncoder().encodeToString(pago.getComprobante()));
            dto.setComprobanteNombre(pago.getComprobanteNombre());
            dto.setComprobanteTipoContenido(pago.getComprobanteTipoContenido());
        } else {
            dto.setComprobante(null);
            dto.setComprobanteNombre(null);
            dto.setComprobanteTipoContenido(null);
        }

        return dto;
    }

}
