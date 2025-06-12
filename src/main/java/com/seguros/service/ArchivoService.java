package com.seguros.service;

import org.springframework.stereotype.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class ArchivoService {

    private final Path directorio = Paths.get("uploads/reembolsos");

    public ArchivoService() throws IOException {
        if (!Files.exists(directorio)) {
            Files.createDirectories(directorio);
        }
    }

    public String guardarArchivo(MultipartFile archivo) {
        try {
            String nombreArchivo = UUID.randomUUID() + "_" + archivo.getOriginalFilename();
            Path destino = directorio.resolve(nombreArchivo);
            Files.copy(archivo.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);
            return destino.toString(); // Ruta local del archivo
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar archivo", e);
        }
    }
}

