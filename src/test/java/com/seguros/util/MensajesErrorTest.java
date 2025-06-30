package com.seguros.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MensajesErrorTest {

    @Test
    void testConstantesNoNulas() {
        assertNotNull(MensajesError.CONTRATO_NO_ENCONTRADO);
        assertNotNull(MensajesError.CLIENTE_NO_ENCONTRADO);
        assertNotNull(MensajesError.AGENTE_NO_ENCONTRADO);
        assertNotNull(MensajesError.SEGURO_NO_ENCONTRADO);
        assertNotNull(MensajesError.USUARIO_NO_ENCONTRADO);
    }
}
