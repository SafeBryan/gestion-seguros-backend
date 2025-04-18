package com.seguros.repository;

import com.seguros.model.Reembolso;
import com.seguros.model.Reembolso.EstadoReembolso;
import com.seguros.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface ReembolsoRepository extends JpaRepository<Reembolso, Long> {

    List<Reembolso> findByContrato_Cliente(Usuario cliente);

    List<Reembolso> findByContratoId(Long contratoId);

    List<Reembolso> findByEstado(EstadoReembolso estado);

    @Query("SELECT r FROM Reembolso r WHERE r.contrato.cliente.id = :clienteId")
    List<Reembolso> findByClienteId(Long clienteId);

    @Query("SELECT r FROM Reembolso r WHERE r.contrato.agente.id = :agenteId AND r.estado = 'PENDIENTE'")
    List<Reembolso> findPendientesByAgenteId(Long agenteId);

    @Transactional
    @Modifying
    @Query("UPDATE Reembolso r SET r.estado = 'APROBADO', r.aprobadoPor.id = :aprobadorId, " +
            "r.comentarioRevisor = :comentario, r.fechaRevision = CURRENT_TIMESTAMP WHERE r.id = :id")
    int aprobarReembolso(Long id, Long aprobadorId, String comentario);

    @Transactional
    @Modifying
    @Query("UPDATE Reembolso r SET r.estado = 'RECHAZADO', r.aprobadoPor.id = :aprobadorId, " +
            "r.comentarioRevisor = :comentario, r.fechaRevision = CURRENT_TIMESTAMP WHERE r.id = :id")
    int rechazarReembolso(Long id, Long aprobadorId, String comentario);
}