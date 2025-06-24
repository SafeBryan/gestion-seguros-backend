package com.seguros.exception;

public class EmailExistenteException extends RuntimeException {
    public EmailExistenteException(String mensaje) {
        super(mensaje);
    }
}

