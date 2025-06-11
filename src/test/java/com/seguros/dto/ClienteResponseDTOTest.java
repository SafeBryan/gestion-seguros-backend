package com.seguros.dto;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class ClienteResponseDTOTest {

    @Test
    void testGettersAndSetters() {
        ClienteResponseDTO dto = new ClienteResponseDTO();
        LocalDate fecha = LocalDate.of(1990, 4, 20);

        dto.setId(100L);
        dto.setNombre("Pedro");
        dto.setApellido("González");
        dto.setEmail("pedro@test.com");
        dto.setTelefono("0990001122");
        dto.setTipoIdentificacion("Cédula");
        dto.setNumeroIdentificacion("1102345678");
        dto.setFechaNacimiento(fecha);
        dto.setNacionalidad("Ecuatoriana");
        dto.setEstadoCivil("Soltero");
        dto.setSexo("Masculino");
        dto.setLugarNacimiento("Cuenca");
        dto.setEstatura(1.80);
        dto.setPeso(75.5);
        dto.setDireccion("Los Ceibos");

        assertEquals(100L, dto.getId());
        assertEquals("Pedro", dto.getNombre());
        assertEquals("González", dto.getApellido());
        assertEquals("pedro@test.com", dto.getEmail());
        assertEquals("0990001122", dto.getTelefono());
        assertEquals("Cédula", dto.getTipoIdentificacion());
        assertEquals("1102345678", dto.getNumeroIdentificacion());
        assertEquals(fecha, dto.getFechaNacimiento());
        assertEquals("Ecuatoriana", dto.getNacionalidad());
        assertEquals("Soltero", dto.getEstadoCivil());
        assertEquals("Masculino", dto.getSexo());
        assertEquals("Cuenca", dto.getLugarNacimiento());
        assertEquals(1.80, dto.getEstatura());
        assertEquals(75.5, dto.getPeso());
        assertEquals("Los Ceibos", dto.getDireccion());
    }
}
