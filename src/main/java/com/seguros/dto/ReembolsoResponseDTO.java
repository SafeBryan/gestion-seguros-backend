package com.seguros.dto;

import com.seguros.model.Reembolso.EstadoReembolso;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

public class ReembolsoResponseDTO {
    private Long id;
    private Long contratoId;
    private String clienteNombre;
    private String seguroNombre;
    private BigDecimal monto;
    private String descripcion;
    private EstadoReembolso estado;
    private Map<String, String> archivos;
    private String aprobadoPorNombre;
    private String comentarioRevisor;
    private LocalDateTime fechaSolicitud;
    private LocalDateTime fechaRevision;
    private Long clienteId;
    private Long seguroId;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getContratoId() {
        return contratoId;
    }

    public void setContratoId(Long contratoId) {
        this.contratoId = contratoId;
    }

    public String getClienteNombre() {
        return clienteNombre;
    }

    public void setClienteNombre(String clienteNombre) {
        this.clienteNombre = clienteNombre;
    }

    public String getSeguroNombre() {
        return seguroNombre;
    }

    public void setSeguroNombre(String seguroNombre) {
        this.seguroNombre = seguroNombre;
    }

    public BigDecimal getMonto() {
        return monto;
    }

    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public EstadoReembolso getEstado() {
        return estado;
    }

    public void setEstado(EstadoReembolso estado) {
        this.estado = estado;
    }

    public Map<String, String> getArchivos() {
        return archivos;
    }

    public void setArchivos(Map<String, String> archivos) {
        this.archivos = archivos;
    }

    public String getAprobadoPorNombre() {
        return aprobadoPorNombre;
    }

    public void setAprobadoPorNombre(String aprobadoPorNombre) {
        this.aprobadoPorNombre = aprobadoPorNombre;
    }

    public String getComentarioRevisor() {
        return comentarioRevisor;
    }

    public void setComentarioRevisor(String comentarioRevisor) {
        this.comentarioRevisor = comentarioRevisor;
    }

    public LocalDateTime getFechaSolicitud() {
        return fechaSolicitud;
    }

    public void setFechaSolicitud(LocalDateTime fechaSolicitud) {
        this.fechaSolicitud = fechaSolicitud;
    }

    public LocalDateTime getFechaRevision() {
        return fechaRevision;
    }

    public void setFechaRevision(LocalDateTime fechaRevision) {
        this.fechaRevision = fechaRevision;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public Long getSeguroId() {
        return seguroId;
    }

    public void setSeguroId(Long seguroId) {
        this.seguroId = seguroId;
    }
}
