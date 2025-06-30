package com.seguros.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class ClienteTest {

    @Test
    void testGettersAndSetters() {
        Cliente cliente = new Cliente();
        Usuario usuario = new Usuario();
        usuario.setId(5L);

        LocalDate fechaNacimiento = LocalDate.of(1995, 8, 15);

        cliente.setId(5L);
        cliente.setUsuario(usuario);
        cliente.setTipoIdentificacion("Cédula");
        cliente.setNumeroIdentificacion("1234567890");
        cliente.setFechaNacimiento(fechaNacimiento);
        cliente.setNacionalidad("Ecuatoriana");
        cliente.setEstadoCivil("Soltero");
        cliente.setSexo("Masculino");
        cliente.setLugarNacimiento("Ambato");
        cliente.setEstatura(1.75);
        cliente.setPeso(70.0);
        cliente.setDireccion("Av. Cevallos y Mera");

        assertEquals(5L, cliente.getId());
        assertEquals(usuario, cliente.getUsuario());
        assertEquals("Cédula", cliente.getTipoIdentificacion());
        assertEquals("1234567890", cliente.getNumeroIdentificacion());
        assertEquals(fechaNacimiento, cliente.getFechaNacimiento());
        assertEquals("Ecuatoriana", cliente.getNacionalidad());
        assertEquals("Soltero", cliente.getEstadoCivil());
        assertEquals("Masculino", cliente.getSexo());
        assertEquals("Ambato", cliente.getLugarNacimiento());
        assertEquals(1.75, cliente.getEstatura());
        assertEquals(70.0, cliente.getPeso());
        assertEquals("Av. Cevallos y Mera", cliente.getDireccion());
    }
}
