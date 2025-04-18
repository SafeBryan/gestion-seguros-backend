package com.seguros.repository;

import com.seguros.model.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface PagoRepository extends JpaRepository<Pago, Long> {

    List<Pago> findByContratoId(Long contratoId);

    @Query("SELECT p FROM Pago p WHERE p.contrato.cliente.id = :clienteId")
    List<Pago> findByClienteId(Long clienteId);

    @Query("SELECT p FROM Pago p WHERE p.fechaPago BETWEEN :fechaInicio AND :fechaFin")
    List<Pago> findByFechaPagoBetween(LocalDateTime fechaInicio, LocalDateTime fechaFin);

    @Query("SELECT p FROM Pago p WHERE p.contrato.id = :contratoId AND p.estado = 'COMPLETADO'")
    List<Pago> findPagosCompletadosByContratoId(Long contratoId);

    @Query("SELECT SUM(p.monto) FROM Pago p WHERE p.contrato.id = :contratoId AND p.estado = 'COMPLETADO'")
    BigDecimal sumPagosCompletadosByContratoId(Long contratoId);

    @Query("SELECT p FROM Pago p WHERE p.estado = 'PENDIENTE' AND p.fechaPago < :fechaLimite")
    List<Pago> findPagosPendientesVencidos(LocalDateTime fechaLimite);
}