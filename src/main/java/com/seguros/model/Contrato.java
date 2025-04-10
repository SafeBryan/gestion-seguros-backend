package com.seguros.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "contratos")
@Data
public class Contrato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Usuario cliente;

    @ManyToOne
    @JoinColumn(name = "seguro_id", nullable = false)
    private Seguro seguro;

    @ManyToOne
    @JoinColumn(name = "agente_id", nullable = false)
    private Usuario agente;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDate fechaFin;

    @Enumerated(EnumType.STRING)
    @Column(name = "frecuencia_pago", nullable = false, columnDefinition = "ENUM('MENSUAL', 'TRIMESTRAL', 'ANUAL')")
    private FrecuenciaPago frecuenciaPago;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('ACTIVO', 'VENCIDO', 'CANCELADO') default 'ACTIVO'")
    private EstadoContrato estado = EstadoContrato.ACTIVO;

    @Column(name = "firma_electronica", columnDefinition = "TEXT")
    private String firmaElectronica;

    @Column(columnDefinition = "JSON")
    private String archivos; // Almacena rutas de documentos en formato JSON

    @OneToMany(mappedBy = "contrato", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Beneficiario> beneficiarios;

    @OneToMany(mappedBy = "contrato")
    private List<Pago> pagos;

    @OneToMany(mappedBy = "contrato")
    private List<Reembolso> reembolsos;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum FrecuenciaPago {
        MENSUAL, TRIMESTRAL, ANUAL
    }

    public enum EstadoContrato {
        ACTIVO, VENCIDO, CANCELADO
    }

    public boolean isActivo() {
        return estado == EstadoContrato.ACTIVO;
    }
}