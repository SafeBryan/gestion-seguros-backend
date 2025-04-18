package com.seguros.dto;

import com.seguros.model.Seguro.TipoSeguro;
import java.math.BigDecimal;

public class SeguroDTO {
    private Long id;
    private String nombre;
    private TipoSeguro tipo;
    private String descripcion;
    private String cobertura;
    private BigDecimal precioAnual;
    private Boolean activo;
    private Long creadoPorId;

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public TipoSeguro getTipo() { return tipo; }
    public void setTipo(TipoSeguro tipo) { this.tipo = tipo; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getCobertura() { return cobertura; }
    public void setCobertura(String cobertura) { this.cobertura = cobertura; }
    public BigDecimal getPrecioAnual() { return precioAnual; }
    public void setPrecioAnual(BigDecimal precioAnual) { this.precioAnual = precioAnual; }
    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
    public Long getCreadoPorId() { return creadoPorId; }
    public void setCreadoPorId(Long creadoPorId) { this.creadoPorId = creadoPorId; }
}