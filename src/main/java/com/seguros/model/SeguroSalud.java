package com.seguros.model;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("SALUD")
public class SeguroSalud extends Seguro {

    @Column(name = "hospitales_convenio")
    private String hospitalesConvenio;

    @Column(name = "numero_consultas")
    private Integer numeroConsultasIncluidas;

    public String getHospitalesConvenio() {
        return hospitalesConvenio;
    }

    public void setHospitalesConvenio(String hospitalesConvenio) {
        this.hospitalesConvenio = hospitalesConvenio;
    }

    public Integer getNumeroConsultasIncluidas() {
        return numeroConsultasIncluidas;
    }

    public void setNumeroConsultasIncluidas(Integer numeroConsultasIncluidas) {
        this.numeroConsultasIncluidas = numeroConsultasIncluidas;
    }
}
