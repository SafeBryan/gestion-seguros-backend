package com.seguros.exception;

// src/main/java/com/seguros/exception/UsuarioNoEncontradoException.java
public class UsuarioNoEncontradoException extends RuntimeException {
    public UsuarioNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}

