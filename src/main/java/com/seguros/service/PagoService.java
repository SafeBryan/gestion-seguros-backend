package com.seguros.service;

import com.seguros.dto.PagoDTO;
import com.seguros.model.*;
import com.seguros.repository.PagoRepository;
import com.seguros.repository.ContratoRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
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
        pago.setReferencia(dto.getReferencia());
        pago.setComprobante(dto.getComprobante());
        pago.setEstado(dto.getEstado());
        pago.setObservaciones(dto.getObservaciones());

        if (dto.getFechaPago() != null) {
            pago.setFechaPago(dto.getFechaPago());
        }

        return pagoRepository.save(pago);
    }

    public List<Pago> obtenerPagosPorContrato(Long contratoId) {
        return pagoRepository.findByContratoId(contratoId);
    }

    public List<Pago> obtenerPagosPorCliente(Long clienteId) {
        return pagoRepository.findByClienteId(clienteId);
    }

    public BigDecimal obtenerTotalPagadoPorContrato(Long contratoId) {
        return pagoRepository.sumPagosCompletadosByContratoId(contratoId);
    }

    public List<Pago> generarReportePagos(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        return pagoRepository.findByFechaPagoBetween(fechaInicio, fechaFin);
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
}
