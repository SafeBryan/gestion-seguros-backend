package com.seguros.dto;

import com.seguros.model.Pago.EstadoPago;
import com.seguros.model.Pago.MetodoPago;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PagoDTO {
    private Long id;
    private Long contratoId;
    private String contratoReferencia;
    private String clienteNombre;
    private BigDecimal monto;
    private LocalDateTime fechaPago;
    private MetodoPago metodo;
    private String referencia;
    private String comprobante;
    private EstadoPago estado;
    private String observaciones;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getContratoId() { return contratoId; }
    public void setContratoId(Long contratoId) { this.contratoId = contratoId; }

    public String getContratoReferencia() { return contratoReferencia; }
    public void setContratoReferencia(String contratoReferencia) { this.contratoReferencia = contratoReferencia; }

    public String getClienteNombre() { return clienteNombre; }
    public void setClienteNombre(String clienteNombre) { this.clienteNombre = clienteNombre; }

    public BigDecimal getMonto() { return monto; }
    public void setMonto(BigDecimal monto) { this.monto = monto; }

    public LocalDateTime getFechaPago() { return fechaPago; }
    public void setFechaPago(LocalDateTime fechaPago) { this.fechaPago = fechaPago; }

    public MetodoPago getMetodo() { return metodo; }
    public void setMetodo(MetodoPago metodo) { this.metodo = metodo; }

    public String getReferencia() { return referencia; }
    public void setReferencia(String referencia) { this.referencia = referencia; }

    public String getComprobante() { return comprobante; }
    public void setComprobante(String comprobante) { this.comprobante = comprobante; }

    public EstadoPago getEstado() { return estado; }
    public void setEstado(EstadoPago estado) { this.estado = estado; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }

    public LocalDateTime getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDateTime fechaInicio) { this.fechaInicio = fechaInicio; }

    public LocalDateTime getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDateTime fechaFin) { this.fechaFin = fechaFin; }
}
