package com.seguros.dto;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class ClienteRequestDTOTest {

    @Test
    void testGettersAndSetters() {
        ClienteRequestDTO dto = new ClienteRequestDTO();
        LocalDate fecha = LocalDate.of(2000, 1, 1);

        dto.setUsuarioId(10L);
        dto.setTipoIdentificacion("Pasaporte");
        dto.setNumeroIdentificacion("A12345678");
        dto.setFechaNacimiento(fecha);
        dto.setNacionalidad("Colombiana");
        dto.setEstadoCivil("Casado");
        dto.setSexo("Femenino");
        dto.setLugarNacimiento("Bogotá");
        dto.setEstatura(1.68);
        dto.setPeso(60.0);
        dto.setDireccion("Av. Siempre Viva 742");

        assertEquals(10L, dto.getUsuarioId());
        assertEquals("Pasaporte", dto.getTipoIdentificacion());
        assertEquals("A12345678", dto.getNumeroIdentificacion());
        assertEquals(fecha, dto.getFechaNacimiento());
        assertEquals("Colombiana", dto.getNacionalidad());
        assertEquals("Casado", dto.getEstadoCivil());
        assertEquals("Femenino", dto.getSexo());
        assertEquals("Bogotá", dto.getLugarNacimiento());
        assertEquals(1.68, dto.getEstatura());
        assertEquals(60.0, dto.getPeso());
        assertEquals("Av. Siempre Viva 742", dto.getDireccion());
    }
}
