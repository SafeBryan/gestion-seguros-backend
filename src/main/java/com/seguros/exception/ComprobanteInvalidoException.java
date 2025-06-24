package com.seguros.exception;

public class ComprobanteInvalidoException extends RuntimeException {
    public ComprobanteInvalidoException(String mensaje, Throwable causa) {
        super(mensaje, causa);
    }
}

