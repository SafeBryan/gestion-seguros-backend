package com.seguros.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "contratos")
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
    private String archivos;

    @OneToMany(mappedBy = "contrato", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Beneficiario> beneficiarios;

    @OneToMany(mappedBy = "contrato")
    private List<Pago> pagos;

    @OneToMany(mappedBy = "contrato")
    private List<Reembolso> reembolsos;
    
    @OneToMany(mappedBy = "contrato", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Dependiente> dependientes;


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

    //getters y setters


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getCliente() {
        return cliente;
    }

    public void setCliente(Usuario cliente) {
        this.cliente = cliente;
    }

    public Seguro getSeguro() {
        return seguro;
    }

    public void setSeguro(Seguro seguro) {
        this.seguro = seguro;
    }

    public Usuario getAgente() {
        return agente;
    }

    public void setAgente(Usuario agente) {
        this.agente = agente;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public FrecuenciaPago getFrecuenciaPago() {
        return frecuenciaPago;
    }

    public void setFrecuenciaPago(FrecuenciaPago frecuenciaPago) {
        this.frecuenciaPago = frecuenciaPago;
    }

    public EstadoContrato getEstado() {
        return estado;
    }

    public void setEstado(EstadoContrato estado) {
        this.estado = estado;
    }

    public String getFirmaElectronica() {
        return firmaElectronica;
    }

    public void setFirmaElectronica(String firmaElectronica) {
        this.firmaElectronica = firmaElectronica;
    }

    public String getArchivos() {
        return archivos;
    }

    public void setArchivos(String archivos) {
        this.archivos = archivos;
    }

    public List<Beneficiario> getBeneficiarios() {
        return beneficiarios;
    }

    public void setBeneficiarios(List<Beneficiario> beneficiarios) {
        this.beneficiarios = beneficiarios;
    }

    public List<Pago> getPagos() {
        return pagos;
    }

    public void setPagos(List<Pago> pagos) {
        this.pagos = pagos;
    }

    public List<Reembolso> getReembolsos() {
        return reembolsos;
    }

    public void setReembolsos(List<Reembolso> reembolsos) {
        this.reembolsos = reembolsos;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}