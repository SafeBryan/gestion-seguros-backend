package com.seguros.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;

class DependienteTest {

    @Test
    void testGettersAndSetters() {
        Dependiente dependiente = new Dependiente();

        Long id = 1L;
        Contrato contrato = new Contrato(); // puedes mockear si la clase es abstracta
        String nombre = "Pedro Gómez";
        String parentesco = "Hijo";
        String documento = "ABC123456";
        String email = "pedro@example.com";
        String telefono = "0999999999";
        LocalDate fechaNacimiento = LocalDate.of(2010, 5, 15);

        dependiente.setId(id);
        dependiente.setContrato(contrato);
        dependiente.setNombre(nombre);
        dependiente.setParentesco(parentesco);
        dependiente.setDocumentoIdentidad(documento);
        dependiente.setEmail(email);
        dependiente.setTelefono(telefono);
        dependiente.setFechaNacimiento(fechaNacimiento);

        assertEquals(id, dependiente.getId());
        assertEquals(contrato, dependiente.getContrato());
        assertEquals(nombre, dependiente.getNombre());
        assertEquals(parentesco, dependiente.getParentesco());
        assertEquals(documento, dependiente.getDocumentoIdentidad());
        assertEquals(email, dependiente.getEmail());
        assertEquals(telefono, dependiente.getTelefono());
        assertEquals(fechaNacimiento, dependiente.getFechaNacimiento());
    }
}
