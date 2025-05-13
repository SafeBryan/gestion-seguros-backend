package com.seguros.model;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import java.math.BigDecimal;

@Entity
@DiscriminatorValue("VIDA")
public class SeguroVida extends Seguro {

    @Column(name = "monto_cobertura", precision = 12, scale = 2)
    private BigDecimal montoCobertura;

    public BigDecimal getMontoCobertura() {
        return montoCobertura;
    }

    public void setMontoCobertura(BigDecimal montoCobertura) {
        this.montoCobertura = montoCobertura;
    }
}
