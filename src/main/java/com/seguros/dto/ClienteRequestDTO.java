package com.seguros.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ClienteRequestDTO {
    private Long usuarioId;
    private String tipoIdentificacion;
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
