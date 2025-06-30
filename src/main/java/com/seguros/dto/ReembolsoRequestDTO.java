package com.seguros.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

@Data
public class ReembolsoRequestDTO {
    private Long contratoId;
    private BigDecimal monto;
    private String descripcion;
    private Map<String, String> archivos;

    // Datos médicos opcionales
    private String nombreMedico;
    private String motivoConsulta;
    private String cie10;
    private LocalDate fechaAtencion;
    private LocalDate inicioSintomas;

    // En caso de accidente
    private Boolean esAccidente;
    private String detalleAccidente;

    public Long getContratoId() {
        return contratoId;
    }

    public void setContratoId(Long contratoId) {
        this.contratoId = contratoId;
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

    public Map<String, String> getArchivos() {
        return archivos;
    }

    public void setArchivos(Map<String, String> archivos) {
        this.archivos = archivos;
    }

    public String getNombreMedico() {
        return nombreMedico;
    }

    public void setNombreMedico(String nombreMedico) {
        this.nombreMedico = nombreMedico;
    }

    public String getMotivoConsulta() {
        return motivoConsulta;
    }

    public void setMotivoConsulta(String motivoConsulta) {
        this.motivoConsulta = motivoConsulta;
    }

    public String getCie10() {
        return cie10;
    }

    public void setCie10(String cie10) {
        this.cie10 = cie10;
    }

    public LocalDate getFechaAtencion() {
        return fechaAtencion;
    }

    public void setFechaAtencion(LocalDate fechaAtencion) {
        this.fechaAtencion = fechaAtencion;
    }

    public LocalDate getInicioSintomas() {
        return inicioSintomas;
    }

    public void setInicioSintomas(LocalDate inicioSintomas) {
        this.inicioSintomas = inicioSintomas;
    }

    public Boolean getEsAccidente() {
        return esAccidente;
    }

    public void setEsAccidente(Boolean esAccidente) {
        this.esAccidente = esAccidente;
    }

    public String getDetalleAccidente() {
        return detalleAccidente;
    }

    public void setDetalleAccidente(String detalleAccidente) {
        this.detalleAccidente = detalleAccidente;
    }
}

