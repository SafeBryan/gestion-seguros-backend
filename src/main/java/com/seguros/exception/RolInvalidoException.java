package com.seguros.exception;

// src/main/java/com/seguros/exception/RolInvalidoException.java
public class RolInvalidoException extends RuntimeException {
    public RolInvalidoException(String mensaje) {
        super(mensaje);
    }
}

