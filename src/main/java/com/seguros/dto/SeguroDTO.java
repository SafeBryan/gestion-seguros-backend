package com.seguros.dto;

import com.seguros.model.Seguro.TipoSeguro;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class SeguroDTO {
    private Long id;
    private String nombre;
    private TipoSeguro tipo;
    private String descripcion;
    private String cobertura;
    private BigDecimal precioAnual;
    private boolean activo;

    private String creadoPorNombre;
    private LocalDateTime fechaCreacion;
}