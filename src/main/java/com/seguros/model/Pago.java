package com.seguros.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

    @Entity
    @Table(name = "pagos")
    public class Pago {

        public enum MetodoPago {
            TARJETA, TRANSFERENCIA, DEBITO_AUTOMATICO, EFECTIVO, CHEQUE, REEMBOLSO
        }

        public enum EstadoPago {
            PENDIENTE, COMPLETADO, RECHAZADO, REVERTIDO
        }

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "contrato_id", nullable = false)
        private Contrato contrato;

        @Column(nullable = false, precision = 10, scale = 2)
        private BigDecimal monto;

        @Column(name = "fecha_pago", nullable = false)
        private LocalDateTime fechaPago = LocalDateTime.now();

        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        private MetodoPago metodo;

        @Lob
        @Column(name = "comprobante", columnDefinition = "LONGBLOB")
        private byte[] comprobante;

        @Column(name = "comprobanteTipoContenido", length = 255)
        private String comprobanteTipoContenido;

        @Column(name = "comprobanteNombre", length = 255)
        private String comprobanteNombre;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        private EstadoPago estado = EstadoPago.COMPLETADO;

        @Column(name = "referencia", length = 100)
        private String referencia;

        @Column(columnDefinition = "TEXT")
        private String observaciones;

        @PrePersist
        protected void onCreate() {
            if (fechaPago == null) {
                fechaPago = LocalDateTime.now();
            }
        }

        public boolean isCompletado() {
            return estado == EstadoPago.COMPLETADO;
        }

        // Getters y Setters
        public String getReferencia() { return referencia; }
        public void setReferencia(String referencia) { this.referencia = referencia; }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Contrato getContrato() { return contrato; }
        public void setContrato(Contrato contrato) { this.contrato = contrato; }

        public BigDecimal getMonto() { return monto; }
        public void setMonto(BigDecimal monto) { this.monto = monto; }

        public LocalDateTime getFechaPago() { return fechaPago; }
        public void setFechaPago(LocalDateTime fechaPago) { this.fechaPago = fechaPago; }

        public MetodoPago getMetodo() { return metodo; }
        public void setMetodo(MetodoPago metodo) { this.metodo = metodo; }

        public byte[] getComprobante() { return comprobante; }
        public void setComprobante(byte[] comprobante) { this.comprobante = comprobante; }

        public String getComprobanteTipoContenido() { return comprobanteTipoContenido; }
        public void setComprobanteTipoContenido(String comprobanteTipoContenido) { this.comprobanteTipoContenido = comprobanteTipoContenido; }

        public String getComprobanteNombre() { return comprobanteNombre; }
        public void setComprobanteNombre(String comprobanteNombre) { this.comprobanteNombre = comprobanteNombre; }

        public EstadoPago getEstado() { return estado; }
        public void setEstado(EstadoPago estado) { this.estado = estado; }

        public String getObservaciones() { return observaciones; }
        public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
    }

