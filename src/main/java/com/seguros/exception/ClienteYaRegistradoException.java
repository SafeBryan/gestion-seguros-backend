package com.seguros.exception;

public class ClienteYaRegistradoException extends RuntimeException {
    public ClienteYaRegistradoException(String mensaje) {
        super(mensaje);
    }
}
