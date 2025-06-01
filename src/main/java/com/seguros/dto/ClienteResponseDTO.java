package com.seguros.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ClienteResponseDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;

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
