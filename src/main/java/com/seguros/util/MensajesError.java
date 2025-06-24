package com.seguros.util;

public class MensajesError {

    private MensajesError() {
        throw new UnsupportedOperationException("Clase de utilidades - no se debe instanciar");
    }

    public static final String CONTRATO_NO_ENCONTRADO = "Contrato no encontrado";
    public static final String CLIENTE_NO_ENCONTRADO = "Cliente no encontrado";
    public static final String AGENTE_NO_ENCONTRADO = "Agente no encontrado";
    public static final String SEGURO_NO_ENCONTRADO = "Seguro no encontrado";
    public static final String USUARIO_NO_ENCONTRADO = "Usuario no encontrado";
    public static final String NUMERO_IDENTIFICACION_REPETIDO = "El número de identificación ya está registrado";
    public static final String ROL_INVALIDO_PARA_CLIENTE = "El usuario no tiene rol CLIENTE.";
    public static final String CLIENTE_YA_REGISTRADO_PARA_USUARIO = "Este usuario ya tiene datos de cliente registrados.";
}
