package com.seguros.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "seguros")
@Data
public class Seguro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('VIDA', 'SALUD')")
    private TipoSeguro tipo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(columnDefinition = "TEXT")
    private String cobertura;

    @Column(name = "precio_anual", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioAnual;

    @Column(nullable = false)
    private Boolean activo = true;

    @ManyToOne
    @JoinColumn(name = "created_by", referencedColumnName = "id")
    private Usuario creadoPor;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum TipoSeguro {
        VIDA, SALUD
    }

    public boolean isActivo() {
        return activo;
    }
}