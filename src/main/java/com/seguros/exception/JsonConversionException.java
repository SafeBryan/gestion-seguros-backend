package com.seguros.exception;

public class JsonConversionException extends RuntimeException {
    public JsonConversionException(String mensaje, Throwable causa) {
        super(mensaje, causa);
    }
}

