package com.seguros.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class Cliente {

    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    private String tipoIdentificacion; // Cédula / Pasaporte

    @Column(unique = true, nullable = false)
    private String numeroIdentificacion;

    private LocalDate fechaNacimiento;
    private String nacionalidad;
    private String estadoCivil;
    private String sexo;
    private String lugarNacimiento;
    private Double estatura;
    private Double peso;
    private String direccion;
}
