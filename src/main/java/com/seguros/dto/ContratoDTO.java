package com.seguros.dto;

import com.seguros.model.Contrato.EstadoContrato;
import com.seguros.model.Contrato.FrecuenciaPago;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class ContratoDTO {
    private Long id;
    private Long clienteId;
    private Long seguroId;
    private Long agenteId;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private FrecuenciaPago frecuenciaPago;
    private EstadoContrato estado;
    private String firmaElectronica;
    private Map<String, String> archivos;
    private List<BeneficiarioDTO> beneficiarios;
    private SeguroDTO seguro;
    private UsuarioDTO agente;


    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getClienteId() { return clienteId; }
    public void setClienteId(Long clienteId) { this.clienteId = clienteId; }
    public Long getSeguroId() { return seguroId; }
    public void setSeguroId(Long seguroId) { this.seguroId = seguroId; }
    public Long getAgenteId() { return agenteId; }
    public void setAgenteId(Long agenteId) { this.agenteId = agenteId; }
    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }
    public LocalDate getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDate fechaFin) { this.fechaFin = fechaFin; }
    public FrecuenciaPago getFrecuenciaPago() { return frecuenciaPago; }
    public void setFrecuenciaPago(FrecuenciaPago frecuenciaPago) { this.frecuenciaPago = frecuenciaPago; }
    public EstadoContrato getEstado() { return estado; }
    public void setEstado(EstadoContrato estado) { this.estado = estado; }
    public String getFirmaElectronica() { return firmaElectronica; }
    public void setFirmaElectronica(String firmaElectronica) { this.firmaElectronica = firmaElectronica; }
    public Map<String, String> getArchivos() { return archivos; }
    public void setArchivos(Map<String, String> archivos) { this.archivos = archivos; }
    public List<BeneficiarioDTO> getBeneficiarios() { return beneficiarios; }
    public void setBeneficiarios(List<BeneficiarioDTO> beneficiarios) { this.beneficiarios = beneficiarios; }

    public SeguroDTO getSeguro() {
        return seguro;
    }

    public void setSeguro(SeguroDTO seguro) {
        this.seguro = seguro;
    }

    public UsuarioDTO getAgente() {
        return agente;
    }

    public void setAgente(UsuarioDTO agente) {
        this.agente = agente;
    }
}