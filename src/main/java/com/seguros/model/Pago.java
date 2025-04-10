package com.seguros.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pagos")
@Data
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contrato_id", nullable = false)
    private Contrato contrato;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monto;

    @Column(name = "fecha_pago", nullable = false)
    private LocalDateTime fechaPago = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('TARJETA', 'TRANSFERENCIA', 'DEBITO_AUTOMATICO', 'EFECTIVO', 'CHEQUE', 'REEMBOLSO')")
    private MetodoPago metodo;

    @Column(length = 100)
    private String referencia;

    @Column(length = 50)
    private String comprobante;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('PENDIENTE', 'COMPLETADO', 'RECHAZADO', 'REVERTIDO') default 'COMPLETADO'")
    private EstadoPago estado = EstadoPago.COMPLETADO;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    public enum MetodoPago {
        TARJETA, TRANSFERENCIA, DEBITO_AUTOMATICO, EFECTIVO, CHEQUE, REEMBOLSO
    }

    public enum EstadoPago {
        PENDIENTE, COMPLETADO, RECHAZADO, REVERTIDO
    }

    public boolean isCompletado() {
        return estado == EstadoPago.COMPLETADO;
    }

    @PrePersist
    protected void onCreate() {
        if (fechaPago == null) {
            fechaPago = LocalDateTime.now();
        }
    }
}