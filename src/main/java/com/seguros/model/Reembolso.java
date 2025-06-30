package com.seguros.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "reembolsos")
public class Reembolso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "contrato_id", nullable = false)
    private Contrato contrato;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monto;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoReembolso estado = EstadoReembolso.PENDIENTE;

    @Column(columnDefinition = "TEXT")
    private String archivos; // JSON string con info de archivos o rutas

    @ManyToOne
    @JoinColumn(name = "aprobado_por")
    private Usuario aprobadoPor;

    @Column(name = "comentario_revisor", columnDefinition = "TEXT")
    private String comentarioRevisor;

    @Column(name = "fecha_solicitud", updatable = false)
    private LocalDateTime fechaSolicitud = LocalDateTime.now();

    @Column(name = "fecha_revision")
    private LocalDateTime fechaRevision;

    // Campos médicos adicionales (opcional según formulario real)
    private String nombreMedico;
    private String motivoConsulta;
    private String cie10;
    private LocalDate fechaAtencion;
    private LocalDate inicioSintomas;
    private Boolean esAccidente = false;

    @Column(columnDefinition = "TEXT")
    private String detalleAccidente;

    public enum EstadoReembolso {
        PENDIENTE, APROBADO, RECHAZADO
    }

    public boolean isPendiente() {
        return estado == EstadoReembolso.PENDIENTE;
    }

    public void aprobar(Usuario aprobadoPor, String comentario) {
        this.estado = EstadoReembolso.APROBADO;
        this.aprobadoPor = aprobadoPor;
        this.comentarioRevisor = comentario;
        this.fechaRevision = LocalDateTime.now();
    }

    public void rechazar(Usuario aprobadoPor, String comentario) {
        this.estado = EstadoReembolso.RECHAZADO;
        this.aprobadoPor = aprobadoPor;
        this.comentarioRevisor = comentario;
        this.fechaRevision = LocalDateTime.now();
    }

    // Getters y Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Contrato getContrato() {
        return contrato;
    }

    public void setContrato(Contrato contrato) {
        this.contrato = contrato;
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

    public String getArchivos() {
        return archivos;
    }

    public void setArchivos(String archivos) {
        this.archivos = archivos;
    }

    public Usuario getAprobadoPor() {
        return aprobadoPor;
    }

    public void setAprobadoPor(Usuario aprobadoPor) {
        this.aprobadoPor = aprobadoPor;
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
