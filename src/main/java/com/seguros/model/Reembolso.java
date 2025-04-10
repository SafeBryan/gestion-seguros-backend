package com.seguros.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "reembolsos")
@Data
public class Reembolso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "contrato_id", nullable = false)
    private Contrato contrato;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monto;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('PENDIENTE', 'APROBADO', 'RECHAZADO') default 'PENDIENTE'")
    private EstadoReembolso estado = EstadoReembolso.PENDIENTE;

    @Column(columnDefinition = "JSON")
    private String archivos;

    @ManyToOne
    @JoinColumn(name = "aprobado_por")
    private Usuario aprobadoPor;

    @Column(name = "comentario_revisor", columnDefinition = "TEXT")
    private String comentarioRevisor;

    @Column(name = "fecha_solicitud", updatable = false)
    private LocalDateTime fechaSolicitud = LocalDateTime.now();

    @Column(name = "fecha_revision")
    private LocalDateTime fechaRevision;

    public enum EstadoReembolso {
        PENDIENTE, APROBADO, RECHAZADO
    }

    public boolean isPendiente() {
        return estado == EstadoReembolso.PENDIENTE;
    }

    public void aprobar(Usuario aprobadoPor, String comentario) {
        this.estado = EstadoReembolso.APROBADO;
        this.aprobadoPor = aprobadoPor;
        this.comentarioRevisor = comentario;
        this.fechaRevision = LocalDateTime.now();
    }

    public void rechazar(Usuario aprobadoPor, String comentario) {
        this.estado = EstadoReembolso.RECHAZADO;
        this.aprobadoPor = aprobadoPor;
        this.comentarioRevisor = comentario;
        this.fechaRevision = LocalDateTime.now();
    }
}