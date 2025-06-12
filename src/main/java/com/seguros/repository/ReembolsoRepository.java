package com.seguros.repository;

import com.seguros.model.Reembolso;
import com.seguros.model.Reembolso.EstadoReembolso;
import com.seguros.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface ReembolsoRepository extends JpaRepository<Reembolso, Long> {

    // ✅ Reembolsos de un cliente
    List<Reembolso> findByContrato_Cliente(Usuario cliente);

    // ✅ Reembolsos de un contrato específico
    List<Reembolso> findByContratoId(Long contratoId);

    // ✅ Reembolsos filtrados por estado (general)
    List<Reembolso> findByEstado(EstadoReembolso estado);

    // ✅ Reembolsos filtrados por cliente y estado (útil para frontend)
    List<Reembolso> findByContrato_Cliente_IdAndEstado(Long clienteId, EstadoReembolso estado);

    // ✅ Reembolsos pendientes por agente (si el contrato tiene agente asignado)
    @Query("SELECT r FROM Reembolso r WHERE r.contrato.agente.id = :agenteId AND r.estado = 'PENDIENTE'")
    List<Reembolso> findPendientesByAgenteId(Long agenteId);

    // ✅ Aprobación directa (optimización por update directo)
    @Modifying
    @Transactional
    @Query("""
        UPDATE Reembolso r SET
            r.estado = 'APROBADO',
            r.aprobadoPor.id = :aprobadorId,
            r.comentarioRevisor = :comentario,
            r.fechaRevision = CURRENT_TIMESTAMP
        WHERE r.id = :id
    """)
    int aprobarReembolso(Long id, Long aprobadorId, String comentario);

    // ✅ Rechazo directo (optimización por update directo)
    @Modifying
    @Transactional
    @Query("""
        UPDATE Reembolso r SET
            r.estado = 'RECHAZADO',
            r.aprobadoPor.id = :aprobadorId,
            r.comentarioRevisor = :comentario,
            r.fechaRevision = CURRENT_TIMESTAMP
        WHERE r.id = :id
    """)
    int rechazarReembolso(Long id, Long aprobadorId, String comentario);

    // ✅ Buscar reembolso por ID con detalles
    Optional<Reembolso> findById(Long id);
}
