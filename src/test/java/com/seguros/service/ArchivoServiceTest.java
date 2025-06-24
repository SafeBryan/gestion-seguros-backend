package com.seguros.service;

import org.junit.jupiter.api.*;
import org.mockito.Mockito;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.*;
import java.util.Comparator;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;

class ArchivoServiceTest {

    private ArchivoService archivoService;
    private final Path testDir = Paths.get("uploads/reembolsos");

    @BeforeEach
    void setUp() throws IOException {
        archivoService = new ArchivoService();
    }

    @AfterEach
    void cleanUp() throws IOException {
        if (Files.exists(testDir)) {
            try (Stream<Path> paths = Files.walk(testDir)) {
                paths.sorted(Comparator.reverseOrder()).forEach(path -> {
                    try {
                        Files.delete(path);
                    } catch (IOException e) {
                        throw new UncheckedIOException("Error al eliminar archivo: " + path, e);
                    }

                });
            }
        }
    }

    @Test
    void guardarArchivo_deberiaGuardarArchivoEnDirectorio() {
        // Arrange
        byte[] contenido = "contenido de prueba".getBytes();
        MultipartFile archivo = new MockMultipartFile("archivo", "prueba.txt", "text/plain", contenido);

        // Act
        String rutaGuardada = archivoService.guardarArchivo(archivo);

        // Assert
        Path ruta = Paths.get(rutaGuardada);
        assertTrue(Files.exists(ruta), "El archivo no fue guardado");
    }

    @Test
    void guardarArchivo_conErrorDebeLanzarExcepcion() throws IOException {
        // Arrange
        MultipartFile archivoMock = Mockito.mock(MultipartFile.class);
        Mockito.when(archivoMock.getOriginalFilename()).thenReturn("fallo.txt");
        Mockito.when(archivoMock.getInputStream()).thenThrow(new IOException("Simulando error"));

        // Act & Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            archivoService.guardarArchivo(archivoMock);
        });

        assertTrue(ex.getMessage().contains("Error al guardar archivo"));
    }
}
